'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSaleEntry } from '@/lib/actions/sales';
import { formatCurrency } from '@/lib/utils';

export default function SaleEntryForm({ customers }: { customers: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [saleData, setSaleData] = useState({
    customer_id: customers[0]?.id || '',
    source: 'Showroom',
  });

  const [items, setItems] = useState([
    { item_name: '', quantity: 1, sale_amount: 0 }
  ]);

  const totalAmount = items.reduce((sum, item) => sum + (item.sale_amount || 0), 0);

  const addItem = () => setItems([...items, { item_name: '', quantity: 1, sale_amount: 0 }]);
  const removeItem = (index: number) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createSaleEntry({ ...saleData, total_amount: totalAmount }, items);
      router.push('/sales');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to create sale.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-card space-y-6">
        <h2 className="font-headline font-bold text-xl text-primary">Stage 1: Sale Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Customer</label>
            <select
              value={saleData.customer_id}
              onChange={(e) => setSaleData({ ...saleData, customer_id: e.target.value })}
              className="w-full bg-surface-container py-3 px-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none font-medium"
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Sale Source</label>
            <select
              value={saleData.source}
              onChange={(e) => setSaleData({ ...saleData, source: e.target.value })}
              className="w-full bg-surface-container py-3 px-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none font-medium"
            >
              {['Showroom', 'Instagram', 'WhatsApp', 'Reference', 'Walk-in', 'Online', 'Other'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-card space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="font-headline font-bold text-xl text-primary">Sold Items</h2>
          <button type="button" onClick={addItem} className="text-xs font-bold text-secondary uppercase tracking-widest px-3 py-1.5 bg-secondary-container rounded-lg hover:opacity-80 transition-opacity">
            + Add Item
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-4 p-4 bg-surface-container rounded-xl relative group">
              <div className="flex-1 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Item Description</label>
                <input
                  type="text"
                  required
                  value={item.item_name}
                  onChange={(e) => handleItemChange(index, 'item_name', e.target.value)}
                  placeholder="e.g. Velvet Sofa 3-Seater"
                  className="w-full bg-white/50 py-2 px-3 rounded-lg border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                />
              </div>
              <div className="w-full md:w-24 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Qty</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                  className="w-full bg-white/50 py-2 px-3 rounded-lg border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm text-center"
                />
              </div>
              <div className="w-full md:w-32 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Amount (PKR)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={item.sale_amount}
                  onChange={(e) => handleItemChange(index, 'sale_amount', parseFloat(e.target.value) || 0)}
                  className="w-full bg-white/50 py-2 px-3 rounded-lg border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm text-right font-mono"
                />
              </div>
              {items.length > 1 && (
                <button type="button" onClick={() => removeItem(index)} className="md:absolute -right-2 -top-2 w-6 h-6 rounded-full bg-error text-white flex items-center justify-center shadow-lg opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4 border-t border-surface-variant">
          <div className="text-right">
            <p className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Total Sale Value</p>
            <p className="font-headline text-3xl font-extrabold text-primary">{formatCurrency(totalAmount)}</p>
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
          <button type="button" onClick={() => router.back()} className="flex-1 bg-surface-container-highest text-on-surface font-bold py-4 rounded-xl active:scale-95 transition-all">
            Cancel
          </button>
          <button type="submit" disabled={loading || totalAmount <= 0} className="flex-[2] gradient-cta text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Sale Entry'}
          </button>
        </div>
      </div>
    </form>
  );
}
