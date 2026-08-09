'use client';

import { useState } from 'react';
import Modal from '@/components/Modal';
import PaymentForm from '@/components/forms/PaymentForm';
import Icon from '@/components/ui/Icon';

interface PaymentActionProps {
  invoiceId: string;
  invoiceNumber: string;
  remainingAmount: number;
  type: 'receivable' | 'payable';
  entityId: string;
}

export default function PaymentAction({ invoiceId, invoiceNumber, remainingAmount, type, entityId }: PaymentActionProps) {
  const [isOpen, setIsOpen] = useState(false);

  // If there's no balance left, don't show the pay button
  if (remainingAmount <= 0) return null;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 bg-secondary-container text-on-secondary-container rounded-lg hover:scale-105 active:scale-95 transition-all shadow-sm flex items-center justify-center group"
        title="Make Payment"
      >
        <Icon name="payments" className="text-sm group-hover:text-primary transition-colors" />
      </button>

      {isOpen && (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={type === 'receivable' ? 'Receive Payment' : 'Make Payment'}>
          <PaymentForm 
            invoiceId={invoiceId}
            invoiceNumber={invoiceNumber}
            remainingAmount={remainingAmount}
            type={type}
            entityId={entityId}
            onSuccess={() => setIsOpen(false)}
            onCancel={() => setIsOpen(false)}
          />
        </Modal>
      )}
    </>
  );
}
