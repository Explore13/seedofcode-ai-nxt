'use client';

import { useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import { cn } from '@/lib/cn';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * 6-digit OTP input with:
 * - Auto-advance to next digit on input
 * - Backspace goes to previous digit
 * - Full paste support (pastes spread across all cells)
 * - Arrow key navigation
 * - one-time-code autocomplete
 */
export function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  className,
}: OtpInputProps) {
  const digits = value.split('').slice(0, length);
  // Pad to `length` with empty strings
  while (digits.length < length) digits.push('');

  const refs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first empty cell (or the last if full)
  useEffect(() => {
    const idx = Math.min(digits.findIndex((d) => d === ''), length - 1);
    refs.current[Math.max(0, idx)]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function focusAt(idx: number) {
    refs.current[Math.max(0, Math.min(idx, length - 1))]?.focus();
  }

  function updateValue(newDigits: string[]) {
    const joined = newDigits.join('');
    onChange(joined);
    if (joined.length === length) {
      onComplete?.(joined);
    }
  }

  function handleKeyDown(idx: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (digits[idx]) {
        const next = [...digits];
        next[idx] = '';
        updateValue(next);
      } else if (idx > 0) {
        const next = [...digits];
        next[idx - 1] = '';
        updateValue(next);
        focusAt(idx - 1);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusAt(idx - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusAt(idx + 1);
    }
  }

  function handleInput(idx: number, rawValue: string) {
    // Accept only the LAST digit typed (in case browser inserts more)
    const digit = rawValue.replace(/\D/g, '').slice(-1);
    if (!digit) return;
    const next = [...digits];
    next[idx] = digit;
    updateValue(next);
    if (idx < length - 1) {
      focusAt(idx + 1);
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, length);
    const next = pasted.split('');
    while (next.length < length) next.push('');
    updateValue(next);
    // Focus last filled cell or first empty
    const lastFilled = Math.min(pasted.length - 1, length - 1);
    focusAt(lastFilled + 1);
  }

  return (
    <div
      className={cn('flex items-center gap-3', className)}
      role="group"
      aria-label="One-time password input"
    >
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => {
            refs.current[idx] = el;
          }}
          id={`otp-${idx}`}
          type="text"
          inputMode="numeric"
          pattern="[0-9]"
          maxLength={1}
          value={digits[idx] ?? ''}
          autoComplete={idx === 0 ? 'one-time-code' : 'off'}
          disabled={disabled}
          aria-label={`Digit ${idx + 1} of ${length}`}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onChange={(e) => handleInput(idx, e.target.value)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={cn(
            'h-12 w-11 rounded-control border border-border bg-surface text-center font-mono text-xl font-semibold text-foreground',
            'transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/50',
            'disabled:cursor-not-allowed disabled:opacity-50',
            digits[idx] && 'border-primary/60',
          )}
        />
      ))}
    </div>
  );
}
