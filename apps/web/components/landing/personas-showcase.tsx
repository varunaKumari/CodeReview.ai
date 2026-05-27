'use client';

import { motion } from 'framer-motion';

import { staggerContainer } from '@/lib/motion';
import { SectionBadge } from '@/components/landing/section-badge';
import { SectionHeader } from '@/components/landing/section-header';

const personas = [
  {
    id: 'critic',
    emoji: '🔴',
    name: 'The Critic',
    borderColor: 'border-t-red-500',
    hoverShadow: 'hover:shadow-red-500/10',
    description:
      'Finds every bug, anti-pattern, and security hole. Brutal but essential.',
    codeBlock: (
      <div className="mt-4 rounded-lg bg-muted/30 p-4 font-mono text-sm">
        <p className="text-red-400">
          {'// ⚠ SQL injection vulnerability detected'}
        </p>
        <p className="mt-1 text-muted-foreground">
          {'const query = `SELECT * FROM users WHERE id = ${userId}`;'}
        </p>
        <p className="mt-2 text-red-400/80">
          {'→ Use parameterized queries to prevent SQL injection attacks.'}
        </p>
      </div>
    ),
  },
  {
    id: 'mentor',
    emoji: '🔵',
    name: 'The Mentor',
    borderColor: 'border-t-blue-500',
    hoverShadow: 'hover:shadow-blue-500/10',
    description:
      'Explains WHY something is wrong. Teaches best practices with patience.',
    codeBlock: (
      <div className="mt-4 rounded-lg bg-muted/30 p-4 font-mono text-sm">
        <p className="text-blue-400">
          {'// 💡 Consider using the Repository pattern here'}
        </p>
        <p className="mt-1 text-muted-foreground">
          {'async function getUser(id: string) {'}
        </p>
        <p className="text-muted-foreground">
          {'  return db.query(`SELECT * FROM users WHERE id = ?`, [id]);'}
        </p>
        <p className="text-muted-foreground">{'}'}</p>
        <p className="mt-2 text-blue-400/80">
          {'→ This improves testability and separates concerns. See: martinfowler.com/eaaCatalog'}
        </p>
      </div>
    ),
  },
  {
    id: 'optimizer',
    emoji: '🟢',
    name: 'The Optimizer',
    borderColor: 'border-t-green-500',
    hoverShadow: 'hover:shadow-green-500/10',
    description:
      'Rewrites your code cleaner and faster. Shows the diff.',
    codeBlock: (
      <div className="mt-4 space-y-3 rounded-lg bg-muted/30 p-4 font-mono text-sm">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Before
          </p>
          <p className="text-red-400 line-through">
            {'users.filter(u => u.active).map(u => u.name)'}
          </p>
        </div>
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            After
          </p>
          <p className="text-green-400">
            {'users.reduce((names, u) => u.active ? [...names, u.name] : names, [])'}
          </p>
        </div>
        <p className="text-green-400/80">
          {'→ Single pass reduces time complexity from O(2n) to O(n).'}
        </p>
      </div>
    ),
  },
] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.15,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export function PersonasShowcase(): React.JSX.Element {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center">
          <SectionBadge text="AI Personas" />
          <SectionHeader
            title={
              <>
                Three perspectives.{' '}
                <span className="gradient-text">One review.</span>
              </>
            }
            subtitle="Every pull request gets analyzed from three distinct angles — security, education, and performance — so nothing slips through."
          />
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {personas.map((persona, index) => (
            <motion.div
              key={persona.id}
              custom={index}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`rounded-xl border border-border/50 border-t-2 bg-card/50 p-6 transition-shadow duration-300 ${persona.borderColor} ${persona.hoverShadow} hover:shadow-lg`}
            >
              <h3 className="text-xl font-semibold">
                {persona.emoji} {persona.name}
              </h3>
              <p className="mt-2 text-muted-foreground">
                {persona.description}
              </p>
              {persona.codeBlock}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
