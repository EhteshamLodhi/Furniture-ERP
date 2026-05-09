'use server';

import { createClient } from '@/lib/supabase/server';

export async function getDashboardData() {
  const supabase = await createClient();

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  // 1. Fetch KPI raw data
  const [
    { data: materials },
    { data: receivables },
    { data: payables },
    { data: salesMonth },
    { data: paymentsReceivedMonth }
  ] = await Promise.all([
    supabase.from('materials').select('stock_quantity, unit_cost'),
    supabase.from('accounts_receivable').select('balance, status'),
    supabase.from('accounts_payable').select('balance, status'),
    supabase.from('sales').select('total_amount').gte('created_at', firstDayOfMonth),
    supabase.from('payments_received').select('amount').gte('created_at', firstDayOfMonth)
  ]);

  const totalReceivables = receivables?.reduce((sum: number, r: any) => sum + (r.balance || 0), 0) || 0;
  const totalPayables = payables?.reduce((sum: number, p: any) => sum + (p.balance || 0), 0) || 0;
  const totalStockValue = materials?.reduce((sum: number, m: any) => sum + (m.stock_quantity * m.unit_cost), 0) || 0;
  const lowStockCount = materials?.filter((m: any) => m.stock_quantity < 10).length || 0;

  const currentRevenue = salesMonth?.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0) || 0;
  const currentPayments = paymentsReceivedMonth?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0;

  const kpis = {
    totalSalesMonth: currentRevenue,
    paymentsReceivedMonth: currentPayments,
    outstandingReceivablesTotal: totalReceivables,
    outstandingPayablesTotal: totalPayables,
    stockValue: totalStockValue,
    lowStockCount,
  };

  // 2. Fetch recent transactions (Combine recent payments received and payments made)
  const [{ data: pr }, { data: pm }] = await Promise.all([
    supabase.from('payments_received').select('id, amount, created_at, method, customers(name)').order('created_at', { ascending: false }).limit(3),
    supabase.from('payments_made').select('id, amount, created_at, method, suppliers(name)').order('created_at', { ascending: false }).limit(3)
  ]);

  const transactions = [
    ...(pr || []).map((p: any) => ({
      id: `pr-${p.id}`,
      description: `Payment from ${(p.customers as any)?.name}`,
      reference: `Received via ${p.method}`,
      amount: p.amount,
      type: 'credit',
      icon: 'arrow_downward',
      date: p.created_at
    })),
    ...(pm || []).map((p: any) => ({
      id: `pm-${p.id}`,
      description: `Payment to ${(p.suppliers as any)?.name}`,
      reference: `Sent via ${p.method}`,
      amount: p.amount,
      type: 'debit',
      icon: 'arrow_upward',
      date: p.created_at
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return { kpis, transactions };
}
