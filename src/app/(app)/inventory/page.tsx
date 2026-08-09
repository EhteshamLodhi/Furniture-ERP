export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getMaterials } from '@/lib/actions/inventory';
import InventoryList from './InventoryList';
import MobileActionBar from '@/components/layout/MobileActionBar';
import Icon from '@/components/ui/Icon';

export default async function InventoryPage() {
  const materials = await getMaterials();

  return (
    <div className="px-4 sm:px-6 py-6 relative">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-1">Stock Overview</p>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight font-headline">Inventory</h1>
        </div>
        <div className="grid grid-cols-2 sm:flex gap-3 w-full sm:w-auto">
          <Link
            href="/inventory/new"
            className="bg-surface-container-high text-primary px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-all active:scale-95 min-h-12"
          >
            <Icon name="add" className="text-sm" />
            Add Inventory
          </Link>
          <Link
            href="/inventory/purchase"
            className="gradient-cta text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:shadow-primary/40 transition-all active:scale-95 min-h-12"
          >
            <Icon name="shopping_cart" className="text-sm" />
            Buy Stock
          </Link>
        </div>
      </header>

      <InventoryList initialMaterials={materials} />
      <MobileActionBar actions={[
        { href: '/inventory/new', icon: 'inventory_2', label: 'Add Inventory', primary: true },
        { href: '/inventory/purchase', icon: 'shopping_cart', label: 'Buy Stock' },
      ]} />
    </div>
  );
}
