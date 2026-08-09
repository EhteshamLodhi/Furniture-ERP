export const dynamic = 'force-dynamic';

import Icon from '@/components/ui/Icon';

export default async function ReportsPage() {
  return (
    <div className="px-4 sm:px-6 py-6 space-y-8 max-w-2xl mx-auto">
      {/* Hero */}
      <section>
        <div className="p-6 rounded-2xl gradient-cta text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="font-label text-[10px] uppercase tracking-widest opacity-80 mb-1 font-bold">Financial Intelligence</p>
            <h1 className="text-2xl font-extrabold mb-2 leading-tight font-headline">Reports Center</h1>
            <p className="text-sm font-medium opacity-90">Export live CSV reports for your records.</p>
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        </div>
      </section>

      {/* CSV Exports */}
      <section className="space-y-4">
        <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-on-surface-variant px-1">CSV Exports</h3>
        <div className="bg-surface-container-low rounded-2xl p-6 shadow-sm space-y-4">
          
          <a href="/api/reports/sales" download className="flex items-center justify-between p-4 bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon name="payments" />
              </div>
              <div>
                <p className="font-headline font-bold text-primary">Monthly Sales Overview</p>
                <p className="text-[10px] font-medium text-on-surface-variant">Complete list of sales and margins</p>
              </div>
            </div>
            <Icon name="download" className="text-outline" />
          </a>

          <a href="/api/reports/receivables" download className="flex items-center justify-between p-4 bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-error-container text-on-error-container flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon name="account_balance" />
              </div>
              <div>
                <p className="font-headline font-bold text-primary">Outstanding Receivables</p>
                <p className="text-[10px] font-medium text-on-surface-variant">Customer unpaid balances</p>
              </div>
            </div>
            <Icon name="download" className="text-outline" />
          </a>

          <a href="/api/reports/payables" download className="flex items-center justify-between p-4 bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-tertiary-container text-on-tertiary-container flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon name="receipt_long" />
              </div>
              <div>
                <p className="font-headline font-bold text-primary">Outstanding Payables</p>
                <p className="text-[10px] font-medium text-on-surface-variant">Vendor unpaid balances</p>
              </div>
            </div>
            <Icon name="download" className="text-outline" />
          </a>

        </div>
      </section>
    </div>
  );
}

