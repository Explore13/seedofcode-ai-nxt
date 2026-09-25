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
import { useDeleteApiKey } from '@/hooks/useApiKeys';
import type { ApiKey } from '@/lib/types';
import { normalizeError } from '@/lib/api/errors';
import { maskApiKey } from '@/lib/format';
import { Loader2 } from 'lucide-react';

interface DeleteKeyDialogProps {
  /** The key to delete. When null the dialog is closed. */
  apiKey: ApiKey | null;
  onClose: () => void;
}

export function DeleteKeyDialog({ apiKey, onClose }: DeleteKeyDialogProps) {
  const del = useDeleteApiKey();
  const open = apiKey !== null;

  async function handleDelete() {
    if (!apiKey) return;
    try {
      await del.mutateAsync(apiKey.id);
      toast.success('API key deleted');
      onClose();
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete API key</DialogTitle>
          <DialogDescription>
            {apiKey && (
              <>
                <span className="text-foreground font-medium">
                  {apiKey.name}
                </span>{' '}
                (
                <span className="font-mono">
                  {maskApiKey(apiKey.keyPrefix)}
                </span>
                ) will stop working immediately. Any application using it will
                start receiving 401 errors. This cannot be undone.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={del.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={del.isPending}
          >
            {del.isPending && (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            )}
            Delete key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
