'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Client-side auth guard component.
 *
 * Wraps protected page content and:
 * 1. Shows a loading skeleton while Clerk checks auth state
 * 2. Redirects to /sign-in if the user is not authenticated
 * 3. Renders children only when authenticated
 *
 * Usage:
 * ```tsx
 * <AuthGuard>
 *   <DashboardContent />
 * </AuthGuard>
 * ```
 */
export function AuthGuard({
  children,
}: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  // Loading state — show skeleton
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          {/* Skeleton avatar */}
          <div className="h-12 w-12 animate-pulse rounded-full bg-muted" />
          {/* Skeleton text lines */}
          <div className="space-y-2">
            <div className="h-4 w-48 animate-pulse rounded bg-muted" />
            <div className="h-4 w-36 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated — redirect happening
  if (!isSignedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Redirecting to sign in...</p>
      </div>
    );
  }

  // Authenticated — render children
  return <>{children}</>;
}
