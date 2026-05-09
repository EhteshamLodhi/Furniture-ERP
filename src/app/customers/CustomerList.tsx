'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatCurrency, getInitials, cn } from '@/lib/utils';
import { Customer } from '@/lib/types';

export default function CustomerList({ initialCustomers }: { initialCustomers: Customer[] }) {
  const [search, setSearch] = useState('');

  const filtered = initialCustomers.filter(c => 
    !search || c.name.toLowerCase().includes(search.toLowerCase())
  );

  const avatarColors = [
    'bg-primary-fixed text-on-primary-fixed',
    'bg-tertiary-fixed text-on-tertiary-fixed',
    'bg-primary-container text-white',
    'bg-secondary-container text-on-secondary-container',
  ];

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="space-y-4 mb-8">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">
            manage_search
          </span>
          <input
            type="text"
            placeholder="Search database..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-surface-container-highest border-none rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant font-body text-sm"
          />
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.map((customer, idx) => (
          <Link
            key={customer.id}
            href={`/customers/${customer.id}`}
            className="block bg-surface-container-lowest p-5 rounded-xl transition-all hover:bg-surface-container-low hover:shadow-card"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center font-headline font-bold text-lg',
                  avatarColors[idx % avatarColors.length]
                )}>
                  {getInitials(customer.name)}
                </div>
                <div>
                  <h3 className="font-headline font-bold text-primary">{customer.name}</h3>
                  <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold">
                    {customer.phone}
                  </p>
                </div>
              </div>
              <span className={cn(
                'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
                customer.balance > 0 ? 'bg-error-container text-on-error-container' : 'bg-secondary-fixed text-on-secondary-fixed-variant'
              )}>
                {customer.balance > 0 ? 'Balance Due' : 'Settled'}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-surface-container-high">
              <div>
                 <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-1">Total Sales</p>
                 <p className="font-headline font-bold text-sm text-primary">{formatCurrency(customer.total_sales)}</p>
              </div>
              <div>
                 <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-1">Paid</p>
                 <p className="font-headline font-bold text-sm text-secondary">{formatCurrency(customer.total_payments_received)}</p>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-1">Remaining</p>
                 <p className={cn("font-headline font-extrabold text-sm", customer.balance > 0 ? 'text-error' : 'text-primary')}>{formatCurrency(customer.balance)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
