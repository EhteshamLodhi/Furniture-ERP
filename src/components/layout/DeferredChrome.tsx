'use client';

import dynamic from 'next/dynamic';

/**
 * Chrome that only ever matters after hydration. Splitting it out of the
 * layout keeps the install prompt, connectivity watcher and FAB out of the
 * critical bundle for the first paint.
 */
const PwaManager = dynamic(() => import('@/components/pwa/PwaManager'), { ssr: false });
const QuickActionsFab = dynamic(() => import('@/components/layout/QuickActionsFab'), { ssr: false });

export default function DeferredChrome() {
  return (
    <>
      <PwaManager />
      <QuickActionsFab />
    </>
  );
}
