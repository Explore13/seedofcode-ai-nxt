import Link from 'next/link';
import { Leaf } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-2 border border-border">
              <Leaf className="h-8 w-8 text-chlorophyll" />
            </div>
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground">
            404
          </h1>
          <h2 className="mt-2 text-xl font-medium text-foreground">
            Page not found
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved. Check the URL or navigate back to safety.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/"
              className="rounded-control bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-ring px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              Go to Homepage
            </Link>
            <Link
              href="/docs"
              className="text-sm font-medium text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
            >
              View Documentation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
