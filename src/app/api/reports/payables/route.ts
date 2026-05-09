import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('accounts_payable')
    .select('id, total_amount, amount_paid, balance, status, created_at, suppliers(name)');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Generate CSV
  const header = ['ID', 'Supplier Name', 'Total Amount', 'Amount Paid', 'Balance', 'Status', 'Date'];
  const rows = data.map((r: any) => [
    r.id,
    r.suppliers?.name || 'Unknown',
    r.total_amount,
    r.amount_paid,
    r.balance,
    r.status,
    new Date(r.created_at).toISOString().split('T')[0]
  ]);

  const csvContent = [header, ...rows].map(row => row.join(',')).join('\n');

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="payables_report.csv"',
    },
  });
}
