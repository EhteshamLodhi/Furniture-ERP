'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useNotifications } from '@/components/providers/NotificationsProvider';
import InstallAppButton from '@/components/pwa/InstallAppButton';
import Icon, { type IconName } from '@/components/ui/Icon';

const notificationIcon: Record<string, IconName> = {
  receivable_pending: 'warning',
  low_stock: 'inventory',
  payable_pending: 'schedule',
};

type OpenPanel = { panel: 'notifications' | 'profile'; at: string };

export default function Header() {
  // Storing the route a panel was opened on means a navigation closes it
  // without an effect — the derived value simply stops matching.
  const [openPanel, setOpenPanel] = useState<OpenPanel | null>(null);
  const { user, notifications, unreadCount, markAsRead, markAllRead } = useNotifications();
  const pathname = usePathname();
  const router = useRouter();

  const showNotifications = openPanel?.panel === 'notifications' && openPanel.at === pathname;
  const showProfileMenu = openPanel?.panel === 'profile' && openPanel.at === pathname;

  const togglePanel = (panel: OpenPanel['panel']) =>
    setOpenPanel((current) =>
      current?.panel === panel && current.at === pathname ? null : { panel, at: pathname }
    );

  const closePanels = () => setOpenPanel(null);

  const handleLogout = async () => {
    await createClient().auth.signOut();

    // The service worker caches rendered pages; without this the next person
    // on this device can still see the previous session's screens.
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k.startsWith('ledger-')).map((k) => caches.delete(k)));
    }

    router.replace('/login');
    router.refresh();
  };

  const showBack = pathname !== '/';

  return (
    <header
      className="sticky top-0 z-50 glass-header"
      style={{ viewTransitionName: 'site-header' }}
    >
      <div className="mx-auto flex h-16 w-full max-w-[80rem] items-center justify-between gap-2 px-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-1 sm:gap-3">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('ledger-mobile-nav-open'))}
            className="lg:hidden flex h-11 w-11 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-container active:scale-95"
            aria-label="Open navigation"
          >
            <Icon name="menu" className="text-xl" />
          </button>

          {showBack && (
            <Link
              href="/"
              transitionTypes={['nav-back']}
              aria-label="Back to dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-container"
            >
              <Icon name="arrow_back" className="text-xl" />
            </Link>
          )}

          <div className="relative">
            <button
              type="button"
              onClick={() => togglePanel('profile')}
              aria-label="Account menu"
              aria-expanded={showProfileMenu}
              className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary shadow-card transition-transform hover:scale-105 active:scale-95"
            >
              {user ? (
                <span className="text-sm font-bold text-on-primary">
                  {user.email?.[0]?.toUpperCase()}
                </span>
              ) : (
                <Icon name="person" className="text-xl text-on-primary" />
              )}
            </button>

            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-[60]" onClick={closePanels} />
                <div className="absolute left-0 z-[70] mt-2 w-56 overflow-hidden rounded-2xl bg-surface-container-lowest shadow-elevated animate-rise-in">
                  <div className="p-4 tonal-separator">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      Signed in as
                    </p>
                    <p className="truncate text-sm font-bold text-primary">{user?.email ?? '—'}</p>
                  </div>
                  <div className="p-2">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-error transition-colors hover:bg-error-container/10"
                    >
                      <Icon name="logout" className="text-base" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <span className="hidden truncate font-headline text-xl font-extrabold tracking-tight text-primary sm:block">
            The Ledger
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <InstallAppButton variant="compact" />
          <button
            type="button"
            onClick={() => togglePanel('notifications')}
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
            aria-expanded={showNotifications}
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-container active:scale-95"
          >
            <Icon name="notifications" className="text-xl" />
            {unreadCount > 0 && (
              <span className="pulse-dot absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[9px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {showNotifications && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={closePanels} />
          <div className="fixed right-3 top-16 z-[70] max-h-96 w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl bg-surface-container-lowest shadow-elevated animate-rise-in sm:right-4 sm:w-80">
            <div className="flex items-center justify-between px-4 py-3 tonal-separator">
              <h2 className="font-headline text-sm font-bold text-primary">Notifications</h2>
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs font-semibold text-secondary hover:underline"
              >
                Mark all read
              </button>
            </div>
            <div className="custom-scrollbar max-h-80 overflow-y-auto">
              {notifications.length === 0 && (
                <p className="py-8 text-center text-xs text-on-surface-variant">No notifications</p>
              )}
              {notifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => markAsRead(n.id)}
                  className={cn(
                    'flex w-full gap-3 p-4 text-left transition-colors hover:bg-surface-container-low',
                    !n.is_read && 'bg-primary-fixed/20'
                  )}
                >
                  <span
                    className={cn(
                      'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
                      n.type === 'receivable_pending'
                        ? 'bg-error-container text-on-error-container'
                        : n.type === 'low_stock'
                          ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                          : n.type === 'payable_pending'
                            ? 'bg-secondary-container text-on-secondary-container'
                            : 'bg-primary-fixed text-on-primary-fixed-variant'
                    )}
                  >
                    <Icon name={notificationIcon[n.type] ?? 'check_circle'} className="text-base" />
                  </span>
                  <span className="min-w-0">
                    <span className="line-clamp-2 block text-[11px] text-on-surface-variant">
                      {n.message}
                    </span>
                    {!n.is_read && (
                      <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-error" />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
