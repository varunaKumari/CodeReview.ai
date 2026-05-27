'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import { fadeIn, fadeInLeft } from '@/lib/motion';
import { SectionBadge } from '@/components/landing/section-badge';
import { SectionHeader } from '@/components/landing/section-header';
import { AnimatedCounter } from '@/components/landing/animated-counter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Persona = 'critic' | 'mentor' | 'optimizer';

interface ReviewComment {
  severity: 'Error' | 'Warning' | 'Info';
  text: string;
}

const diffLines = [
  { type: 'normal', content: 'async function login(req: Request) {' },
  { type: 'normal', content: '  const { email, password } = await req.json();' },
  { type: 'removed', content: '  const user = await db.query(' },
  { type: 'removed', content: '    `SELECT * FROM users WHERE email = \'${email}\'`' },
  { type: 'removed', content: '  );' },
  { type: 'added', content: '  const user = await db.query(' },
  { type: 'added', content: '    "SELECT * FROM users WHERE email = $1",' },
  { type: 'added', content: '    [email]' },
  { type: 'added', content: '  );' },
  { type: 'normal', content: '  if (!user) return Response.json({ error: "Not found" }, { status: 404 });' },
  { type: 'removed', content: '  if (password === user.password) {' },
  { type: 'added', content: '  if (await bcrypt.compare(password, user.passwordHash)) {' },
  { type: 'normal', content: '    const token = jwt.sign({ id: user.id }, SECRET);' },
  { type: 'normal', content: '    return Response.json({ token });' },
  { type: 'normal', content: '  }' },
  { type: 'normal', content: '}' },
] as const;

const tabs: { id: Persona; label: string; color: string; activeColor: string }[] = [
  { id: 'critic', label: 'Critic', color: 'bg-red-500', activeColor: 'bg-red-500/20 text-red-400' },
  { id: 'mentor', label: 'Mentor', color: 'bg-blue-500', activeColor: 'bg-blue-500/20 text-blue-400' },
  { id: 'optimizer', label: 'Optimizer', color: 'bg-green-500', activeColor: 'bg-green-500/20 text-green-400' },
];

const reviewComments: Record<Persona, ReviewComment[]> = {
  critic: [
    {
      severity: 'Error',
      text: 'SQL injection vulnerability: raw string interpolation in query. Use parameterized queries.',
    },
    {
      severity: 'Error',
      text: 'Plain-text password comparison detected. Never store or compare passwords in plain text.',
    },
    {
      severity: 'Warning',
      text: 'Missing rate limiting on login endpoint. Vulnerable to brute-force attacks.',
    },
  ],
  mentor: [
    {
      severity: 'Info',
      text: 'Great fix using parameterized queries! This prevents SQL injection by separating data from code.',
    },
    {
      severity: 'Info',
      text: 'Using bcrypt.compare is the right approach. Consider also adding a work factor of at least 12.',
    },
    {
      severity: 'Warning',
      text: 'Consider extracting auth logic into a service layer for better testability and reuse.',
    },
  ],
  optimizer: [
    {
      severity: 'Info',
      text: 'Add a unique index on users.email to avoid full table scans on every login.',
    },
    {
      severity: 'Warning',
      text: 'Return identical error messages for "not found" and "wrong password" to prevent user enumeration.',
    },
    {
      severity: 'Info',
      text: 'Consider using a prepared statement cache to avoid re-parsing the SQL query on every request.',
    },
  ],
};

const severityStyles: Record<string, string> = {
  Error: 'bg-red-500/10 text-red-400 border-red-500/30',
  Warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  Info: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
};

const borderColorMap: Record<Persona, string> = {
  critic: 'border-l-red-500',
  mentor: 'border-l-blue-500',
  optimizer: 'border-l-green-500',
};

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export function CodeDiffDemo(): React.JSX.Element {
  const [activePersona, setActivePersona] = useState<Persona>('critic');

  return (
    <section id="demo" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center">
          <SectionBadge text="Live Demo" />
          <SectionHeader
            title={
              <>
                See it{' '}
                <span className="gradient-text">in action</span>
              </>
            }
            subtitle="Watch how CodeReview.ai analyzes a real pull request in real-time — from code diff to actionable feedback."
          />
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* LEFT: Code diff viewer */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="overflow-hidden rounded-xl border bg-card"
          >
            {/* Title bar */}
            <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/70" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <div className="h-3 w-3 rounded-full bg-green-500/70" />
              </div>
              <span className="ml-2 text-xs text-muted-foreground">
                src/auth/login.ts
              </span>
            </div>

            {/* Code area */}
            <div className="overflow-x-auto p-4 font-mono text-sm leading-6">
              {diffLines.map((line, index) => {
                let lineClass = 'text-muted-foreground';
                let prefix = ' ';
                let bgClass = '';

                if (line.type === 'removed') {
                  lineClass = 'text-red-400';
                  prefix = '-';
                  bgClass = 'bg-red-500/10';
                } else if (line.type === 'added') {
                  lineClass = 'text-green-400';
                  prefix = '+';
                  bgClass = 'bg-green-500/10';
                }

                return (
                  <div
                    key={index}
                    className={`flex ${bgClass} -mx-4 px-4`}
                  >
                    <span className="mr-4 inline-block w-4 select-none text-muted-foreground/40">
                      {prefix}
                    </span>
                    <span className={lineClass}>{line.content}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* RIGHT: AI review panel */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="flex flex-col overflow-hidden rounded-xl border bg-card"
          >
            {/* Header with score */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-lg font-semibold">AI Review Summary</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Score:</span>
                <AnimatedCounter
                  target={74}
                  suffix="/100"
                  className="text-2xl font-bold text-primary"
                />
              </div>
            </div>

            {/* Persona tabs */}
            <div className="flex gap-1 border-b px-6 py-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActivePersona(tab.id)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    activePersona === tab.id
                      ? tab.activeColor
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className={`h-2 w-2 rounded-full ${tab.color}`} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Review comments */}
            <div className="flex-1 space-y-4 p-6">
              {reviewComments[activePersona].map((comment, index) => (
                <motion.div
                  key={`${activePersona}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`space-y-1 border-l-2 py-2 pl-4 ${borderColorMap[activePersona]}`}
                >
                  <Badge
                    variant="outline"
                    className={`text-xs ${severityStyles[comment.severity]}`}
                  >
                    {comment.severity}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {comment.text}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-4">
              <Button className="w-full gap-2">
                View Full Review
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
