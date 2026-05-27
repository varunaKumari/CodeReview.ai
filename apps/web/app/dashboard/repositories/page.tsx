'use client';

import { motion } from 'framer-motion';
import { GitBranch } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { DashboardPageSkeleton } from '@/components/dashboard/skeletons';
import { fadeIn } from '@/lib/motion';

export default function RepositoriesPage(): React.JSX.Element {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center gap-3">
        <GitBranch className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Repositories</h1>
        <Badge variant="secondary" className="text-xs">Coming in Day 7</Badge>
      </div>
      <p className="max-w-xl text-muted-foreground">
        Connect your GitHub repositories, manage access, and configure review
        settings for each project. Auto-detects language, framework, and CI pipeline.
      </p>
      <DashboardPageSkeleton />
    </motion.div>
  );
}
