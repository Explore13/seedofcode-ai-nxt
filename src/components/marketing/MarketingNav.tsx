'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { ComingSoonDialog } from '@/components/shared/ComingSoonDialog';
import { useAuthStore } from '@/store/auth.store';

export function MarketingNav() {
  const [pricingOpen, setPricingOpen] = useState(false);
  const status = useAuthStore((s) => s.status);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      setIsAuthenticated(true);
    } else if (typeof document !== 'undefined') {
      setIsAuthenticated(document.cookie.includes('soc_authed=1'));
    }
  }, [status]);

  return (
    <>
      <nav
        aria-label="Primary navigation"
        className="border-border/60 bg-background/80 sticky top-0 z-40 border-b backdrop-blur-md"
      >
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          {/* Logo */}
          <Link
            href="/"
            className="text-foreground flex items-center gap-2"
            aria-label="SeedofCode AI home"
          >
            <Leaf className="text-chlorophyll h-5 w-5" />
            <span className="font-display text-sm font-semibold tracking-tight">
              SeedofCode AI
            </span>
          </Link>

          {/* Centre links */}
          <div className="hidden items-center gap-6 sm:flex">
            <Link
              href="/docs"
              className="text-muted-foreground hover:text-foreground text-sm underline-offset-4 transition-colors hover:underline"
            >
              Docs
            </Link>
            <button
              type="button"
              onClick={() => setPricingOpen(true)}
              className="text-muted-foreground hover:text-foreground text-sm underline-offset-4 transition-colors hover:underline"
            >
              Pricing
            </button>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className="text-muted-foreground hover:text-foreground hidden text-sm underline-offset-4 transition-colors sm:inline-flex"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="rounded-control bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-primary px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  Start free
                </Link>
              </>
            ) : (
              <Link
                href="/home"
                className="rounded-control bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-primary px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                Go to dashboard
              </Link>
            )}
          </div>
        </div>
      </nav>

      <ComingSoonDialog
        open={pricingOpen}
        onOpenChange={setPricingOpen}
        feature="Pricing & credits"
      />
    </>
  );
}

/** Why section bullet items */
const WHY_ITEMS = [
  {
    title: 'OpenAI-compatible',
    body: 'Drop in your baseURL — the same SDKs, same request shapes, same response format.',
  },
  {
    title: 'Pay per token',
    body: 'Credits deducted per request. No monthly subscriptions, no seat limits, no surprises.',
  },
  {
    title: 'Real models, real hardware',
    body: 'Running Llama, Qwen, Mistral and more on dedicated GPU nodes via Ollama — not a wrapper.',
  },
  {
    title: 'Zero Data Retention',
    body: 'We never store your prompts or completions. Your data is processed in memory and instantly discarded.',
  },
];

export function WhySection() {
  return (
    <section
      aria-labelledby="why-heading"
      className="border-border bg-surface border-t"
    >
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-12 text-center">
          <p className="text-chlorophyll mb-3 font-mono text-xs font-medium tracking-widest uppercase">
            Why SeedofCode AI
          </p>
          <h2
            id="why-heading"
            className="font-display text-display-sm text-foreground font-semibold tracking-tight"
          >
            LLM inference without the noise.
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {WHY_ITEMS.map((item) => (
            <div
              key={item.title}
              className="rounded-card border-border bg-background border p-6"
            >
              <div className="rounded-pill bg-chlorophyll mb-3 h-1 w-8" />
              <h3 className="text-foreground mb-2 font-semibold">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
