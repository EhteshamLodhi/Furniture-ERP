import { formatCurrency, formatDate } from '@/lib/utils';
import { getReceivables } from '@/lib/actions/accounting';
import PaymentAction from '@/components/PaymentAction';
import MobileActionBar from '@/components/layout/MobileActionBar';

type ReceivableRow = {
  id: string;
  sale_id: string | null;
  customer_id: string;
  customers?: { name?: string | null } | null;
  created_at: string;
  status: 'unpaid' | 'partial' | 'paid' | string;
  total_amount: number;
  amount_paid: number;
  balance: number;
};

export default async function ReceivablesPage() {
  const receivables = await getReceivables();
  
  const totalOutstanding = (receivables || []).reduce((sum: number, r: ReceivableRow) => sum + (r.balance || 0), 0);
  const totalInvoices = receivables?.length || 0;

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6 max-w-4xl mx-auto pb-32">
      <header className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight font-headline">Receivables</h1>
          <p className="text-on-surface-variant text-sm font-medium">Customer Payment Tracking</p>
        </div>
        <div className="flex gap-2">
          <a href="#receivable-records" className="gradient-cta text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 min-h-12">
            <span className="material-symbols-outlined text-lg">payments</span>
            Record Payment
          </a>
        </div>
      </header>

      {/* KPI Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-error-container rounded-xl p-6 text-on-error-container overflow-hidden relative shadow-card">
          <div className="relative z-10">
            <p className="font-label text-[10px] uppercase tracking-widest mb-1 opacity-80">Total Outstanding Balance</p>
            <h2 className="font-headline text-4xl font-extrabold tracking-tight">{formatCurrency(totalOutstanding)}</h2>
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-error/10 rounded-full blur-3xl" />
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-card flex flex-col justify-center">
          <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Unpaid Sale Records</p>
          <h3 className="font-headline text-3xl font-bold text-primary">{totalInvoices}</h3>
        </div>
      </section>

      {/* List */}
      <section id="receivable-records" className="space-y-4 scroll-mt-32">
        {receivables && receivables.length > 0 ? (
          receivables.map((r: ReceivableRow) => (
            <div key={r.id} className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-outline-variant/20">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 pb-4 border-b border-surface-container">
                <div>
                  <h3 className="font-headline font-bold text-primary text-lg">{r.customers?.name}</h3>
                  <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">
                    Sale Ref: {r.sale_id ? r.sale_id.split('-')[0] : 'N/A'} • {formatDate(r.created_at)}
                  </p>
                </div>
                <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-3">
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${r.status === 'unpaid' ? 'bg-error-container text-on-error-container' : r.status === 'partial' ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-secondary-container text-on-secondary-container'}`}>
                    {r.status}
                  </span>
                  {r.sale_id && (
                    <PaymentAction 
                      invoiceId={r.sale_id} 
                      invoiceNumber={r.sale_id.split('-')[0]} 
                      remainingAmount={r.balance} 
                      type="receivable" 
                      entityId={r.customer_id} 
                    />
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                   <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-1">Total</p>
                   <p className="font-headline font-bold text-sm text-on-surface">{formatCurrency(r.total_amount)}</p>
                </div>
                <div>
                   <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-1">Paid</p>
                   <p className="font-headline font-bold text-sm text-secondary">{formatCurrency(r.amount_paid)}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-1">Remaining</p>
                   <p className="font-headline font-extrabold text-sm text-error">{formatCurrency(r.balance)}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border-2 border-dashed border-outline-variant/20">
            <span className="material-symbols-outlined text-5xl text-outline-variant mb-3">check_circle</span>
            <p className="font-bold text-on-surface-variant uppercase tracking-widest text-[11px]">No outstanding receivables</p>
          </div>
        )}
      </section>
      <MobileActionBar actions={[
        { href: '#receivable-records', icon: 'payments', label: 'Record Payment', primary: true },
        { href: '/sales/new', icon: 'add_shopping_cart', label: 'Add Sale' },
      ]} />
    </div>
  );
}
