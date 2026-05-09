/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

type LedgerNotification = {
  title?: string;
  body?: string;
  url?: string;
  tag?: string;
  icon?: string;
};

self.addEventListener('push', (event: PushEvent) => {
  const fallback: Required<LedgerNotification> = {
    title: 'Furniture Accounts Manager',
    body: 'A business update is ready to review.',
    url: '/',
    tag: 'ledger-update',
    icon: '/icons/icon-192.png',
  };

  let payload: LedgerNotification = fallback;
  try {
    payload = event.data ? { ...fallback, ...event.data.json() as LedgerNotification } : fallback;
  } catch {
    payload = {
      ...fallback,
      body: event.data?.text() || fallback.body,
    };
  }

  event.waitUntil(
    self.registration.showNotification(payload.title || fallback.title, {
      body: payload.body,
      icon: payload.icon || fallback.icon,
      badge: '/icons/icon-192.png',
      tag: payload.tag,
      data: {
        url: payload.url || '/',
      },
    })
  );
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || '/', self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url === targetUrl) {
          return client.focus();
        }
      }

      return self.clients.openWindow(targetUrl);
    })
  );
});

self.addEventListener('sync', ((event: Event) => {
  const syncEvent = event as ExtendableEvent & { tag: string };
  if (syncEvent.tag !== 'ledger-background-sync') return;
  syncEvent.waitUntil(
    self.registration.showNotification('Furniture Accounts Manager', {
      body: 'You are back online. Sales, inventory, and payment data can sync now.',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag: 'ledger-sync-ready',
      data: { url: '/' },
    })
  );
}) as EventListener);

export {};
