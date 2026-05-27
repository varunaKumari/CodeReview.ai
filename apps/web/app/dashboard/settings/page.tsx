'use client';

import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { DashboardPageSkeleton } from '@/components/dashboard/skeletons';
import { fadeIn } from '@/lib/motion';

export default function SettingsPage(): React.JSX.Element {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <Badge variant="secondary" className="text-xs">Coming in Day 18</Badge>
      </div>
      <p className="max-w-xl text-muted-foreground">
        Manage your account, team members, API keys, notification preferences,
        and integrations. Configure review personas and quality thresholds.
      </p>
      <DashboardPageSkeleton />
    </motion.div>
  );
}
