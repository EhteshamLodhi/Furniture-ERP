import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton rounded-xl', className)} />;
}

/**
 * Placeholder shaped like the list screens, so the swap to real content does
 * not shift layout. Rendered from `loading.tsx`, which is what lets Next.js
 * paint a route the instant a link is clicked.
 */
export function ListPageSkeleton({
  rows = 5,
  showStats = false,
}: {
  rows?: number;
  showStats?: boolean;
}) {
  return (
    <div className="space-y-6 px-4 py-6 sm:px-6" role="status" aria-label="Loading">
      <span className="sr-only">Loading…</span>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-9 w-56" />
        </div>
        <Skeleton className="h-12 w-full sm:w-44" />
      </div>

      {showStats && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24" />
          ))}
        </div>
      )}

      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className="h-28" />
        ))}
      </div>
    </div>
  );
}
