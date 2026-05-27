import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  /** Lucide icon component */
  readonly icon: LucideIcon;
  /** Heading text */
  readonly title: string;
  /** Description text */
  readonly description: string;
  /** Optional CTA button */
  readonly action?: { label: string; href: string };
  /** Size variant */
  readonly size?: 'sm' | 'md' | 'lg';
}

/**
 * Reusable empty state component — centered icon, text, and optional CTA.
 *
 * Usage examples:
 * - <EmptyState icon={GitBranch} title="No repositories connected" description="Connect your first GitHub repository to get started." action={{ label: "Connect Repository", href: "/dashboard/repositories" }} />
 * - <EmptyState icon={MessageSquareCode} title="No reviews yet" description="Open a pull request to trigger your first AI review." />
 * - <EmptyState icon={GitPullRequest} title="No pull requests found" description="We'll show your pull requests here once you connect a repository." />
 * - <EmptyState icon={Users} title="No team members" description="Invite your team to collaborate on code reviews." action={{ label: "Invite Members", href: "/dashboard/settings" }} />
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  size = 'md',
}: EmptyStateProps): React.JSX.Element {
  const sizeClasses = {
    sm: 'py-8',
    md: 'py-16',
    lg: 'py-24',
  };

  const iconSizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const circleSizes = {
    sm: 'h-14 w-14',
    md: 'h-20 w-20',
    lg: 'h-28 w-28',
  };

  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${sizeClasses[size]} rounded-xl border border-dashed border-border/60`}
    >
      <div
        className={`flex items-center justify-center rounded-full bg-muted/50 ${circleSizes[size]}`}
      >
        <Icon className={`text-muted-foreground ${iconSizes[size]}`} />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {action && (
        <Button asChild className="mt-6 rounded-full" size="sm">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}
