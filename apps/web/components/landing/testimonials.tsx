'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

import { SectionBadge } from '@/components/landing/section-badge';
import { SectionHeader } from '@/components/landing/section-header';
import { AnimatedCounter } from '@/components/landing/animated-counter';

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'Senior Engineer',
    company: 'Stripe',
    initials: 'SC',
    color: 'bg-violet-500',
    quote:
      'CodeReview.ai caught a race condition in our payment processing pipeline that three human reviewers missed. The Critic persona is genuinely ruthless — in the best way.',
  },
  {
    name: 'Marcus Johnson',
    role: 'Tech Lead',
    company: 'Notion',
    initials: 'MJ',
    color: 'bg-blue-500',
    quote:
      'We integrated it into our CI and the Mentor persona has become our best onboarding tool. Junior devs learn best practices directly in their PRs.',
  },
  {
    name: 'Priya Patel',
    role: 'Staff Engineer',
    company: 'Figma',
    initials: 'PP',
    color: 'bg-pink-500',
    quote:
      'The Optimizer rewrote a hot path in our rendering engine that reduced bundle size by 18%. It paid for the annual subscription in one PR.',
  },
  {
    name: 'Alex Rivera',
    role: 'Engineering Manager',
    company: 'Linear',
    initials: 'AR',
    color: 'bg-green-500',
    quote:
      'Review turnaround went from 2 days to 2 minutes. My team ships 3x faster and code quality actually improved. Best engineering investment this year.',
  },
  {
    name: 'Tom Nakamura',
    role: 'Principal Engineer',
    company: 'Vercel',
    initials: 'TN',
    color: 'bg-orange-500',
    quote:
      'I was skeptical about AI reviews until CodeReview.ai found a subtle memory leak in our edge runtime. The security scanner alone is worth the price.',
  },
  {
    name: 'Emma Wilson',
    role: 'CTO',
    company: 'YC Startup',
    initials: 'EW',
    color: 'bg-cyan-500',
    quote:
      'As a 4-person startup, we can\'t afford dedicated code reviewers. CodeReview.ai gives us enterprise-grade reviews at a fraction of the cost.',
  },
] as const;

/**
 * Testimonials section — stats row + 6 testimonial cards in a grid.
 */
export function Testimonials(): React.JSX.Element {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionBadge text="Testimonials" />
        <div className="mt-4">
          <SectionHeader
            title="Loved by developers"
            subtitle="Join thousands of engineers who ship better code with AI-powered reviews."
          />
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mt-12 flex flex-wrap items-center justify-center gap-8 md:gap-16"
        >
          <div className="text-center">
            <AnimatedCounter
              target={10000}
              suffix="+"
              className="text-4xl font-bold"
            />
            <p className="mt-1 text-sm text-muted-foreground">Reviews completed</p>
          </div>
          <div className="hidden h-8 w-px bg-border sm:block" />
          <div className="text-center">
            <AnimatedCounter
              target={500}
              suffix="+"
              className="text-4xl font-bold"
            />
            <p className="mt-1 text-sm text-muted-foreground">Repositories connected</p>
          </div>
          <div className="hidden h-8 w-px bg-border sm:block" />
          <div className="text-center">
            <div className="text-4xl font-bold">
              <AnimatedCounter target={4} className="" />
              .9/5
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Average rating</p>
          </div>
        </motion.div>

        {/* Testimonial cards */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="rounded-xl border border-border/50 bg-card/50 p-6 transition-shadow hover:shadow-lg"
            >
              {/* Header: avatar + name + stars */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white ${testimonial.color}`}
                  >
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-yellow-500 text-yellow-500"
                    />
                  ))}
                </div>
              </div>

              {/* Quote */}
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
