'use client';

import { useEffect } from 'react';

/**
 * Replaces the root layout when rendering itself fails, so it cannot rely on
 * any app styling and must ship its own <html>/<body>.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Fatal error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8f9fa',
          color: '#191c1d',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '1.5rem',
        }}
      >
        <div style={{ maxWidth: '28rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#002046', margin: '0 0 .5rem' }}>
            The Ledger could not start
          </h1>
          <p style={{ fontSize: '.875rem', color: '#44474e', margin: '0 0 1.5rem' }}>
            An unexpected error stopped the application from rendering.
          </p>
          {error.digest && (
            <p style={{ fontSize: '.6875rem', color: '#74777f', margin: '0 0 1.5rem' }}>
              Reference: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              background: '#002046',
              color: '#fff',
              border: 0,
              borderRadius: '.75rem',
              padding: '.75rem 2rem',
              fontWeight: 700,
              fontSize: '.875rem',
              cursor: 'pointer',
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
