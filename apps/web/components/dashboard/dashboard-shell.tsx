'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { CommandPalette } from '@/components/dashboard/command-palette';
import { PageTransition } from '@/components/dashboard/page-transition';
import { useUIStore } from '@/store/ui.store';
import { Sheet, SheetContent } from '@/components/ui/sheet';

/**
 * Root shell for the entire dashboard — manages sidebar layout,
 * mobile Sheet overlay, header, page transitions, and the
 * command palette.
 */
export function DashboardShell({
  children,
}: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    setIsDesktop(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar — fixed column */}
      {isDesktop && (
        <motion.aside
          className="hidden h-full flex-shrink-0 lg:block"
          animate={{ width: collapsed ? 64 : 260 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <Sidebar />
        </motion.aside>
      )}

      {/* Mobile sidebar — Sheet overlay */}
      {!isDesktop && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-[280px] p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>
      )}

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-4 md:p-6">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
      </div>

      <CommandPalette />
    </div>
  );
}
