import { notFound } from 'next/navigation';
import { DevHarness } from '@/components/dev/DevHarness';

// Never expose this route in production.
export const dynamic = 'force-static';

export const metadata = {
  title: 'Dev harness',
  robots: { index: false, follow: false },
};

export default function DevPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }
  return <DevHarness />;
}
