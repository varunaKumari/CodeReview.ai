'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useCallback } from 'react';
import { Github, Check, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { syncGitHubToken } from '@/actions/auth.actions';

/**
 * GitHub connection button.
 *
 * States:
 * 1. Not connected: shows "Connect GitHub" button that opens Clerk's
 *    OAuth connection flow via window redirect
 * 2. Connected: shows green "Connected" badge with GitHub icon
 * 3. Syncing: shows loading spinner while syncing token to backend
 *
 * After OAuth completes, calls the syncGitHubToken server action
 * to store the encrypted token on the backend.
 */
export function GitHubConnectButton(): React.JSX.Element {
  const { user, isLoaded } = useUser();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Check if GitHub is already connected via Clerk external accounts
  const githubAccount = user?.externalAccounts?.find(
    (account) => account.provider === 'github',
  );
  const isConnected = Boolean(githubAccount);

  const handleSync = useCallback(async () => {
    setIsSyncing(true);
    setSyncError(null);

    const result = await syncGitHubToken();

    if (!result.success) {
      setSyncError(result.error ?? 'Failed to sync token');
    }

    setIsSyncing(false);
  }, []);

  const handleConnect = useCallback(() => {
    // Redirect to Clerk's account page where users can manage OAuth connections
    // Alternatively, use Clerk's user.createExternalAccount API
    window.location.href = '/user/profile';
  }, []);

  if (!isLoaded) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading...</span>
      </Button>
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="gap-1.5 border-green-500/30 bg-green-500/10 text-green-500">
          <Check className="h-3 w-3" />
          GitHub Connected
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSync}
          disabled={isSyncing}
          title="Sync GitHub token to backend"
        >
          {isSyncing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <span className="text-xs text-muted-foreground">Sync Token</span>
          )}
        </Button>
        {syncError ? (
          <p className="text-xs text-destructive">{syncError}</p>
        ) : null}
      </div>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={handleConnect}>
      <Github className="h-4 w-4" />
      <span>Connect GitHub</span>
    </Button>
  );
}
