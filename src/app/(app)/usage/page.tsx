import type { Metadata } from 'next';
import { Suspense } from 'react';
import { UsageClient } from '@/components/usage/UsageClient';

export const metadata: Metadata = {
  title: 'Usage Analytics',
  robots: { index: false },
};

export default function UsagePage() {
  return (
    <Suspense>
      <UsageClient />
    </Suspense>
  );
}
