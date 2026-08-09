export const dynamic = 'force-dynamic';

/**
 * Tiny same-origin endpoint the client probes to tell "actually offline" apart
 * from "navigator.onLine is lying". Deliberately does no I/O.
 */
export function GET() {
  return new Response(null, {
    status: 204,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
