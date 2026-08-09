export const dynamic = 'force-dynamic';

import { getSale } from '@/lib/actions/sales';
import { getMaterials } from '@/lib/actions/inventory';
import MaterialUsageForm from '@/components/forms/MaterialUsageForm';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Icon from '@/components/ui/Icon';

export default async function MaterialUsagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [sale, materials] = await Promise.all([getSale(id), getMaterials()]);

  if (!sale) notFound();

  return (
    <div className="px-4 sm:px-6 py-8 max-w-3xl mx-auto space-y-6">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-1">Stage 2: Material Usage</p>
        <h1 className="text-3xl font-extrabold text-primary tracking-tight font-headline">Record Materials</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Customer: <span className="font-bold text-primary">{(sale as any).customers?.name}</span>
        </p>
      </header>

      {materials.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border-2 border-dashed border-outline-variant/20">
          <Icon name="inventory_2" className="text-5xl text-outline-variant mb-3 block" />
          <p className="font-bold text-on-surface-variant uppercase tracking-widest text-[11px] mb-4">No materials in inventory</p>
          <Link href="/inventory/new" className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm">
            Add Material First
          </Link>
        </div>
      ) : (
        <MaterialUsageForm
          saleId={id}
          materials={materials}
          existingUsage={(sale as any).material_usage || []}
        />
      )}
    </div>
  );
}
