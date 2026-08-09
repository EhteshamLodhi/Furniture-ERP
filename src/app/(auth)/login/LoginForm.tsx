'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Icon from '@/components/ui/Icon';

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await createClient().auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      router.replace(redirectTo);
      router.refresh();
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-[2.5rem] border border-white/5 p-6 shadow-2xl backdrop-blur-2xl animate-slide-up sm:p-8">
      <div className="mb-10 text-center">
        <div className="group mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-primary shadow-xl shadow-primary/20 transition-transform duration-500 hover:scale-110">
          <Icon name="chair" className="text-4xl text-white transition-transform group-hover:rotate-12" />
        </div>
        <h1 className="mb-2 font-headline text-4xl font-extrabold tracking-tighter text-white">
          The Ledger
        </h1>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-on-surface-variant/80">
          Master Craftsman&apos;s ERP
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 flex items-center gap-3 rounded-2xl border border-error/20 bg-error-container/20 p-4 text-sm text-error-container animate-shake"
        >
          <Icon name="error" className="text-lg text-error" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <label
            className="ml-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70"
            htmlFor="email"
          >
            Identity / Email
          </label>
          <div className="group relative">
            <Icon
              name="fingerprint"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-outline-variant transition-colors group-focus-within:text-primary-fixed"
            />
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white outline-none transition-all placeholder:text-outline-variant/50 focus:bg-white/10 focus:ring-2 focus:ring-primary-fixed/40"
              placeholder="artisan@ledger.io"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            className="ml-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70"
            htmlFor="password"
          >
            Security Key
          </label>
          <div className="group relative">
            <Icon
              name="lock"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-outline-variant transition-colors group-focus-within:text-primary-fixed"
            />
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white outline-none transition-all placeholder:text-outline-variant/50 focus:bg-white/10 focus:ring-2 focus:ring-primary-fixed/40"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-2xl gradient-cta py-5 text-lg font-bold text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] hover:shadow-primary/40 active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <span className="inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-white/30 border-t-white" />
          ) : (
            <>
              <Icon name="shield_person" className="text-xl" />
              Authenticate
            </>
          )}
        </button>
      </form>

      <div className="mt-10 border-t border-white/5 pt-8 text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
          Secured by Antigravity Protocol
        </p>
      </div>
    </div>
  );
}
