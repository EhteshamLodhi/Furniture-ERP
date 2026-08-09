export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { getDashboardData } from '@/lib/actions/dashboard';
import Icon from '@/components/ui/Icon';

export default async function DashboardPage() {
  const { kpis, transactions } = await getDashboardData();

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6">
      {/* Welcome Section */}
      <section className="py-2">
        <h1 className="text-2xl font-extrabold text-primary tracking-tight font-headline">
          Showroom Operations
        </h1>
        <p className="text-on-surface-variant text-sm font-medium">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </section>

      {/* Financial Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales Month */}
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-card hover:shadow-elevated transition-all">
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            Monthly Sales
          </span>
          <h2 className="text-2xl font-extrabold text-primary mt-1 tracking-tight font-headline">
            {formatCurrency(kpis.totalSalesMonth)}
          </h2>
        </div>

        {/* Payments Received Month */}
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-card hover:shadow-elevated transition-all border-b-2 border-secondary/20">
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            Collected
          </span>
          <h2 className="text-2xl font-extrabold text-secondary mt-1 tracking-tight font-headline">
            {formatCurrency(kpis.paymentsReceivedMonth)}
          </h2>
        </div>

        {/* Total AR */}
        <Link href="/receivables" className="bg-error-container text-on-error-container p-5 rounded-xl shadow-card hover:shadow-elevated transition-all group">
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
            Total Receivables
          </span>
          <h2 className="text-2xl font-extrabold mt-1 tracking-tight font-headline group-hover:scale-105 transition-transform origin-left">
            {formatCurrency(kpis.outstandingReceivablesTotal)}
          </h2>
        </Link>

        {/* Total AP */}
        <Link href="/payables" className="bg-tertiary-container text-on-tertiary-container p-5 rounded-xl shadow-card hover:shadow-elevated transition-all group">
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
            Total Payables
          </span>
          <h2 className="text-2xl font-extrabold mt-1 tracking-tight font-headline group-hover:scale-105 transition-transform origin-left">
            {formatCurrency(kpis.outstandingPayablesTotal)}
          </h2>
        </Link>
      </div>

      {/* Stock Value Card */}
      <div className="gradient-cta p-5 rounded-xl shadow-lg relative overflow-hidden flex justify-between items-center">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="inventory_2" className="text-on-primary-container text-sm" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">
              Total Material Value
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight font-headline">
            {formatCurrency(kpis.stockValue)}
          </h2>
        </div>
        <div className="relative z-10 text-right">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/20">
            <p className="text-[10px] font-bold text-white uppercase tracking-widest">Low Stock Items</p>
            <p className="text-xl font-extrabold text-error-container">{kpis.lowStockCount}</p>
          </div>
        </div>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
      </div>

      {/* Recent Transactions */}
      <section className="space-y-4">
        <div className="flex justify-between items-end px-1">
          <h2 className="text-lg font-bold text-primary tracking-tight font-headline">
            Recent Payments
          </h2>
        </div>
        <div className="space-y-3">
          {transactions.map(tx => (
            <div key={tx.id} className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between hover:bg-surface-container transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tx.type === 'credit' ? 'bg-secondary-container text-secondary' : 'bg-tertiary-container text-tertiary'}`}>
                  <Icon name={tx.type === 'credit' ? 'arrow_downward' : 'arrow_upward'} className="text-xl" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">{tx.description}</p>
                  <p className="text-[11px] text-on-surface-variant">{tx.reference}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${tx.type === 'credit' ? 'text-secondary' : 'text-primary'}`}>
                  {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                </p>
                <span className="text-[10px] text-on-surface-variant">
                  {new Date(tx.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
             <div className="text-center py-8 text-on-surface-variant text-sm border-2 border-dashed border-outline-variant/30 rounded-xl">
               No recent payments recorded.
             </div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-3 pb-8">
        <Link href="/sales/new" className="gradient-cta text-white p-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-md transition-all active:scale-95 hover:shadow-lg">
          <Icon name="shopping_cart" className="text-sm" />
          Add Sale
        </Link>
        <Link href="/customers/new" className="bg-surface-container-high text-primary p-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all active:scale-95 hover:bg-surface-container-highest">
          <Icon name="person_add" className="text-sm" />
          Add Customer
        </Link>
        <Link href="/inventory/new" className="bg-surface-container-high text-primary p-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all active:scale-95 hover:bg-surface-container-highest">
          <Icon name="inventory" className="text-sm" />
          Add Inventory
        </Link>
        <Link href="/suppliers/new" className="bg-surface-container-high text-primary p-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all active:scale-95 hover:bg-surface-container-highest">
          <Icon name="local_shipping" className="text-sm" />
          Add Supplier
        </Link>
        <Link href="/receivables" className="bg-surface-container-high text-primary p-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all active:scale-95 hover:bg-surface-container-highest">
          <Icon name="payments" className="text-sm" />
          Record Payment
        </Link>
      </section>
    </div>
  );
}
