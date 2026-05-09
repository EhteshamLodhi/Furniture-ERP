'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const actions = [
  { href: '/customers/new', icon: 'person_add', label: 'Add Customer' },
  { href: '/sales/new', icon: 'add_shopping_cart', label: 'Add Sale' },
  { href: '/inventory/new', icon: 'inventory_2', label: 'Add Inventory' },
  { href: '/suppliers/new', icon: 'local_shipping', label: 'Add Supplier' },
  { href: '/receivables', icon: 'payments', label: 'Record Payment' },
];

export default function QuickActionsFab() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === '/login' || pathname.includes('/new') || pathname.includes('/purchase') || pathname.includes('/close') || pathname.includes('/materials')) {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-4 z-[55] lg:hidden">
      <div className={cn('mb-3 flex flex-col items-end gap-2 transition-all duration-200', open ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-2')}>
        {actions.map((action, index) => (
          <Link
            key={action.href}
            href={action.href}
            onClick={() => setOpen(false)}
            className="min-h-11 rounded-xl bg-surface-container-lowest px-4 shadow-elevated flex items-center gap-3 text-sm font-bold text-primary"
            style={{ transitionDelay: `${index * 25}ms` }}
          >
            <span>{action.label}</span>
            <span className="material-symbols-outlined text-lg">{action.icon}</span>
          </Link>
        ))}
      </div>
      <button
        type="button"
        aria-label="Open quick actions"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-2xl gradient-cta text-white shadow-elevated transition-all active:scale-95"
      >
        <span className={cn('material-symbols-outlined transition-transform duration-200', open && 'rotate-45')}>add</span>
      </button>
    </div>
  );
}
