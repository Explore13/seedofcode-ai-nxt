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
      <h1
        id={id}
        className={cn(
          'font-display text-foreground mt-2 scroll-m-20 text-4xl font-bold tracking-tight',
          className,
        )}
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, id, className, ...props }) => (
      <h2
        id={id}
        className={cn(
          'border-border font-display text-foreground mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0',
          className,
        )}
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, id, className, ...props }) => (
      <h3
        id={id}
        className={cn(
          'font-display text-foreground mt-8 scroll-m-20 text-xl font-semibold tracking-tight',
          className,
        )}
        {...props}
      >
        {children}
      </h3>
    ),
    a: ({ href, children, className, ...props }) => {
      const isInternal = href?.startsWith('/');
      if (isInternal) {
        return (
          <Link
            href={href}
            className={cn(
              'text-primary dark:text-chlorophyll font-medium underline underline-offset-4',
              className,
            )}
            {...props}
          >
            {children}
          </Link>
        );
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className={cn(
            'text-primary dark:text-chlorophyll font-medium underline underline-offset-4',
            className,
          )}
          {...props}
        >
          {children}
        </a>
      );
    },
    p: ({ className, ...props }) => (
      <p
        className={cn(
          'text-muted-foreground leading-7 [&:not(:first-child)]:mt-6',
          className,
        )}
        {...props}
      />
    ),
    ul: ({ className, ...props }) => (
      <ul
        className={cn(
          'text-muted-foreground my-6 ml-6 list-disc [&>li]:mt-2',
          className,
        )}
        {...props}
      />
    ),
    ol: ({ className, ...props }) => (
      <ol
        className={cn(
          'text-muted-foreground my-6 ml-6 list-decimal [&>li]:mt-2',
          className,
        )}
        {...props}
      />
    ),
    li: ({ className, ...props }) => (
      <li className={cn('mt-2', className)} {...props} />
    ),
    blockquote: ({ className, ...props }) => (
      <blockquote
        className={cn(
          'border-chlorophyll text-muted-foreground bg-surface-2/50 rounded-r-control mt-6 border-l-2 py-2 pl-6 italic',
          className,
        )}
        {...props}
      />
    ),
    hr: ({ ...props }) => <hr className="border-border my-8" {...props} />,
    table: ({ className, ...props }) => (
      <div className="rounded-card border-border my-6 w-full overflow-y-auto border">
        <table
          className={cn('w-full border-collapse text-left text-sm', className)}
          {...props}
        />
      </div>
    ),
    th: ({ className, ...props }) => (
      <th
        className={cn(
          'border-border text-foreground bg-surface-2 border-b px-4 py-4 font-semibold',
          className,
        )}
        {...props}
      />
    ),
    td: ({ className, ...props }) => (
      <td
        className={cn(
          'border-border text-muted-foreground border-b px-4 py-4',
          className,
        )}
        {...props}
      />
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
          <CodeBlock code={codeString} language={language} />
        </div>
      );
    },
    code: ({ className, children, ...props }) => {
      // If code doesn't have a language class, it's inline code
      if (!className || !className.includes('language-')) {
        return (
          <code
            className={cn(
              'bg-surface-2 text-foreground border-border/50 relative rounded border px-[0.4rem] py-[0.2rem] font-mono text-[0.85rem]',
              className,
            )}
            {...props}
          >
            {children}
          </code>
        );
      }
      // Fallback
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    ...components,
  };
}
