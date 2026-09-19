'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { VerifyEmailBanner } from '@/components/layout/VerifyEmailBanner';
import { cn } from '@/lib/cn';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <AuthGuard>
      <div className="relative flex min-h-dvh bg-background">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed((c) => !c)}
          />
        </div>

        {/* Main content area */}
        <div
          className={cn(
            'flex flex-1 flex-col transition-all duration-300',
            'md:ml-60',
            sidebarCollapsed && 'md:ml-16',
          )}
        >
          <Header sidebarCollapsed={sidebarCollapsed} />
          {/* Content below the fixed header */}
          <main className="flex-1 pt-14">
            <VerifyEmailBanner />
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
