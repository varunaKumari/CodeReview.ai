'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

/**
 * Theme provider component wrapping next-themes.
 * Manages dark/light/system theme state via class strategy on <html>.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>): React.JSX.Element {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
