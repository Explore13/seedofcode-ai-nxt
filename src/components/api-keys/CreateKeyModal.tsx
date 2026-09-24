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
import { useCreateApiKey } from '@/hooks/useApiKeys';
import type { ApiKeyMode, CreateApiKeyResult } from '@/lib/types';
import { normalizeError } from '@/lib/api/errors';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Give your key a name')
    .max(100, 'Name cannot exceed 100 characters'),
  mode: z.enum(['live', 'test']),
});

type CreateKeyFields = z.infer<typeof schema>;

interface CreateKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called with the one-time result so the parent can reveal the plaintext. */
  onCreated: (result: CreateApiKeyResult) => void;
}

export function CreateKeyModal({
  open,
  onOpenChange,
  onCreated,
}: CreateKeyModalProps) {
  const create = useCreateApiKey();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateKeyFields>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', mode: 'live' },
  });

  const mode = watch('mode');

  // Reset the form each time the modal is (re)opened.
  useEffect(() => {
    if (open) reset({ name: '', mode: 'live' });
  }, [open, reset]);

  async function onSubmit(data: CreateKeyFields) {
    try {
      const result = await create.mutateAsync(data);
      onOpenChange(false);
      onCreated(result);
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  }

  const modes: { value: ApiKeyMode; label: string; hint: string }[] = [
    { value: 'live', label: 'Live', hint: 'soc_live_… — production traffic' },
    { value: 'test', label: 'Test', hint: 'soc_test_… — safe for experiments' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create API key</DialogTitle>
          <DialogDescription>
            Name your key so you can recognise it later. The secret is shown
            once after creation.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-1.5">
            <label
              htmlFor="key-name"
              className="text-foreground block text-sm font-medium"
            >
              Key name
            </label>
            <Input
              id="key-name"
              autoFocus
              placeholder="e.g. Production server"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'key-name-error' : undefined}
              {...register('name')}
            />
            {errors.name && (
              <p
                id="key-name-error"
                role="alert"
                className="text-danger text-xs"
              >
                {errors.name.message}
              </p>
            )}
          </div>

          <fieldset className="space-y-1.5">
            <legend className="text-foreground mb-1.5 block text-sm font-medium">
              Mode
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {modes.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() =>
                    setValue('mode', m.value, { shouldValidate: true })
                  }
                  aria-pressed={mode === m.value}
                  className={cn(
                    'rounded-control flex flex-col items-start gap-0.5 border px-3 py-2 text-left transition-colors',
                    mode === m.value
                      ? 'border-chlorophyll bg-chlorophyll/10'
                      : 'border-border hover:bg-muted',
                  )}
                >
                  <span className="text-foreground text-sm font-medium">
                    {m.label}
                  </span>
                  <span className="text-muted-foreground font-mono text-[11px]">
                    {m.hint}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={create.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending && (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              )}
              Create key
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
