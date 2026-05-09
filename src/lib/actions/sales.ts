'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getSales() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('sales')
    .select('*, customers(name), sale_items(*)')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getSale(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('sales')
    .select('*, customers(*), sale_items(*), material_usage(*, materials(*))')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function createSaleEntry(saleData: any, items: any[]) {
  const supabase = await createClient();
  
  // 1. Insert Sale
  const { data: sale, error: saleError } = await supabase
    .from('sales')
    .insert([{
      customer_id: saleData.customer_id,
      source: saleData.source,
      total_amount: saleData.total_amount
    }])
    .select()
    .single();

  if (saleError) throw new Error(saleError.message);

  // 2. Insert Items
  if (items.length > 0) {
    const saleItems = items.map(item => ({
      sale_id: sale.id,
      item_name: item.item_name,
      quantity: item.quantity,
      sale_amount: item.sale_amount
    }));

    const { error: itemsError } = await supabase
      .from('sale_items')
      .insert(saleItems);

    if (itemsError) throw new Error(itemsError.message);
  }

  revalidatePath('/sales');
  return sale;
}

export async function recordMaterialUsage(saleId: string, usages: any[]) {
  const supabase = await createClient();
  
  if (usages.length > 0) {
    const usageData = usages.map(u => ({
      sale_id: saleId,
      material_id: u.material_id,
      quantity_used: u.quantity_used,
      unit_cost: u.unit_cost
    }));

    const { error } = await supabase
      .from('material_usage')
      .insert(usageData);

    if (error) throw new Error(error.message);
  }

  revalidatePath(`/sales/${saleId}`);
}

export async function closeSale(saleId: string, closeData: any) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('sales')
    .update({
      payment_received: closeData.payment_received,
      payment_method: closeData.payment_method,
      order_delivered: closeData.order_delivered,
      sale_completed: closeData.sale_completed
    })
    .eq('id', saleId);

  if (error) throw new Error(error.message);

  revalidatePath('/sales');
  revalidatePath(`/sales/${saleId}`);
}

export async function deleteSale(saleId: string) {
  const supabase = await createClient();

  const { data: sale, error: saleError } = await supabase
    .from('sales')
    .select('id, customer_id, material_usage(material_id, quantity_used)')
    .eq('id', saleId)
    .single();

  if (saleError || !sale) {
    throw new Error(saleError?.message || 'Sale not found.');
  }

  const usages = (sale.material_usage ?? []) as Array<{ material_id: string; quantity_used: number }>;

  for (const usage of usages) {
    const { data: material, error: materialError } = await supabase
      .from('materials')
      .select('stock_quantity')
      .eq('id', usage.material_id)
      .single();

    if (materialError || !material) {
      throw new Error(materialError?.message || 'Unable to restore stock before deleting the sale.');
    }

    const { error: restoreError } = await supabase
      .from('materials')
      .update({ stock_quantity: Number(material.stock_quantity) + Number(usage.quantity_used) })
      .eq('id', usage.material_id);

    if (restoreError) {
      throw new Error(restoreError.message);
    }
  }

  const { error: paymentsError } = await supabase
    .from('payments_received')
    .delete()
    .eq('sale_id', saleId);

  if (paymentsError) throw new Error(paymentsError.message);

  const { error: deleteError } = await supabase
    .from('sales')
    .delete()
    .eq('id', saleId);

  if (deleteError) throw new Error(deleteError.message);

  const [{ data: remainingSales, error: totalsError }, { data: remainingPayments, error: paymentsTotalsError }] = await Promise.all([
    supabase.from('sales').select('total_amount').eq('customer_id', sale.customer_id),
    supabase.from('payments_received').select('amount').eq('customer_id', sale.customer_id),
  ]);

  if (totalsError || paymentsTotalsError) {
    throw new Error(totalsError?.message || paymentsTotalsError?.message || 'Sale deleted but customer totals could not be refreshed.');
  }

  const totalSales = (remainingSales ?? []).reduce((sum, item) => sum + Number(item.total_amount || 0), 0);
  const totalPayments = (remainingPayments ?? []).reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const { error: customerError } = await supabase
    .from('customers')
    .update({
      total_sales: totalSales,
      total_payments_received: totalPayments,
      balance: totalSales - totalPayments,
    })
    .eq('id', sale.customer_id);

  if (customerError) throw new Error(customerError.message);

  revalidatePath('/sales');
  revalidatePath('/customers');
  revalidatePath(`/customers/${sale.customer_id}`);
  revalidatePath('/receivables');
  revalidatePath('/inventory');
  revalidatePath('/');
}
