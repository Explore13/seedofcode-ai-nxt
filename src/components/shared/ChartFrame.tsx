import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from './EmptyState';
import { BarChart3 } from 'lucide-react';

interface ChartFrameProps {
  title?: string;
  description?: string;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  className?: string;
  children: React.ReactNode;
}

export function ChartFrame({
  title,
  description,
  loading,
  empty,
  emptyMessage = 'No data available for this period.',
  className,
  children,
}: ChartFrameProps) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-card border bg-surface p-6',
        className
      )}
    >
      {(title || description) && (
        <div className="mb-6 flex flex-col gap-1">
          {title && <h3 className="font-medium text-foreground">{title}</h3>}
          {description && (
            <p className="text-sm text-subtle-foreground">{description}</p>
          )}
        </div>
      )}
      <div className="flex-1 min-h-[250px] w-full">
        {loading ? (
          <Skeleton className="h-full w-full rounded-md" />
        ) : empty ? (
          <EmptyState
            icon={<BarChart3 className="h-8 w-8" />}
            title="No data"
            description={emptyMessage}
            className="h-full border-none bg-surface-2/50"
          />
        ) : (
          children
        )}
      </div>
    </div>
  );
}
