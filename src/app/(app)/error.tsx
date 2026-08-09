'use client';

import { useEffect } from 'react';
import Icon from '@/components/ui/Icon';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Route error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-error-container">
        <Icon name="error" className="text-4xl text-on-error-container" />
      </div>
      <h1 className="mb-2 font-headline text-2xl font-extrabold text-primary">
        Something went wrong
      </h1>
      <p className="mb-8 max-w-sm text-sm text-on-surface-variant">
        This screen failed to load. Retrying usually clears it; if it keeps happening, the record
        may be unavailable.
      </p>
      {error.digest && (
        <p className="mb-6 font-mono text-[11px] text-outline">Reference: {error.digest}</p>
      )}
      <button
        type="button"
        onClick={reset}
        className="rounded-xl gradient-cta px-8 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all active:scale-95"
      >
        Try Again
      </button>
    </div>
  );
}
