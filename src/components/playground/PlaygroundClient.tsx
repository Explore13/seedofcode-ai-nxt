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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { ComingSoonDialog } from '@/components/shared/ComingSoonDialog';
import { Markdown } from './Markdown';
import { useModels } from '@/hooks/useModels';
import { useAuthStore } from '@/store/auth.store';
import { InferenceError, streamChat } from '@/lib/api/inference.api';
import type { ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Send, Sparkles, Square, Settings, Zap } from 'lucide-react';

function ThinkingIndicator() {
  const phrases = [
    "Synthesizing...",
    "Let him cook...",
    "Vibing with the prompt...",
    "Doing the math...",
    "Cooking up some tokens...",
    "Hold up, I'm cooking...",
    "Gathering the lore..."
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % phrases.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [phrases.length]);

  return (
    <div className="flex w-fit items-center gap-2 py-1.5">
      <div className="relative flex h-3.5 w-3.5 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 opacity-75"></span>
        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
      </div>
      <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-xs font-semibold tracking-wide text-transparent animate-pulse transition-all duration-300">
        {phrases[index]}
      </span>
    </div>
  );
}

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
  const [systemPromptOpen, setSystemPromptOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
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
      ...messages.map(({ role, content }) => ({ role, content })),
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
          onChunk: (chunk) => {
            if (chunk?.done && (chunk.eval_count || chunk.total_duration)) {
              setMessages((prev) => {
                const next = [...prev];
                const last = next[next.length - 1];
                if (last?.role === 'assistant') {
                  const durationMs = chunk.total_duration
                    ? Math.round(chunk.total_duration / 1000000)
                    : undefined;
                  const tokens = chunk.eval_count;

                  next[next.length - 1] = {
                    ...last,
                    stats: { tokens, durationMs }
                  };
                }
                return next;
              });
            }
          }
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
    setClearDialogOpen(false);
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
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Playground settings"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-input bg-transparent hover:bg-surface-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Settings className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSystemPromptOpen(true)}>
                System Prompt
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (messages.length > 0) setClearDialogOpen(true);
                }}
                disabled={messages.length === 0}
                className="text-danger focus:text-danger focus:bg-danger/10"
              >
                Clear Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={systemPromptOpen} onOpenChange={setSystemPromptOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>System Prompt</DialogTitle>
            <DialogDescription>
              Set the foundational instructions for the model.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={system}
            onChange={(e) => setSystem(e.target.value)}
            placeholder="e.g. You are a helpful coding assistant."
            rows={4}
            disabled={streaming}
            className="bg-surface dark:bg-surface-2 dark:border-border dark:text-foreground mt-2 resize-none"
          />
          <div className="flex justify-end mt-4">
            <Button onClick={() => setSystemPromptOpen(false)}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Clear Chat</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this entire conversation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setClearDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={clear}>Clear</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transcript */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto px-1 py-4"
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
                  'rounded-control max-w-[85%] text-sm px-3 py-2',
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground whitespace-pre-wrap'
                    : 'text-foreground px-0',
                )}
              >
                {m.role === 'user' ? (
                  m.content
                ) : m.content ? (
                  <>
                    <Markdown content={m.content} />
                    {m.stats && (
                      <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground/80 pt-2 border-t border-border/50">
                        <Zap className="h-3 w-3 text-primary/70" />
                        Cooked for {(m.stats.durationMs! / 1000).toFixed(1)}s
                        {m.stats.tokens && ` · ${m.stats.tokens} tokens spent`}
                      </div>
                    )}
                  </>
                ) : streaming && i === messages.length - 1 ? (
                  <ThinkingIndicator />
                ) : (
                  ''
                )}
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
          className="bg-surface dark:bg-surface-2 dark:border-border dark:text-foreground focus-visible:ring-primary resize-none"
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
