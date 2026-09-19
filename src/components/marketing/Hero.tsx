import Link from 'next/link';
import { GerminationAnimation } from './GerminationAnimation';

export function Hero() {
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
        <div className="absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-chlorophyll/5 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:py-32">
        {/* Left — headline + CTAs */}
        <div className="space-y-6">
          <p className="font-mono text-xs font-medium tracking-widest text-chlorophyll uppercase">
            OpenAI-compatible · Ollama-powered
          </p>

          <h1
            id="hero-heading"
            className="font-display text-display font-semibold leading-tight tracking-tight text-foreground"
          >
            Plant a prompt.
            <br />
            <span className="text-chlorophyll">Watch it grow</span>
            <br />
            into code.
          </h1>

          <p className="max-w-sm text-base leading-relaxed text-muted-foreground">
            A self-serve LLM inference API with API keys, usage analytics, and
            pay-per-token pricing. Drop in your{' '}
            <code className="rounded-chip bg-surface-2 px-1.5 py-0.5 font-mono text-sm text-foreground">
              baseURL
            </code>{' '}
            and go.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/register"
              className="rounded-control bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Get an API key
            </Link>
            <Link
              href="/docs"
              className="rounded-control border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Read the docs
            </Link>
          </div>

          {/* Social proof / trust */}
          <p className="text-xs text-subtle-foreground">
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
