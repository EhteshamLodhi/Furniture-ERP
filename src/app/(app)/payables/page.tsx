export const dynamic = 'force-dynamic';

import { formatCurrency, formatDate } from '@/lib/utils';
import { getPayables } from '@/lib/actions/accounting';
import PaymentAction from '@/components/PaymentAction';
import MobileActionBar from '@/components/layout/MobileActionBar';
import Icon from '@/components/ui/Icon';

type PayableRow = {
  id: string;
  purchase_id: string | null;
  supplier_id: string;
  suppliers?: { name?: string | null } | null;
  created_at: string;
  status: 'unpaid' | 'partial' | 'paid' | string;
  total_amount: number;
  amount_paid: number;
  balance: number;
};

export default async function PayablesPage() {
  const payables = await getPayables();
  
  const totalOutstanding = (payables || []).reduce((sum: number, p: PayableRow) => sum + (p.balance || 0), 0);
  const totalInvoices = payables?.length || 0;

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6 max-w-4xl mx-auto">
      <header className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight font-headline">Payables</h1>
          <p className="text-on-surface-variant text-sm font-medium">Supplier & Vendor Payments</p>
        </div>
        <a href="#payable-records" className="gradient-cta text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 min-h-12">
          <Icon name="payments" className="text-lg" />
          Record Payment
        </a>
      </header>

      {/* KPI Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-tertiary-container rounded-xl p-6 text-on-tertiary-container overflow-hidden relative shadow-card">
          <div className="relative z-10">
            <p className="font-label text-[10px] uppercase tracking-widest mb-1 opacity-80">Total Outstanding Payables</p>
            <h2 className="font-headline text-4xl font-extrabold tracking-tight">{formatCurrency(totalOutstanding)}</h2>
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-tertiary/10 rounded-full blur-3xl" />
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-card flex flex-col justify-center">
          <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Unpaid Purchase Records</p>
          <h3 className="font-headline text-3xl font-bold text-primary">{totalInvoices}</h3>
        </div>
      </section>

      {/* List */}
      <section id="payable-records" className="space-y-4 scroll-mt-32">
        {payables && payables.length > 0 ? (
          payables.map((p: PayableRow) => (
            <div key={p.id} className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-outline-variant/20">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 pb-4 border-b border-surface-container">
                <div>
                  <h3 className="font-headline font-bold text-primary text-lg">{p.suppliers?.name}</h3>
                  <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">
                    Purchase Ref: {p.purchase_id ? p.purchase_id.split('-')[0] : 'N/A'} • {formatDate(p.created_at)}
                  </p>
                </div>
                <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-3">
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${p.status === 'unpaid' ? 'bg-error-container text-on-error-container' : p.status === 'partial' ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-secondary-container text-on-secondary-container'}`}>
                    {p.status}
                  </span>
                  {p.purchase_id && (
                    <PaymentAction 
                      invoiceId={p.purchase_id} 
                      invoiceNumber={p.purchase_id.split('-')[0]} 
                      remainingAmount={p.balance} 
                      type="payable" 
                      entityId={p.supplier_id} 
                    />
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                   <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-1">Total</p>
                   <p className="font-headline font-bold text-sm text-on-surface">{formatCurrency(p.total_amount)}</p>
                </div>
                <div>
                   <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-1">Paid</p>
                   <p className="font-headline font-bold text-sm text-secondary">{formatCurrency(p.amount_paid)}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-1">Remaining</p>
                   <p className="font-headline font-extrabold text-sm text-error">{formatCurrency(p.balance)}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border-2 border-dashed border-outline-variant/20">
            <Icon name="check_circle" className="text-5xl text-outline-variant mb-3" />
            <p className="font-bold text-on-surface-variant uppercase tracking-widest text-[11px]">No outstanding payables</p>
          </div>
        )}
      </section>
      <MobileActionBar actions={[
        { href: '#payable-records', icon: 'payments', label: 'Record Payment', primary: true },
        { href: '/suppliers/new', icon: 'local_shipping', label: 'Add Supplier' },
      ]} />
    </div>
  );
}
