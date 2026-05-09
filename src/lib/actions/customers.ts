'use server';

import { createClient } from '@/lib/supabase/server';
import { Customer } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getCustomers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw new Error(error.message);
  return data as Customer[];
}

export async function getCustomerById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data as Customer;
}

export async function getRecentSalesForCustomer(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('sales')
    .select('*, sale_items(*)')
    .eq('customer_id', id)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw new Error(error.message);
  return data;
}

export async function createCustomer(customer: Partial<Customer>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('customers')
    .insert(customer)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/customers');
  return data;
}

export async function updateCustomer(id: string, updates: Partial<Customer>) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('customers')
    .update(updates)
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/customers');
  revalidatePath(`/customers/${id}`);
}

export async function deleteCustomer(id: string) {
  const supabase = await createClient();

  const [{ count: salesCount, error: salesError }, { count: paymentsCount, error: paymentsError }] = await Promise.all([
    supabase.from('sales').select('*', { count: 'exact', head: true }).eq('customer_id', id),
    supabase.from('payments_received').select('*', { count: 'exact', head: true }).eq('customer_id', id),
  ]);

  if (salesError || paymentsError) {
    throw new Error(salesError?.message || paymentsError?.message || 'Failed to validate customer dependencies.');
  }

  if ((salesCount ?? 0) > 0 || (paymentsCount ?? 0) > 0) {
    throw new Error('This customer has sale or payment history and cannot be deleted.');
  }

  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/customers');
}
