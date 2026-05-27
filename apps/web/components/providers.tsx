'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

import { ThemeProvider } from '@/components/providers/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';

/** Props for the Providers component */
interface ProvidersProps {
  /** Child components to wrap with global providers */
  readonly children: ReactNode;
}

/**
 * Global application providers that wrap the entire app.
 *
 * Includes:
 * - QueryClientProvider — TanStack React Query for server-state management
 * - ThemeProvider — next-themes for dark/light mode via CSS class
 * - TooltipProvider — Radix tooltip context for all tooltips
 *
 * QueryClient is instantiated inside useState to ensure each SSR request
 * gets its own client, preventing cross-request data leakage.
 */
export function Providers({ children }: ProvidersProps): React.JSX.Element {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            retry: 3,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30_000),
            refetchOnWindowFocus: process.env.NODE_ENV === 'production',
          },
          mutations: {
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange={false}
      >
        <TooltipProvider delayDuration={300}>
          {children}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
