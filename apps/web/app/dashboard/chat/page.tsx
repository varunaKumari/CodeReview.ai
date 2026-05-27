'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { DashboardPageSkeleton } from '@/components/dashboard/skeletons';
import { fadeIn } from '@/lib/motion';

export default function ChatPage(): React.JSX.Element {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center gap-3">
        <MessageCircle className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Chat</h1>
        <Badge variant="secondary" className="text-xs">Coming in Day 12</Badge>
      </div>
      <p className="max-w-xl text-muted-foreground">
        Chat with your codebase using AI. Ask questions about architecture, find
        patterns, and get context-aware answers grounded in your actual code.
      </p>
      <DashboardPageSkeleton />
    </motion.div>
  );
}
