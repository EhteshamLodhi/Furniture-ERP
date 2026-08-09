import Link from 'next/link';
import Icon, { type IconName } from '@/components/ui/Icon';

type MobileAction = {
  href: string;
  icon: IconName;
  label: string;
  primary?: boolean;
};

export default function MobileActionBar({ actions }: { actions: MobileAction[] }) {
  return (
    <div className="fixed inset-x-0 bottom-20 z-[45] px-3 lg:hidden pointer-events-none">
      <div className="pointer-events-auto mx-auto flex max-w-lg gap-2 rounded-2xl glass-panel p-2 shadow-elevated">
        {actions.map((action) => (
          <Link
            key={`${action.href}-${action.label}`}
            href={action.href}
            className={`flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl px-3 text-xs font-extrabold active:scale-95 transition-all ${
              action.primary ? 'gradient-cta text-white shadow-lg shadow-primary/20' : 'bg-surface-container-high text-primary'
            }`}
          >
            <Icon name={action.icon} className="text-[18px]" />
            <span className="truncate">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
