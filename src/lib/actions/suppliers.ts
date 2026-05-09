'use server';

import { createClient } from '@/lib/supabase/server';
import { Supplier } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getSuppliers(): Promise<Supplier[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Supplier[];
}

export async function getSupplierById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data as Supplier;
}

export async function getSupplierPurchases(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('inventory_additions')
    .select('*, materials(name)')
    .eq('supplier_id', id)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function createSupplier(supplier: Partial<Supplier>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('suppliers')
    .insert([supplier])
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/suppliers');
  return data;
}

export async function updateSupplier(id: string, updates: Partial<Supplier>) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('suppliers')
    .update(updates)
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/suppliers');
}

export async function deleteSupplier(id: string) {
  const supabase = await createClient();

  const [{ count: purchaseCount, error: purchaseError }, { count: paymentCount, error: paymentError }] = await Promise.all([
    supabase.from('inventory_additions').select('*', { count: 'exact', head: true }).eq('supplier_id', id),
    supabase.from('payments_made').select('*', { count: 'exact', head: true }).eq('supplier_id', id),
  ]);

  if (purchaseError || paymentError) {
    throw new Error(purchaseError?.message || paymentError?.message || 'Failed to validate supplier dependencies.');
  }

  if ((purchaseCount ?? 0) > 0 || (paymentCount ?? 0) > 0) {
    throw new Error('This supplier has purchase or payment history and cannot be deleted.');
  }

  const { error } = await supabase
    .from('suppliers')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/suppliers');
}
