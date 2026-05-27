import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { DashboardShell } from '@/components/dashboard/dashboard-shell';

/**
 * Dashboard layout — Server Component that verifies auth
 * then renders the client-side DashboardShell.
 */
export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  return <DashboardShell>{children}</DashboardShell>;
}
