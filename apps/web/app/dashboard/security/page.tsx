'use client';

import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { DashboardPageSkeleton } from '@/components/dashboard/skeletons';
import { fadeIn } from '@/lib/motion';

export default function SecurityPage(): React.JSX.Element {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Security</h1>
        <Badge variant="secondary" className="text-xs">Coming in Day 16</Badge>
      </div>
      <p className="max-w-xl text-muted-foreground">
        Monitor security vulnerabilities, dependency risks, and compliance issues
        across your codebase. Get real-time alerts and automated fix suggestions.
      </p>
      <DashboardPageSkeleton />
    </motion.div>
  );
}
