import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

import { Providers } from '@/components/providers';
import './globals.css';

/**
 * Clerk appearance config matching the CodeReview.ai design system.
 * Uses CSS variables from globals.css for seamless theme integration.
 */
const clerkAppearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: 'hsl(240 5.9% 90%)',
    colorBackground: 'hsl(240 10% 3.9%)',
    colorText: 'hsl(0 0% 98%)',
    colorInputBackground: 'hsl(240 3.7% 15.9%)',
    colorInputText: 'hsl(0 0% 98%)',
    borderRadius: '0.5rem',
    fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
  },
  elements: {
    card: 'bg-card border border-border shadow-xl',
    formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    footerActionLink: 'text-primary hover:text-primary/80',
    socialButtonsBlockButton: 'border border-border bg-background hover:bg-accent',
  },
};

/**
 * Application metadata for SEO, OpenGraph, and Twitter cards.
 * Uses a template so child pages inherit the brand suffix automatically.
 */
export const metadata: Metadata = {
  title: {
    default: 'CodeReview.ai — AI-Powered Code Review',
    template: '%s | CodeReview.ai',
  },
  description:
    'Automated, intelligent code reviews powered by AI. Catch bugs, enforce best practices, and ship better code faster with CodeReview.ai.',
  keywords: [
    'code review',
    'AI code review',
    'automated code review',
    'GitHub integration',
    'pull request review',
    'code quality',
    'static analysis',
    'security scanning',
    'CodeReview.ai',
  ],
  authors: [{ name: 'CodeReview.ai' }],
  creator: 'CodeReview.ai',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://codereview.ai',
    siteName: 'CodeReview.ai',
    title: 'CodeReview.ai — AI-Powered Code Review',
    description:
      'Automated, intelligent code reviews powered by AI. Catch bugs, enforce best practices, and ship better code faster.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeReview.ai — AI-Powered Code Review',
    description:
      'Automated, intelligent code reviews powered by AI. Catch bugs, enforce best practices, and ship better code faster.',
    creator: '@codereviewai',
  },
  robots: {
    index: true,
    follow: true,
  },
};

/** Viewport configuration for responsive design and theme colors */
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
  width: 'device-width',
  initialScale: 1,
};

/**
 * Root layout for the CodeReview.ai application.
 *
 * Provider hierarchy (outermost to innermost):
 * 1. ClerkProvider — auth session + Clerk components
 * 2. Providers — React Query + Theme + Tooltip
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}
        >
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
