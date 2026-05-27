'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useAuth } from '@clerk/nextjs';
import {
  LayoutDashboard,
  GitBranch,
  GitPullRequest,
  MessageSquareCode,
  BarChart3,
  Shield,
  Settings,
  CreditCard,
  Plus,
  UserPlus,
  Key,
  Sun,
  Moon,
  Monitor,
  User,
  LogOut,
} from 'lucide-react';

import { useUIStore } from '@/store/ui.store';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';

/* ── Navigation commands ──────────────────────────────── */

const NAV_COMMANDS = [
  { label: 'Go to Dashboard', icon: LayoutDashboard, href: '/dashboard', shortcut: 'G D' },
  { label: 'Go to Repositories', icon: GitBranch, href: '/dashboard/repositories', shortcut: 'G R' },
  { label: 'Go to Pull Requests', icon: GitPullRequest, href: '/dashboard/pull-requests', shortcut: 'G P' },
  { label: 'Go to Reviews', icon: MessageSquareCode, href: '/dashboard/reviews', shortcut: 'G V' },
  { label: 'Go to Analytics', icon: BarChart3, href: '/dashboard/analytics', shortcut: 'G A' },
  { label: 'Go to Security', icon: Shield, href: '/dashboard/security' },
  { label: 'Go to Settings', icon: Settings, href: '/dashboard/settings', shortcut: 'G S' },
  { label: 'Go to Billing', icon: CreditCard, href: '/dashboard/billing' },
] as const;

const ACTION_COMMANDS = [
  { label: 'New Code Review', icon: Plus, href: '/dashboard/reviews' },
  { label: 'Connect Repository', icon: GitBranch, href: '/dashboard/repositories' },
  { label: 'Invite Team Member', icon: UserPlus, href: '/dashboard/settings' },
  { label: 'Generate API Key', icon: Key, href: '/dashboard/settings' },
] as const;

/* ── Component ────────────────────────────────────────── */

export function CommandPalette(): React.JSX.Element {
  const router = useRouter();
  const { setTheme } = useTheme();
  const { signOut } = useAuth();

  const open = useUIStore((s) => s.commandPaletteOpen);
  const openCommandPalette = useUIStore((s) => s.openCommandPalette);
  const closeCommandPalette = useUIStore((s) => s.closeCommandPalette);

  // ⌘K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (open) {
          closeCommandPalette();
        } else {
          openCommandPalette();
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, openCommandPalette, closeCommandPalette]);

  const runCommand = (fn: () => void) => {
    closeCommandPalette();
    fn();
  };

  return (
    <CommandDialog open={open} onOpenChange={(v) => (v ? openCommandPalette() : closeCommandPalette())}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found. Try a different search.</CommandEmpty>

        {/* Navigation */}
        <CommandGroup heading="Navigation">
          {NAV_COMMANDS.map((cmd) => (
            <CommandItem
              key={cmd.href}
              onSelect={() => runCommand(() => router.push(cmd.href))}
            >
              <cmd.icon className="mr-2 h-4 w-4" />
              <span>{cmd.label}</span>
              {cmd.shortcut && (
                <CommandShortcut>{cmd.shortcut}</CommandShortcut>
              )}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Actions */}
        <CommandGroup heading="Actions">
          {ACTION_COMMANDS.map((cmd) => (
            <CommandItem
              key={cmd.label}
              onSelect={() => runCommand(() => router.push(cmd.href))}
            >
              <cmd.icon className="mr-2 h-4 w-4" />
              <span>{cmd.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Theme */}
        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Light Mode</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark Mode</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
            <Monitor className="mr-2 h-4 w-4" />
            <span>System Theme</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Account */}
        <CommandGroup heading="Account">
          <CommandItem
            onSelect={() => runCommand(() => router.push('/dashboard/settings'))}
          >
            <User className="mr-2 h-4 w-4" />
            <span>View Profile</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/dashboard/billing'))}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Manage Billing</span>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                void signOut();
              })
            }
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
