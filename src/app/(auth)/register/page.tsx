import type { Metadata } from 'next';
import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Create account | SeedofCode AI',
  description:
    'Create a free SeedofCode AI account to get your API keys and start using OpenAI-compatible LLMs.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Create account | SeedofCode AI',
    description:
      'Create a free SeedofCode AI account to get your API keys and start using OpenAI-compatible LLMs.',
    type: 'website',
  },
};

export default function RegisterPage() {
  return (
    <div className="w-full max-w-sm space-y-8">
      {/* Logo + heading */}
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="rounded-card bg-primary/10 flex items-center justify-center p-3">
          <Leaf className="text-primary dark:text-chlorophyll h-7 w-7" />
        </span>
        <div>
          <h1 className="font-display text-foreground text-2xl font-semibold">
            Create your account
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary dark:text-chlorophyll underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="rounded-card border-border bg-surface border p-6 shadow-sm">
        <RegisterForm />
      </div>
    </div>
  );
}
