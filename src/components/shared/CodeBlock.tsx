'use client';

import { cn } from '@/lib/utils';
import { CopyButton } from './CopyButton';

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  code: string;
  language?: string;
}

export function CodeBlock({
  code,
  language = 'bash',
  className,
  ...props
}: CodeBlockProps) {
  return (
    <div
      className={cn(
        'relative group rounded-card border bg-surface-2',
        className
      )}
    >
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
        <CopyButton value={code} className="bg-surface/50 backdrop-blur-sm shadow-sm" />
      </div>
      <pre
        className="overflow-x-auto p-4 text-sm font-mono text-subtle-foreground"
        {...props}
      >
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}
