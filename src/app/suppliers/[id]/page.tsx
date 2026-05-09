import Link from 'next/link';
import { getSupplierById, getSupplierPurchases } from '@/lib/actions/suppliers';
import { notFound } from 'next/navigation';
import { formatCurrency, formatDate, getInitials, cn } from '@/lib/utils';
import PaymentAction from '@/components/PaymentAction';
import { getPayables } from '@/lib/actions/accounting';
import DeleteEntryButton from '@/components/DeleteEntryButton';

export default async function SupplierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [supplier, purchases, allPayables] = await Promise.all([
    getSupplierById(id),
    getSupplierPurchases(id),
    getPayables(),
  ]);

  if (!supplier) notFound();

  const unpaidPayables = (allPayables || []).filter(
    (p: any) => p.supplier_id === id && p.status !== 'paid'
  );

  return (
    <div className="px-4 sm:px-6 py-6 max-w-2xl mx-auto space-y-6">
      {/* Profile Card */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-card">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-tertiary flex items-center justify-center text-white font-headline font-extrabold text-2xl shadow-lg">
            {getInitials(supplier.name)}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-primary font-headline tracking-tight">{supplier.name}</h1>
            <p className="text-sm text-on-surface-variant font-medium">{supplier.phone}</p>
            {supplier.address && <p className="text-xs text-on-surface-variant mt-0.5">{supplier.address}</p>}
          </div>
          </div>
          <DeleteEntryButton entryId={id} kind="supplier" label={supplier.name} redirectTo="/suppliers" variant="button" className="shrink-0" />
        </div>

        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-surface-container">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Total Purchases</p>
            <p className="font-headline font-bold text-primary">{formatCurrency(supplier.total_purchases)}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Paid</p>
            <p className="font-headline font-bold text-secondary">{formatCurrency(supplier.total_payments_made)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">We Owe</p>
            <p className={cn('font-headline font-extrabold', supplier.balance > 0 ? 'text-error' : 'text-primary')}>
              {formatCurrency(supplier.balance)}
            </p>
          </div>
        </div>
      </div>

      {/* Outstanding Payables */}
      {unpaidPayables.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-headline font-bold text-primary px-1">Outstanding Payables</h2>
          {unpaidPayables.map((p: any) => (
            <div key={p.id} className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-error/20 flex justify-between items-center gap-4">
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  {formatDate(p.created_at)}
                </p>
                <p className="font-headline font-bold text-error">{formatCurrency(p.balance)}</p>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded mt-1 inline-block ${p.status === 'partial' ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-error-container text-on-error-container'}`}>
                  {p.status}
                </span>
              </div>
              <PaymentAction
                invoiceId={p.purchase_id}
                invoiceNumber={p.purchase_id?.split('-')[0]}
                remainingAmount={p.balance}
                type="payable"
                entityId={id}
              />
            </div>
          ))}
        </section>
      )}

      {/* Purchase History */}
      <section className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h2 className="font-headline font-bold text-primary">Purchase History</h2>
          <Link href="/inventory/purchase" className="text-xs font-bold text-secondary uppercase tracking-widest">
            + New Purchase
          </Link>
        </div>

        {purchases && purchases.length > 0 ? (
          <div className="space-y-3">
            {purchases.map((p: any) => (
              <div key={p.id} className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/10">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-primary text-sm">{(p.materials as any)?.name}</p>
                    <p className="text-xs text-on-surface-variant">{formatDate(p.date)} • {p.quantity_added} units @ {formatCurrency(p.unit_cost)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-headline font-bold text-primary">{formatCurrency(p.total_cost)}</p>
                    <p className="text-xs text-secondary">Paid: {formatCurrency(p.amount_paid)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-surface-container-lowest rounded-2xl border-2 border-dashed border-outline-variant/20">
            <span className="material-symbols-outlined text-4xl text-outline-variant mb-2 block">local_shipping</span>
            <p className="text-on-surface-variant text-sm font-medium">No purchases recorded yet</p>
          </div>
        )}
      </section>
    </div>
  );
}
