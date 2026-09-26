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
        'rounded-card animate-in fade-in zoom-in-95 flex flex-col items-center justify-center border border-dashed p-10 text-center duration-300',
        className,
      )}
    >
      <div className="bg-surface-2 text-chlorophyll mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        {icon || <Leaf className="h-8 w-8" />}
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-subtle-foreground mt-1 max-w-sm text-sm">
        {description}
      </p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
