'use client';

import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRegenerateApiKey } from '@/hooks/useApiKeys';
import type { ApiKey } from '@/lib/types';
import { normalizeError } from '@/lib/api/errors';
import { maskApiKey } from '@/lib/format';
import { Loader2 } from 'lucide-react';

interface RegenerateKeyDialogProps {
  /** The key to regenerate. When null the dialog is closed. */
  apiKey: ApiKey | null;
  onClose: () => void;
  /** Called with the new one-time plaintext so the parent can reveal it. */
  onRegenerated: (rawKey: string, keyName: string) => void;
}

export function RegenerateKeyDialog({
  apiKey,
  onClose,
  onRegenerated,
}: RegenerateKeyDialogProps) {
  const regen = useRegenerateApiKey();
  const open = apiKey !== null;

  async function handleRegenerate() {
    if (!apiKey) return;
    try {
      const { rawKey } = await regen.mutateAsync(apiKey.id);
      const name = apiKey.name;
      onClose();
      onRegenerated(rawKey, name);
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Regenerate API key</DialogTitle>
          <DialogDescription>
            {apiKey && (
              <>
                A new secret will replace{' '}
                <span className="text-foreground font-medium">
                  {apiKey.name}
                </span>{' '}
                (
                <span className="font-mono">
                  {maskApiKey(apiKey.keyPrefix)}
                </span>
                ). The current key stops working immediately and the new one is
                shown only once.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={regen.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleRegenerate}
            disabled={regen.isPending}
          >
            {regen.isPending && (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            )}
            Regenerate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
