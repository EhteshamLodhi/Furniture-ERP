import type { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Sign in',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  // Only ever bounce back to a path inside this app.
  const redirectTo = next && next.startsWith('/') && !next.startsWith('//') ? next : '/';

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative full-bleed backdrop */}
        <img
          src="/login-bg.png"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="h-full w-full scale-105 object-cover opacity-40 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4 py-10">
        <LoginForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}
