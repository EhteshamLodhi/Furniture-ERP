import Link from 'next/link';

const moreItems = [
  { href: '/receivables', icon: 'account_balance', label: 'Receivables', desc: 'Track unpaid invoices', color: 'bg-primary-fixed text-on-primary-fixed-variant' },
  { href: '/payables', icon: 'payments', label: 'Payables', desc: 'Supplier outstanding', color: 'bg-error-container text-on-error-container' },
  { href: '/showrooms', icon: 'store', label: 'Showrooms', desc: 'Performance analytics', color: 'bg-secondary-container text-on-secondary-container' },
  { href: '/ledger', icon: 'receipt_long', label: 'General Ledger', desc: 'Full ledger view', color: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' },
  { href: '/reports', icon: 'assessment', label: 'Reports', desc: 'Financial intelligence', color: 'bg-primary-container text-on-primary-container' },
  { href: '/suppliers', icon: 'local_shipping', label: 'Suppliers', desc: 'Vendor management', color: 'bg-surface-container-highest text-on-surface-variant' },
];

export default function MorePage() {
  return (
    <div className="px-4 sm:px-6 py-6 space-y-6">
      <div className="space-y-3">
        {moreItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 bg-surface-container-lowest p-4 rounded-xl transition-all hover:shadow-card hover:bg-surface-container-low"
          >
            <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center`}>
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
            </div>
            <div className="flex-1">
              <p className="font-headline font-bold text-primary">{item.label}</p>
              <p className="text-xs text-on-surface-variant">{item.desc}</p>
            </div>
            <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
