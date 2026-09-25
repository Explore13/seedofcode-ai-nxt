'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GerminationAnimation } from './GerminationAnimation';
import { useAuthStore } from '@/store/auth.store';

export function Hero() {
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
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden"
    >
      {/* Subtle radial glow behind hero */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="bg-chlorophyll/5 absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:py-32">
        {/* Left — headline + CTAs */}
        <div className="space-y-6">
          <p className="text-chlorophyll font-mono text-xs font-medium tracking-widest uppercase">
            OpenAI-compatible · Ollama-powered
          </p>

          <h1
            id="hero-heading"
            className="font-display text-display text-foreground leading-tight font-semibold tracking-tight"
          >
            Plant a prompt.
            <br />
            <span className="text-chlorophyll">Watch it grow</span>
            <br />
            into code.
          </h1>

          <p className="text-muted-foreground max-w-sm text-base leading-relaxed">
            A self-serve LLM inference API with API keys, usage analytics, and
            pay-per-token pricing. Drop in your{' '}
            <code className="rounded-chip bg-surface-2 text-foreground px-1.5 py-0.5 font-mono text-sm">
              baseURL
            </code>{' '}
            and go.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            {!isAuthenticated ? (
              <Link
                href="/register"
                className="rounded-control bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-ring px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                Get an API key
              </Link>
            ) : (
              <Link
                href="/home"
                className="rounded-control bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-ring px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                Go to dashboard
              </Link>
            )}
            <Link
              href="/docs"
              className="rounded-control border-border text-foreground hover:bg-surface focus-visible:ring-ring border px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              Read the docs
            </Link>
          </div>

          {/* Social proof / trust */}
          <p className="text-subtle-foreground text-xs">
            Free to start · No credit card required
          </p>
        </div>

        {/* Right — Germination animation */}
        <div className="w-full">
          <GerminationAnimation />
        </div>
      </div>
    </section>
  );
}
