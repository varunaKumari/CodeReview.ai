'use client';

import { motion, type Variants } from 'framer-motion';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';

import { fadeIn } from '@/lib/motion';

/**
 * Props for the MotionDiv wrapper component.
 * Extends standard motion.div props with convenience overrides.
 */
interface MotionDivProps extends ComponentPropsWithoutRef<typeof motion.div> {
  /** Delay in seconds before the animation starts */
  delay?: number;
  /** Custom variants — defaults to fadeIn */
  variants?: Variants;
}

/**
 * Reusable Framer Motion wrapper that animates into view.
 *
 * - Uses `whileInView` with `once: true` so elements animate once on scroll
 * - Accepts a `delay` prop for staggered manual control
 * - Falls back to the `fadeIn` variant preset from the motion library
 */
const MotionDiv = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ delay = 0, variants: customVariants, children, ...props }, ref) => {
    const activeVariants = customVariants ?? fadeIn;

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={activeVariants}
        transition={{ delay }}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);

MotionDiv.displayName = 'MotionDiv';

export { MotionDiv };
