import { ListPageSkeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return <ListPageSkeleton rows={4} showStats={true} />;
}
