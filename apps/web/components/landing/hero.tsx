'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionBadge } from '@/components/landing/section-badge';
import { staggerContainer, fadeIn } from '@/lib/motion';

export function Hero(): React.JSX.Element {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,hsl(var(--primary)/0.04),transparent)]" />
        {/* Dot grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_1px_at_center,hsl(var(--muted-foreground)/0.15)_1px,transparent_1px)] bg-[length:24px_24px]" />
      </div>

      {/* Content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto w-full max-w-5xl px-4 py-32 text-center sm:px-6 lg:px-8"
      >
        {/* Badge */}
        <motion.div variants={fadeIn}>
          <SectionBadge text="Now in Public Beta" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={fadeIn}
          className="mt-8 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
        >
          AI Code Reviews That
          <br />
          Think Like a{' '}
          <span className="gradient-text">Senior Engineer</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeIn}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
        >
          Connect your GitHub repo. Get instant multi-persona AI reviews — from
          a brutal critic, a patient mentor, and a performance optimizer. All in
          seconds.
        </motion.p>

        {/* CTA row */}
        <motion.div
          variants={fadeIn}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button asChild size="lg" className="rounded-full">
            <Link href="/sign-up">
              Start Reviewing Free
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <a href="#demo">
              <Play className="mr-1 h-4 w-4" />
              View Demo
            </a>
          </Button>
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          variants={fadeIn}
          className="mt-4 text-sm text-muted-foreground"
        >
          No credit card required · Free 10 reviews/month
        </motion.p>

        {/* Floating hero card — mock code review */}
        <motion.div
          variants={fadeIn}
          animate={{ y: [0, -12, 0] }}
          transition={{
            y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="mx-auto mt-16 max-w-2xl"
        >
          <div className="glass rounded-xl border border-border/50 p-6">
            {/* Title bar */}
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <span className="font-mono text-sm text-muted-foreground">
                feat: add user authentication #142
              </span>
            </div>

            {/* Persona tabs */}
            <div className="mt-4 flex gap-2">
              <div className="rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                Critic
              </div>
              <div className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/50 transition-colors">
                Mentor
              </div>
              <div className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/50 transition-colors">
                Optimizer
              </div>
            </div>

            {/* Mock review comment */}
            <div className="mt-4 border-l-2 border-red-500 pl-4">
              <Badge variant="destructive" className="text-[10px]">
                Security
              </Badge>
              <p className="mt-2 font-mono text-sm text-muted-foreground">
                The password is stored in plain text. Use bcrypt or argon2 for
                hashing.
              </p>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4 text-xs text-muted-foreground">
              <span>3 comments</span>
              <span className="font-mono">Score: 74/100</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
