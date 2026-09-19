import type { Metadata, Viewport } from 'next';
import { Fraunces, Geist, Geist_Mono } from 'next/font/google';
import { ThemeScript } from '@/components/theme/ThemeScript';
import { Providers } from '@/providers/Providers';
import { env } from '@/lib/env';
import './globals.css';

// Display serif — the one editorial voice (hero + section openers). Optical
// sizing on so large settings get their intended proportions.
const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-fraunces',
});

// UI / body.
const geistSans = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-sans',
});

// Code, keys, tokens, numeric data.
const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL(env.appUrl),
  title: {
    default: 'SeedofCode AI — LLM inference API for developers',
    template: '%s · SeedofCode AI',
  },
  description:
    'Plant a prompt. Watch it grow into code. An OpenAI-compatible LLM ' +
    'inference API with API keys, usage analytics, and pay-per-token pricing.',
  applicationName: 'SeedofCode AI',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ecf1e9' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1c16' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable}`}
    >
      <body className="min-h-dvh antialiased">
        {/* Must be the first body node: sets the theme before first paint. */}
        <ThemeScript />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
