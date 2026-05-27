'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  ChevronLeft,
  LayoutDashboard,
  GitBranch,
  GitPullRequest,
  MessageSquareCode,
  MessageCircle,
  BarChart3,
  Shield,
  Settings,
  CreditCard,
  Bell,
  Plus,
} from 'lucide-react';
import { UserButton, useUser } from '@clerk/nextjs';

import { cn } from '@codereview-ai/utils';
import { useUIStore } from '@/store/ui.store';
import { useNotifications } from '@/hooks/use-notifications';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import type { LucideIcon } from 'lucide-react';

/* ── Navigation data ──────────────────────────────────── */

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Repositories', href: '/dashboard/repositories', icon: GitBranch },
      { label: 'Pull Requests', href: '/dashboard/pull-requests', icon: GitPullRequest },
      { label: 'Reviews', href: '/dashboard/reviews', icon: MessageSquareCode },
      { label: 'Chat', href: '/dashboard/chat', icon: MessageCircle },
    ],
  },
  {
    label: 'Insights',
    items: [
      { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
      { label: 'Security', href: '/dashboard/security', icon: Shield },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Settings', href: '/dashboard/settings', icon: Settings },
      { label: 'Billing', href: '/dashboard/billing', icon: CreditCard },
    ],
  },
];

/* ── Helpers ──────────────────────────────────────────── */

function isActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') return pathname === '/dashboard';
  return pathname.startsWith(href);
}

/* ── Sidebar component ────────────────────────────────── */

export function Sidebar(): React.JSX.Element {
  const pathname = usePathname();
  const { user } = useUser();
  const { unreadCount } = useNotifications();

  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);

  const handleNavClick = () => {
    // Close mobile Sheet on navigation
    setSidebarOpen(false);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full flex-col border-r border-border bg-card/50">
        {/* ── Logo + collapse toggle ──────────────────── */}
        <div className="flex h-14 items-center gap-2 border-b border-border px-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-chart-4">
            <Code2 className="h-4 w-4 text-white" />
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap text-sm font-bold"
              >
                CodeReview.ai
              </motion.span>
            )}
          </AnimatePresence>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto h-7 w-7 flex-shrink-0"
                onClick={() => setSidebarCollapsed(!collapsed)}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <ChevronLeft
                  className={cn(
                    'h-4 w-4 transition-transform duration-200',
                    collapsed && 'rotate-180',
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* ── Navigation groups ───────────────────────── */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
          {NAV_GROUPS.map((group, gi) => (
            <div key={group.label}>
              {gi > 0 && <Separator className="my-2" />}

              <AnimatePresence>
                {!collapsed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-1 px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    {group.label}
                  </motion.p>
                )}
              </AnimatePresence>

              {group.items.map((item) => {
                const active = isActive(pathname, item.href);
                const content = (
                  <Link
                    href={item.href}
                    onClick={handleNavClick}
                    className={cn(
                      'relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      collapsed && 'justify-center',
                    )}
                  >
                    {/* Active indicator pill */}
                    {active && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-primary"
                        transition={{
                          type: 'spring',
                          stiffness: 350,
                          damping: 30,
                        }}
                      />
                    )}

                    <item.icon className="h-5 w-5 flex-shrink-0" />

                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                );

                // When collapsed, wrap in tooltip
                if (collapsed) {
                  return (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>{content}</TooltipTrigger>
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    </Tooltip>
                  );
                }

                return <div key={item.href}>{content}</div>;
              })}
            </div>
          ))}
        </nav>

        {/* ── Bottom section ──────────────────────────── */}
        <div className="mt-auto space-y-2 border-t border-border px-2 py-3">
          {/* Notifications */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard"
                className={cn(
                  'relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                  collapsed && 'justify-center',
                )}
              >
                <div className="relative flex-shrink-0">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      Notifications
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">
                Notifications{unreadCount > 0 ? ` (${unreadCount})` : ''}
              </TooltipContent>
            )}
          </Tooltip>

          {/* New Review button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className={cn(
                  'w-full gap-2 rounded-lg',
                  collapsed && 'px-0',
                )}
                size="sm"
              >
                <Plus className="h-4 w-4 flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      New Review
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">New Review</TooltipContent>
            )}
          </Tooltip>

          <Separator />

          {/* User section */}
          <div
            className={cn(
              'flex items-center gap-3 rounded-lg px-2 py-1.5',
              collapsed && 'justify-center',
            )}
          >
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'h-8 w-8',
                },
              }}
            />
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex min-w-0 flex-col overflow-hidden"
                >
                  <span className="truncate text-sm font-medium">
                    {user?.firstName ?? 'User'}
                  </span>
                  <Badge
                    variant="secondary"
                    className="mt-0.5 w-fit text-[10px]"
                  >
                    Pro
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
