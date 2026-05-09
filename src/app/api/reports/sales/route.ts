import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('sales')
    .select('id, source, sale_date, total_amount, payment_received, payment_method, remaining_balance, order_delivered, sale_completed, customers(name)');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Generate CSV
  const header = ['ID', 'Customer Name', 'Source', 'Sale Date', 'Total Amount', 'Payment Received', 'Remaining Balance', 'Payment Method', 'Delivered', 'Completed'];
  const rows = data.map((r: any) => [
    r.id,
    r.customers?.name || 'Unknown',
    r.source,
    r.sale_date,
    r.total_amount,
    r.payment_received,
    r.remaining_balance,
    r.payment_method || 'N/A',
    r.order_delivered ? 'Yes' : 'No',
    r.sale_completed ? 'Yes' : 'No'
  ]);

  const csvContent = [header, ...rows].map(row => row.join(',')).join('\n');

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="monthly_sales_report.csv"',
    },
  });
}
