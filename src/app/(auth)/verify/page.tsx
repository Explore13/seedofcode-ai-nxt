'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { OtpInput } from '@/components/auth/OtpInput';
import { Button } from '@/components/ui/button';

const RESEND_COOLDOWN = 60; // seconds

export default function VerifyPage() {
  const router = useRouter();
  const { user, setUser, status } = useAuthStore();
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [initialSent, setInitialSent] = useState(false);

  // Redirect if not authenticated or already verified
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    }
    if (status === 'authenticated' && user?.verified) {
      router.replace('/home');
      return;
    }
    // Auto-send OTP on mount (first visit after register)
    if (status === 'authenticated' && !initialSent) {
      setInitialSent(true);
      handleSendOtp(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, user?.verified]);

  // Countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function handleSendOtp(silent = false) {
    if (cooldown > 0) return;
    setSending(true);
    try {
      await authApi.sendOtp();
      setCooldown(RESEND_COOLDOWN);
      if (!silent) toast.success('Verification code sent! Check your inbox.');
    } catch {
      toast.error('Failed to send code. Please try again.');
    } finally {
      setSending(false);
    }
  }

  async function handleVerify(code: string) {
    if (code.length < 6) return;
    setVerifying(true);
    try {
      await authApi.verifyOtp({ otp: code });
      if (user) setUser({ ...user, verified: true });
      toast.success('Email verified! Welcome to SeedofCode AI.');
      router.replace('/home');
    } catch {
      toast.error('Incorrect or expired code. Please try again.');
      setOtp('');
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className="w-full max-w-sm space-y-8">
      {/* Logo + heading */}
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="rounded-card bg-primary/10 flex items-center justify-center p-4">
          <Mail className="text-primary dark:text-chlorophyll h-8 w-8" />
        </span>
        <div>
          <h1 className="font-display text-foreground text-2xl font-semibold">
            Check your inbox
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            We sent a 6-digit code to{' '}
            <strong className="text-foreground">
              {user?.email ?? 'your email'}
            </strong>
            .
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="rounded-card border-border bg-surface border p-6 shadow-sm">
        <div className="flex flex-col items-center gap-6">
          {/* OTP input */}
          <OtpInput
            value={otp}
            onChange={setOtp}
            onComplete={handleVerify}
            disabled={verifying}
          />

          {/* Verify button */}
          <Button
            className="w-full"
            onClick={() => handleVerify(otp)}
            disabled={otp.length < 6 || verifying}
          >
            {verifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying…
              </>
            ) : (
              'Verify email'
            )}
          </Button>

          {/* Resend */}
          <div className="text-muted-foreground text-center text-sm">
            Didn&apos;t receive a code?{' '}
            {cooldown > 0 ? (
              <span className="text-subtle-foreground">
                Resend in {cooldown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={() => handleSendOtp(false)}
                disabled={sending}
                className="text-primary dark:text-chlorophyll inline-flex items-center gap-1 underline-offset-4 hover:underline disabled:opacity-50"
              >
                {sending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <RotateCcw className="h-3 w-3" />
                )}
                Resend code
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Back to login */}
      <div className="text-center">
        <Link
          href="/login"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm underline-offset-4 hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
