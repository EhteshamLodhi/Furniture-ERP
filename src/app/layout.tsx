import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

/**
 * Self-hosted through next/font: no render-blocking request to a third-party
 * CDN, no layout shift, and the app keeps its typography when offline.
 */
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#002046",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "Furniture Accounts Manager",
    template: "%s · The Ledger",
  },
  description:
    "Enterprise Resource Planning for furniture manufacturing and showroom management. Track accounts, inventory, orders, and financial performance.",
  applicationName: "The Ledger",
  manifest: "/manifest.json",
  formatDetection: { telephone: false },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Furniture Accounts Manager",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body className="bg-background text-on-surface min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
