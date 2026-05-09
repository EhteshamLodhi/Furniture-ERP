import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import Sidebar from "@/components/layout/Sidebar";
import NotificationHeader from "@/components/layout/NotificationHeader";
import PwaManager from "@/components/pwa/PwaManager";
import QuickActionsFab from "@/components/layout/QuickActionsFab";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#002046",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Furniture Accounts Manager",
  description: "Enterprise Resource Planning for furniture manufacturing and showroom management. Track accounts, inventory, orders, and financial performance.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Furniture Accounts Manager",
  },
  icons: {
    apple: "/icons/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-background text-on-surface min-h-screen antialiased">
        <div className="fixed top-0 left-0 w-full z-50">
          <Header />
          <NotificationHeader />
        </div>
        <Sidebar />
        <main className="pt-[104px] pb-36 lg:pb-8 lg:pl-64">
          <div className="max-w-screen-xl mx-auto">
            {children}
          </div>
        </main>
        <PwaManager />
        <QuickActionsFab />
        <BottomNav />
      </body>
    </html>
  );
}
