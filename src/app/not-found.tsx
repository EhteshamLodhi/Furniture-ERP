import Link from 'next/link';
import Icon from '@/components/ui/Icon';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface-container">
        <Icon name="search" className="text-4xl text-on-surface-variant" />
      </div>
      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
        Error 404
      </p>
      <h1 className="mb-2 font-headline text-2xl font-extrabold text-primary">Page not found</h1>
      <p className="mb-8 max-w-xs text-sm text-on-surface-variant">
        That record or screen does not exist. It may have been removed, or the link may be out of
        date.
      </p>
      <Link
        href="/"
        className="rounded-xl gradient-cta px-8 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all active:scale-95"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
