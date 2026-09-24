import type { Metadata } from 'next';
import { PlaygroundClient } from '@/components/playground/PlaygroundClient';

export const metadata: Metadata = {
  title: 'Playground',
  robots: { index: false },
};

export default function PlaygroundPage() {
  return <PlaygroundClient />;
}
