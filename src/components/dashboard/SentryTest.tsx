'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api/client';

export function SentryTest() {
  const [apiLoading, setApiLoading] = useState(false);
  const [apiResult, setApiResult] = useState<string | null>(null);

  // 1. TypeError: Accessing property on undefined (Most common JS bug)
  const handleUndefinedError = () => {
    const user: any = null;
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
        reject(new Error('Sentry Test: Background async promise rejected without catch!'));
      }, 100);
    });
  };

  // 4. API Error
  const handleApiError = async () => {
    setApiLoading(true);
    setApiResult(null);
    try {
      await apiClient.get('/test-intentional-sentry-error');
    } catch (err: any) {
      setApiResult(`Error captured: ${err.message || 'API call failed'}`);
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <div className="rounded-card border-border bg-surface border p-6 space-y-4 shadow-sm">
      <div>
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <span>🛠️</span> Sentry Frontend Diagnostics
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Click any button to trigger a real frontend bug and trace it in your Sentry dashboard.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={handleUndefinedError}
          className="rounded-control bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer"
        >
          💥 1. TypeError (null.profile)
        </button>

        <button
          type="button"
          onClick={handleJsonError}
          className="rounded-control bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer"
        >
          🧩 2. Bad JSON.parse
        </button>

        <button
          type="button"
          onClick={handleUnhandledRejection}
          className="rounded-control bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer"
        >
          ⏳ 3. Unhandled Promise
        </button>

        <button
          type="button"
          onClick={handleApiError}
          disabled={apiLoading}
          className="rounded-control bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 px-3.5 py-2 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
        >
          {apiLoading ? 'Testing...' : '📡 4. API Error'}
        </button>
      </div>

      {apiResult && (
        <div className="text-xs font-mono text-muted-foreground bg-surface-2 p-2.5 rounded-control border border-border">
          {apiResult} — <span className="text-emerald-500 font-sans">Sent to Sentry!</span>
        </div>
      )}
    </div>
  );
}
