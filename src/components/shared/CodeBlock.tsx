/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { cn } from '@/lib/utils';
import { CopyButton } from './CopyButton';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
        'relative group rounded-card border border-[#24382c] bg-[#0d1117]',
        className
      )}
    >
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100 z-10">
        <CopyButton value={code} className="text-[#8b949e] hover:text-[#c9d1d9] bg-transparent border-none shadow-none" />
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          background: 'transparent',
          padding: '1rem',
          fontSize: '0.875rem',
        }}
        {...(props as any)}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
