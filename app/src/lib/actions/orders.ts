'use server';

import { createClient } from '@/lib/supabase/server';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Order = Record<string, any>;
import { revalidatePath } from 'next/cache';

export async function getOrders(): Promise<Order[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*, customers(name)')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Order[];
}

export async function getOrder(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*, customers(*), showrooms(*), order_items(*, materials(*))')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateOrderStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/orders');
  revalidatePath(`/orders/${id}`);
}

export async function createOrder(order: Partial<Order>, items: any[]) {
  const supabase = await createClient();
  
  // 1. Create the order
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert([order])
    .select()
    .single();

  if (orderError) throw new Error(orderError.message);

  // 2. Create order items
  const orderItems = items.map(item => ({
    order_id: orderData.id,
    material_id: item.material_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    total_price: item.quantity * item.unit_price
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw new Error(itemsError.message);

  revalidatePath('/orders');
  return orderData;
}

