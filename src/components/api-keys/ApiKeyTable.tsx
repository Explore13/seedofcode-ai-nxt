'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { maskApiKey } from '@/lib/format';
import type { ApiKey } from '@/lib/types';
import { MoreHorizontal, Pencil, Power, RefreshCw, Trash2 } from 'lucide-react';

/** Compact absolute date, e.g. "23 Sep 2026". */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

interface ApiKeyTableProps {
  keys: ApiKey[];
  onRename: (key: ApiKey) => void;
  onToggleActive: (key: ApiKey) => void;
  onRegenerate: (key: ApiKey) => void;
  onDelete: (key: ApiKey) => void;
  /** Id of a key whose enable/disable toggle is in flight. */
  togglingId?: string | null;
}

export function ApiKeyTable({
  keys,
  onRename,
  onToggleActive,
  onRegenerate,
  onDelete,
  togglingId,
}: ApiKeyTableProps) {
  return (
    <div className="rounded-card border-border border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Key</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="hidden lg:table-cell">Last used</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-10 text-right">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keys.map((key) => (
            <TableRow key={key.id}>
              <TableCell className="text-foreground font-medium">
                {key.name}
              </TableCell>
              <TableCell className="text-muted-foreground font-mono text-xs">
                {maskApiKey(key.keyPrefix)}
              </TableCell>
              <TableCell className="text-muted-foreground hidden md:table-cell">
                {formatDate(key.createdAt)}
              </TableCell>
              <TableCell className="text-muted-foreground hidden lg:table-cell">
                {key.lastUsedAt ? formatDate(key.lastUsedAt) : 'Never'}
              </TableCell>
              <TableCell>
                <Badge variant={key.isActive ? 'outline' : 'ghost'}>
                  <span
                    className={
                      key.isActive
                        ? 'bg-success mr-1 inline-block h-1.5 w-1.5 rounded-full'
                        : 'bg-muted-foreground mr-1 inline-block h-1.5 w-1.5 rounded-full'
                    }
                  />
                  {key.isActive ? 'Active' : 'Disabled'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    aria-label={`Actions for ${key.name}`}
                    disabled={togglingId === key.id}
                    className="rounded-control text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring inline-flex h-7 w-7 items-center justify-center transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem
                      onClick={() => onRename(key)}
                      className="cursor-pointer gap-2"
                    >
                      <Pencil className="h-4 w-4" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onToggleActive(key)}
                      className="cursor-pointer gap-2"
                    >
                      <Power className="h-4 w-4" />
                      {key.isActive ? 'Disable' : 'Enable'}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onRegenerate(key)}
                      className="cursor-pointer gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Regenerate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => onDelete(key)}
                      className="cursor-pointer gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/** Skeleton rows shown while the key list loads. */
export function ApiKeyTableSkeleton() {
  return (
    <div className="rounded-card border-border border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Key</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="hidden lg:table-cell">Last used</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 3 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="rounded-pill h-5 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="rounded-control h-7 w-7" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
