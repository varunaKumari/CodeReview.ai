'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

interface SectionBadgeProps {
  /** Text to display inside the badge */
  readonly text: string;
  /** Optional icon before text — defaults to Sparkles */
  readonly icon?: React.ReactNode;
}

/**
 * Animated section label badge with shimmer effect.
 * Used at the top of each landing page section.
 */
export function SectionBadge({ text, icon }: SectionBadgeProps): React.JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
    >
      <Badge
        variant="outline"
        className="relative gap-1.5 overflow-hidden border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary"
      >
        {icon ?? <Sparkles className="h-3.5 w-3.5" />}
        {text}
        {/* Shimmer overlay */}
        <span className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </Badge>
    </motion.div>
  );
}
