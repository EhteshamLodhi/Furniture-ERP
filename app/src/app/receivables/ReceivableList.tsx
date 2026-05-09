'use client';

import { useState } from 'react';
import { formatCurrency, getInitials } from '@/lib/utils';
import Modal from '@/components/Modal';
import PaymentForm from '@/components/forms/PaymentForm';

interface Receivable {
  id: string;
  invoice_number: string;
  customer_id: string;
  customers: { name: string };
  amount: number;
  balance: number;
  due_date: string;
  status: string;
}

export default function ReceivableList({ initialReceivables }: { initialReceivables: any[] }) {
  const [selectedInv, setSelectedInv] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openPaymentModal = (inv: any) => {
    setSelectedInv(inv);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <h4 className="font-headline font-bold text-primary">Critical Overdue</h4>
        <button className="text-secondary text-xs font-semibold">View All</button>
      </div>
      <div className="space-y-3">
        {initialReceivables.length > 0 ? (
          initialReceivables.map(inv => (
            <div key={inv.id} className="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between hover:bg-surface-container transition-colors shadow-card group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center font-headline font-bold text-primary shadow-sm group-hover:bg-primary-fixed group-hover:text-on-primary-fixed transition-colors">
                  {getInitials(inv.customers?.name || '??')}
                </div>
                <div>
                  <p className="font-semibold text-sm text-on-surface">{inv.customers?.name}</p>
                  <p className={`font-label text-[10px] font-medium uppercase tracking-widest ${inv.status === 'overdue' ? 'text-error' : 'text-on-surface-variant'}`}>
                    Due {new Date(inv.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-headline font-bold text-primary">{formatCurrency(inv.balance)}</p>
                  <p className="text-[10px] text-on-surface-variant font-mono">{inv.invoice_number}</p>
                </div>
                <button 
                  onClick={() => openPaymentModal(inv)}
                  className="p-2 bg-secondary-container text-on-secondary-container rounded-lg hover:scale-105 active:scale-95 transition-all md:opacity-0 md:group-hover:opacity-100"
                >
                  <span className="material-symbols-outlined text-sm">payments</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-surface-container-lowest rounded-xl border-2 border-dashed border-surface-variant">
            <span className="material-symbols-outlined text-4xl text-secondary-fixed/50 mb-2">check_circle</span>
            <p className="text-on-surface-variant font-semibold">No overdue invoices</p>
          </div>
        )}
      </div>

      {selectedInv && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          title="Receive Payment"
        >
          <PaymentForm 
            invoiceId={selectedInv.id}
            invoiceNumber={selectedInv.invoice_number || selectedInv.id?.split('-')[0]}
            remainingAmount={selectedInv.balance}
            type="receivable"
            entityId={selectedInv.customer_id}
            onSuccess={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
