'use client';

import { useEffect, useState } from 'react';

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

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as StandaloneNavigator).standalone === true;
}

export default function PwaManager() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [isOffline, setIsOffline] = useState(() => (typeof navigator === 'undefined' ? false : !navigator.onLine));

  async function requestNotificationPermission() {
    if (!('Notification' in window) || Notification.permission !== 'default') return;
    try {
      await Notification.requestPermission();
    } catch {
      // Browsers may require a direct user gesture; the app remains usable without push permission.
    }
  }

  useEffect(() => {
    const updateInstallState = () => {
      const installed = isStandalone();
      setIsInstalled(installed);
      window.dispatchEvent(new CustomEvent('ledger-pwa-state', { detail: { canInstall: !!installPrompt && !installed, installed } }));
    };

    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      const promptEvent = event as BeforeInstallPromptEvent;
      setInstallPrompt(promptEvent);
      setIsInstalled(isStandalone());
      window.dispatchEvent(new CustomEvent('ledger-pwa-state', { detail: { canInstall: true, installed: false } }));

      const laterUntil = Number(localStorage.getItem(LATER_KEY) || 0);
      if (Date.now() > laterUntil) setShowInstallModal(true);
    };

    const handleInstallRequest = () => setShowInstallModal(true);
    const handleInstalled = () => {
      setInstallPrompt(null);
      setIsInstalled(true);
      setShowInstallModal(false);
      window.dispatchEvent(new CustomEvent('ledger-pwa-state', { detail: { canInstall: false, installed: true } }));
      requestNotificationPermission();
    };

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    updateInstallState();

    const visits = Number(localStorage.getItem(VISIT_KEY) || 0) + 1;
    localStorage.setItem(VISIT_KEY, String(visits));

    const dwellTimer = window.setTimeout(() => {
      const laterUntil = Number(localStorage.getItem(LATER_KEY) || 0);
      if (!isStandalone() && Date.now() > laterUntil && (visits > 1 || installPrompt)) {
        setShowInstallModal(true);
      }
    }, 45000);

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);
    window.addEventListener('ledger-install-request', handleInstallRequest);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        const syncRegistration = registration as SyncCapableRegistration;
        if (syncRegistration.sync) {
          syncRegistration.sync.register('ledger-background-sync').catch(() => undefined);
        }
      });
    }

    return () => {
      window.clearTimeout(dwellTimer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
      window.removeEventListener('ledger-install-request', handleInstallRequest);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [installPrompt]);

  const installApp = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setInstallPrompt(null);
      setIsInstalled(true);
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
        <div className="fixed top-[104px] left-0 right-0 z-[65] px-4 lg:pl-68">
          <div className="mx-auto max-w-screen-xl rounded-xl bg-primary text-white px-4 py-3 text-sm font-semibold shadow-elevated flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">cloud_off</span>
            You are offline. Changes will sync automatically when connection returns.
          </div>
        </div>
      )}

      {showInstallModal && !isInstalled && (
        <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center bg-black/30 px-4 py-6">
          <div className="w-full max-w-md rounded-2xl bg-surface-container-lowest p-5 shadow-elevated animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined">install_mobile</span>
              </div>
              <div>
                <h2 className="font-headline text-xl font-extrabold text-primary">Install Furniture Accounts Manager</h2>
                <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                  Access sales, inventory, receivables, and payables directly from your device home screen for faster daily operations.
                </p>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={maybeLater}
                className="flex-1 min-h-12 rounded-xl bg-surface-container-high text-on-surface font-bold active:scale-95 transition-all"
              >
                Maybe Later
              </button>
              <button
                type="button"
                onClick={installApp}
                disabled={!installPrompt}
                className="flex-[1.4] min-h-12 rounded-xl gradient-cta text-white font-bold shadow-lg active:scale-95 transition-all disabled:opacity-60"
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
