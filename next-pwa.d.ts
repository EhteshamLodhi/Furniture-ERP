declare module 'next-pwa' {
  import type { NextConfig } from 'next';

  type RuntimeCachingContext = {
    url: URL;
    request: Request;
  };

  type RuntimeCaching = {
    urlPattern: RegExp | ((context: RuntimeCachingContext) => boolean);
    handler: string;
    options?: Record<string, unknown>;
  };

  type PWAConfig = {
    dest: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    fallbacks?: Record<string, string>;
    runtimeCaching?: RuntimeCaching[];
    customWorkerDir?: string;
  };

  export default function withPWAInit(config: PWAConfig): (nextConfig: NextConfig) => NextConfig;
}
