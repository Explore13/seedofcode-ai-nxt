import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify Email | SeedofCode AI',
  description: 'Verify your SeedofCode AI account to start using the API.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Verify Email | SeedofCode AI',
    description: 'Verify your SeedofCode AI account to start using the API.',
    type: 'website',
  },
};

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
