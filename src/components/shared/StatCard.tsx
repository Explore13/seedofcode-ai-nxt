import { cn } from '@/lib/utils';
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from 'lucide-react';

export type TrendDirection = 'up' | 'down' | 'neutral';
export type TrendTone = 'positive' | 'negative' | 'neutral';

interface StatCardProps {
  title: string;
  value: string | number;
  trendValue?: string;
  trendDirection?: TrendDirection;
  trendTone?: TrendTone;
  trendLabel?: string;
  sparkline?: React.ReactNode;
  className?: string;
}

export function StatCard({
  title,
  value,
  trendValue,
  trendDirection = 'neutral',
  trendTone = 'neutral',
  trendLabel,
  sparkline,
  className,
}: StatCardProps) {
  const toneClass =
    trendTone === 'positive'
      ? 'text-success'
      : trendTone === 'negative'
      ? 'text-danger'
      : 'text-muted-foreground';

  return (
    <div className={cn('rounded-card border bg-surface p-6', className)}>
      <h3 className="text-sm font-medium text-subtle-foreground pb-2">
        {title}
      </h3>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold font-mono">{value}</div>
          {trendValue && (
            <p className="text-xs mt-1 flex items-center">
              {trendDirection === 'up' && (
                <ArrowUpIcon className={cn('mr-1 h-3 w-3', toneClass)} />
              )}
              {trendDirection === 'down' && (
                <ArrowDownIcon className={cn('mr-1 h-3 w-3', toneClass)} />
              )}
              {trendDirection === 'neutral' && (
                <MinusIcon className="mr-1 h-3 w-3 text-muted-foreground" />
              )}
              <span className={toneClass}>{trendValue}</span>
              {trendLabel && (
                <span className="text-subtle-foreground ml-1">
                  {trendLabel}
                </span>
              )}
            </p>
          )}
        </div>
        {sparkline && <div className="h-10 w-24 shrink-0">{sparkline}</div>}
      </div>
    </div>
  );
}
