'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';
import { deleteCustomer } from '@/lib/actions/customers';
import { deleteSupplier } from '@/lib/actions/suppliers';
import { deleteMaterial } from '@/lib/actions/inventory';
import { deleteSale } from '@/lib/actions/sales';
import Icon from '@/components/ui/Icon';

type DeleteKind = 'customer' | 'supplier' | 'material' | 'sale';

const deleteActions: Record<DeleteKind, (id: string) => Promise<void>> = {
  customer: deleteCustomer,
  supplier: deleteSupplier,
  material: deleteMaterial,
  sale: deleteSale,
};

type Props = {
  entryId: string;
  kind: DeleteKind;
  label: string;
  redirectTo?: string;
  variant?: 'icon' | 'button';
  className?: string;
};

export default function DeleteEntryButton({
  entryId,
  kind,
  label,
  redirectTo,
  variant = 'icon',
  className = '',
}: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      try {
        await deleteActions[kind](entryId);
        setIsOpen(false);
        if (redirectTo) {
          router.push(redirectTo);
        } else {
          router.refresh();
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to delete this record right now.';
        setError(message);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setIsOpen(true);
        }}
        className={
          variant === 'button'
            ? `min-h-11 rounded-xl bg-error-container px-4 py-2.5 text-sm font-bold text-on-error-container transition-all active:scale-95 ${className}`
            : `flex h-10 w-10 items-center justify-center rounded-full bg-error-container text-on-error-container transition-all active:scale-95 ${className}`
        }
        aria-label={`Delete ${label}`}
        title={`Delete ${label}`}
      >
        <Icon name="delete" className="text-[18px]" />
        {variant === 'button' && <span className="ml-2">Delete</span>}
      </button>

      <Modal isOpen={isOpen} onClose={() => !isPending && setIsOpen(false)} title={`Delete ${label}?`}>
        <div className="space-y-4">
          <p className="text-sm leading-6 text-on-surface-variant">
            This will permanently remove this {kind} entry. Linked records may block deletion until related history is cleared.
          </p>
          {error && (
            <div className="rounded-xl bg-error-container px-4 py-3 text-sm font-medium text-on-error-container">
              {error}
            </div>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
              className="flex-1 min-h-12 rounded-xl bg-surface-container-highest font-bold text-on-surface transition-all active:scale-95 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="flex-1 min-h-12 rounded-xl bg-error text-white font-bold transition-all active:scale-95 disabled:opacity-60"
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
