export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getSales } from '@/lib/actions/sales';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import MobileActionBar from '@/components/layout/MobileActionBar';
import DeleteEntryButton from '@/components/DeleteEntryButton';
import Icon from '@/components/ui/Icon';

type SaleRow = {
  id: string;
  customers?: { name?: string | null } | null;
  source: string;
  sale_date: string;
  total_amount: number;
  remaining_balance: number;
  sale_completed: boolean;
};

export default async function SalesDashboard() {
  const sales = await getSales();

  return (
    <div className="px-4 sm:px-6 py-8 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-1">Workflow Pipeline</p>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight font-headline">Sales Lifecycle</h1>
        </div>
        <Link 
          href="/sales/new"
          className="gradient-cta text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all flex items-center gap-2 w-full sm:w-auto justify-center min-h-12"
        >
          <Icon name="add" className="text-lg" />
          Add Sale
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {sales && sales.length > 0 ? (
          sales.map((sale: SaleRow) => {
            const isCompleted = sale.sale_completed;
            const hasBalance = sale.remaining_balance > 0;
            
            return (
              <div key={sale.id} className="bg-surface-container-lowest rounded-2xl p-5 shadow-card hover:shadow-elevated transition-all border border-transparent hover:border-primary/20">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "w-2 h-2 rounded-full",
                        isCompleted ? "bg-secondary" : "bg-primary animate-pulse"
                      )} />
                      <h3 className="font-headline font-bold text-lg text-primary">
                        {sale.customers?.name || 'Walk-in'}
                      </h3>
                      <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label text-[10px] font-bold uppercase tracking-widest">
                        {sale.source}
                      </span>
                    </div>
                    
                    <p className="text-sm font-medium text-on-surface-variant flex items-center gap-2">
                      <Icon name="calendar_month" className="text-sm" />
                      {formatDate(sale.sale_date)}
                    </p>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2 border-t md:border-t-0 pt-4 md:pt-0">
                    <div className="text-left md:text-right">
                      <p className="font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Total Value</p>
                      <p className="font-headline font-extrabold text-xl text-primary">{formatCurrency(sale.total_amount)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasBalance && isCompleted && (
                        <span className="px-2 py-1 rounded bg-error-container text-on-error-container font-label text-[10px] font-bold uppercase tracking-widest">
                          AR: {formatCurrency(sale.remaining_balance)}
                        </span>
                      )}
                      <DeleteEntryButton entryId={sale.id} kind="sale" label="sale" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-surface-container flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                  <Link href={`/sales/${sale.id}/materials`} className={cn(
                    "flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-colors",
                    !isCompleted ? "bg-surface-container hover:bg-primary hover:text-white" : "bg-surface-container-high text-on-surface-variant opacity-50 cursor-not-allowed"
                  )}>
                    Stage 2: Materials
                  </Link>
                  <Link href={`/sales/${sale.id}/close`} className={cn(
                    "flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-colors",
                    !isCompleted ? "bg-surface-container hover:bg-secondary hover:text-white" : "bg-secondary-container text-on-secondary-container"
                  )}>
                    {isCompleted ? 'View Closed Sale' : 'Stage 3: Close Sale'}
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-24 bg-surface-container-lowest rounded-3xl border-2 border-dashed border-outline-variant/30">
            <Icon name="receipt_long" className="text-6xl text-outline-variant mb-4 block" />
            <p className="text-on-surface-variant font-bold uppercase tracking-widest text-sm mb-6">No active sales</p>
            <Link 
              href="/sales/new"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all"
            >
              Start Stage 1
            </Link>
          </div>
        )}
      </div>
      <MobileActionBar actions={[
        { href: '/sales/new', icon: 'add_shopping_cart', label: 'Add Sale', primary: true },
        { href: '/receivables', icon: 'payments', label: 'Payment' },
      ]} />
    </div>
  );
}
