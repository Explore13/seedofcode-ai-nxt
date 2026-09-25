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
  icon?: React.ReactNode;
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
  icon,
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
    <div
      className={cn(
        'rounded-card border-border bg-surface border p-6 shadow-[0_1px_2px_rgba(18,48,36,0.04)] dark:shadow-none',
        className,
      )}
    >
      <h3 className="text-subtle-foreground pb-2 text-sm font-medium">
        {title}
      </h3>
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2">
            {icon && <div className="text-muted-foreground">{icon}</div>}
            <div className="font-mono text-2xl font-bold">{value}</div>
          </div>
          {trendValue && (
            <p className="mt-1 flex items-center text-xs">
              {trendDirection === 'up' && (
                <ArrowUpIcon className={cn('mr-1 h-3 w-3', toneClass)} />
              )}
              {trendDirection === 'down' && (
                <ArrowDownIcon className={cn('mr-1 h-3 w-3', toneClass)} />
              )}
              {trendDirection === 'neutral' && (
                <MinusIcon className="text-muted-foreground mr-1 h-3 w-3" />
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
