/**
 * Skeleton loader components for the dashboard.
 * Pure Tailwind — no client hooks needed.
 */

/** Full-page dashboard skeleton */
export function DashboardPageSkeleton(): React.JSX.Element {
  return (
    <div className="space-y-6">
      {/* Title bar */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
        <div className="h-9 w-28 animate-pulse rounded-lg bg-muted" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-xl border border-border/50 bg-muted/50 p-5"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <div className="h-4 w-20 rounded bg-muted" />
            <div className="mt-3 h-8 w-24 rounded bg-muted" />
            <div className="mt-2 h-3 w-16 rounded bg-muted" />
          </div>
        ))}
      </div>

      {/* Content area */}
      <div className="h-64 animate-pulse rounded-xl border border-border/50 bg-muted/50" />
    </div>
  );
}

/** Repository card skeleton */
export function RepoCardSkeleton(): React.JSX.Element {
  return (
    <div className="animate-pulse rounded-xl border border-border/50 bg-card/50 p-5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-muted" />
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="h-3 w-48 rounded bg-muted" />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-5 w-16 rounded-full bg-muted" />
        <div className="h-5 w-12 rounded-full bg-muted" />
      </div>
    </div>
  );
}

/** Review card skeleton */
export function ReviewCardSkeleton(): React.JSX.Element {
  return (
    <div className="animate-pulse rounded-xl border border-border/50 bg-card/50 p-5">
      <div className="h-5 w-40 rounded bg-muted" />
      <div className="mt-3 h-3 w-full rounded-full bg-muted" />
      <div className="mt-4 space-y-2">
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-4 w-5/6 rounded bg-muted" />
      </div>
    </div>
  );
}

/** Table row skeleton */
export function TableRowSkeleton(): React.JSX.Element {
  return (
    <div className="flex items-center gap-4 px-4 py-3">
      <div className="h-4 w-8 animate-pulse rounded bg-muted" />
      <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      <div className="h-4 w-48 animate-pulse rounded bg-muted" />
      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      <div className="h-4 w-16 animate-pulse rounded bg-muted" />
    </div>
  );
}

/** Stat card skeleton */
export function StatCardSkeleton(): React.JSX.Element {
  return (
    <div className="h-28 animate-pulse rounded-xl border border-border/50 bg-card/50 p-5">
      <div className="h-4 w-20 rounded bg-muted" />
      <div className="mt-3 h-8 w-24 rounded bg-muted" />
    </div>
  );
}
