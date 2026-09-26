import Link from 'next/link';
import { Leaf } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-dvh flex-col">
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-surface-2 border-border flex h-16 w-16 items-center justify-center rounded-full border">
              <Leaf className="text-chlorophyll h-8 w-8" />
            </div>
          </div>
          <h1 className="font-display text-foreground text-4xl font-semibold tracking-tight">
            404
          </h1>
          <h2 className="text-foreground mt-2 text-xl font-medium">
            Page not found
          </h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Check the URL or navigate back to safety.
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
              className="text-muted-foreground hover:text-foreground text-sm font-medium underline-offset-4 hover:underline"
            >
              View Documentation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
