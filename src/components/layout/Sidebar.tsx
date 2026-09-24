'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/cn';
import {
  LayoutDashboard,
  Key,
  BarChart3,
  Settings,
  ChevronLeft,
  Leaf,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const navItems = [
  { href: '/home', label: 'Overview', icon: LayoutDashboard },
  { href: '/api-keys', label: 'API Keys', icon: Key },
  { href: '/usage', label: 'Usage', icon: BarChart3 },
  { href: '/playground', label: 'Playground', icon: Sparkles },
  { href: '/docs', label: 'Docs', icon: BookOpen },
  { href: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

function NavLink({
  item,
  collapsed,
  onClick,
}: {
  item: (typeof navItems)[0];
  collapsed?: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === item.href || pathname.startsWith(item.href + '/');

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'group rounded-control flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-primary/10 text-primary dark:text-chlorophyll'
          : 'text-muted-foreground hover:bg-surface-2 hover:text-foreground',
      )}
      aria-current={active ? 'page' : undefined}
    >
      <item.icon
        className={cn(
          'h-4 w-4 shrink-0 transition-colors',
          active
            ? 'text-primary dark:text-chlorophyll'
            : 'text-muted-foreground group-hover:text-foreground',
        )}
      />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}

/** Desktop collapsible sidebar */
export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        'border-border bg-surface fixed inset-y-0 left-0 z-30 flex flex-col border-r transition-all duration-300',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'border-border flex h-14 items-center border-b px-4',
          collapsed ? 'justify-center' : 'gap-2',
        )}
      >
        <Leaf className="text-primary dark:text-chlorophyll h-5 w-5 shrink-0" />
        {!collapsed && (
          <span className="font-display text-foreground text-sm font-semibold tracking-tight">
            SeedofCode AI
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavLink item={item} collapsed={collapsed} />
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="border-border border-t p-2">
        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="rounded-control text-muted-foreground hover:bg-surface-2 hover:text-foreground flex w-full items-center justify-center p-2 transition-colors"
        >
          <ChevronLeft
            className={cn(
              'h-4 w-4 transition-transform duration-300',
              collapsed && 'rotate-180',
            )}
          />
        </button>
      </div>
    </aside>
  );
}

/** Mobile sidebar (Sheet) */
export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="rounded-control text-muted-foreground hover:bg-surface-2 hover:text-foreground inline-flex items-center justify-center p-2 transition-colors md:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" className="bg-surface w-64 p-0">
        <div className="border-border flex h-14 items-center gap-2 border-b px-4">
          <Leaf className="text-primary dark:text-chlorophyll h-5 w-5" />
          <span className="font-display text-foreground text-sm font-semibold">
            SeedofCode AI
          </span>
        </div>
        <nav className="px-2 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <NavLink item={item} onClick={() => setOpen(false)} />
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
