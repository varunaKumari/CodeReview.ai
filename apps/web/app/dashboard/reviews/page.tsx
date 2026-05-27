'use client';

import { motion } from 'framer-motion';
import { MessageSquareCode } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { DashboardPageSkeleton } from '@/components/dashboard/skeletons';
import { fadeIn } from '@/lib/motion';

export default function ReviewsPage(): React.JSX.Element {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center gap-3">
        <MessageSquareCode className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
        <Badge variant="secondary" className="text-xs">Coming in Day 9</Badge>
      </div>
      <p className="max-w-xl text-muted-foreground">
        Browse all your AI-powered code reviews. Filter by repository, score, persona,
        and status. Drill into detailed review comments and suggested fixes.
      </p>
      <DashboardPageSkeleton />
    </motion.div>
  );
}
