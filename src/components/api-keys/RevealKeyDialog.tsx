'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/shared/CopyButton';
import { AlertTriangle } from 'lucide-react';

interface RevealKeyDialogProps {
  /** The one-time plaintext key. When null the dialog is closed. */
  rawKey: string | null;
  /** Name of the key being revealed (for context in the header). */
  keyName?: string;
  onClose: () => void;
}

/**
 * Shows a freshly-created or regenerated plaintext key exactly once.
 * The user must tick the acknowledgement before the dialog can be dismissed —
 * the secret is never retrievable again after this.
 */
export function RevealKeyDialog({
  rawKey,
  keyName,
  onClose,
}: RevealKeyDialogProps) {
  const [acknowledged, setAcknowledged] = useState(false);
  const open = rawKey !== null;

  function handleOpenChange(next: boolean) {
    if (!next) {
      if (!acknowledged) return;
      // Reset for the next reveal only after the dialog fully closes.
      setAcknowledged(false);
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your new API key</DialogTitle>
          <DialogDescription>
            {keyName ? (
              <>
                Copy the key for{' '}
                <span className="text-foreground font-medium">{keyName}</span>{' '}
                now.
              </>
            ) : (
              'Copy this key now.'
            )}{' '}
            You won&apos;t be able to see it again.
          </DialogDescription>
        </DialogHeader>

        <div className="min-w-0 rounded-control border-harvest/40 bg-harvest/10 text-harvest flex items-center gap-2 border px-3 py-2 text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            Store it in a safe place — this is the only time it&apos;s shown.
          </span>
        </div>

        <div className="min-w-0 rounded-control border-border bg-surface-2 flex items-center gap-2 border p-2">
          <code className="text-foreground flex-1 min-w-0 px-1 font-mono text-sm break-all">
            {rawKey}
          </code>
          {rawKey && <CopyButton value={rawKey} />}
        </div>

        <label className="text-muted-foreground flex cursor-pointer items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="accent-chlorophyll mt-0.5 h-4 w-4"
          />
          I have copied my API key and stored it securely.
        </label>

        <DialogFooter>
          <Button
            type="button"
            disabled={!acknowledged}
            onClick={() => handleOpenChange(false)}
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
