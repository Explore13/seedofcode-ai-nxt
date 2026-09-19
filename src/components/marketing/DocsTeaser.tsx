import Link from 'next/link';
import { ArrowRight, Key, BookOpen, Code2 } from 'lucide-react';

const DOCS = [
  {
    href: '/docs/quickstart',
    icon: Code2,
    title: 'Quickstart',
    description:
      'Get a key, set your baseURL, make your first request. Five minutes, working code.',
  },
  {
    href: '/docs/api-keys',
    icon: Key,
    title: 'API Keys',
    description:
      'Create, rotate and revoke keys. Understand the soc_live_ / soc_test_ prefix system.',
  },
  {
    href: '/docs/sdk-compat',
    icon: BookOpen,
    title: 'SDK Compatibility',
    description:
      'Drop-in OpenAI-compatible. Works with the official SDKs for Python, Node, Go and more.',
  },
];

export function DocsTeaser() {
  return (
    <section
      aria-labelledby="docs-teaser-heading"
      className="border-t border-border bg-surface"
    >
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 font-mono text-xs font-medium tracking-widest text-chlorophyll uppercase">
              Documentation
            </p>
            <h2
              id="docs-teaser-heading"
              className="font-display text-3xl font-semibold tracking-tight text-foreground"
            >
              Everything you need to build.
            </h2>
          </div>
          <Link
            href="/docs"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline dark:text-chlorophyll"
          >
            Browse all docs
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {DOCS.map((doc) => (
            <Link
              key={doc.href}
              href={doc.href}
              className="group flex flex-col gap-4 rounded-card border border-border bg-background p-6 transition-colors hover:border-chlorophyll/40 hover:bg-surface"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-control bg-chlorophyll/10">
                <doc.icon className="h-5 w-5 text-chlorophyll" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary dark:group-hover:text-chlorophyll">
                  {doc.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {doc.description}
                </p>
              </div>
              <div className="mt-auto flex items-center gap-1 text-xs font-medium text-chlorophyll opacity-0 transition-opacity group-hover:opacity-100">
                Read more
                <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
