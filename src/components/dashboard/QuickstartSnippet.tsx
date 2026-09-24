"use client";

import { useApiKeys } from '@/hooks/useApiKeys';
import { CodeBlock } from '../shared/CodeBlock';
import { maskApiKey } from '@/lib/format';
import Link from 'next/link';

export function QuickstartSnippet() {
  const { data: keys, isLoading } = useApiKeys();

  const activeKey = keys?.find((k) => k.isActive);
  const keyToDisplay = activeKey
    ? maskApiKey(activeKey.keyPrefix)
    : 'soc_live_your_api_key_here';

  const codeString = `import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.ai.seedofcode.dev",
  apiKey: "${keyToDisplay}",
});

const response = await openai.chat.completions.create({
  model: "llama-3-70b",
  messages: [{ role: "user", content: "Hello!" }],
});

console.log(response.choices[0].message.content);`;

  return (
    <div className="rounded-card border bg-surface p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <div>
          <h3 className="text-lg font-medium text-foreground">Quickstart</h3>
          <p className="text-sm text-subtle-foreground mt-1">
            Use SeedOfCode AI directly with the official OpenAI SDKs.
          </p>
        </div>
        {!activeKey && !isLoading && (
          <Link
            href="/api-keys"
            className="shrink-0 text-sm font-medium text-primary hover:underline"
          >
            Create API Key &rarr;
          </Link>
        )}
      </div>

      <CodeBlock code={codeString} language="javascript" />
    </div>
  );
}
