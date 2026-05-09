'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: 'dashboard', label: 'Dashboard' },
  { href: '/sales', icon: 'shopping_bag', label: 'Sales' },
  { href: '/customers', icon: 'groups', label: 'Customers' },
  { href: '/inventory', icon: 'factory', label: 'Inventory' },
  { href: '/more', icon: 'more_horiz', label: 'More' },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/more') {
      return ['/receivables', '/payables', '/showrooms', '/ledger', '/reports', '/suppliers', '/settings', '/more'].some(p => pathname.startsWith(p));
    }
    return pathname.startsWith(href);
  };

  const isFormFlow =
    pathname === '/login' ||
    pathname.endsWith('/new') ||
    pathname.includes('/purchase') ||
    pathname.includes('/close') ||
    pathname.includes('/materials');

  if (isFormFlow) return null;

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-2 min-[380px]:px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 glass-panel z-50 shadow-[0_-4px_24px_rgba(0,32,70,0.04)] lg:hidden">
      {navItems.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex min-w-0 flex-1 flex-col items-center justify-center px-2 py-1.5 transition-all duration-300 ease-out',
            isActive(item.href)
              ? 'bg-primary text-white rounded-xl'
              : 'text-on-surface-variant hover:text-primary'
          )}
        >
          <span className="material-symbols-outlined">{item.icon}</span>
          <span className="font-label text-[10px] font-semibold uppercase tracking-wider mt-1">
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}
