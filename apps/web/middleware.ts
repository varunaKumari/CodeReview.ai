import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

/**
 * Routes that require authentication.
 * Any request matching these patterns will trigger `auth.protect()`.
 */
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/settings(.*)',
  '/reviews(.*)',
  '/repositories(.*)',
  '/chat(.*)',
  '/billing(.*)',
]);

/**
 * Clerk middleware for the CodeReview.ai frontend.
 *
 * Public routes (no auth required):
 * - / — landing page
 * - /sign-in, /sign-up — auth pages (Clerk-managed)
 * - /pricing, /about — marketing pages
 * - /api/webhooks/* — webhook handlers
 *
 * Protected routes (redirect to sign-in):
 * - /dashboard/* — main application
 * - /settings/* — user settings
 * - /reviews/* — code review pages
 * - /repositories/* — repository management
 * - /chat/* — AI chat sessions
 * - /billing/* — subscription management
 */
export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

/**
 * Matcher configuration — runs middleware on all routes except
 * static files and Next.js internals.
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
