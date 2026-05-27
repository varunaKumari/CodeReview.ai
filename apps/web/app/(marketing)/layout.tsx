import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CodeReview.ai — AI-Powered Code Review',
};

/**
 * Marketing layout — clean wrapper for the landing page
 * with no dashboard sidebar or authenticated navigation.
 */
export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  return <>{children}</>;
}
