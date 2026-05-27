'use client';

import { motion } from 'framer-motion';
import { GitPullRequest } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { DashboardPageSkeleton } from '@/components/dashboard/skeletons';
import { fadeIn } from '@/lib/motion';

export default function PullRequestsPage(): React.JSX.Element {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center gap-3">
        <GitPullRequest className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Pull Requests</h1>
        <Badge variant="secondary" className="text-xs">Coming in Day 8</Badge>
      </div>
      <p className="max-w-xl text-muted-foreground">
        Track all your open and merged pull requests across connected repositories.
        See review status, AI scores, and comment threads at a glance.
      </p>
      <DashboardPageSkeleton />
    </motion.div>
  );
}
