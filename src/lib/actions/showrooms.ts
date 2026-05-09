'use server';

import { createClient } from '@/lib/supabase/server';
interface Showroom { id: string; name: string; location?: string | null; [key: string]: unknown; }

import { revalidatePath } from 'next/cache';

export async function getShowrooms(): Promise<Showroom[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('showrooms')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Showroom[];
}

export async function createShowroom(showroom: Partial<Showroom>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('showrooms')
    .insert([showroom])
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/showrooms');
  return data;
}

export async function updateShowroom(id: string, updates: Partial<Showroom>) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('showrooms')
    .update(updates)
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/showrooms');
}

export async function getShowroomMonthlySales() {
  // Returns aggregated monthly sales from orders grouped by month
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('orders')
    .select('total, created_at')
    .not('status', 'eq', 'draft');

  if (error) throw new Error(error.message);

  // Aggregate by month name
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const grouped: Record<string, { sales: number; margin: number }> = {};

  (data ?? []).forEach((order: any) => {
    const date = new Date(order.created_at);
    const key = months[date.getMonth()];
    if (!grouped[key]) grouped[key] = { sales: 0, margin: 0 };
    grouped[key].sales += order.total || 0;
    grouped[key].margin += (order.total || 0) * 0.35; // 35% margin estimate
  });

  // Return last 6 months with data
  return months.map((month) => ({
    month,
    sales: grouped[month]?.sales ?? 0,
    margin: grouped[month]?.margin ?? 0,
  })).slice(-6);
}
