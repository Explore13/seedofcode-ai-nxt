import type { Metadata } from 'next';
import { ApiKeysClient } from '@/components/api-keys/ApiKeysClient';

export const metadata: Metadata = {
  title: 'API Keys',
  robots: { index: false },
};

export default function ApiKeysPage() {
  return <ApiKeysClient />;
}
