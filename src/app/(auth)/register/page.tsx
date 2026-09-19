import type { Metadata } from 'next';
import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Create account',
  robots: { index: false },
};

export default function RegisterPage() {
  return (
    <div className="w-full max-w-sm space-y-8">
      {/* Logo + heading */}
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex items-center justify-center rounded-card bg-primary/10 p-3">
          <Leaf className="h-7 w-7 text-primary dark:text-chlorophyll" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary underline-offset-4 hover:underline dark:text-chlorophyll"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
        <RegisterForm />
      </div>
    </div>
  );
}
