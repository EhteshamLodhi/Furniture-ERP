'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Icon from '@/components/ui/Icon';

type InstallAppButtonProps = {
  variant?: 'header' | 'sidebar' | 'compact';
  className?: string;
};

export default function InstallAppButton({ variant = 'header', className }: InstallAppButtonProps) {
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const update = (event: Event) => {
      const detail = (event as CustomEvent).detail || {};
      setCanInstall(Boolean(detail.canInstall) && !detail.installed);
    };

    window.addEventListener('ledger-pwa-state', update);
    window.dispatchEvent(new CustomEvent('ledger-pwa-query'));

    return () => window.removeEventListener('ledger-pwa-state', update);
  }, []);

  if (!canInstall) return null;

  const label = variant === 'compact' ? 'Install' : 'Install App';

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent('ledger-install-request'))}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all active:scale-95',
        variant === 'sidebar'
          ? 'w-full min-h-11 bg-primary text-white px-4 py-3 text-sm shadow-lg shadow-primary/20'
          : 'min-h-10 bg-primary text-white px-3 py-2 text-xs shadow-card',
        className
      )}
    >
      <Icon name="install_mobile" className="text-[18px]" />
      <span className={variant === 'compact' ? 'hidden min-[420px]:inline' : ''}>{label}</span>
    </button>
  );
}
