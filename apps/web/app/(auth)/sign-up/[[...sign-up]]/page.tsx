import { SignUp } from '@clerk/nextjs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create a CodeReview.ai account and start getting AI-powered code reviews.',
};

/**
 * Sign-up page using Clerk's <SignUp /> component.
 *
 * - Catch-all route [[...sign-up]] for multi-step flows
 * - GitHub OAuth shown as primary social connection
 * - Appearance inherits from ClerkProvider + local overrides
 */
export default function SignUpPage(): React.JSX.Element {
  return (
    <SignUp
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
