import 'server-only';

import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

/**
 * Server-only auth utilities for the CodeReview.ai frontend.
 *
 * All functions in this module can only be imported in Server Components,
 * Server Actions, and Route Handlers. The `server-only` import ensures
 * a build error if accidentally imported on the client.
 */

/** Clerk user profile shape (subset of what Clerk returns) */
export interface ServerUser {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}

/**
 * Returns the current authenticated user from Clerk.
 * Returns null if no user is signed in.
 */
export async function getServerUser(): Promise<ServerUser | null> {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    clerkId: user.id,
    email: user.emailAddresses[0]?.emailAddress ?? '',
    name: [user.firstName, user.lastName].filter(Boolean).join(' ') || 'User',
    avatarUrl: user.imageUrl ?? null,
  };
}

/**
 * Returns the current Clerk auth session.
 * Provides userId, sessionId, and getToken() for API calls.
 */
export async function getServerSession() {
  return auth();
}

/**
 * Requires authentication — redirects to /sign-in if not authenticated.
 * Use this at the top of protected Server Components or Server Actions.
 *
 * @returns The authenticated user (never null when this returns)
 */
export async function requireAuth(): Promise<ServerUser> {
  const user = await getServerUser();

  if (!user) {
    redirect('/sign-in');
  }

  return user;
}

/**
 * Extracts the GitHub OAuth access token from Clerk's session.
 * Returns null if GitHub is not connected or no token is available.
 *
 * The token is obtained from Clerk's OAuth provider tokens API.
 */
export async function getGitHubAccessToken(): Promise<string | null> {
  const { getToken } = await auth();

  try {
    // Clerk stores OAuth provider tokens accessible via getToken
    // with the template name matching the OAuth provider
    const token = await getToken({ template: 'github' });
    return token;
  } catch {
    return null;
  }
}

/**
 * Gets a JWT token for authenticating with our backend API.
 * The token is a Clerk session token that our API can verify.
 */
export async function getApiToken(): Promise<string | null> {
  const { getToken } = await auth();

  try {
    return await getToken();
  } catch {
    return null;
  }
}
