'use client';

import { useState } from 'react';
import { Play, Loader2, Terminal } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { CodeBlock } from './CodeBlock';
import { testChat } from '@/lib/api/inference.api';

export function ApiTester() {
  const [apiKey, setApiKey] = useState('');
  const [jsonPayload, setJsonPayload] = useState(`{
  "model": "qwen2.5vl:7b",
  "messages": [
    {
      "role": "user",
      "content": "What is 2+2?"
    }
  ]
}`);

  const [leftTab, setLeftTab] = useState<'headers' | 'body'>('body');
  const [activeLangTab, setActiveLangTab] = useState<'curl' | 'javascript' | 'python' | 'java'>('curl');

  const [response, setResponse] = useState<string | null>(null);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const displayKey = apiKey || '';

  // Snippets always show production URL for copy/paste
  const displayUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat`;

  const snippets = {
    curl: `curl -X POST ${displayUrl} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${displayKey}" \\
  -d '${jsonPayload}'`,
    javascript: `import axios from 'axios';

const response = await axios.post(
  '${displayUrl}',
  ${jsonPayload},
  {
    headers: {
      'Authorization': 'Bearer ${displayKey}',
      'Content-Type': 'application/json'
    }
  }
);

console.log(response.data);`,
    python: `import requests

headers = {
    "Authorization": "Bearer ${displayKey}",
    "Content-Type": "application/json"
}

data = ${jsonPayload}

response = requests.post(
    "${displayUrl}",
    headers=headers,
    json=data
)

print(response.json())`,
    java: `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class Main {
    public static void main(String[] args) throws Exception {
        String payload = "${jsonPayload.replace(/"/g, '\\"').replace(/\n/g, '')}";
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("${displayUrl}"))
            .header("Authorization", "Bearer ${displayKey}")
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(payload))
            .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        
        System.out.println(response.body());
    }
}`
  };

  const handleSend = async () => {
    setIsLoading(true);
    setResponse(null);
    setStatusText(null);
    setStatusCode(null);
    setDuration(null);

    let parsedBody;
    try {
      parsedBody = JSON.parse(jsonPayload);
    } catch (e) {
      setStatusCode(400);
      setStatusText('Bad Request');
      setResponse(JSON.stringify({ error: 'Invalid JSON payload' }, null, 2));
      setIsLoading(false);
      return;
    }

    const startTime = performance.now();

    try {
      const res = await testChat(apiKey || 'soc_live_missing_key', parsedBody);

      const endTime = performance.now();
      setDuration(Math.round(endTime - startTime));
      setStatusCode(res.status);
      setStatusText(res.statusText || (res.status === 200 ? 'OK' : 'Error'));

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      const endTime = performance.now();
      setDuration(Math.round(endTime - startTime));
      setStatusCode(0);
      setStatusText('Network Error');
      setResponse(JSON.stringify({
        error: err.message || 'Failed to fetch',
        tip: 'Check your network connection and server status.'
      }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const isSuccessStatus = statusCode !== null && statusCode >= 200 && statusCode < 300;

  return (
    <div className="my-8 flex flex-col gap-8">
      {/* HTTP Bar */}
      <div className="flex items-center w-full shadow-sm rounded-md overflow-hidden border border-border">
        <div className="bg-muted px-4 py-3 text-sm font-bold text-primary border-r border-border">
          POST
        </div>
        <div className="flex-1 bg-surface px-4 py-3 text-sm font-mono text-muted-foreground overflow-x-auto whitespace-nowrap">
          {displayUrl}
        </div>
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="bg-primary text-primary-foreground px-8 py-3 font-semibold text-sm hover:bg-primary-hover flex items-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed border-l border-primary"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
          Send
        </button>
      </div>

      {/* Request Config Pane */}
      <div className="flex flex-col border border-border rounded-xl overflow-hidden bg-surface shadow-sm">
        <div className="flex items-center gap-1 border-b border-border/60 px-2 pt-2 bg-surface-2/30">
          <button
            onClick={() => setLeftTab('headers')}
            className={`px-6 py-2.5 text-sm font-medium border-b-2 transition-colors ${leftTab === 'headers' ? 'border-primary text-foreground bg-surface rounded-t-md' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-surface/50 rounded-t-md'
              }`}
          >
            Headers
          </button>
          <button
            onClick={() => setLeftTab('body')}
            className={`px-6 py-2.5 text-sm font-medium border-b-2 transition-colors ${leftTab === 'body' ? 'border-primary text-foreground bg-surface rounded-t-md' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-surface/50 rounded-t-md'
              }`}
          >
            Body (JSON)
          </button>
        </div>

        <div className="p-4 min-h-[300px] flex flex-col relative">
          {leftTab === 'headers' && (
            <div className="space-y-4">
              <div className="grid grid-cols-[140px_1fr] items-center gap-4 rounded-md border border-border p-4 bg-background">
                <span className="text-sm font-mono text-foreground font-medium">Authorization</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-muted-foreground">Bearer</span>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="soc_live_..."
                    className="flex-1 bg-transparent text-sm font-mono focus:outline-none placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-[140px_1fr] items-center gap-4 rounded-md border border-border p-4 bg-background opacity-70">
                <span className="text-sm font-mono text-foreground font-medium">Content-Type</span>
                <span className="text-sm font-mono text-foreground">application/json</span>
              </div>
            </div>
          )}

          {leftTab === 'body' && (
            <div className="absolute inset-0 p-4">
              <div className="h-full rounded-md border border-input overflow-hidden">
                <Editor
                  height="100%"
                  defaultLanguage="json"
                  theme="vs-dark"
                  value={jsonPayload}
                  onChange={(val) => setJsonPayload(val || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    padding: { top: 16 },
                    tabSize: 2,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Code Tabs Pane */}
      <div className="flex flex-col border border-border rounded-xl overflow-hidden bg-surface shadow-sm">
        <div className="flex items-center gap-1 border-b border-border/60 px-2 pt-2 bg-surface-2/30">
          {(['curl', 'javascript', 'python', 'java'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLangTab(lang)}
              className={`px-6 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeLangTab === lang
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
            >
              {lang === 'javascript' ? 'Axios (Node)' : lang === 'python' ? 'Python' : lang === 'java' ? 'Java' : 'cURL'}
            </button>
          ))}
        </div>
        <div className="overflow-y-auto bg-[#0d1117] p-4 min-h-[300px] max-h-[500px] custom-scrollbar">
          <CodeBlock
            code={snippets[activeLangTab]}
            language={activeLangTab === 'curl' ? 'bash' : activeLangTab}
          />
        </div>
      </div>

      {/* Response Console Pane */}
      <div className="flex flex-col border border-border rounded-xl overflow-hidden bg-[#0d1117] shadow-sm">
        <div className="flex items-center justify-between border-b border-border/20 px-6 py-3 bg-[#010409]">
          <span className="text-sm font-semibold text-[#8b949e]">RESPONSE</span>
          {statusCode !== null && (
            <div className="flex items-center gap-4 text-sm">
              <span className="text-[#8b949e] font-mono">Time: {duration}ms</span>
              <span className={`font-mono font-medium px-2.5 py-1 rounded-md ${isSuccessStatus ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                Status: {statusCode} {statusText}
              </span>
            </div>
          )}
        </div>

        <div className="overflow-y-auto min-h-[300px] max-h-[500px]">
          {response ? (
            <div className="p-4">
              <CodeBlock code={response} language="json" />
            </div>
          ) : (
            <div className="h-[300px] flex flex-col gap-3 items-center justify-center text-[#8b949e]">
              <Terminal className="h-8 w-8 opacity-50" />
              <span className="text-sm italic">Click "Send Request" to see the API response.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
