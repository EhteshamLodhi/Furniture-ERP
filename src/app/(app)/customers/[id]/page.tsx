export const dynamic = 'force-dynamic';

import { getCustomerById, getRecentSalesForCustomer } from '@/lib/actions/customers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency, formatDate, getInitials, cn } from '@/lib/utils';
import CustomerActions from './CustomerActions';
import { getReceivables } from '@/lib/actions/accounting';
import DeleteEntryButton from '@/components/DeleteEntryButton';
import Icon from '@/components/ui/Icon';

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [customer, sales, allReceivables] = await Promise.all([
    getCustomerById(id),
    getRecentSalesForCustomer(id),
    getReceivables(),
  ]);

  if (!customer) notFound();

  const unpaidInvoices = (allReceivables || []).filter(
    (r: any) => r.customer_id === id && r.status !== 'paid'
  );

  return (
    <div className="px-4 sm:px-6 py-6 max-w-2xl mx-auto space-y-6">
      {/* Profile Card */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-card">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-headline font-extrabold text-2xl shadow-lg">
            {getInitials(customer.name)}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-primary font-headline tracking-tight">{customer.name}</h1>
            <p className="text-sm text-on-surface-variant font-medium">{customer.phone}</p>
            {customer.email && <p className="text-xs text-on-surface-variant">{customer.email}</p>}
            {customer.address && <p className="text-xs text-on-surface-variant mt-0.5">{customer.address}</p>}
          </div>
          </div>
          <DeleteEntryButton entryId={id} kind="customer" label={customer.name} redirectTo="/customers" variant="button" className="shrink-0" />
        </div>

        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-surface-container">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Total Sales</p>
            <p className="font-headline font-bold text-primary">{formatCurrency(customer.total_sales)}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Collected</p>
            <p className="font-headline font-bold text-secondary">{formatCurrency(customer.total_payments_received)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Balance</p>
            <p className={cn('font-headline font-extrabold', customer.balance > 0 ? 'text-error' : 'text-primary')}>
              {formatCurrency(customer.balance)}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <CustomerActions customerId={id} unpaidInvoices={unpaidInvoices} />

      {/* Sales History */}
      <section className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h2 className="font-headline font-bold text-primary">Sales History</h2>
          <Link href={`/sales/new`} className="text-xs font-bold text-secondary uppercase tracking-widest">
            + New Sale
          </Link>
        </div>

        {sales && sales.length > 0 ? (
          <div className="space-y-3">
            {sales.map((sale: any) => (
              <div key={sale.id} className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/10">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        sale.sale_completed ? 'bg-secondary' : 'bg-primary animate-pulse'
                      )} />
                      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{sale.source}</span>
                    </div>
                    <p className="text-sm text-on-surface-variant">{formatDate(sale.sale_date)}</p>
                    <div className="mt-2 space-y-0.5">
                      {sale.sale_items?.slice(0, 2).map((item: any) => (
                        <p key={item.id} className="text-xs text-on-surface-variant">
                          {item.item_name} ×{item.quantity}
                        </p>
                      ))}
                      {sale.sale_items?.length > 2 && (
                        <p className="text-xs text-outline">+{sale.sale_items.length - 2} more items</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-headline font-bold text-primary">{formatCurrency(sale.total_amount)}</p>
                    <span className={cn(
                      'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mt-1 inline-block',
                      sale.sale_completed ? 'bg-secondary-container text-on-secondary-container' : 'bg-primary-fixed/20 text-primary'
                    )}>
                      {sale.sale_completed ? 'Closed' : 'Active'}
                    </span>
                    {!sale.sale_completed && (
                      <div className="flex flex-col gap-1 mt-2">
                        <Link href={`/sales/${sale.id}/materials`} className="text-[10px] text-secondary font-bold uppercase tracking-widest hover:underline">
                          Materials →
                        </Link>
                        <Link href={`/sales/${sale.id}/close`} className="text-[10px] text-primary font-bold uppercase tracking-widest hover:underline">
                          Close →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-surface-container-lowest rounded-2xl border-2 border-dashed border-outline-variant/20">
            <Icon name="receipt_long" className="text-4xl text-outline-variant mb-2 block" />
            <p className="text-on-surface-variant text-sm font-medium">No sales recorded yet</p>
          </div>
        )}
      </section>
    </div>
  );
}
