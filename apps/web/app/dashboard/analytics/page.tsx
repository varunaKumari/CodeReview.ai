'use client';

import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { DashboardPageSkeleton } from '@/components/dashboard/skeletons';
import { fadeIn } from '@/lib/motion';

export default function AnalyticsPage(): React.JSX.Element {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <Badge variant="secondary" className="text-xs">Coming in Day 15</Badge>
      </div>
      <p className="max-w-xl text-muted-foreground">
        Visualize your team&apos;s code quality trends over time. Track review scores,
        issue resolution rates, and improvement metrics across all repositories.
      </p>
      <DashboardPageSkeleton />
    </motion.div>
  );
}
