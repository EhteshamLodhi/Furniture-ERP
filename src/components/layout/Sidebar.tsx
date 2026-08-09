'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import InstallAppButton from '@/components/pwa/InstallAppButton';
import Icon, { type IconName } from '@/components/ui/Icon';

type NavItem = { href: string; icon: IconName; label: string };

const sections: { title: string; items: NavItem[] }[] = [
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
  // Remembering which route opened the drawer closes it on navigation for
  // free, including browser back, with no effect chasing the pathname.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const mobileOpen = openedAt === pathname;
  const setMobileOpen = (open: boolean) => setOpenedAt(open ? pathname : null);

  useEffect(() => {
    const open = () => setOpenedAt(pathname);
    window.addEventListener('ledger-mobile-nav-open', open);
    return () => window.removeEventListener('ledger-mobile-nav-open', open);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenedAt(null);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const navContent = (
    <>
      <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto p-6">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="mb-3 px-3 font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex min-h-12 items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-200',
                      active
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
                    )}
                  >
                    <Icon name={item.icon} className="text-xl" />
                    <span className="truncate text-sm font-semibold">{item.label}</span>
                  </Link>
                );
              })}
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
      <aside
        aria-label="Sections"
        className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-64 shrink-0 flex-col bg-surface-container-highest/50 backdrop-blur-xl lg:flex"
        style={{ viewTransitionName: 'site-sidebar' }}
      >
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
          <aside className="relative flex h-full w-[min(86vw,22rem)] flex-col bg-surface-container-lowest shadow-elevated animate-slide-in-left">
            <div className="flex items-center justify-between px-5 py-4 tonal-separator">
              <div>
                <p className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Furniture ERP
                </p>
                <h2 className="font-headline text-lg font-extrabold text-primary">The Ledger</h2>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-primary"
              >
                <Icon name="close" className="text-xl" />
              </button>
            </div>
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
