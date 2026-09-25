'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Input } from '@/components/ui/input';
import { useUpdateApiKey } from '@/hooks/useApiKeys';
import type { ApiKey } from '@/lib/types';
import { normalizeError } from '@/lib/api/errors';
import { Loader2 } from 'lucide-react';

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Give your key a name')
    .max(100, 'Name cannot exceed 100 characters'),
});

type RenameFields = z.infer<typeof schema>;

interface RenameKeyModalProps {
  /** The key to rename. When null the dialog is closed. */
  apiKey: ApiKey | null;
  onClose: () => void;
}

export function RenameKeyModal({ apiKey, onClose }: RenameKeyModalProps) {
  const update = useUpdateApiKey();
  const open = apiKey !== null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RenameFields>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (apiKey) reset({ name: apiKey.name });
  }, [apiKey, reset]);

  async function onSubmit(data: RenameFields) {
    if (!apiKey) return;
    if (data.name === apiKey.name) {
      onClose();
      return;
    }
    try {
      await update.mutateAsync({ id: apiKey.id, payload: { name: data.name } });
      toast.success('Key renamed');
      onClose();
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rename API key</DialogTitle>
          <DialogDescription>
            This only changes the display name — the key itself is unchanged.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-1.5">
            <label
              htmlFor="rename-key"
              className="text-foreground block text-sm font-medium"
            >
              Key name
            </label>
            <Input
              id="rename-key"
              autoFocus
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'rename-key-error' : undefined}
              {...register('name')}
            />
            {errors.name && (
              <p
                id="rename-key-error"
                role="alert"
                className="text-danger text-xs"
              >
                {errors.name.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={update.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={update.isPending}>
              {update.isPending && (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              )}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
