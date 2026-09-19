import { Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  children,
  className,
  icon,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-card border border-dashed p-10 text-center animate-in fade-in zoom-in-95 duration-300',
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-2 text-chlorophyll mb-4">
        {icon || <Leaf className="h-8 w-8" />}
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-subtle-foreground">
        {description}
      </p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
