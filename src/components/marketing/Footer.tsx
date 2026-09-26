import Link from 'next/link';
import { Leaf } from 'lucide-react';

const FOOTER_COLS = [
  {
    heading: 'Product',
    links: [
      { label: 'Dashboard', href: '/home' },
      { label: 'Playground', href: '/playground' },
      { label: 'API Keys', href: '/api-keys' },
      { label: 'Usage Analytics', href: '/usage' },
    ],
  },
  {
    heading: 'Docs',
    links: [
      { label: 'Quickstart', href: '/docs' },
      { label: 'API Keys & Auth', href: '/docs/api-keys' },
      { label: 'SDK Compatibility', href: '/docs/sdk-compat' },
      { label: 'Data Privacy', href: '/docs/data-privacy' },
      { label: 'Error Codes', href: '/docs/errors' },
    ],
  },
  {
    heading: 'Support',
    links: [
      {
        label: 'Contact',
        href: 'mailto:suryaxdeveloper@gmail.com',
        external: true,
      },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border bg-background border-t">
      <div className="mx-auto max-w-5xl px-6 py-16">
        {/* Top row */}
        <div className="grid gap-12 sm:grid-cols-[1fr_auto_auto_auto]">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Leaf className="text-chlorophyll h-5 w-5" />
              <span className="font-display text-foreground text-sm font-semibold">
                SeedofCode AI
              </span>
            </div>
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
              An OpenAI-compatible LLM inference API backed by an Ollama fleet.
              Pay per token, no subscriptions.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.heading} className="space-y-4">
              <h3 className="text-foreground text-xs font-semibold tracking-wide">
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
                      className="text-muted-foreground hover:text-foreground text-sm underline-offset-4 transition-colors hover:underline"
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
        <div className="border-border mt-16 flex flex-wrap items-center justify-between gap-4 border-t pt-8">
          <p className="text-subtle-foreground text-xs">
            © {year} SeedofCode AI. All rights reserved.
          </p>
          <p className="text-subtle-foreground text-xs">
            Built on Ollama · OpenAI-compatible API
          </p>
        </div>
      </div>
    </footer>
  );
}
