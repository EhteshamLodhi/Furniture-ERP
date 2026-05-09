'use server';

import { createClient } from '@/lib/supabase/server';
import { Material } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getMaterials() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw new Error(error.message);
  return data as Material[];
}

export async function deleteMaterial(id: string) {
  const supabase = await createClient();

  const [{ count: usageCount, error: usageError }, { count: purchaseCount, error: purchaseError }] = await Promise.all([
    supabase.from('material_usage').select('*', { count: 'exact', head: true }).eq('material_id', id),
    supabase.from('inventory_additions').select('*', { count: 'exact', head: true }).eq('material_id', id),
  ]);

  if (usageError || purchaseError) {
    throw new Error(usageError?.message || purchaseError?.message || 'Failed to validate inventory dependencies.');
  }

  if ((usageCount ?? 0) > 0 || (purchaseCount ?? 0) > 0) {
    throw new Error('This inventory item has stock history and cannot be deleted.');
  }

  const { error } = await supabase
    .from('materials')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/inventory');
}

export async function createMaterial(material: Partial<Material>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('materials')
    .insert([material])
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/inventory');
  return data;
}

export async function createInventoryAddition(data: { material_id: string, quantity_added: number, unit_cost: number, supplier_id?: string, amount_paid: number }) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('inventory_additions')
    .insert([data]);

  if (error) throw new Error(error.message);
  revalidatePath('/inventory');
  revalidatePath('/payables');
  revalidatePath('/suppliers');
}
