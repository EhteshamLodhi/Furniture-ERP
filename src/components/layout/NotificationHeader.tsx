'use client';

import { useNotifications } from '@/components/providers/NotificationsProvider';
import Icon from '@/components/ui/Icon';

export default function NotificationHeader() {
  const { notifications, markAsRead, markAllRead } = useNotifications();
  const unread = notifications.filter((n) => !n.is_read);

  if (unread.length === 0) return null;

  return (
    <div className="w-full bg-error-container text-on-error-container shadow-sm">
      <div className="mx-auto flex w-full max-w-[80rem] flex-col gap-2 px-3 py-2 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <Icon name="notifications_active" className="text-base" />
          <span className="shrink-0 text-[11px] font-bold uppercase tracking-widest">
            Alerts ({unread.length})
          </span>
          <span className="mx-1 hidden h-4 w-px shrink-0 bg-on-error-container/20 sm:block" />
          <div className="no-scrollbar flex min-w-0 items-center gap-4 overflow-x-auto">
            {unread.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => markAsRead(n.id)}
                className="group/item flex shrink-0 items-center gap-2"
              >
                <span className="whitespace-nowrap text-xs font-medium opacity-90 group-hover/item:opacity-100">
                  {n.message}
                </span>
                <Icon
                  name="close"
                  label="Mark as read"
                  className="text-[14px] opacity-50 transition-opacity group-hover/item:opacity-100"
                />
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={markAllRead}
          className="shrink-0 self-start rounded bg-on-error-container/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-colors hover:bg-on-error-container/20 md:self-auto"
        >
          Dismiss All
        </button>
      </div>
    </div>
  );
}
