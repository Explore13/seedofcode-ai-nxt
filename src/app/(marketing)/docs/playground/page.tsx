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
        <h1 className="mt-2 scroll-m-20 font-display text-4xl font-bold tracking-tight text-foreground">
          API Playground
        </h1>
        <p className="leading-7 mt-6 text-muted-foreground">
          Use the interactive tester below to send live requests to the API. 
          Edit the JSON payload directly to customize the model, messages, and parameters.
        </p>
      </div>

      <ApiTester />
    </div>
  );
}
