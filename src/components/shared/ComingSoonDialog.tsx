'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { env } from '@/lib/env';

interface ComingSoonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: string;
}

export function ComingSoonDialog({
  open,
  onOpenChange,
  feature = 'Pricing & credits',
}: ComingSoonDialogProps) {
  // Try to use the configured contact email, fallback if not set.
  const email = env.contactEmail || 'support@ai.seedofcode.dev';
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">{feature} — Coming Soon</DialogTitle>
          <DialogDescription className="text-subtle-foreground pt-2">
            Self-serve billing is on the way. For now, credits are provisioned
            manually — reach out and we&apos;ll top you up.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end pt-4">
          <Button render={<a href={`mailto:${email}?subject=SeedOfCode%20Credits`} />}>
            Contact Us
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
