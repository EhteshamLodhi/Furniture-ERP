'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { recordMaterialUsage } from '@/lib/actions/sales';
import { formatCurrency } from '@/lib/utils';
import Icon from '@/components/ui/Icon';

export default function MaterialUsageForm({ saleId, materials, existingUsage }: { saleId: string, materials: any[], existingUsage: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [usages, setUsages] = useState([
    { material_id: materials[0]?.id || '', quantity_used: 1, unit_cost: materials[0]?.unit_cost || 0 }
  ]);

  const addUsage = () => setUsages([...usages, { material_id: materials[0]?.id || '', quantity_used: 1, unit_cost: materials[0]?.unit_cost || 0 }]);
  const removeUsage = (index: number) => {
    if (usages.length > 1) setUsages(usages.filter((_, i) => i !== index));
  };

  const handleUsageChange = (index: number, field: string, value: any) => {
    const newUsages = [...usages];
    if (field === 'material_id') {
      const material = materials.find(m => m.id === value);
      (newUsages[index] as any).unit_cost = material?.unit_cost || 0;
    }
    (newUsages[index] as any)[field] = value;
    setUsages(newUsages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await recordMaterialUsage(saleId, usages);
      router.push('/sales');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to record usage.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      {existingUsage.length > 0 && (
        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 space-y-4">
          <h3 className="font-headline font-bold text-sm text-on-surface uppercase tracking-widest">Previously Recorded Usage</h3>
          <div className="space-y-2">
            {existingUsage.map((u, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{u.quantity_used}x {u.materials?.name}</span>
                <span className="font-mono">{formatCurrency(u.total_cost)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-card space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="font-headline font-bold text-xl text-primary">Record New Materials</h2>
          <button type="button" onClick={addUsage} className="text-xs font-bold text-secondary uppercase tracking-widest px-3 py-1.5 bg-secondary-container rounded-lg hover:opacity-80 transition-opacity">
            + Add Material
          </button>
        </div>

        <div className="space-y-4">
          {usages.map((usage, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-4 p-4 bg-surface-container rounded-xl relative group">
              <div className="flex-1 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Material</label>
                <select
                  required
                  value={usage.material_id}
                  onChange={(e) => handleUsageChange(index, 'material_id', e.target.value)}
                  className="w-full bg-white/50 py-2 px-3 rounded-lg border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm appearance-none"
                >
                  {materials.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.stock_quantity} in stock)</option>
                  ))}
                </select>
              </div>
              <div className="w-24 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Qty Used</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  required
                  value={usage.quantity_used}
                  onChange={(e) => handleUsageChange(index, 'quantity_used', parseFloat(e.target.value) || 0)}
                  className="w-full bg-white/50 py-2 px-3 rounded-lg border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm text-center"
                />
              </div>
              <div className="w-32 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Cost (PKR)</label>
                <input
                  type="number"
                  disabled
                  value={(usage.quantity_used * usage.unit_cost).toFixed(2)}
                  className="w-full bg-surface-container-highest py-2 px-3 rounded-lg border-none outline-none text-sm text-right font-mono opacity-70"
                />
              </div>
              {usages.length > 1 && (
                <button type="button" onClick={() => removeUsage(index)} className="md:absolute -right-2 -top-2 w-6 h-6 rounded-full bg-error text-white flex items-center justify-center shadow-lg opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <Icon name="close" className="text-[14px]" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-error-container text-on-error-container rounded-xl text-sm font-medium flex items-center gap-3">
          <Icon name="error" />
          {error}
        </div>
      )}

      <div className="fixed bottom-0 left-0 w-full lg:left-64 glass-panel z-50 px-6 py-4">
        <div className="max-w-[80rem] mx-auto flex gap-4">
          <button type="button" onClick={() => router.back()} className="flex-1 bg-surface-container-highest text-on-surface font-bold py-4 rounded-xl active:scale-95 transition-all">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="flex-[2] gradient-cta text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Record Usage'}
          </button>
        </div>
      </div>
    </form>
  );
}
