'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createInventoryAddition } from '@/lib/actions/inventory';
import { formatCurrency } from '@/lib/utils';

const paymentMethods = ['Cash', 'Bank Transfer', 'JazzCash', 'EasyPaisa', 'Other'];

export default function InventoryPurchaseForm({ materials, suppliers }: { materials: any[]; suppliers: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    material_id: materials[0]?.id || '',
    quantity_added: 1,
    unit_cost: materials[0]?.unit_cost || 0,
    supplier_id: '',
    amount_paid: 0,
    payment_method: 'Cash',
    date: new Date().toISOString().split('T')[0],
  });

  const totalCost = formData.quantity_added * formData.unit_cost;
  const remainingPayable = totalCost - formData.amount_paid;

  const handleMaterialChange = (materialId: string) => {
    const mat = materials.find(m => m.id === materialId);
    setFormData(prev => ({
      ...prev,
      material_id: materialId,
      unit_cost: mat?.unit_cost || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createInventoryAddition({
        material_id: formData.material_id,
        quantity_added: formData.quantity_added,
        unit_cost: formData.unit_cost,
        supplier_id: formData.supplier_id || undefined,
        amount_paid: formData.amount_paid,
      });
      setSuccess(true);
      setTimeout(() => {
        router.push('/inventory');
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to record inventory purchase.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-16 bg-surface-container-lowest rounded-2xl shadow-card space-y-4">
        <span className="material-symbols-outlined text-6xl text-secondary block">check_circle</span>
        <p className="font-headline font-bold text-xl text-primary">Purchase Recorded!</p>
        <p className="text-sm text-on-surface-variant">Stock levels updated. Redirecting...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-card space-y-6">
        <h2 className="font-headline font-bold text-xl text-primary">Purchase Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Material / SKU</label>
            <select
              required
              value={formData.material_id}
              onChange={e => handleMaterialChange(e.target.value)}
              className="w-full bg-surface-container py-3 px-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
            >
              {materials.map(m => (
                <option key={m.id} value={m.id}>{m.name} (Current: {m.stock_quantity} {m.unit})</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Supplier (Optional)</label>
            <select
              value={formData.supplier_id}
              onChange={e => setFormData(prev => ({ ...prev, supplier_id: e.target.value }))}
              className="w-full bg-surface-container py-3 px-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
            >
              <option value="">— No Supplier / Direct Purchase —</option>
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Quantity Purchased</label>
            <input
              type="number"
              required
              min="0.1"
              step="0.1"
              value={formData.quantity_added}
              onChange={e => setFormData(prev => ({ ...prev, quantity_added: parseFloat(e.target.value) || 0 }))}
              className="w-full bg-surface-container py-3 px-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Unit Cost (PKR)</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.unit_cost}
              onChange={e => setFormData(prev => ({ ...prev, unit_cost: parseFloat(e.target.value) || 0 }))}
              className="w-full bg-surface-container py-3 px-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Purchase Date</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full bg-surface-container py-3 px-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        {/* Cost Summary */}
        <div className="pt-4 border-t border-surface-variant grid grid-cols-2 gap-3">
          <div className="bg-surface-container p-4 rounded-xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Total Cost</p>
            <p className="font-headline font-extrabold text-primary text-xl">{formatCurrency(totalCost)}</p>
          </div>
          <div className={`p-4 rounded-xl text-center ${remainingPayable > 0 ? 'bg-error-container' : 'bg-secondary-container'}`}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Payable Remaining</p>
            <p className={`font-headline font-extrabold text-xl ${remainingPayable > 0 ? 'text-error' : 'text-secondary'}`}>
              {formatCurrency(remainingPayable)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-card space-y-6">
        <h2 className="font-headline font-bold text-xl text-primary">Payment at Purchase</h2>
        <p className="text-xs text-on-surface-variant">If supplier is paid in full, balance will be PKR 0. Otherwise a payable record is created automatically.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Amount Paid Now (PKR)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              max={totalCost}
              value={formData.amount_paid}
              onChange={e => setFormData(prev => ({ ...prev, amount_paid: parseFloat(e.target.value) || 0 }))}
              className="w-full bg-surface-container py-3 px-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Payment Method</label>
            <select
              value={formData.payment_method}
              onChange={e => setFormData(prev => ({ ...prev, payment_method: e.target.value }))}
              className="w-full bg-surface-container py-3 px-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
            >
              {paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        {remainingPayable > 0 && formData.supplier_id && (
          <div className="p-3 bg-error-container/50 rounded-xl">
            <p className="text-xs font-bold text-on-error-container text-center">
              ⚠️ {formatCurrency(remainingPayable)} will be logged as a Payable to the selected supplier automatically.
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-error-container text-on-error-container rounded-xl text-sm font-medium flex items-center gap-3">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      <div className="fixed bottom-0 left-0 w-full lg:left-64 glass-panel z-50 px-6 py-4">
        <div className="max-w-screen-xl mx-auto flex gap-4">
          <button type="button" onClick={() => router.back()} className="flex-1 bg-surface-container-highest text-on-surface font-bold py-4 rounded-xl active:scale-95 transition-all">
            Cancel
          </button>
          <button type="submit" disabled={loading || totalCost <= 0} className="flex-[2] gradient-cta text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
              <>
                <span className="material-symbols-outlined text-sm">add_circle</span>
                Record Purchase
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
