'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupplier, updateSupplier } from '@/lib/actions/suppliers';
import type { Supplier } from '@/lib/types';

export default function SupplierForm({ initialData }: { initialData?: Supplier }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (initialData) {
        await updateSupplier(initialData.id, formData);
      } else {
        await createSupplier(formData);
      }
      router.push('/suppliers');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the supplier.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-card space-y-6">
        <h2 className="font-headline font-bold text-xl text-primary">Company Info</h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Supplier / Entity Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Global Veneers Ltd."
              className="w-full bg-surface-container py-3 px-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-card space-y-6">
        <h2 className="font-headline font-bold text-xl text-primary">Communication & Logistics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Phone</label>
            <input
              type="text"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 987-6543"
              className="w-full bg-surface-container py-3 px-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          <div className="col-span-1 md:col-span-2 space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Office Address</label>
            <textarea
              name="address"
              rows={3}
              value={formData.address}
              onChange={handleChange}
              placeholder="456 Industrial Blvd, Logis City..."
              className="w-full bg-surface-container py-3 px-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
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
                <span className="material-symbols-outlined">local_shipping</span>
                {initialData ? 'Update Supplier' : 'Onboard Supplier'}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
