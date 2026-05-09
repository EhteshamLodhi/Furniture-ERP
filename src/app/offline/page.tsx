'use client';

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant">cloud_off</span>
      </div>
      <h1 className="font-headline text-2xl font-extrabold text-primary mb-2">You&apos;re Offline</h1>
      <p className="text-on-surface-variant text-sm max-w-xs mb-8">
        You are offline. Changes will sync automatically when connection returns.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="gradient-cta text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all"
      >
        Retry Connection
      </button>
    </div>
  );
}
