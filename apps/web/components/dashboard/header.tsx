'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, Search, Bell, ChevronRight } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

import { cn } from '@codereview-ai/utils';
import { useUIStore } from '@/store/ui.store';
import { useNotifications } from '@/hooks/use-notifications';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/* ── Helpers ──────────────────────────────────────────── */

function timeAgo(dateStr: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000,
  );
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function capitalize(s: string): string {
  return s
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/* ── Header ───────────────────────────────────────────── */

export function Header(): React.JSX.Element {
  const pathname = usePathname();
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const openCommandPalette = useUIStore((s) => s.openCommandPalette);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  // Auto-generate breadcrumbs from pathname
  const segments = pathname
    .split('/')
    .filter(Boolean)
    .map((seg, i, arr) => ({
      label: capitalize(seg),
      href: '/' + arr.slice(0, i + 1).join('/'),
      isLast: i === arr.length - 1,
    }));

  return (
    <header className="flex h-14 flex-shrink-0 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-sm">
      {/* Mobile hamburger */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Breadcrumbs */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="hidden items-center gap-1 text-sm sm:flex"
        aria-label="Breadcrumb"
      >
        {segments.map((seg, i) => (
          <div key={seg.href} className="flex items-center gap-1">
            {i > 0 && (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            {seg.isLast ? (
              <span className="font-medium text-foreground">{seg.label}</span>
            ) : (
              <Link
                href={seg.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {seg.label}
              </Link>
            )}
          </div>
        ))}
      </motion.nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search trigger */}
      <Button
        variant="outline"
        className="hidden min-w-[280px] justify-start gap-2 text-muted-foreground md:flex"
        onClick={openCommandPalette}
        aria-label="Open command palette"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search repositories, reviews…</span>
        <kbd className="pointer-events-none rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
          ⌘K
        </kbd>
      </Button>

      {/* GitHub status (desktop only) */}
      <div className="hidden items-center gap-1.5 lg:flex">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        <span className="text-xs text-muted-foreground">Connected</span>
      </div>

      <ThemeToggle />

      {/* Notification bell dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto px-2 py-0.5 text-xs"
                onClick={markAllAsRead}
              >
                Mark all read
              </Button>
            )}
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {notifications.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No new notifications
            </p>
          ) : (
            notifications.slice(0, 5).map((n) => (
              <DropdownMenuItem
                key={n.id}
                className="flex cursor-pointer gap-3 px-3 py-2.5"
                onClick={() => markAsRead(n.id)}
              >
                {!n.isRead && (
                  <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                )}
                <div className={cn('min-w-0 flex-1', n.isRead && 'pl-4')}>
                  <p className="truncate text-sm font-medium">{n.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {n.body}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground/60">
                    {timeAgo(n.createdAt)}
                  </p>
                </div>
              </DropdownMenuItem>
            ))
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard"
              className="w-full justify-center text-xs text-muted-foreground"
            >
              View all notifications
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Clerk user button */}
      <UserButton
        afterSignOutUrl="/"
        appearance={{ elements: { avatarBox: 'h-8 w-8' } }}
      />
    </header>
  );
}
