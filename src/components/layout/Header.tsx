'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { authApi } from '@/lib/api';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { MobileSidebar } from './Sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Settings } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  /** Mirror the sidebar width offset so the header doesn't go under the sidebar */
  sidebarCollapsed: boolean;
}

export function Header({ sidebarCollapsed }: HeaderProps) {
  const { user, clear } = useAuthStore();
  const router = useRouter();

  async function handleLogout() {
    try {
      await authApi.logout();
    } catch {
      // Best-effort — clear locally regardless
    }
    clear();
    router.replace('/login');
  }

  const displayName = user?.name ?? user?.email ?? 'Account';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header
      className="fixed top-0 right-0 z-20 flex h-14 items-center justify-between border-b border-border bg-surface px-4 transition-all duration-300"
      style={{
        left: sidebarCollapsed ? '4rem' : '15rem',
      }}
    >
      {/* Mobile hamburger */}
      <MobileSidebar />

      {/* Right-side controls */}
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />

        {/* User menu — base-ui Menu, no asChild needed */}
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Open account menu"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary transition-colors hover:bg-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-chlorophyll"
          >
            {initial}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium">{displayName}</p>
                {user?.email && (
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* Base UI MenuItem does not support asChild; wrap Link inside */}
            <DropdownMenuItem className="cursor-pointer p-0">
              <Link
                href="/settings"
                className="flex w-full items-center gap-2 px-1.5 py-1"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-danger data-[variant=destructive]:focus:text-danger flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
