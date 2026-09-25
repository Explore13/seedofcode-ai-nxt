'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { Book, Key, Link as LinkIcon, AlertCircle, Activity, Shield, Terminal } from 'lucide-react';

const DOC_LINKS = [
  {
    title: 'Getting Started',
    links: [
      { href: '/docs', label: 'Quickstart', icon: Book },
      { href: '/docs/playground', label: 'API Playground', icon: Terminal },
      { href: '/docs/sdk-compat', label: 'SDK Compatibility', icon: LinkIcon },
    ],
  },
  {
    title: 'Core Concepts',
    links: [
      { href: '/docs/api-keys', label: 'API Keys & Auth', icon: Key },
      { href: '/docs/errors', label: 'Error Codes', icon: AlertCircle },
      { href: '/docs/usage', label: 'Usage & Limits', icon: Activity },
      { href: '/docs/data-privacy', label: 'Data Privacy', icon: Shield },
    ],
  },
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-8" aria-label="Docs navigation">
      {DOC_LINKS.map((group) => (
        <div key={group.title}>
          <h4 className="mb-3 font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {group.title}
          </h4>
          <ul className="space-y-1">
            {group.links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'group flex items-center gap-3 rounded-control px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-chlorophyll/10 text-chlorophyll'
                        : 'text-muted-foreground hover:bg-surface-2 hover:text-foreground'
                    )}
                  >
                    <link.icon
                      className={cn(
                        'h-4 w-4',
                        isActive ? 'text-chlorophyll' : 'text-subtle-foreground group-hover:text-foreground'
                      )}
                    />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
