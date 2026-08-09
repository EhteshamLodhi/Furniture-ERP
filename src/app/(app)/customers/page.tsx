export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getCustomers } from '@/lib/actions/customers';
import CustomerList from './CustomerList';
import MobileActionBar from '@/components/layout/MobileActionBar';
import Icon from '@/components/ui/Icon';

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="px-4 sm:px-6 py-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-1">Portfolio Relations</p>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight font-headline">Customers</h1>
        </div>
        <Link
          href="/customers/new"
          className="gradient-cta text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all flex items-center gap-2 w-full sm:w-auto justify-center min-h-12"
        >
          <Icon name="person_add" className="text-lg" />
          Add Customer
        </Link>
      </header>

      <CustomerList initialCustomers={customers} />
      <MobileActionBar actions={[
        { href: '/customers/new', icon: 'person_add', label: 'Add Customer', primary: true },
        { href: '/sales/new', icon: 'add_shopping_cart', label: 'Add Sale' },
      ]} />
    </div>
  );
}
