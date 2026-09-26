import type { Metadata } from 'next';
import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { LoginForm } from '@/components/auth/LoginForm';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Sign in to SeedofCode AI',
  description:
    'Sign in to your SeedofCode AI account to manage your API keys, view usage analytics, and test models in the playground.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Sign in to SeedofCode AI',
    description:
      'Sign in to your SeedofCode AI account to manage your API keys, view usage analytics, and test models in the playground.',
    type: 'website',
  },
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm space-y-8">
      {/* Logo + heading */}
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="rounded-card bg-primary/10 flex items-center justify-center p-3">
          <Leaf className="text-primary dark:text-chlorophyll h-7 w-7" />
        </span>
        <div>
          <h1 className="font-display text-foreground text-2xl font-semibold">
            Sign in to SeedofCode AI
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="text-primary dark:text-chlorophyll underline-offset-4 hover:underline"
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="rounded-card border-border bg-surface border p-6 shadow-sm">
        {/* LoginForm uses useSearchParams internally — must be inside Suspense */}
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
