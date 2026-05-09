import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  fallbacks: {
    document: "/offline",
  },
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts",
        expiration: { maxEntries: 8, maxAgeSeconds: 31536000 },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "ledger-images",
        expiration: { maxEntries: 80, maxAgeSeconds: 2592000 },
      },
    },
    {
      urlPattern: ({ url }: { url: URL }) =>
        ["/", "/customers", "/sales", "/inventory", "/receivables", "/payables"].includes(url.pathname),
      handler: "NetworkFirst",
      options: {
        cacheName: "ledger-core-pages",
        networkTimeoutSeconds: 4,
        expiration: { maxEntries: 24, maxAgeSeconds: 604800 },
      },
    },
    {
      urlPattern: ({ request }: { request: Request }) => request.mode === "navigate",
      handler: "NetworkFirst",
      options: {
        cacheName: "ledger-pages",
        networkTimeoutSeconds: 4,
        expiration: { maxEntries: 40, maxAgeSeconds: 604800 },
      },
    },
  ],
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default withPWA(nextConfig);
