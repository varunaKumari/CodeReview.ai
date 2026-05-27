'use client';

import { Code2 } from 'lucide-react';
import { motion } from 'framer-motion';

import { fadeIn } from '@/lib/motion';

/**
 * Auth layout — full-screen centered layout for sign-in/sign-up pages.
 *
 * Features:
 * - Animated dot grid background
 * - CodeReview.ai logo at top
 * - Framer Motion fade-in on mount
 * - Centered card container
 */
export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Animated background decoration */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-32 -top-32 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute -right-32 bottom-0 h-[350px] w-[350px] rounded-full bg-chart-4/5 blur-[100px]" />
        <div className="bg-dot-grid absolute inset-0 opacity-[0.12]" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="flex w-full flex-col items-center gap-8 px-4"
      >
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Code2 className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold tracking-tight">CodeReview.ai</span>
        </a>

        {/* Auth card (Clerk renders here) */}
        {children}
      </motion.div>
    </div>
  );
}
