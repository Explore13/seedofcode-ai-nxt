'use client';

import { useState } from 'react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useThemeStore } from '@/store/theme.store';
import { ApiError } from '@/lib/api';

/**
 * Application providers: server-state (TanStack Query), theme sync, and toasts.
 * The QueryClient is created once per app instance (lazy `useState`) so it is
 * never recreated across re-renders.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache(),
        defaultOptions: {
          queries: {
            // Data is considered fresh for 30s — avoids refetch storms.
            staleTime: 30_000,
            gcTime: 5 * 60_000,
            refetchOnWindowFocus: true,
            retry: (failureCount, error) => {
              // Never retry client errors (401/403/404/422 etc.) — only
              // transient failures, and only twice.
              if (
                error instanceof ApiError &&
                error.status &&
                error.status < 500
              ) {
                return false;
              }
              return failureCount < 2;
            },
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          {children}
        </TooltipProvider>
        <ToasterBridge />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

/** Sonner toaster themed to our design tokens and the active theme. */
function ToasterBridge() {
  const resolved = useThemeStore((s) => s.resolved);
  return (
    <Toaster
      theme={resolved}
      position="top-right"
      closeButton
      toastOptions={{
        style: {
          background: 'var(--surface)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-control)',
        },
      }}
    />
  );
}
