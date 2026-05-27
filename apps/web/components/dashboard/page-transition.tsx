'use client';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Wraps page content and animates on route change.
 * Uses usePathname() as key so AnimatePresence re-triggers
 * whenever the URL changes.
 */
export function PageTransition({
  children,
}: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
