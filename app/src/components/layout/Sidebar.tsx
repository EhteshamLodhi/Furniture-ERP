'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import InstallAppButton from '@/components/pwa/InstallAppButton';

const sections = [
  {
    title: 'Overview',
    items: [
      { href: '/', icon: 'dashboard', label: 'Dashboard' },
      { href: '/reports', icon: 'assessment', label: 'Reports' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { href: '/sales', icon: 'shopping_bag', label: 'Sales Workflow' },
      { href: '/inventory', icon: 'factory', label: 'Inventory' },
    ],
  },
  {
    title: 'Entities',
    items: [
      { href: '/customers', icon: 'groups', label: 'Customers' },
      { href: '/suppliers', icon: 'local_shipping', label: 'Suppliers' },
    ],
  },
  {
    title: 'Accounts',
    items: [
      { href: '/receivables', icon: 'account_balance', label: 'Receivables' },
      { href: '/payables', icon: 'payments', label: 'Payables' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const open = () => setMobileOpen(true);
    window.addEventListener('ledger-mobile-nav-open', open);
    return () => window.removeEventListener('ledger-mobile-nav-open', open);
  }, []);

  if (pathname === '/login') return null;

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const navContent = (
    <>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        {sections.map(section => (
          <div key={section.title}>
            <p className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3 px-3">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex min-h-12 items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                    isActive(item.href)
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
                  )}
                >
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  <span className="text-sm font-semibold">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 tonal-separator">
        <InstallAppButton variant="sidebar" />
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-16 bottom-0 bg-surface-container-highest/50 backdrop-blur-xl z-40">
        {navContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-[min(86vw,22rem)] flex-col bg-surface-container-lowest shadow-elevated animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between px-5 py-4 tonal-separator">
              <div>
                <p className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Furniture ERP</p>
                <h2 className="font-headline text-lg font-extrabold text-primary">The Ledger</h2>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="h-10 w-10 rounded-full bg-surface-container flex items-center justify-center text-primary"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
