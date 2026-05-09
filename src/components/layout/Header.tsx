'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { markNotificationAsRead, markAllNotificationsAsRead } from '@/lib/actions/notifications';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import InstallAppButton from '@/components/pwa/InstallAppButton';
import type { Notification as LedgerNotification } from '@/lib/types';

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<LedgerNotification[]>([]);
  const unreadCount = notifications.filter(n => !n.is_read).length;
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const initAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    initAuth();

    const fetchInitialNotifications = async () => {
      const { data } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (data) setNotifications(data);
    };
    fetchInitialNotifications();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
      if (!session) setNotifications([]);
    });

    // Real-time notifications
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            setNotifications(prev => [payload.new as LedgerNotification, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as LedgerNotification;
            setNotifications(prev => prev.map(n => n.id === updated.id ? updated : n));
          } else if (payload.eventType === 'DELETE') {
            setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (pathname === '/login') return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const getPageTitle = () => {
    if (pathname === '/') return null;
    if (pathname.startsWith('/customers')) return 'Customers';
    if (pathname.startsWith('/orders/new')) return 'New Order';
    if (pathname.startsWith('/orders')) return 'Orders';
    if (pathname.startsWith('/inventory')) return 'Inventory';
    if (pathname.startsWith('/receivables')) return 'Receivables';
    if (pathname.startsWith('/payables')) return 'Payables';
    if (pathname.startsWith('/showrooms')) return 'Showrooms';
    if (pathname.startsWith('/ledger')) return 'Ledger';
    if (pathname.startsWith('/reports')) return 'Reports';
    if (pathname.startsWith('/suppliers')) return 'Suppliers';
    return null;
  };

  const pageTitle = getPageTitle();
  const showBack = pathname !== '/';

  const handleMarkAsRead = async (id: string) => {
    // Optimistic update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    await markNotificationAsRead(id);
  };

  const handleMarkAllRead = async () => {
    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    await markAllNotificationsAsRead();
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 glass-header">
        <div className="flex justify-between items-center px-4 sm:px-6 h-16 w-full max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('ledger-mobile-nav-open'))}
              className="lg:hidden p-2 rounded-full hover:bg-surface-container transition-colors text-primary"
              aria-label="Open navigation"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            {showBack && (
              <Link href="/" className="p-1 hover:bg-surface-container rounded-full transition-colors">
                <span className="material-symbols-outlined text-primary">arrow_back</span>
              </Link>
            )}
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center overflow-hidden shadow-card hover:scale-105 transition-transform"
              >
                {user ? (
                  <span className="text-on-primary font-bold text-sm">
                    {user.email?.[0].toUpperCase()}
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-on-primary">person</span>
                )}
              </button>
              
              {showProfileMenu && (
                <>
                  <div className="fixed inset-0 z-[60]" onClick={() => setShowProfileMenu(false)} />
                  <div className="absolute left-0 mt-2 w-56 z-[70] bg-surface-container-lowest rounded-2xl shadow-elevated overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 tonal-separator">
                      <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Signed in as</p>
                      <p className="text-sm font-bold text-primary truncate">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-error hover:bg-error-container/10 transition-colors text-sm font-bold"
                      >
                        <span className="material-symbols-outlined text-sm">logout</span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            <span className="text-xl font-extrabold text-primary tracking-tight font-headline hidden sm:block">
              The Ledger
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <InstallAppButton variant="compact" />
            <button className="p-2 rounded-full hover:bg-surface-container transition-colors text-primary hidden min-[430px]:inline-flex">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full hover:bg-surface-container transition-colors text-primary relative"
            >
              <span className="material-symbols-outlined">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-error text-white text-[9px] font-bold rounded-full flex items-center justify-center pulse-dot">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
        {pageTitle && (
          <div className="px-4 sm:px-6 pb-3 max-w-screen-xl mx-auto">
            <p className="font-label text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant mb-0.5">
              {pathname === '/customers' ? 'Portfolio Relations' : pathname === '/inventory' ? 'Stock Overview' : pathname === '/showrooms' ? 'Performance Analytics' : 'Management'}
            </p>
            <h1 className="font-headline text-2xl font-extrabold text-primary tracking-tight">{pageTitle}</h1>
          </div>
        )}
      </header>

      {/* Notification Panel */}
      {showNotifications && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setShowNotifications(false)} />
          <div className="fixed top-16 right-3 sm:right-4 w-[calc(100vw-1.5rem)] sm:w-80 max-h-96 z-[70] bg-surface-container-lowest rounded-xl shadow-elevated overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 tonal-separator">
              <h3 className="font-headline font-bold text-sm text-primary">Notifications</h3>
              <button onClick={handleMarkAllRead} className="text-secondary text-xs font-semibold">
                Mark all read
              </button>
            </div>
            <div className="overflow-y-auto max-h-80 custom-scrollbar">
              {notifications.length === 0 && (
                <p className="text-center py-8 text-xs text-on-surface-variant">No notifications</p>
              )}
              {notifications.map(n => (
                <button
                  key={n.id}
                  onClick={() => handleMarkAsRead(n.id)}
                  className={cn(
                    'w-full text-left p-4 transition-colors hover:bg-surface-container-low flex gap-3',
                    !n.is_read && 'bg-primary-fixed/20'
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                    n.type === 'receivable_pending' ? 'bg-error-container text-on-error-container' :
                    n.type === 'low_stock' ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' :
                    n.type === 'payable_pending' ? 'bg-secondary-container text-on-secondary-container' :
                    'bg-primary-fixed text-on-primary-fixed-variant'
                  )}>
                    <span className="material-symbols-outlined text-sm">
                      {n.type === 'receivable_pending' ? 'warning' :
                       n.type === 'low_stock' ? 'inventory' :
                       n.type === 'payable_pending' ? 'schedule' :
                       'check_circle'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-on-surface-variant line-clamp-2">{n.message}</p>
                    {!n.is_read && <span className="inline-block w-1.5 h-1.5 rounded-full bg-error mt-1" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
