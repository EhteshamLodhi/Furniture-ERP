import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="space-y-6 px-4 py-6 sm:px-6" role="status" aria-label="Loading">
      <span className="sr-only">Loading…</span>

      <div className="space-y-2 py-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-44" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24" />
        ))}
      </div>

      <Skeleton className="h-28" />

      <div className="space-y-3">
        <Skeleton className="h-6 w-48" />
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-[68px]" />
        ))}
      </div>
    </div>
  );
}
