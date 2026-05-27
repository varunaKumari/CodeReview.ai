'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';

import { Button } from '@/components/ui/button';

/**
 * Full-width CTA banner with gradient background and animated dots.
 */
export function CtaBanner(): React.JSX.Element {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-chart-4/10 px-8 py-16 text-center md:px-16 md:py-24"
        >
          {/* Animated background dots */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/4 top-1/4 h-2 w-2 animate-pulse rounded-full bg-primary/30" />
            <div
              className="absolute right-1/3 top-1/3 h-1.5 w-1.5 animate-pulse rounded-full bg-chart-4/30"
              style={{ animationDelay: '0.5s' }}
            />
            <div
              className="absolute bottom-1/4 left-1/3 h-2.5 w-2.5 animate-pulse rounded-full bg-primary/20"
              style={{ animationDelay: '1s' }}
            />
            <div
              className="absolute bottom-1/3 right-1/4 h-1.5 w-1.5 animate-pulse rounded-full bg-chart-4/20"
              style={{ animationDelay: '1.5s' }}
            />
            <div
              className="absolute left-1/2 top-1/2 h-3 w-3 animate-pulse rounded-full bg-primary/10"
              style={{ animationDelay: '2s' }}
            />
            <div
              className="absolute right-1/2 bottom-1/2 h-2 w-2 animate-pulse rounded-full bg-chart-4/15"
              style={{ animationDelay: '0.8s' }}
            />
          </div>

          {/* Radial glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.15),transparent_70%)]" />

          <div className="relative z-10 mx-auto max-w-2xl space-y-6">
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              Ready to ship better code?
            </h2>
            <p className="text-lg text-muted-foreground md:text-xl">
              Join 10,000+ developers who review smarter with AI.
              Get started in under 2 minutes.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/sign-up">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <Link href="/docs">
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Docs
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
