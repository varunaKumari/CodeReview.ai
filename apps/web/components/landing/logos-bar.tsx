'use client';

import { motion } from 'framer-motion';

import { fadeIn } from '@/lib/motion';

const companies = ['Stripe', 'Vercel', 'Linear', 'Notion', 'Figma', 'GitHub'] as const;

export function LogosBar(): React.JSX.Element {
  return (
    <section className="border-y border-border/50 py-16">
      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeIn}
        className="text-center text-sm uppercase tracking-wider text-muted-foreground"
      >
        Trusted by engineers at
      </motion.p>

      <div className="relative mt-10 overflow-hidden">
        {/* Fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

        {/* Marquee track — duplicated for seamless loop */}
        <div className="flex animate-[marquee_30s_linear_infinite]">
          {[...companies, ...companies].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="mx-8 flex-shrink-0 text-2xl font-bold text-muted-foreground/40 transition-colors hover:text-muted-foreground"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
