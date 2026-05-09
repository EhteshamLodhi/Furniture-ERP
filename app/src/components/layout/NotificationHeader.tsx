'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Notification } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function NotificationHeader() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const supabase = createClient();

  useEffect(() => {
    // Initial fetch
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('is_read', false)
        .order('created_at', { ascending: false });
      
      if (data) setNotifications(data);
    };

    fetchNotifications();

    // Subscribe to new notifications
    const channel = supabase
      .channel('public:notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, payload => {
        setNotifications(prev => [payload.new as Notification, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="w-full bg-error-container text-on-error-container py-2 px-4 shadow-sm z-50 relative border-b border-error/20 flex flex-col md:flex-row items-center justify-between gap-2 overflow-hidden group transition-all">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar whitespace-nowrap md:max-w-[80%]">
        <span className="material-symbols-outlined text-sm shrink-0">notifications_active</span>
        <span className="font-bold text-[11px] uppercase tracking-widest shrink-0">Alerts ({notifications.length})</span>
        <div className="h-4 w-px bg-on-error-container/20 mx-1 shrink-0" />
        <div className="flex gap-4 items-center">
          {notifications.map(n => (
            <div key={n.id} className="flex items-center gap-2 group/item cursor-pointer" onClick={() => markAsRead(n.id)}>
              <span className="text-xs font-medium opacity-90 group-hover/item:opacity-100 transition-opacity">
                {n.message}
              </span>
              <span className="material-symbols-outlined text-[14px] opacity-50 group-hover/item:opacity-100 hover:text-error transition-all" title="Mark as read">
                close
              </span>
            </div>
          ))}
        </div>
      </div>
      <button 
        onClick={() => {
          notifications.forEach(n => markAsRead(n.id));
        }}
        className="text-[10px] font-bold uppercase tracking-widest bg-on-error-container/10 px-3 py-1 rounded hover:bg-on-error-container/20 transition-colors whitespace-nowrap"
      >
        Dismiss All
      </button>
    </div>
  );
}
