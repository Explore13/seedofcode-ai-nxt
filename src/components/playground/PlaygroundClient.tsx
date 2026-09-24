'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EmptyState } from '@/components/shared/EmptyState';
import { ComingSoonDialog } from '@/components/shared/ComingSoonDialog';
import { useModels } from '@/hooks/useModels';
import { useAuthStore } from '@/store/auth.store';
import { InferenceError, streamChat } from '@/lib/api/inference.api';
import type { ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Loader2, Send, Sparkles, Square, Trash2 } from 'lucide-react';

export function PlaygroundClient() {
  const { data: models, isLoading: modelsLoading } = useModels();
  const token = useAuthStore((s) => s.accessToken);

  const enabledModels = useMemo(
    () => (models ?? []).filter((m) => m.enabled),
    [models],
  );

  const [model, setModel] = useState<string>('');
  const [system, setSystem] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [billingOpen, setBillingOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Default to the first enabled model once loaded.
  useEffect(() => {
    if (!model && enabledModels.length > 0) setModel(enabledModels[0].name);
  }, [enabledModels, model]);

  // Keep the transcript scrolled to the newest content.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  function stop() {
    abortRef.current?.abort();
    abortRef.current = null;
    setStreaming(false);
  }

  async function send() {
    const text = input.trim();
    if (!text || !model || streaming) return;

    const outgoing: ChatMessage[] = [
      ...(system.trim()
        ? [{ role: 'system' as const, content: system.trim() }]
        : []),
      ...messages,
      { role: 'user', content: text },
    ];
    // Display list (without the system message) + a placeholder assistant turn.
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: text },
      { role: 'assistant', content: '' },
    ]);
    setInput('');
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await streamChat(
        { model, messages: outgoing },
        {
          token,
          signal: controller.signal,
          onToken: (delta) => {
            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              if (last?.role === 'assistant') {
                next[next.length - 1] = {
                  ...last,
                  content: last.content + delta,
                };
              }
              return next;
            });
          },
        },
      );
    } catch (err) {
      if (controller.signal.aborted) {
        // user-initiated stop — leave the partial response in place
      } else if (err instanceof InferenceError && err.status === 402) {
        setBillingOpen(true);
        setMessages((prev) => prev.slice(0, -1)); // drop the empty assistant turn
      } else {
        const message =
          err instanceof Error ? err.message : 'Generation failed';
        toast.error(message);
        setMessages((prev) => prev.slice(0, -1));
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  function clear() {
    stop();
    setMessages([]);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-4rem)] max-w-4xl flex-col gap-4 p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-display-sm text-foreground font-semibold tracking-tight">
            Playground
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Test models interactively with streaming responses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={model}
            onValueChange={(v) => setModel(v ?? '')}
            disabled={modelsLoading || streaming}
          >
            <SelectTrigger className="w-56">
              <SelectValue
                placeholder={
                  modelsLoading ? 'Loading models…' : 'Select a model'
                }
              />
            </SelectTrigger>
            <SelectContent>
              {enabledModels.map((m) => (
                <SelectItem
                  key={m.id}
                  value={m.name}
                  className="font-mono text-xs"
                >
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={clear}
            disabled={messages.length === 0}
            aria-label="Clear conversation"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* System prompt */}
      <Textarea
        value={system}
        onChange={(e) => setSystem(e.target.value)}
        placeholder="Optional system prompt (e.g. You are a helpful coding assistant.)"
        rows={2}
        disabled={streaming}
        className="shrink-0 resize-none"
      />

      {/* Transcript */}
      <div
        ref={scrollRef}
        className="rounded-card border-border bg-surface flex-1 space-y-4 overflow-y-auto border p-4"
      >
        {messages.length === 0 ? (
          <EmptyState
            icon={<Sparkles className="h-8 w-8" />}
            title="Start a conversation"
            description="Pick a model, type a message, and watch the response stream in."
            className="h-full border-none bg-transparent"
          />
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                'flex',
                m.role === 'user' ? 'justify-end' : 'justify-start',
              )}
            >
              <div
                className={cn(
                  'rounded-control max-w-[80%] px-3 py-2 text-sm whitespace-pre-wrap',
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-surface-2 text-foreground',
                )}
              >
                {m.content ||
                  (streaming && i === messages.length - 1 ? (
                    <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                  ) : (
                    ''
                  ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Composer */}
      <div className="flex shrink-0 items-end gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Send a message…  (Enter to send, Shift+Enter for newline)"
          rows={2}
          disabled={!model}
          className="resize-none"
        />
        {streaming ? (
          <Button
            variant="outline"
            onClick={stop}
            className="h-auto self-stretch"
          >
            <Square className="h-4 w-4" />
            Stop
          </Button>
        ) : (
          <Button
            onClick={send}
            disabled={!input.trim() || !model}
            className="h-auto self-stretch"
          >
            <Send className="h-4 w-4" />
            Send
          </Button>
        )}
      </div>

      <ComingSoonDialog
        open={billingOpen}
        onOpenChange={setBillingOpen}
        feature="Billing & credits"
      />
    </div>
  );
}
