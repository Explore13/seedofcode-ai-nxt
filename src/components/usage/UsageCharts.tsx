'use client';

import { useMemo } from 'react';
import {
  bucketByDay,
  bucketByHourWeekday,
  bucketByModel,
} from '@/lib/usage/aggregate';
import type { UsageLog } from '@/lib/types';
import { PeakHoursHeatmap } from './PeakHoursHeatmap';
import { ModelUsageDonut } from './ModelUsageDonut';
import { DailyTokenBarChart } from './DailyTokenBarChart';
import { CreditBurnAreaChart } from './CreditBurnAreaChart';
import { RequestSuccessRateChart } from './RequestSuccessRateChart';
import { LatencyLineChart } from './LatencyLineChart';

interface Props {
  /** Rows already filtered to the selected range + model. */
  rows: UsageLog[];
  from: Date;
  to: Date;
}

/**
 * The six usage charts. Imported lazily (client-only) so Recharts ships only on
 * the `/usage` route. All aggregation is memoized over the filtered rows.
 */
export default function UsageCharts({ rows, from, to }: Props) {
  const daily = useMemo(() => bucketByDay(rows, from, to), [rows, from, to]);
  const heatmap = useMemo(() => bucketByHourWeekday(rows), [rows]);
  const models = useMemo(() => bucketByModel(rows), [rows]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PeakHoursHeatmap heatmap={heatmap} />
        <ModelUsageDonut models={models} />
      </div>
      <DailyTokenBarChart daily={daily} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CreditBurnAreaChart daily={daily} />
        <RequestSuccessRateChart daily={daily} />
      </div>
      <LatencyLineChart daily={daily} />
    </div>
  );
}
