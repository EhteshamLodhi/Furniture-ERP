'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getReceivables() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('accounts_receivable')
    .select('*, customers(name), sales(source)')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getPayables() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('accounts_payable')
    .select('*, suppliers(name), inventory_additions(*)')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function recordPaymentReceived(data: { customer_id: string, sale_id?: string, amount: number, method: string }) {
  const supabase = await createClient();
  const { error } = await supabase.from('payments_received').insert([data]);
  
  if (error) throw new Error(error.message);
  revalidatePath('/receivables');
  revalidatePath('/customers');
  revalidatePath('/sales');
  return { success: true };
}

export async function recordPaymentMade(data: { supplier_id: string, purchase_id?: string, amount: number, method: string }) {
  const supabase = await createClient();
  const { error } = await supabase.from('payments_made').insert([data]);
  
  if (error) throw new Error(error.message);
  revalidatePath('/payables');
  revalidatePath('/suppliers');
  revalidatePath('/inventory');
  return { success: true };
}
