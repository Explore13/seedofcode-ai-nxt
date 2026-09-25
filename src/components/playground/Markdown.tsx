'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from '@/components/shared/CodeBlock';

interface MarkdownProps {
  content: string;
}

// Ensure unclosed code blocks are closed while streaming, so they render properly
function preprocessMarkdown(content: string) {
  const codeBlockCount = (content.match(/```/g) || []).length;
  if (codeBlockCount % 2 !== 0) {
    return content + '\n```';
  }
  return content;
}

export function Markdown({ content }: MarkdownProps) {
  const safeContent = preprocessMarkdown(content);

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none break-words leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pre({ children }: any) {
            // Block code is always wrapped in <pre> by standard markdown.
            // We intercept it and pull the <code> element's props to render CodeBlock.
            const codeProps = children?.props || {};
            const match = /language-(\w+)/.exec(codeProps.className || '');
            const lang = match ? match[1] : '';
            return (
              <CodeBlock
                code={String(codeProps.children).replace(/\n$/, '')}
                language={lang || 'text'}
                className="my-4"
              />
            );
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
          code({ className, children, ...props }: any) {
            // Since we intercept <pre>, this only runs for inline <code> elements.
            return (
              <code
                className="bg-foreground/10 rounded px-1.5 py-0.5 font-mono text-[0.85em]"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {safeContent}
      </ReactMarkdown>
    </div>
  );
}
