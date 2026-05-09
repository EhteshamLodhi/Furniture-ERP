'use client';

import { useState } from 'react';
import { formatCurrency, getInitials } from '@/lib/utils';
import Modal from '@/components/Modal';
import PaymentForm from '@/components/forms/PaymentForm';

export default function PayableList({ initialPayables }: { initialPayables: any[] }) {
  const [selectedInv, setSelectedInv] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openPaymentModal = (inv: any) => {
    setSelectedInv(inv);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <h3 className="font-headline font-bold text-primary">Priority Suppliers</h3>
        <div className="flex items-center gap-1 text-on-surface-variant text-[11px] font-bold uppercase tracking-widest">
          <span>Sort</span>
          <span className="material-symbols-outlined text-[16px]">expand_more</span>
        </div>
      </div>
      <div className="space-y-3">
        {initialPayables.length > 0 ? (
          initialPayables.map(payable => {
            const isOverdue = payable.status === 'overdue';
            const daysLeft = Math.max(0, Math.round((new Date(payable.due_date).getTime() - Date.now()) / 86400000));
            
            return (
              <div key={payable.id} className="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between shadow-card hover:bg-surface-container transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center text-primary-container font-bold shadow-sm group-hover:bg-primary-fixed group-hover:text-on-primary-fixed transition-colors">
                    {getInitials(payable.suppliers?.name || '??')}
                  </div>
                  <div>
                    <p className="font-headline text-sm font-bold text-primary">{payable.suppliers?.name}</p>
                    <p className="text-[10px] text-on-surface-variant font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                      {isOverdue ? 'OVERDUE' : `DUE IN ${daysLeft} DAYS`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`font-headline text-sm font-extrabold ${isOverdue ? 'text-error' : 'text-primary'}`}>{formatCurrency(payable.balance)}</p>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${
                      isOverdue ? 'bg-error text-white' : 'bg-secondary-fixed text-on-secondary-fixed-variant'
                    }`}>
                      {isOverdue ? 'Critical' : 'Planned'}
                    </span>
                  </div>
                  <button 
                    onClick={() => openPaymentModal(payable)}
                    className="p-2 bg-error-container text-on-error-container rounded-lg hover:scale-105 active:scale-95 transition-all md:opacity-0 md:group-hover:opacity-100"
                  >
                    <span className="material-symbols-outlined text-sm">payments</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 bg-surface-container-lowest rounded-xl border-2 border-dashed border-surface-variant">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-2">payments</span>
            <p className="text-on-surface-variant font-semibold">No pending payables</p>
          </div>
        )}
      </div>

      {selectedInv && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          title="Make Payment"
        >
          <PaymentForm 
            invoiceId={selectedInv.id}
            invoiceNumber={selectedInv.invoice_number || selectedInv.id?.split('-')[0]}
            remainingAmount={selectedInv.balance}
            type="payable"
            entityId={selectedInv.supplier_id}
            onSuccess={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
