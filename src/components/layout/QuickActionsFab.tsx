'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Icon, { type IconName } from '@/components/ui/Icon';

const actions: { href: string; icon: IconName; label: string }[] = [
  { href: '/customers/new', icon: 'person_add', label: 'Add Customer' },
  { href: '/sales/new', icon: 'add_shopping_cart', label: 'Add Sale' },
  { href: '/inventory/new', icon: 'inventory_2', label: 'Add Inventory' },
  { href: '/suppliers/new', icon: 'local_shipping', label: 'Add Supplier' },
  { href: '/receivables', icon: 'payments', label: 'Record Payment' },
];

export default function QuickActionsFab() {
  const pathname = usePathname();
  // Scoped to the route it was opened on, so navigating collapses it without
  // an effect.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === pathname;

  const isFormFlow =
    pathname.includes('/new') ||
    pathname.includes('/purchase') ||
    pathname.includes('/close') ||
    pathname.includes('/materials');

  if (isFormFlow) return null;

  return (
    <div className="fixed bottom-24 right-4 z-[55] lg:hidden">
      <div
        className={cn(
          'mb-3 flex flex-col items-end gap-2 transition-all duration-200',
          open ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-2'
        )}
      >
        {actions.map((action, index) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex min-h-11 items-center gap-3 rounded-xl bg-surface-container-lowest px-4 text-sm font-bold text-primary shadow-elevated"
            style={{ transitionDelay: `${index * 25}ms` }}
            tabIndex={open ? undefined : -1}
            aria-hidden={open ? undefined : true}
          >
            <span>{action.label}</span>
            <Icon name={action.icon} className="text-lg" />
          </Link>
        ))}
      </div>
      <button
        type="button"
        aria-label={open ? 'Close quick actions' : 'Open quick actions'}
        aria-expanded={open}
        onClick={() => setOpenedAt(open ? null : pathname)}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-2xl gradient-cta text-white shadow-elevated transition-all active:scale-95"
      >
        <Icon
          name="add"
          className={cn('text-2xl transition-transform duration-200', open && 'rotate-45')}
        />
      </button>
    </div>
  );
}
