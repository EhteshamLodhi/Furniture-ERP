import { ViewTransition } from 'react';
import Header from '@/components/layout/Header';
import NotificationHeader from '@/components/layout/NotificationHeader';
import Sidebar from '@/components/layout/Sidebar';
import BottomNav from '@/components/layout/BottomNav';
import DeferredChrome from '@/components/layout/DeferredChrome';
import NotificationsProvider from '@/components/providers/NotificationsProvider';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <NotificationsProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:text-white focus:font-bold"
      >
        Skip to content
      </a>

      <Header />
      <NotificationHeader />

      <div className="mx-auto flex w-full max-w-[96rem]">
        <Sidebar />
        <main
          id="main-content"
          className="min-w-0 flex-1 pb-[calc(env(safe-area-inset-bottom)+7rem)] lg:pb-10"
        >
          <div className="mx-auto w-full max-w-[80rem]">
            {/* Navigation direction is opt-in per link via `transitionTypes`;
                anything untagged reads as moving forward. */}
            <ViewTransition
              enter={{ 'nav-back': 'nav-back', default: 'nav-forward' }}
              exit={{ 'nav-back': 'nav-back', default: 'nav-forward' }}
              default="none"
            >
              {children}
            </ViewTransition>
          </div>
        </main>
      </div>

      <DeferredChrome />
      <BottomNav />
    </NotificationsProvider>
  );
}
