import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CodeBlock } from '@/components/shared/CodeBlock';
import { CopyButton } from '@/components/shared/CopyButton';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatCard } from '@/components/shared/StatCard';
import { ChartFrame } from '@/components/shared/ChartFrame';
import { Leaf } from 'lucide-react';
import { ComingSoonDemo } from './ComingSoonDemo';

export const metadata = {
  title: 'Component Kit (Dev)',
};

export default function DevKitPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-12 p-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-text-display-sm text-foreground">
            UI Kit
          </h1>
          <p className="text-subtle-foreground mt-2">
            Shared components for the Greenhouse design system.
          </p>
        </div>
        <ThemeToggle />
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-medium border-b border-border pb-2">
          Buttons
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button>Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium border-b border-border pb-2">
          Inputs & Badges
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <Input placeholder="Enter something..." className="max-w-xs" />
          <Badge>Default Badge</Badge>
          <Badge variant="secondary">Secondary Badge</Badge>
          <Badge variant="outline">Outline Badge</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium border-b border-border pb-2">
          Shared: CodeBlock & CopyButton
        </h2>
        <div className="grid gap-4 max-w-2xl">
          <CodeBlock
            code={`curl https://api.ai.seedofcode.dev/api/chat \\
  -H "x-api-key: soc_live_abcd1234"`}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-subtle-foreground">
              Standalone CopyButton:
            </span>
            <CopyButton value="test-copy" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium border-b border-border pb-2">
          Shared: StatCard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Requests"
            value="12,450"
            trendValue="12.5"
            trendDirection="up"
            trendTone="positive"
            trendLabel="vs last week"
          />
          <StatCard
            title="Avg Latency"
            value="845ms"
            trendValue="5.2"
            trendDirection="down"
            trendTone="positive"
            trendLabel="vs last week"
          />
          <StatCard
            title="Error Rate"
            value="2.4%"
            trendValue="0.8"
            trendDirection="up"
            trendTone="negative"
            trendLabel="vs last week"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium border-b border-border pb-2">
          Shared: ChartFrame & EmptyState
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChartFrame
            title="Active Users"
            description="Daily active users over time"
          >
            <div className="flex h-full w-full items-center justify-center rounded-md border border-dashed border-chlorophyll/30 bg-chlorophyll/5 text-sm text-chlorophyll">
              [Recharts component goes here]
            </div>
          </ChartFrame>

          <ChartFrame
            title="Loading Chart"
            description="Simulating data fetch"
            loading
          >
            <Skeleton className="h-full w-full" />
          </ChartFrame>

          <ChartFrame
            title="Empty Chart"
            description="No data available for the period"
            empty
          >
            <Skeleton className="h-full w-full" />
          </ChartFrame>

          <div className="p-4 border rounded-card bg-surface flex flex-col gap-4">
            <EmptyState
              title="No API Keys found"
              description="Create a key to start making requests."
              icon={<Leaf className="h-8 w-8" />}
            >
              <Button>Create Key</Button>
            </EmptyState>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium border-b border-border pb-2">
          Shared: ComingSoonDialog
        </h2>
        <div className="flex gap-4">
          <ComingSoonDemo />
        </div>
      </section>
    </div>
  );
}
