'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { authApi } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Mail, X, AlertCircle } from 'lucide-react';

type BannerStep = 'idle' | 'sending' | 'entering-otp' | 'verifying';

export function VerifyEmailBanner() {
  const { user, setUser } = useAuthStore();
  const [dismissed, setDismissed] = useState(false);
  const [step, setStep] = useState<BannerStep>('idle');
  const [otp, setOtp] = useState('');
  const [otpOpen, setOtpOpen] = useState(false);

  // Only show for unverified, logged-in users.
  if (!user || user.verified || dismissed) return null;

  async function handleSendCode() {
    setStep('sending');
    try {
      await authApi.sendOtp();
      toast.success('Verification email sent — check your inbox.');
      setOtpOpen(true);
      setStep('entering-otp');
    } catch {
      toast.error('Could not send verification email. Please try again.');
      setStep('idle');
    }
  }

  async function handleVerifyOtp() {
    if (otp.trim().length < 6) {
      toast.error('Please enter the 6-digit code.');
      return;
    }
    setStep('verifying');
    try {
      await authApi.verifyOtp({ otp: otp.trim() });
      // Mark user as verified in store so banner disappears immediately.
      if (user) setUser({ ...user, verified: true });
      setOtpOpen(false);
      setOtp('');
      toast.success("Email verified! You're all set.");
    } catch {
      toast.error('Incorrect code. Please try again.');
      setStep('entering-otp');
    }
  }

  function handleOtpChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Allow only digits, max 6 chars
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(val);
  }

  return (
    <>
      {/* Sticky banner */}
      <div
        role="alert"
        className="flex items-center justify-between gap-4 border-b border-warning/30 bg-warning/10 px-4 py-2.5 text-sm"
      >
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-warning" />
          <span className="text-foreground">
            📧 Verify your email to unlock all features.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-7 border-warning/40 text-xs hover:bg-warning/10"
            onClick={handleSendCode}
            disabled={step === 'sending'}
          >
            {step === 'sending' ? 'Sending…' : 'Send code'}
          </Button>
          <button
            aria-label="Dismiss banner"
            onClick={() => setDismissed(true)}
            className="rounded-chip p-1 text-muted-foreground transition-colors hover:bg-surface-2"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* OTP entry dialog */}
      <Dialog
        open={otpOpen}
        onOpenChange={(open) => {
          setOtpOpen(open);
          if (!open) {
            setOtp('');
            setStep('idle');
          }
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary dark:text-chlorophyll" />
              Enter verification code
            </DialogTitle>
            <DialogDescription>
              We sent a 6-digit code to{' '}
              <strong className="text-foreground">{user.email}</strong>. Enter
              it below to verify your account.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <Input
              id="otp-input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={handleOtpChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleVerifyOtp();
              }}
              className="font-mono text-center text-xl tracking-widest"
              autoFocus
              autoComplete="one-time-code"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setOtpOpen(false);
                setOtp('');
                setStep('idle');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleVerifyOtp}
              disabled={otp.length < 6 || step === 'verifying'}
            >
              {step === 'verifying' ? 'Verifying…' : 'Verify'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
