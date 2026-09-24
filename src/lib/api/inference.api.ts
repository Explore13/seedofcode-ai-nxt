import { env } from '@/lib/env';
import type { ChatMessage } from '@/lib/types';

/** Error carrying the HTTP status so callers can branch (e.g. 402 → billing). */
export class InferenceError extends Error {
  readonly status: number | null;
  constructor(message: string, status: number | null) {
    super(message);
    this.name = 'InferenceError';
    this.status = status;
  }
}

interface StreamChatParams {
  model: string;
  messages: ChatMessage[];
  options?: Record<string, unknown>;
}

interface StreamChatHandlers {
  token: string | null;
  signal: AbortSignal;
  onToken: (delta: string) => void;
}

/**
 * Stream a chat completion from `POST /chat/stream` (NestJS `@Sse()`).
 *
 * The endpoint is JWT-guarded and takes a JSON body, so `EventSource` can't be
 * used — we POST with fetch and parse the `text/event-stream` body by hand. Each
 * `data:` frame is a raw Ollama chat chunk (`{ message: { content }, done }`);
 * we forward the incremental `message.content`.
 */
export async function streamChat(
  params: StreamChatParams,
  { token, signal, onToken }: StreamChatHandlers,
): Promise<void> {
  const res = await fetch(`${env.apiBaseUrl}/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(params),
    signal,
  });

  if (!res.ok || !res.body) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.message) message = String(body.message);
    } catch {
      // non-JSON error body; keep the status message
    }
    throw new InferenceError(message, res.status);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE frames are separated by a blank line.
    const frames = buffer.split('\n\n');
    buffer = frames.pop() ?? '';

    for (const frame of frames) {
      const dataLine = frame.split('\n').find((l) => l.startsWith('data:'));
      if (!dataLine) continue;
      const payload = dataLine.slice(5).trim();
      if (!payload || payload === '[DONE]') continue;
      try {
        const chunk = JSON.parse(payload);
        const delta: string | undefined =
          chunk?.message?.content ?? chunk?.response;
        if (delta) onToken(delta);
      } catch {
        // ignore keep-alive / non-JSON frames
      }
    }
  }
}
