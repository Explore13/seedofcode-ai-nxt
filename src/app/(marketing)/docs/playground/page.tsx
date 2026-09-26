import type { Metadata } from 'next';
import { ApiTester } from '@/components/shared/ApiTester';

export const metadata: Metadata = {
  title: 'API Playground | SeedofCode AI',
  description: 'Test the SeedofCode AI inference API interactively.',
};

export default function PlaygroundPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-foreground mt-2 scroll-m-20 text-4xl font-bold tracking-tight">
          API Playground
        </h1>
        <p className="text-muted-foreground mt-6 leading-7">
          Use the interactive tester below to send live requests to the API.
          Edit the JSON payload directly to customize the model, messages, and
          parameters.
        </p>
      </div>

      <ApiTester />
    </div>
  );
}
