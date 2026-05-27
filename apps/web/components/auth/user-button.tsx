'use client';

import { UserButton as ClerkUserButton } from '@clerk/nextjs';
import { LayoutDashboard, Settings, CreditCard } from 'lucide-react';

/**
 * Custom UserButton wrapping Clerk's <UserButton /> with
 * the CodeReview.ai design system appearance and custom menu items.
 *
 * Menu items:
 * - Dashboard — navigate to /dashboard
 * - Settings — navigate to /settings
 * - Billing — navigate to /billing
 * - Sign out (built-in from Clerk)
 */
export function UserButton(): React.JSX.Element {
  return (
    <ClerkUserButton
      afterSignOutUrl="/"
      appearance={{
        elements: {
          avatarBox: 'h-8 w-8',
          userButtonPopoverCard: 'bg-popover border border-border shadow-xl',
          userButtonPopoverActionButton:
            'text-popover-foreground hover:bg-accent',
          userButtonPopoverActionButtonText: 'text-popover-foreground',
          userButtonPopoverActionButtonIcon: 'text-muted-foreground',
          userButtonPopoverFooter: 'border-t border-border',
        },
      }}
    >
      <ClerkUserButton.MenuItems>
        <ClerkUserButton.Link
          label="Dashboard"
          labelIcon={<LayoutDashboard className="h-4 w-4" />}
          href="/dashboard"
        />
        <ClerkUserButton.Link
          label="Settings"
          labelIcon={<Settings className="h-4 w-4" />}
          href="/settings"
        />
        <ClerkUserButton.Link
          label="Billing"
          labelIcon={<CreditCard className="h-4 w-4" />}
          href="/billing"
        />
      </ClerkUserButton.MenuItems>
    </ClerkUserButton>
  );
}
