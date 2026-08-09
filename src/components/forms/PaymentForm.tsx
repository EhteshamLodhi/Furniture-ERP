'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { recordPaymentReceived, recordPaymentMade } from '@/lib/actions/accounting';
import { formatCurrency } from '@/lib/utils';
import Icon from '@/components/ui/Icon';

interface PaymentFormProps {
  invoiceId: string;
  invoiceNumber: string;
  remainingAmount: number;
  type: 'receivable' | 'payable';
  entityId: string; // customer_id or supplier_id
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PaymentForm({ 
  invoiceId, 
  invoiceNumber, 
  remainingAmount, 
  type,
  entityId,
  onSuccess,
  onCancel
}: PaymentFormProps) {
  const router = useRouter();
  const [amount, setAmount] = useState(remainingAmount);
  const [method, setMethod] = useState('Cash');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || amount > remainingAmount) {
      setError(`Amount must be between 0.01 and ${formatCurrency(remainingAmount)}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (type === 'receivable') {
        await recordPaymentReceived({ customer_id: entityId, sale_id: invoiceId, amount, method });
      } else {
        await recordPaymentMade({ supplier_id: entityId, purchase_id: invoiceId, amount, method });
      }
      if (onSuccess) onSuccess();
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to record payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="p-4 bg-primary-fixed/10 rounded-xl">
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Outstanding on {invoiceNumber}</p>
          <p className="text-2xl font-extrabold text-primary font-headline">{formatCurrency(remainingAmount)}</p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Payment Amount (PKR)</label>
          <input
            type="number"
            step="0.01"
            max={remainingAmount}
            required
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            className="w-full bg-surface-container py-3 px-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Payment Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full bg-surface-container py-3 px-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
          >
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="JazzCash">JazzCash</option>
            <option value="EasyPaisa">EasyPaisa</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-error-container text-on-error-container rounded-xl text-sm font-medium flex items-center gap-3">
          <Icon name="error" />
          {error}
        </div>
      )}

      <div className="flex gap-3 sm:gap-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-surface-container-highest text-on-surface font-bold py-3 rounded-xl active:scale-95 transition-all min-h-12"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading || amount <= 0}
          className="flex-[2] gradient-cta text-white font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 min-h-12"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Icon name="payments" />
              Confirm Payment
            </>
          )}
        </button>
      </div>
    </form>
  );
}
