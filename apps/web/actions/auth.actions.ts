'use server';

import { getApiToken, getGitHubAccessToken } from '@/lib/auth';

/** API URL for the backend */
const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3001';

/** Result shape for server action returns */
interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Syncs the GitHub OAuth access token from Clerk to the backend database.
 *
 * Called after the user completes the GitHub OAuth flow via Clerk.
 * The token is sent to the API where it gets encrypted at rest.
 *
 * @returns ActionResult indicating success or failure
 */
export async function syncGitHubToken(): Promise<ActionResult> {
  try {
    const [apiToken, githubToken] = await Promise.all([
      getApiToken(),
      getGitHubAccessToken(),
    ]);

    if (!apiToken) {
      return { success: false, error: 'Not authenticated' };
    }

    if (!githubToken) {
      return { success: false, error: 'GitHub token not available. Please connect your GitHub account first.' };
    }

    const response = await fetch(`${API_URL}/api/v1/users/me/github-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
      },
      body: JSON.stringify({ token: githubToken }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({})) as Record<string, unknown>;
      return {
        success: false,
        error: (body['message'] as string) ?? `API returned ${response.status}`,
      };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: message };
  }
}

/**
 * Fetches the current user's profile from the backend API.
 *
 * @returns ActionResult with the user profile data
 */
export async function fetchCurrentUser(): Promise<ActionResult> {
  try {
    const apiToken = await getApiToken();

    if (!apiToken) {
      return { success: false, error: 'Not authenticated' };
    }

    const response = await fetch(`${API_URL}/api/v1/users/me`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
      },
    });

    if (!response.ok) {
      return { success: false, error: `API returned ${response.status}` };
    }

    const data = await response.json() as Record<string, unknown>;
    return { success: true, data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: message };
  }
}
