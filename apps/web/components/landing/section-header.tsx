'use client';

import { motion } from 'framer-motion';

interface SectionHeaderProps {
  /** Section title — supports JSX for gradient spans */
  readonly title: React.ReactNode;
  /** Subtitle description text */
  readonly subtitle: string;
  /** Center-align text (default true) */
  readonly centered?: boolean;
}

/**
 * Reusable section title + subtitle block with scroll animation.
 */
export function SectionHeader({
  title,
  subtitle,
  centered = true,
}: SectionHeaderProps): React.JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className={`mx-auto max-w-3xl space-y-4 ${centered ? 'text-center' : ''}`}
    >
      <h2 className="text-4xl font-bold tracking-tight md:text-5xl">{title}</h2>
      <p className="text-lg text-muted-foreground md:text-xl">{subtitle}</p>
    </motion.div>
  );
}
