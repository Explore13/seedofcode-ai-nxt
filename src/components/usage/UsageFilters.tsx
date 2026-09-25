'use client';

import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { CalendarDays, ChevronDown, Filter } from 'lucide-react';
import type { RangePreset, UsageFilterState } from '@/hooks/useUsageFilters';

const PRESETS: { value: Exclude<RangePreset, 'custom'>; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
];

interface UsageFiltersProps {
  filters: UsageFilterState;
  availableModels: string[];
  onPreset: (preset: Exclude<RangePreset, 'custom'>) => void;
  onCustomRange: (from: Date, to: Date) => void;
  onModels: (models: string[]) => void;
}

export function UsageFilters({
  filters,
  availableModels,
  onPreset,
  onCustomRange,
  onModels,
}: UsageFiltersProps) {
  const [range, setRange] = useState<DateRange | undefined>({
    from: filters.from,
    to: filters.to,
  });
  const [calendarOpen, setCalendarOpen] = useState(false);

  function applyRange(next: DateRange | undefined) {
    setRange(next);
    if (next?.from && next?.to) {
      onCustomRange(next.from, next.to);
      setCalendarOpen(false);
    }
  }

  function toggleModel(model: string) {
    const set = new Set(filters.models);
    if (set.has(model)) set.delete(model);
    else set.add(model);
    onModels([...set]);
  }

  const modelLabel =
    filters.models.length === 0
      ? 'All models'
      : filters.models.length === 1
        ? filters.models[0]
        : `${filters.models.length} models`;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Preset pills */}
      <div
        role="group"
        aria-label="Date range preset"
        className="rounded-control border-border inline-flex items-center border p-0.5"
      >
        {PRESETS.map((p) => (
          <button
            key={p.value}
            type="button"
            aria-pressed={filters.preset === p.value}
            onClick={() => onPreset(p.value)}
            className={cn(
              'rounded-[7px] px-3 py-1 text-sm font-medium transition-colors',
              filters.preset === p.value
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom range */}
      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger
          render={
            <Button
              variant={filters.preset === 'custom' ? 'secondary' : 'outline'}
              size="sm"
            />
          }
        >
          <CalendarDays className="h-4 w-4" />
          {filters.preset === 'custom'
            ? `${format(filters.from, 'd MMM')} – ${format(filters.to, 'd MMM')}`
            : 'Custom'}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={filters.from}
            selected={range}
            onSelect={applyRange}
            numberOfMonths={2}
            className="p-3"
          />
        </PopoverContent>
      </Popover>

      {/* Model multi-select */}
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={availableModels.length === 0}
          className="rounded-control border-border text-foreground hover:bg-muted inline-flex h-7 items-center gap-1.5 border px-2.5 text-sm transition-colors disabled:opacity-50"
        >
          <Filter className="h-3.5 w-3.5" />
          {modelLabel}
          <ChevronDown className="text-muted-foreground h-3.5 w-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Filter by model</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {availableModels.map((model) => (
            <DropdownMenuCheckboxItem
              key={model}
              checked={filters.models.includes(model)}
              onClick={(e) => {
                e.preventDefault();
                toggleModel(model);
              }}
              className="font-mono text-xs"
            >
              {model}
            </DropdownMenuCheckboxItem>
          ))}
          {filters.models.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <button
                type="button"
                onClick={() => onModels([])}
                className="text-muted-foreground hover:bg-muted hover:text-foreground w-full rounded-md px-1.5 py-1 text-left text-xs"
              >
                Clear filter
              </button>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
