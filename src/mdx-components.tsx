import type { MDXComponents } from 'mdx/types';
import { CodeBlock } from '@/components/shared/CodeBlock';
import { CodeTabs } from '@/components/shared/CodeTabs';
import { ApiTester } from '@/components/shared/ApiTester';
import { cn } from '@/lib/cn';
import Link from 'next/link';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    CodeTabs,
    ApiTester,
    h1: ({ children, id, className, ...props }) => (
      <h1 id={id} className={cn("mt-2 scroll-m-20 font-display text-4xl font-bold tracking-tight text-foreground", className)} {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, id, className, ...props }) => (
      <h2 id={id} className={cn("mt-12 scroll-m-20 border-b border-border pb-2 font-display text-2xl font-semibold tracking-tight text-foreground first:mt-0", className)} {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, id, className, ...props }) => (
      <h3 id={id} className={cn("mt-8 scroll-m-20 font-display text-xl font-semibold tracking-tight text-foreground", className)} {...props}>
        {children}
      </h3>
    ),
    a: ({ href, children, className, ...props }) => {
      const isInternal = href?.startsWith('/');
      if (isInternal) {
        return (
          <Link href={href} className={cn("font-medium text-primary underline underline-offset-4 dark:text-chlorophyll", className)} {...props}>
            {children}
          </Link>
        );
      }
      return (
        <a href={href} target="_blank" rel="noreferrer" className={cn("font-medium text-primary underline underline-offset-4 dark:text-chlorophyll", className)} {...props}>
          {children}
        </a>
      );
    },
    p: ({ className, ...props }) => (
      <p className={cn("leading-7 [&:not(:first-child)]:mt-6 text-muted-foreground", className)} {...props} />
    ),
    ul: ({ className, ...props }) => (
      <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2 text-muted-foreground", className)} {...props} />
    ),
    ol: ({ className, ...props }) => (
      <ol className={cn("my-6 ml-6 list-decimal [&>li]:mt-2 text-muted-foreground", className)} {...props} />
    ),
    li: ({ className, ...props }) => (
      <li className={cn("mt-2", className)} {...props} />
    ),
    blockquote: ({ className, ...props }) => (
      <blockquote className={cn("mt-6 border-l-2 border-chlorophyll pl-6 italic text-muted-foreground bg-surface-2/50 py-2 rounded-r-control", className)} {...props} />
    ),
    hr: ({ ...props }) => <hr className="my-8 border-border" {...props} />,
    table: ({ className, ...props }) => (
      <div className="my-6 w-full overflow-y-auto rounded-card border border-border">
        <table className={cn("w-full border-collapse text-sm text-left", className)} {...props} />
      </div>
    ),
    th: ({ className, ...props }) => (
      <th className={cn("border-b border-border py-4 px-4 font-semibold text-foreground bg-surface-2", className)} {...props} />
    ),
    td: ({ className, ...props }) => (
      <td className={cn("border-b border-border py-4 px-4 text-muted-foreground", className)} {...props} />
    ),
    pre: ({ children, ..._props }) => {
      let codeString = '';
      let language = 'bash';

      if (children && typeof children === 'object' && 'props' in children) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const childProps = (children as any).props;
        if (typeof childProps.children === 'string') {
          codeString = childProps.children.trim();
        } else if (Array.isArray(childProps.children)) {
          codeString = childProps.children.join('').trim();
        }
        
        if (childProps.className && typeof childProps.className === 'string') {
          language = childProps.className.replace('language-', '');
        }
      }

      return (
        <div className="not-prose my-6">
          <CodeBlock 
            code={codeString} 
            language={language}
          />
        </div>
      );
    },
    code: ({ className, children, ...props }) => {
      // If code doesn't have a language class, it's inline code
      if (!className || !className.includes('language-')) {
        return (
          <code className={cn("relative rounded bg-surface-2 px-[0.4rem] py-[0.2rem] font-mono text-[0.85rem] text-foreground border border-border/50", className)} {...props}>
            {children}
          </code>
        );
      }
      // Fallback
      return <code className={className} {...props}>{children}</code>;
    },
    ...components,
  };
}
