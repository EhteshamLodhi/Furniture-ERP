'use client';

import Icon from '@/components/ui/Icon';

export default function OfflinePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface-container">
        <Icon name="cloud_off" className="text-4xl text-on-surface-variant" />
      </div>
      <h1 className="mb-2 font-headline text-2xl font-extrabold text-primary">You&apos;re Offline</h1>
      <p className="mb-8 max-w-xs text-sm text-on-surface-variant">
        This page isn&apos;t available without a connection. Anything you already opened stays
        readable, and changes sync once you&apos;re back.
      </p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="rounded-xl gradient-cta px-8 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all active:scale-95"
      >
        Retry Connection
      </button>
    </div>
  );
}
