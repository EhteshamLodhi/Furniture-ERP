'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import Icon from '@/components/ui/Icon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/** Portals need a DOM; this is the documented way to render client-only. */
const subscribeToNothing = () => () => {};
const isClient = () => true;
const isServer = () => false;

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const mounted = useSyncExternalStore(subscribeToNothing, isClient, isServer);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[100] flex items-end justify-center p-4 animate-fade-in sm:items-center"
    >
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-t-[2.5rem] bg-surface-container-lowest shadow-elevated animate-slide-up sm:rounded-[2rem]">
        <div className="flex items-center justify-between p-6 tonal-separator">
          <h2 className="font-headline text-xl font-bold text-primary">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-container"
          >
            <Icon name="close" className="text-xl text-on-surface-variant" />
          </button>
        </div>
        <div className="max-h-[70dvh] overflow-y-auto p-6 custom-scrollbar">{children}</div>
      </div>
    </div>,
    document.body
  );
}
