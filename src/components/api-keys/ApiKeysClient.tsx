'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';
import { useApiKeys, useUpdateApiKey } from '@/hooks/useApiKeys';
import { normalizeError } from '@/lib/api/errors';
import type { ApiKey, CreateApiKeyResult } from '@/lib/types';
import { ApiKeyTable, ApiKeyTableSkeleton } from './ApiKeyTable';
import { CreateKeyModal } from './CreateKeyModal';
import { RevealKeyDialog } from './RevealKeyDialog';
import { RenameKeyModal } from './RenameKeyModal';
import { RegenerateKeyDialog } from './RegenerateKeyDialog';
import { DeleteKeyDialog } from './DeleteKeyDialog';
import { KeyRound, Plus, AlertCircle } from 'lucide-react';

const MAX_ACTIVE_KEYS = 10;

export function ApiKeysClient() {
  const { data: keys, isLoading, isError, refetch } = useApiKeys();
  const update = useUpdateApiKey();

  const [createOpen, setCreateOpen] = useState(false);
  const [reveal, setReveal] = useState<{ rawKey: string; name: string } | null>(
    null,
  );
  const [renameTarget, setRenameTarget] = useState<ApiKey | null>(null);
  const [regenTarget, setRegenTarget] = useState<ApiKey | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiKey | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const activeCount = keys?.filter((k) => k.isActive).length ?? 0;
  const limitReached = activeCount >= MAX_ACTIVE_KEYS;

  function handleCreated(result: CreateApiKeyResult) {
    setReveal({ rawKey: result.rawKey, name: result.apiKey.name });
  }

  async function handleToggleActive(key: ApiKey) {
    if (!key.isActive && limitReached) {
      toast.error(`You can have at most ${MAX_ACTIVE_KEYS} active keys.`);
      return;
    }
    setTogglingId(key.id);
    try {
      await update.mutateAsync({
        id: key.id,
        payload: { isActive: !key.isActive },
      });
      toast.success(key.isActive ? 'Key disabled' : 'Key enabled');
    } catch (err) {
      toast.error(normalizeError(err).message);
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-display-sm text-foreground font-semibold tracking-tight">
            API Keys
          </h1>
          <p className="text-muted-foreground mt-2 max-w-prose">
            Create and manage the keys your applications use to call the API.
            Secrets are shown only once — store them somewhere safe.
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          disabled={limitReached || isLoading}
          className="shrink-0"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Create key
        </Button>
      </div>

      {!isLoading && !isError && keys && keys.length > 0 && (
        <p className="text-muted-foreground text-xs">
          {activeCount} of {MAX_ACTIVE_KEYS} active keys used.
          {limitReached && ' Disable or delete a key to create a new one.'}
        </p>
      )}

      {isLoading && <ApiKeyTableSkeleton />}

      {isError && (
        <EmptyState
          icon={<AlertCircle className="h-8 w-8" />}
          title="Couldn't load your keys"
          description="Something went wrong fetching your API keys. Please try again."
        >
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </EmptyState>
      )}

      {!isLoading && !isError && keys && keys.length === 0 && (
        <EmptyState
          icon={<KeyRound className="h-8 w-8" />}
          title="No API keys yet"
          description="Create your first API key to start calling the API."
        >
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            Create your first key
          </Button>
        </EmptyState>
      )}

      {!isLoading && !isError && keys && keys.length > 0 && (
        <ApiKeyTable
          keys={keys}
          togglingId={togglingId}
          onRename={setRenameTarget}
          onToggleActive={handleToggleActive}
          onRegenerate={setRegenTarget}
          onDelete={setDeleteTarget}
        />
      )}

      {/* Dialogs */}
      <CreateKeyModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={handleCreated}
      />
      <RevealKeyDialog
        rawKey={reveal?.rawKey ?? null}
        keyName={reveal?.name}
        onClose={() => setReveal(null)}
      />
      <RenameKeyModal
        apiKey={renameTarget}
        onClose={() => setRenameTarget(null)}
      />
      <RegenerateKeyDialog
        apiKey={regenTarget}
        onClose={() => setRegenTarget(null)}
        onRegenerated={(rawKey, name) => setReveal({ rawKey, name })}
      />
      <DeleteKeyDialog
        apiKey={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
