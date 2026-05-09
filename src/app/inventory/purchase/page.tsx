import { getMaterials } from '@/lib/actions/inventory';
import { getSuppliers } from '@/lib/actions/suppliers';
import InventoryPurchaseForm from '@/components/forms/InventoryPurchaseForm';
import Link from 'next/link';

export default async function NewInventoryPurchasePage() {
  const [materials, suppliers] = await Promise.all([getMaterials(), getSuppliers()]);

  return (
    <div className="px-4 sm:px-6 py-8 max-w-3xl mx-auto space-y-6">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-1">Stock Management</p>
        <h1 className="text-3xl font-extrabold text-primary tracking-tight font-headline">Purchase Inventory</h1>
        <p className="text-sm text-on-surface-variant mt-1">Record a new stock purchase. Creates a payable if not fully paid.</p>
      </header>

      {materials.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border-2 border-dashed border-outline-variant/20 space-y-4">
          <span className="material-symbols-outlined text-5xl text-outline-variant block">inventory_2</span>
          <p className="font-bold text-on-surface-variant uppercase tracking-widest text-[11px]">No material SKUs defined yet</p>
          <Link href="/inventory/new" className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm">
            Add Material SKU First
          </Link>
        </div>
      ) : (
        <InventoryPurchaseForm materials={materials} suppliers={suppliers} />
      )}
    </div>
  );
}
