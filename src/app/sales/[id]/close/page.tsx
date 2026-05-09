export const dynamic = 'force-dynamic';

import { getSale } from '@/lib/actions/sales';
import SaleClosingForm from '@/components/forms/SaleClosingForm';
import { notFound } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';
import DeleteEntryButton from '@/components/DeleteEntryButton';

export default async function CloseSalePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sale = await getSale(id);

  if (!sale) notFound();

  const s = sale as any;

  return (
    <div className="px-4 sm:px-6 py-8 max-w-3xl mx-auto space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-1">Stage 3: Sale Closing</p>
        <h1 className="text-3xl font-extrabold text-primary tracking-tight font-headline">
          {s.sale_completed ? 'View Closed Sale' : 'Close Sale'}
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Customer: <span className="font-bold text-primary">{s.customers?.name}</span>
        </p>
        </div>
        <DeleteEntryButton entryId={id} kind="sale" label="sale" redirectTo="/sales" variant="button" className="shrink-0" />
      </header>

      {/* Sale Summary */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-card space-y-4">
        <h2 className="font-headline font-bold text-sm text-on-surface-variant uppercase tracking-widest">Sale Summary</h2>
        <div className="space-y-2">
          {s.sale_items?.map((item: any) => (
            <div key={item.id} className="flex justify-between text-sm py-2 border-b border-surface-container last:border-0">
              <span className="text-on-surface font-medium">{item.item_name} ×{item.quantity}</span>
              <span className="font-bold text-primary font-mono">{formatCurrency(item.sale_amount)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center pt-2">
          <span className="font-bold text-on-surface-variant text-sm uppercase tracking-widest">Total Value</span>
          <span className="font-headline font-extrabold text-xl text-primary">{formatCurrency(s.total_amount)}</span>
        </div>
      </div>

      <SaleClosingForm sale={sale} />
    </div>
  );
}
