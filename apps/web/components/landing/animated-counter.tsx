'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface AnimatedCounterProps {
  /** Target number to count up to */
  readonly target: number;
  /** Suffix after the number (e.g., "+", "k", "/5") */
  readonly suffix?: string;
  /** Prefix before the number (e.g., "$") */
  readonly prefix?: string;
  /** Animation duration in ms (default 2000) */
  readonly duration?: number;
  /** CSS class for the number */
  readonly className?: string;
}

/**
 * Count-up animation component that triggers when scrolled into view.
 * Uses requestAnimationFrame for smooth 60fps animation.
 */
export function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  duration = 2000,
  className = '',
}: AnimatedCounterProps): React.JSX.Element {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();

    function animate(currentTime: number): void {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for a satisfying deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    }

    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}
