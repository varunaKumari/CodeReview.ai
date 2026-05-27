'use client';

import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { DashboardPageSkeleton } from '@/components/dashboard/skeletons';
import { fadeIn } from '@/lib/motion';

export default function BillingPage(): React.JSX.Element {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center gap-3">
        <CreditCard className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <Badge variant="secondary" className="text-xs">Coming in Day 19</Badge>
      </div>
      <p className="max-w-xl text-muted-foreground">
        Manage your subscription, view invoices, and update payment methods.
        Monitor usage against your plan limits and upgrade as your team grows.
      </p>
      <DashboardPageSkeleton />
    </motion.div>
  );
}
