'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import Icon from '@/components/ui/Icon';

const categories = ['General', 'Sales Receipt', 'Expense Payment', 'Petty Cash', 'Rent', 'Utilities', 'Payroll'];

export default function LedgerEntryForm({ showrooms }: { showrooms: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    showroom_id: showrooms[0]?.id || '',
    category: 'General',
    description: '',
    reference_number: '',
    type: 'debit' as 'debit' | 'credit',
    amount: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.from('ledger_entries').insert({
        showroom_id: formData.showroom_id,
        category: formData.category,
        description: formData.description,
        reference_number: formData.reference_number,
        debit: formData.type === 'debit' ? formData.amount : 0,
        credit: formData.type === 'credit' ? formData.amount : 0,
      });

      if (error) throw error;
      router.push('/ledger');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save entry.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-card space-y-6">
        <h2 className="font-headline font-bold text-xl text-primary">Entry Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Type</label>
            <div className="flex p-1 bg-surface-container rounded-xl">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'debit' }))}
                className={cn(
                  "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                  formData.type === 'debit' ? "bg-primary text-white shadow-sm" : "text-on-surface-variant"
                )}
              >
                DEBIT (+)
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'credit' }))}
                className={cn(
                  "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                  formData.type === 'credit' ? "bg-error text-white shadow-sm" : "text-on-surface-variant"
                )}
              >
                CREDIT (-)
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Amount (PKR)</label>
            <input
              type="number"
              step="0.01"
              name="amount"
              required
              value={formData.amount}
              onChange={handleChange}
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
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Showroom</label>
            <select
              name="showroom_id"
              value={formData.showroom_id}
              onChange={handleChange}
              className="w-full bg-surface-container py-3 px-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
            >
              {showrooms.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Description</label>
            <textarea
              name="description"
              required
              rows={2}
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g. Monthly office rent payment"
              className="w-full bg-surface-container py-3 px-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Reference #</label>
            <input
              type="text"
              name="reference_number"
              value={formData.reference_number}
              onChange={handleChange}
              placeholder="e.g. CHQ-442"
              className="w-full bg-surface-container py-3 px-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
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
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-surface-container-highest text-on-surface font-bold py-4 rounded-xl active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || formData.amount <= 0}
            className="flex-[2] gradient-cta text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Icon name="receipt_long" />
                Record Entry
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
