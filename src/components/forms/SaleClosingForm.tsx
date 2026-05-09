'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { closeSale } from '@/lib/actions/sales';
import { formatCurrency } from '@/lib/utils';

export default function SaleClosingForm({ sale }: { sale: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    payment_received: sale.payment_received || 0,
    payment_method: sale.payment_method || 'Cash',
    order_delivered: sale.order_delivered || false,
    sale_completed: sale.sale_completed || false,
  });

  const remainingBalance = sale.total_amount - formData.payment_received;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await closeSale(sale.id, formData);
      router.push('/sales');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to close sale.');
    } finally {
      setLoading(false);
    }
  };

  const isCompleted = sale.sale_completed;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-card space-y-6">
        <h2 className="font-headline font-bold text-xl text-primary">Payment Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Payment Received (PKR)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              required
              disabled={isCompleted}
              value={formData.payment_received}
              onChange={(e) => setFormData({ ...formData, payment_received: parseFloat(e.target.value) || 0 })}
              className="w-full bg-surface-container py-3 px-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Payment Method</label>
            <select
              disabled={isCompleted}
              value={formData.payment_method}
              onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
              className="w-full bg-surface-container py-3 px-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none disabled:opacity-50"
            >
              {['Cash', 'Bank Transfer', 'JazzCash', 'EasyPaisa', 'Other'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-surface-variant flex justify-between items-center">
          <p className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">Remaining Balance</p>
          <p className={`font-headline text-2xl font-extrabold ${remainingBalance > 0 ? 'text-error' : 'text-secondary'}`}>
            {formatCurrency(remainingBalance)}
          </p>
        </div>
        {remainingBalance > 0 && formData.sale_completed && (
          <div className="p-3 bg-error-container/50 rounded-lg">
            <p className="text-xs font-bold text-on-error-container text-center">
              ⚠️ An Accounts Receivable record will be generated automatically.
            </p>
          </div>
        )}
      </div>

      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-card space-y-4">
        <h2 className="font-headline font-bold text-xl text-primary mb-4">Finalization</h2>
        
        <label className="flex items-center gap-3 p-4 bg-surface-container rounded-xl cursor-pointer hover:bg-surface-container-high transition-colors">
          <input
            type="checkbox"
            disabled={isCompleted}
            checked={formData.order_delivered}
            onChange={(e) => setFormData({ ...formData, order_delivered: e.target.checked })}
            className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
          />
          <span className="font-bold text-sm text-on-surface">Order Delivered</span>
        </label>

        <label className="flex items-center gap-3 p-4 bg-primary-container rounded-xl cursor-pointer hover:opacity-90 transition-opacity">
          <input
            type="checkbox"
            disabled={isCompleted}
            checked={formData.sale_completed}
            onChange={(e) => setFormData({ ...formData, sale_completed: e.target.checked })}
            className="w-5 h-5 rounded border-primary text-primary focus:ring-primary"
          />
          <div>
            <span className="font-bold text-sm text-primary block">Mark Sale as Completed</span>
            <span className="text-xs text-on-primary-container opacity-80">This will lock the sale and trigger accounting entries.</span>
          </div>
        </label>
      </div>

      {error && (
        <div className="p-4 bg-error-container text-on-error-container rounded-xl text-sm font-medium flex items-center gap-3">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      {!isCompleted && (
        <div className="fixed bottom-0 left-0 w-full lg:left-64 glass-panel z-50 px-6 py-4">
          <div className="max-w-screen-xl mx-auto flex gap-4">
            <button type="button" onClick={() => router.back()} className="flex-1 bg-surface-container-highest text-on-surface font-bold py-4 rounded-xl active:scale-95 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-[2] gradient-cta text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Confirm & Close'}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
