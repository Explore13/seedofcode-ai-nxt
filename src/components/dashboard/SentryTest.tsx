'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api/client';

export function SentryTest() {
  const [apiLoading, setApiLoading] = useState(false);
  const [apiResult, setApiResult] = useState<string | null>(null);

  // 1. TypeError: Accessing property on undefined (Most common JS bug)
  const handleUndefinedError = () => {
    const user = null as unknown as {
      profile: { settings: { theme: string } };
    };
    // This will throw: Cannot read properties of null (reading 'profile')
    return user.profile.settings.theme;
  };

  // 2. SyntaxError: Corrupted JSON parsing (e.g. from localStorage/cookies)
  const handleJsonError = () => {
    JSON.parse('invalid_json_data_{test: 123');
  };

  // 3. Unhandled Async Promise Rejection
  const handleUnhandledRejection = () => {
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(
          new Error(
            'Sentry Test: Background async promise rejected without catch!',
          ),
        );
      }, 100);
    });
  };

  // 4. API Error
  const handleApiError = async () => {
    setApiLoading(true);
    setApiResult(null);
    try {
      await apiClient.get('/test-intentional-sentry-error');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'API call failed';
      setApiResult(`Error captured: ${message}`);
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <div className="rounded-card border-border bg-surface space-y-4 border p-6 shadow-sm">
      <div>
        <h3 className="text-foreground flex items-center gap-2 text-base font-semibold">
          <span>🛠️</span> Sentry Frontend Diagnostics
        </h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Click any button to trigger a real frontend bug and trace it in your
          Sentry dashboard.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={handleUndefinedError}
          className="rounded-control cursor-pointer border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-500 transition-colors hover:bg-red-500/20"
        >
          💥 1. TypeError (null.profile)
        </button>

        <button
          type="button"
          onClick={handleJsonError}
          className="rounded-control cursor-pointer border border-purple-500/30 bg-purple-500/10 px-3.5 py-2 text-xs font-semibold text-purple-400 transition-colors hover:bg-purple-500/20"
        >
          🧩 2. Bad JSON.parse
        </button>

        <button
          type="button"
          onClick={handleUnhandledRejection}
          className="rounded-control cursor-pointer border border-blue-500/30 bg-blue-500/10 px-3.5 py-2 text-xs font-semibold text-blue-400 transition-colors hover:bg-blue-500/20"
        >
          ⏳ 3. Unhandled Promise
        </button>

        <button
          type="button"
          onClick={handleApiError}
          disabled={apiLoading}
          className="rounded-control cursor-pointer border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-500 transition-colors hover:bg-amber-500/20 disabled:opacity-50"
        >
          {apiLoading ? 'Testing...' : '📡 4. API Error'}
        </button>
      </div>

      {apiResult && (
        <div className="text-muted-foreground bg-surface-2 rounded-control border-border border p-2.5 font-mono text-xs">
          {apiResult} —{' '}
          <span className="font-sans text-emerald-500">Sent to Sentry!</span>
        </div>
      )}
    </div>
  );
}
