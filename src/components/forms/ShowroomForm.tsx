'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createShowroom, updateShowroom } from '@/lib/actions/showrooms';

interface Showroom { id: string; name: string; location?: string | null; }

export default function ShowroomForm({ initialData }: { initialData?: Showroom }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    location: initialData?.location || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (initialData) {
        await updateShowroom(initialData.id, formData);
      } else {
        await createShowroom(formData);
      }
      router.push('/showrooms');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the showroom.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-card space-y-6">
        <h2 className="font-headline font-bold text-xl text-primary">Showroom Identity</h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Showroom Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Downtown Atelier"
              className="w-full bg-surface-container py-3 px-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">City / Location</label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. New York, NY"
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

      <div className="fixed bottom-0 left-0 w-full lg:left-64 glass-panel z-50 px-6 py-4">
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
                <span className="material-symbols-outlined">storefront</span>
                {initialData ? 'Update Showroom' : 'Register Showroom'}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
