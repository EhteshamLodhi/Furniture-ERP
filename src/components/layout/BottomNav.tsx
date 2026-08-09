'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Icon, { type IconName } from '@/components/ui/Icon';

const navItems: { href: string; icon: IconName; label: string }[] = [
  { href: '/', icon: 'dashboard', label: 'Dashboard' },
  { href: '/sales', icon: 'shopping_bag', label: 'Sales' },
  { href: '/customers', icon: 'groups', label: 'Customers' },
  { href: '/inventory', icon: 'factory', label: 'Inventory' },
  { href: '/more', icon: 'more_horiz', label: 'More' },
];

const moreSections = ['/receivables', '/payables', '/reports', '/suppliers', '/more'];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/more') return moreSections.some((p) => pathname.startsWith(p));
    return pathname.startsWith(href);
  };

  const isFormFlow =
    pathname.endsWith('/new') ||
    pathname.includes('/purchase') ||
    pathname.includes('/close') ||
    pathname.includes('/materials');

  if (isFormFlow) return null;

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around gap-1 px-2 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 glass-panel shadow-[0_-4px_24px_rgba(0,32,70,0.04)] min-[380px]:px-4 lg:hidden"
      style={{ viewTransitionName: 'site-bottom-nav' }}
    >
      {navItems.map((item) => {
        const active = isActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl px-1 py-1.5 transition-colors duration-200',
              active ? 'bg-primary text-white' : 'text-on-surface-variant hover:text-primary'
            )}
          >
            <Icon name={item.icon} className="text-xl" />
            <span className="mt-1 w-full truncate text-center font-label text-[10px] font-semibold uppercase tracking-wider">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
