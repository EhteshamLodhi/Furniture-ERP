import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/session';

// Renamed from `middleware.ts`: Next.js 16 deprecated Middleware in favour of
// Proxy. Behaviour is identical.
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, manifest, service worker
     * - static asset extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-.*|worker-.*|fallback-.*|icons/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)',
  ],
};
