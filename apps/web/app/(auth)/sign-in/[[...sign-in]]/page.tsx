import { SignIn } from '@clerk/nextjs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your CodeReview.ai account to access AI-powered code reviews.',
};

/**
 * Sign-in page using Clerk's <SignIn /> component.
 *
 * - Catch-all route [[...sign-in]] so Clerk can handle
 *   multi-step flows (MFA, OAuth callbacks, etc.)
 * - Appearance inherits from ClerkProvider in root layout
 * - GitHub OAuth shown as primary social connection
 */
export default function SignInPage(): React.JSX.Element {
  return (
    <SignIn
      appearance={{
        elements: {
          rootBox: 'w-full max-w-md',
          card: 'bg-card/80 backdrop-blur-xl border border-border shadow-2xl',
          socialButtonsBlockButton:
            'border border-border bg-background/50 hover:bg-accent transition-colors',
          formButtonPrimary:
            'bg-primary text-primary-foreground hover:bg-primary/90 transition-colors',
          footerActionLink: 'text-primary hover:text-primary/80',
          headerTitle: 'text-foreground',
          headerSubtitle: 'text-muted-foreground',
          formFieldLabel: 'text-foreground',
          formFieldInput:
            'bg-background border-border text-foreground focus:ring-ring',
          dividerLine: 'bg-border',
          dividerText: 'text-muted-foreground',
        },
      }}
      forceRedirectUrl="/dashboard"
    />
  );
}
