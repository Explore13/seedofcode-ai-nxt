'use client';

import { ChartFrame } from '@/components/shared/ChartFrame';
import type { HeatmapData } from '@/lib/usage/aggregate';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const FULL_DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const HOUR_TICKS = [0, 6, 12, 18];

function hourLabel(h: number): string {
  if (h === 0) return '12am';
  if (h === 12) return '12pm';
  return h < 12 ? `${h}am` : `${h - 12}pm`;
}

interface Props {
  heatmap: HeatmapData;
}

export function PeakHoursHeatmap({ heatmap }: Props) {
  const { grid, max } = heatmap;

  return (
    <ChartFrame
      title="Peak Hours"
      description="Requests by day of week and hour"
      empty={max === 0}
      emptyMessage="No requests to map in this period."
    >
      <div className="overflow-x-auto">
        <div className="min-w-[520px]">
          {DAYS.map((day, d) => (
            <div key={day} className="flex items-center gap-1">
              <span className="text-muted-foreground w-8 shrink-0 text-right text-[11px]">
                {day}
              </span>
              <div className="flex flex-1 gap-[3px] py-[2px]">
                {grid[d].map((count, h) => {
                  const intensity =
                    max > 0 && count > 0 ? 0.15 + 0.85 * (count / max) : 0;
                  return (
                    <div
                      key={h}
                      title={`${FULL_DAYS[d]} ${hourLabel(h)} — ${count} request${count === 1 ? '' : 's'}`}
                      className="border-border/40 aspect-square flex-1 rounded-[3px] border"
                      style={{
                        backgroundColor:
                          intensity > 0
                            ? 'var(--color-chlorophyll)'
                            : 'var(--color-surface-2)',
                        opacity: intensity > 0 ? intensity : 1,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
          {/* Hour axis */}
          <div className="mt-1 flex items-center gap-1">
            <span className="w-8 shrink-0" />
            <div className="relative flex-1">
              {HOUR_TICKS.map((h) => (
                <span
                  key={h}
                  className="text-muted-foreground absolute text-[10px]"
                  style={{ left: `${(h / 24) * 100}%` }}
                >
                  {hourLabel(h)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ChartFrame>
  );
}
