'use client';

import { useState } from 'react';
import Link from 'next/link';
import Modal from '@/components/Modal';
import PaymentForm from '@/components/forms/PaymentForm';
import { formatCurrency } from '@/lib/utils';
import Icon from '@/components/ui/Icon';

interface Props {
  customerId: string;
  unpaidInvoices: any[];
}

export default function CustomerActions({ customerId, unpaidInvoices }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  const totalUnpaid = unpaidInvoices.reduce((sum, inv) => sum + (inv.balance || 0), 0);

  return (
    <div className="flex gap-3 mb-8">
      <button 
        onClick={() => setIsModalOpen(true)}
        disabled={unpaidInvoices.length === 0}
        className="flex-1 gradient-cta text-white py-4 rounded-xl font-headline font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
      >
        <Icon name="payments" className="text-sm" />
        Receive Payment
      </button>
      <Link href="/orders/new" className="flex-1 bg-surface-container-high text-on-primary-fixed-variant py-4 rounded-xl font-headline font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-surface-container-highest">
        <Icon name="add_shopping_cart" className="text-sm" />
        Create Order
      </Link>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedInvoice(null); }}
        title="Receive Payment"
      >
        {!selectedInvoice ? (
          <div className="space-y-4">
            <p className="text-xs text-on-surface-variant font-medium uppercase tracking-widest px-1">Select an Invoice</p>
            <div className="space-y-2">
              {unpaidInvoices.map(inv => (
                <button
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className="w-full bg-surface-container p-4 rounded-xl flex justify-between items-center hover:bg-surface-container-high transition-colors"
                >
                  <div className="text-left">
                    <p className="font-bold text-primary text-sm">{inv.invoice_number}</p>
                    <p className="text-[10px] text-on-surface-variant font-medium">Due {new Date(inv.due_date).toLocaleDateString()}</p>
                  </div>
                  <p className="font-headline font-bold text-primary">{formatCurrency(inv.balance)}</p>
                </button>
              ))}
            </div>
            <div className="pt-4 border-t border-surface-variant/30 flex justify-between items-center">
              <span className="text-xs font-bold text-on-surface-variant uppercase">Total Due</span>
              <span className="text-xl font-extrabold text-primary font-headline">{formatCurrency(totalUnpaid)}</span>
            </div>
          </div>
        ) : (
          <PaymentForm
            invoiceId={selectedInvoice.id}
            invoiceNumber={selectedInvoice.invoice_number || selectedInvoice.id?.split('-')[0]}
            remainingAmount={selectedInvoice.balance}
            type="receivable"
            entityId={customerId}
            onSuccess={() => { setIsModalOpen(false); setSelectedInvoice(null); }}
            onCancel={() => setSelectedInvoice(null)}
          />
        )}
      </Modal>
    </div>
  );
}
