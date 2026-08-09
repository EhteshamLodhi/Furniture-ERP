'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { markAllNotificationsAsRead, markNotificationAsRead } from '@/lib/actions/notifications';
import type { Notification as LedgerNotification } from '@/lib/types';

type NotificationsContextValue = {
  user: User | null;
  notifications: LedgerNotification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

/**
 * Header and the alert bar both need the notification feed. Fetching it here
 * once means a single query and a single realtime channel per session instead
 * of one of each per component, per navigation.
 */
export default function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<LedgerNotification[]>([]);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const [{ data: auth }, { data: rows }] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(50),
      ]);

      if (!active) return;
      setUser(auth.user ?? null);
      if (rows) setNotifications(rows);
    };

    load();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) setNotifications([]);
    });

    const channel = supabase
      .channel('ledger:notifications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotifications((prev) => [payload.new as LedgerNotification, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as LedgerNotification;
            setNotifications((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
          } else if (payload.eventType === 'DELETE') {
            const removed = payload.old as Partial<LedgerNotification>;
            setNotifications((prev) => prev.filter((n) => n.id !== removed.id));
          }
        }
      )
      .subscribe();

    return () => {
      active = false;
      subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const markAsRead = useCallback(async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    await markNotificationAsRead(id);
  }, []);

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    await markAllNotificationsAsRead();
  }, []);

  const value = useMemo<NotificationsContextValue>(
    () => ({
      user,
      notifications,
      unreadCount: notifications.filter((n) => !n.is_read).length,
      markAsRead,
      markAllRead,
    }),
    [user, notifications, markAsRead, markAllRead]
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used inside NotificationsProvider');
  }
  return context;
}
