import path from "node:path";
import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const isDev = process.env.NODE_ENV === "development";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  // We surface connectivity changes ourselves in PwaManager; letting the
  // service worker force a reload on every `online` event caused reload loops.
  reloadOnOnline: false,
  fallbacks: {
    document: "/offline",
  },
  runtimeCaching: [
    {
      // Never serve an authenticated API response from cache.
      urlPattern: ({ url }: { url: URL }) => url.pathname.startsWith("/api/"),
      handler: "NetworkOnly",
      // next-pwa reads `options` when wiring up the offline fallback, so every
      // entry needs one even when there is nothing to configure.
      options: {},
    },
    {
      urlPattern: /\.(?:woff2?|ttf|otf)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "ledger-fonts",
        expiration: { maxEntries: 12, maxAgeSeconds: 31536000 },
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
  // Several stray lockfiles live above this project; without this Next infers
  // the user's home directory as the workspace root and traces the wrong files.
  outputFileTracingRoot: path.join(__dirname),
  poweredByHeader: false,
  experimental: {
    viewTransition: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

// next-pwa always attaches a `webpack()` hook, which would opt dev out of
// Turbopack. The service worker is a production concern, so only wrap there.
export default isDev ? nextConfig : withPWA(nextConfig);
