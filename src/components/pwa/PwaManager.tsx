'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Icon from '@/components/ui/Icon';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

type StandaloneNavigator = Navigator & {
  standalone?: boolean;
};

type SyncCapableRegistration = ServiceWorkerRegistration & {
  sync?: {
    register: (tag: string) => Promise<void>;
  };
};

const VISIT_KEY = 'ledger-pwa-visits';
const LATER_KEY = 'ledger-pwa-later';

/** Consecutive failed probes before we tell the user they are offline. */
const OFFLINE_THRESHOLD = 2;
const PROBE_TIMEOUT_MS = 5000;
const RECHECK_MS = 6000;

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as StandaloneNavigator).standalone === true
  );
}

/**
 * Display mode is browser state, not React state — subscribing to it keeps
 * the server render (`false`) and the client in agreement without an effect.
 */
function subscribeToDisplayMode(onChange: () => void) {
  const query = window.matchMedia('(display-mode: standalone)');
  query.addEventListener('change', onChange);
  window.addEventListener('appinstalled', onChange);

  return () => {
    query.removeEventListener('change', onChange);
    window.removeEventListener('appinstalled', onChange);
  };
}

/**
 * `navigator.onLine` only reports whether the OS has *a* network interface. It
 * reads false on VPNs, captive portals and some Windows adapters while the
 * connection is perfectly usable — which is why the banner used to stick. A
 * same-origin request is the only thing that actually proves reachability.
 */
async function canReachServer() {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);

  try {
    const response = await fetch('/api/health', {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timeout);
  }
}

export default function PwaManager() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const isInstalled = useSyncExternalStore(
    subscribeToDisplayMode,
    isStandalone,
    () => false
  );

  const installPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const failureCountRef = useRef(0);

  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window) || Notification.permission !== 'default') return;
    try {
      await Notification.requestPermission();
    } catch {
      // Some browsers require a direct user gesture; the app works without it.
    }
  }, []);

  /* ---- Connectivity ---- */
  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    const schedule = (delay: number) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(check, delay);
    };

    async function check() {
      if (cancelled) return;

      const reachable = await canReachServer();
      if (cancelled) return;

      if (reachable) {
        failureCountRef.current = 0;
        setIsOffline(false);
        return;
      }

      failureCountRef.current += 1;
      if (failureCountRef.current >= OFFLINE_THRESHOLD) {
        setIsOffline(true);
      }
      // Keep polling while we believe we are down so recovery is instant.
      schedule(RECHECK_MS);
    }

    // Browser events are hints; every one of them gets confirmed by a probe.
    const handleOffline = () => check();

    const handleOnline = () => {
      failureCountRef.current = 0;
      check();
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') check();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    document.addEventListener('visibilitychange', handleVisibility);

    // Only probe on load if the browser already suspects trouble; otherwise we
    // stay quiet and let the events drive it.
    if (!navigator.onLine) check();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  /* ---- Install lifecycle ---- */
  useEffect(() => {
    const broadcast = (canInstall: boolean, installed: boolean) => {
      window.dispatchEvent(
        new CustomEvent('ledger-pwa-state', { detail: { canInstall, installed } })
      );
    };

    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      const promptEvent = event as BeforeInstallPromptEvent;
      installPromptRef.current = promptEvent;
      setInstallPrompt(promptEvent);
      broadcast(true, false);

      const laterUntil = Number(localStorage.getItem(LATER_KEY) || 0);
      if (Date.now() > laterUntil) setShowInstallModal(true);
    };

    const handleInstallRequest = () => setShowInstallModal(true);

    const handleInstalled = () => {
      installPromptRef.current = null;
      setInstallPrompt(null);
      setShowInstallModal(false);
      broadcast(false, true);
      requestNotificationPermission();
    };

    const handleQuery = () =>
      broadcast(!!installPromptRef.current && !isStandalone(), isStandalone());

    const installed = isStandalone();
    broadcast(!!installPromptRef.current && !installed, installed);

    const visits = Number(localStorage.getItem(VISIT_KEY) || 0) + 1;
    localStorage.setItem(VISIT_KEY, String(visits));

    const dwellTimer = window.setTimeout(() => {
      const laterUntil = Number(localStorage.getItem(LATER_KEY) || 0);
      if (!isStandalone() && Date.now() > laterUntil && installPromptRef.current) {
        setShowInstallModal(true);
      }
    }, 45000);

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);
    window.addEventListener('ledger-install-request', handleInstallRequest);
    window.addEventListener('ledger-pwa-query', handleQuery);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        const syncRegistration = registration as SyncCapableRegistration;
        syncRegistration.sync?.register('ledger-background-sync').catch(() => undefined);
      });
    }

    return () => {
      window.clearTimeout(dwellTimer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
      window.removeEventListener('ledger-install-request', handleInstallRequest);
      window.removeEventListener('ledger-pwa-query', handleQuery);
    };
  }, [requestNotificationPermission]);

  const installApp = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      installPromptRef.current = null;
      setInstallPrompt(null);
      setShowInstallModal(false);
      requestNotificationPermission();
    }
  };

  const maybeLater = () => {
    localStorage.setItem(LATER_KEY, String(Date.now() + 1000 * 60 * 60 * 18));
    setShowInstallModal(false);
  };

  return (
    <>
      {isOffline && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] z-[65] px-4 lg:bottom-6 lg:pl-72"
        >
          <div className="mx-auto flex max-w-md items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-elevated animate-slide-up">
            <Icon name="cloud_off" className="text-lg" />
            You are offline. Changes will sync automatically when connection returns.
          </div>
        </div>
      )}

      {showInstallModal && !isInstalled && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/30 px-4 py-6 sm:items-center">
          <div className="w-full max-w-md rounded-2xl bg-surface-container-lowest p-5 shadow-elevated animate-slide-up">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                <Icon name="install_mobile" className="text-2xl" />
              </div>
              <div>
                <h2 className="font-headline text-xl font-extrabold text-primary">
                  Install Furniture Accounts Manager
                </h2>
                <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                  Access sales, inventory, receivables, and payables directly from your device home
                  screen for faster daily operations.
                </p>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={maybeLater}
                className="min-h-12 flex-1 rounded-xl bg-surface-container-high font-bold text-on-surface transition-all active:scale-95"
              >
                Maybe Later
              </button>
              <button
                type="button"
                onClick={installApp}
                disabled={!installPrompt}
                className="min-h-12 flex-[1.4] rounded-xl gradient-cta font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-60"
              >
                Install Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
