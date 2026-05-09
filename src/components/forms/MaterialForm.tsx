'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createMaterial } from '@/lib/actions/inventory';
import type { Material } from '@/lib/types';

const categories = ['Sheet', 'Hardware', 'Cushion', 'PVC', 'Brass', 'Pegs', 'Glass', 'Other'];
const units = ['units', 'meters', 'sq ft', 'kg', 'liters'];

export default function MaterialForm({ initialData }: { initialData?: Material }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || 'Sheet',
    unit: initialData?.unit || 'units',
    stock_quantity: initialData?.stock_quantity || 0,
    unit_cost: initialData?.unit_cost || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createMaterial(formData as any);
      router.push('/inventory');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the material.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'stock_quantity' || name === 'unit_cost') 
        ? parseFloat(value) || 0 
        : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-card space-y-6">
        <h2 className="font-headline font-bold text-xl text-primary">Technical Specs</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Material Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Italian Walnut Veneer"
              className="w-full bg-surface-container py-3 px-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-surface-container py-3 px-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Inventory Unit</label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full bg-surface-container py-3 px-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
            >
              {units.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-card space-y-6">
        <h2 className="font-headline font-bold text-xl text-primary">Stock & Costing</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Initial Quantity</label>
            <input
              type="number"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleChange}
              className="w-full bg-surface-container py-3 px-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Unit Cost (PKR)</label>
            <input
              type="number"
              step="0.01"
              name="unit_cost"
              value={formData.unit_cost}
              onChange={handleChange}
              className="w-full bg-surface-container py-3 px-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>


        </div>
      </div>

      {error && (
        <div className="p-4 bg-error-container text-on-error-container rounded-xl text-sm font-medium flex items-center gap-3">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      <div className="fixed bottom-0 left-0 w-full lg:left-64 glass-panel z-50 px-4 sm:px-6 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
        <div className="max-w-screen-xl mx-auto flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-surface-container-highest text-on-surface font-bold py-4 rounded-xl active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-[2] gradient-cta text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span className="material-symbols-outlined">inventory</span>
                {initialData ? 'Update Stock' : 'Add to Catalog'}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
