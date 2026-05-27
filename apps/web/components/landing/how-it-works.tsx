'use client';

import { motion } from 'framer-motion';
import { Github, GitPullRequest, Sparkles } from 'lucide-react';

import { fadeIn, staggerContainer } from '@/lib/motion';
import { SectionBadge } from '@/components/landing/section-badge';
import { SectionHeader } from '@/components/landing/section-header';

const steps = [
  {
    number: 1,
    icon: Github,
    title: 'Connect GitHub',
    description:
      'Link your GitHub account and select the repositories you want reviewed. Setup takes less than a minute.',
  },
  {
    number: 2,
    icon: GitPullRequest,
    title: 'Open a Pull Request',
    description:
      'Push code and create a PR like you normally do. No changes to your workflow required.',
  },
  {
    number: 3,
    icon: Sparkles,
    title: 'Get AI Review in Seconds',
    description:
      'Three AI personas analyze your code instantly — catching bugs, teaching best practices, and suggesting optimizations.',
  },
] as const;

const terminalLines = [
  { color: 'text-green-400', text: '$ Webhook received: pull_request.opened' },
  { color: 'text-blue-400', text: '$ Starting multi-persona review...' },
  { color: 'text-yellow-400', text: '$ Critic analyzing... done ✓' },
  { color: 'text-blue-400', text: '$ Mentor analyzing... done ✓' },
  { color: 'text-green-400', text: '$ Optimizer analyzing... done ✓' },
  { color: 'text-primary', text: '$ Review complete. Score: 74/100' },
] as const;

export function HowItWorks(): React.JSX.Element {
  return (
    <section id="how-it-works" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center">
          <SectionBadge text="How It Works" />
          <SectionHeader
            title={
              <>
                Up and running in{' '}
                <span className="gradient-text">3 steps</span>
              </>
            }
            subtitle="No complex setup. No configuration files. Connect your repo and let AI do the heavy lifting."
          />
        </div>

        {/* Steps grid with connector */}
        <div className="relative mt-16">
          {/* Connector line between step circles (md+ only) */}
          <div className="absolute left-0 right-0 top-6 hidden md:block">
            <div className="mx-auto flex max-w-4xl items-center justify-center px-16">
              <div className="h-px w-full bg-border" />
            </div>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
          >
            {steps.map((step) => (
              <motion.div
                key={step.number}
                variants={fadeIn}
                className="relative flex flex-col items-center text-center"
              >
                {/* Number badge */}
                <div className="relative z-10 mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-muted/50">
                  <step.icon className="h-7 w-7 text-muted-foreground" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold">{step.title}</h3>

                {/* Description */}
                <p className="mt-2 max-w-xs text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Mock terminal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-16 max-w-3xl"
        >
          <div className="overflow-hidden rounded-xl border bg-card">
            {/* Title bar */}
            <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/70" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <div className="h-3 w-3 rounded-full bg-green-500/70" />
              </div>
              <span className="ml-2 text-xs text-muted-foreground">
                Terminal
              </span>
            </div>

            {/* Terminal content */}
            <div className="space-y-2 p-6 font-mono text-sm">
              {terminalLines.map((line, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.15 }}
                  className={line.color}
                >
                  {line.text}
                </motion.p>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
