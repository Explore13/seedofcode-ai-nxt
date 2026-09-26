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
        'rounded-card bg-surface flex flex-col border p-6',
        className,
      )}
    >
      {(title || description) && (
        <div className="mb-6 flex flex-col gap-1">
          {title && <h3 className="text-foreground font-medium">{title}</h3>}
          {description && (
            <p className="text-subtle-foreground text-sm">{description}</p>
          )}
        </div>
      )}
      <div className="min-h-[250px] w-full flex-1">
        {loading ? (
          <Skeleton className="h-full w-full rounded-md" />
        ) : empty ? (
          <EmptyState
            icon={<BarChart3 className="h-8 w-8" />}
            title="No data"
            description={emptyMessage}
            className="bg-surface-2/50 h-full border-none"
          />
        ) : (
          children
        )}
      </div>
    </div>
  );
}
