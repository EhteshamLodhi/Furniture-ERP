import type { Metadata } from 'next';
import Link from 'next/link';
import Icon, { type IconName } from '@/components/ui/Icon';

export const metadata: Metadata = {
  title: 'More',
};

const moreItems: { href: string; icon: IconName; label: string; desc: string; color: string }[] = [
  {
    href: '/receivables',
    icon: 'account_balance',
    label: 'Receivables',
    desc: 'Track unpaid invoices',
    color: 'bg-primary-fixed text-on-primary-fixed-variant',
  },
  {
    href: '/payables',
    icon: 'payments',
    label: 'Payables',
    desc: 'Supplier outstanding',
    color: 'bg-error-container text-on-error-container',
  },
  {
    href: '/reports',
    icon: 'assessment',
    label: 'Reports',
    desc: 'Financial intelligence',
    color: 'bg-primary-container text-on-primary-container',
  },
  {
    href: '/suppliers',
    icon: 'local_shipping',
    label: 'Suppliers',
    desc: 'Vendor management',
    color: 'bg-surface-container-highest text-on-surface-variant',
  },
];

export default function MorePage() {
  return (
    <div className="space-y-6 px-4 py-6 sm:px-6">
      <header>
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
          Management
        </p>
        <h1 className="font-headline text-3xl font-extrabold tracking-tight text-primary">More</h1>
      </header>

      <div className="space-y-3">
        {moreItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 rounded-xl bg-surface-container-lowest p-4 transition-all hover:bg-surface-container-low hover:shadow-card"
          >
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.color}`}
            >
              <Icon name={item.icon} className="text-xl" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-headline font-bold text-primary">{item.label}</span>
              <span className="block text-xs text-on-surface-variant">{item.desc}</span>
            </span>
            <Icon name="chevron_right" className="text-xl text-outline-variant" />
          </Link>
        ))}
      </div>
    </div>
  );
}
