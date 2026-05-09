import Link from 'next/link';
import { formatCurrency, getInitials, cn } from '@/lib/utils';
import { getSuppliers } from '@/lib/actions/suppliers';
import MobileActionBar from '@/components/layout/MobileActionBar';

export default async function SuppliersPage() {
  const suppliers = await getSuppliers();

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6 max-w-lg mx-auto min-h-screen">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-1">Logistics & Supply</p>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight font-headline">Suppliers</h1>
        </div>
        <Link
          href="/suppliers/new"
          className="gradient-cta text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all flex items-center gap-2 w-full sm:w-auto justify-center min-h-12"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add Supplier
        </Link>
      </header>

      {/* Supplier Cards */}
      <div className="space-y-4">
        {suppliers.length > 0 ? (
          suppliers.map((supplier) => (
            <Link
              key={supplier.id}
              href={`/suppliers/${supplier.id}`}
              className="block bg-surface-container-lowest p-5 rounded-xl shadow-card transition-all hover:shadow-elevated hover:bg-surface-container-low"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center font-bold font-headline text-lg">
                  {getInitials(supplier.name)}
                </div>
                <div>
                  <h3 className="font-headline font-bold text-primary">{supplier.name}</h3>
                  <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold">
                    {supplier.phone}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-surface-container">
                <div>
                   <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-1">Purchases</p>
                   <p className="font-headline font-bold text-sm text-primary">{formatCurrency(supplier.total_purchases)}</p>
                </div>
                <div>
                   <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-1">Paid</p>
                   <p className="font-headline font-bold text-sm text-secondary">{formatCurrency(supplier.total_payments_made)}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-1">We Owe</p>
                   <p className={cn("font-headline font-extrabold text-sm", supplier.balance > 0 ? 'text-error' : 'text-primary')}>{formatCurrency(supplier.balance)}</p>
                </div>
              </div>
              
              <div className="pt-3 flex justify-end">
                <span className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-1">
                  View Details <span className="material-symbols-outlined text-sm">chevron_right</span>
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border-2 border-dashed border-outline-variant/20">
            <span className="material-symbols-outlined text-5xl text-outline-variant mb-3 block">local_shipping</span>
            <p className="font-bold text-on-surface-variant uppercase tracking-widest text-[11px] mb-4">No suppliers on record</p>
            <Link href="/suppliers/new" className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm">
              Add First Supplier
            </Link>
          </div>
        )}
      </div>
      <MobileActionBar actions={[
        { href: '/suppliers/new', icon: 'local_shipping', label: 'Add Supplier', primary: true },
        { href: '/payables', icon: 'payments', label: 'Payables' },
      ]} />
    </div>
  );
}
