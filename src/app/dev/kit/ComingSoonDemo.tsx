'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ComingSoonDialog } from '@/components/shared/ComingSoonDialog';

export function ComingSoonDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Coming Soon Dialog</Button>
      <ComingSoonDialog open={open} onOpenChange={setOpen} feature="Pricing & billing" />
    </>
  );
}
