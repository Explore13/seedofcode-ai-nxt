import Link from 'next/link';
import { ArrowRight, Key, BookOpen, Code2 } from 'lucide-react';

const DOCS = [
  {
    href: '/docs',
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
      className="border-border bg-surface border-t"
    >
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-chlorophyll mb-2 font-mono text-xs font-medium tracking-widest uppercase">
              Documentation
            </p>
            <h2
              id="docs-teaser-heading"
              className="font-display text-foreground text-3xl font-semibold tracking-tight"
            >
              Everything you need to build.
            </h2>
          </div>
          <Link
            href="/docs"
            className="group text-primary dark:text-chlorophyll inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
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
              className="group rounded-card border-border bg-background hover:border-chlorophyll/40 hover:bg-surface flex flex-col gap-4 border p-6 transition-colors"
            >
              <div className="rounded-control bg-chlorophyll/10 flex h-10 w-10 items-center justify-center">
                <doc.icon className="text-chlorophyll h-5 w-5" />
              </div>
              <div>
                <h3 className="text-foreground group-hover:text-primary dark:group-hover:text-chlorophyll font-semibold">
                  {doc.title}
                </h3>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  {doc.description}
                </p>
              </div>
              <div className="text-chlorophyll mt-auto flex items-center gap-1 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100">
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
