'use client';

import { useApiKeys } from '@/hooks/useApiKeys';
import { CodeBlock } from '../shared/CodeBlock';
import { maskApiKey } from '@/lib/format';
import Link from 'next/link';
import { useState } from 'react';

export function QuickstartSnippet() {
  const { data: keys, isLoading } = useApiKeys();

  const activeKey = keys?.find((k) => k.isActive);
  const keyToDisplay = activeKey
    ? maskApiKey(activeKey.keyPrefix)
    : 'soc_live_your_api_key_here';

  const [lang, setLang] = useState<'javascript' | 'python' | 'java'>(
    'javascript',
  );

  const snippets = {
    javascript: `import axios from 'axios';

const response = await axios.post(
  'https://api.ai.seedofcode.dev/api/chat',
  {
    model: 'qwen2.5vl:7b',
    messages: [{ role: 'user', content: 'Hello!' }]
  },
  {
    headers: {
      'x-api-key': \`${keyToDisplay}\`,
      'Content-Type': 'application/json'
    }
  }
);

console.log(response.data.message.content);`,
    python: `import requests

headers = {
    "x-api-key": f"{keyToDisplay}",
    "Content-Type": "application/json"
}

data = {
    "model": "qwen2.5vl:7b",
    "messages": [{"role": "user", "content": "Hello!"}]
}

response = requests.post(
    "https://api.ai.seedofcode.dev/api/chat",
    headers=headers,
    json=data
)

print(response.json()["message"]["content"])`,
    java: `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class Main {
    public static void main(String[] args) throws Exception {
        String json = """
            {
                "model": "qwen2.5vl:7b",
                "messages": [{"role": "user", "content": "Hello!"}]
            }
            """;

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://api.ai.seedofcode.dev/api/chat"))
            .header("x-api-key", "${keyToDisplay}")
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(json))
            .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        System.out.println(response.body());
    }
}`,
  };

  return (
    <div className="rounded-card bg-surface p-6">
      <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-foreground text-lg font-medium">Quickstart</h3>
          <p className="text-subtle-foreground mt-1 text-sm">
            Use SeedOfCode AI directly with the official OpenAI SDKs.
          </p>
        </div>
        {!activeKey && !isLoading && (
          <Link
            href="/api-keys"
            className="text-primary shrink-0 text-sm font-medium hover:underline"
          >
            Create API Key &rarr;
          </Link>
        )}
      </div>
      <div className="mb-3 flex items-center gap-2">
        {(['javascript', 'python', 'java'] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              lang === l
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
            }`}
          >
            {l === 'javascript'
              ? 'Node.js (Axios)'
              : l === 'python'
                ? 'Python'
                : 'Java'}
          </button>
        ))}
      </div>

      <CodeBlock code={snippets[lang]} language={lang} />
    </div>
  );
}
