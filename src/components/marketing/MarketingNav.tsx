'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { ComingSoonDialog } from '@/components/shared/ComingSoonDialog';
import { cn } from '@/lib/cn';

export function MarketingNav() {
  const [pricingOpen, setPricingOpen] = useState(false);

  return (
    <>
      <nav
        aria-label="Primary navigation"
        className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md"
      >
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-foreground"
            aria-label="SeedofCode AI home"
          >
            <Leaf className="h-5 w-5 text-chlorophyll" />
            <span className="font-display text-sm font-semibold tracking-tight">
              SeedofCode AI
            </span>
          </Link>

          {/* Centre links */}
          <div className="hidden items-center gap-6 sm:flex">
            <Link
              href="/docs"
              className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Docs
            </Link>
            <button
              type="button"
              onClick={() => setPricingOpen(true)}
              className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Pricing
            </button>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="hidden text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-control bg-primary px-3.5 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Start free
            </Link>
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
];

export function WhySection() {
  return (
    <section
      aria-labelledby="why-heading"
      className="border-t border-border bg-surface"
    >
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-12 text-center">
          <p className="mb-3 font-mono text-xs font-medium tracking-widest text-chlorophyll uppercase">
            Why SeedofCode AI
          </p>
          <h2
            id="why-heading"
            className="font-display text-display-sm font-semibold tracking-tight text-foreground"
          >
            LLM inference without the noise.
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {WHY_ITEMS.map((item) => (
            <div
              key={item.title}
              className="rounded-card border border-border bg-background p-6"
            >
              <div className="mb-3 h-1 w-8 rounded-pill bg-chlorophyll" />
              <h3 className="mb-2 font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
