import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { env } from '@/lib/env';

const FOOTER_COLS = [
  {
    heading: 'Product',
    links: [
      { label: 'Dashboard', href: '/home' },
      { label: 'API Keys', href: '/api-keys' },
      { label: 'Usage Analytics', href: '/usage' },
    ],
  },
  {
    heading: 'Docs',
    links: [
      { label: 'Quickstart', href: '/docs/quickstart' },
      { label: 'Authentication', href: '/docs/auth' },
      { label: 'SDK Compatibility', href: '/docs/sdk-compat' },
      { label: 'Error Codes', href: '/docs/errors' },
    ],
  },
  {
    heading: 'Support',
    links: [
      {
        label: 'Contact',
        href: `mailto:${env.contactEmail}`,
        external: true,
      },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-5xl px-6 py-16">
        {/* Top row */}
        <div className="grid gap-12 sm:grid-cols-[1fr_auto_auto_auto]">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-chlorophyll" />
              <span className="font-display text-sm font-semibold text-foreground">
              SeedofCode AI
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              An OpenAI-compatible LLM inference API backed by an Ollama fleet.
              Pay per token, no subscriptions.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.heading} className="space-y-4">
              <h3 className="text-xs font-semibold tracking-wide text-foreground">
                {col.heading}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      {...('external' in link && link.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
          <p className="text-xs text-subtle-foreground">
            © {year} SeedofCode AI. All rights reserved.
          </p>
          <p className="text-xs text-subtle-foreground">
            Built on Ollama · OpenAI-compatible API
          </p>
        </div>
      </div>
    </footer>
  );
}
