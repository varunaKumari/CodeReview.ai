'use client';

import { motion } from 'framer-motion';
import {
  Users,
  GitPullRequest,
  BarChart3,
  Shield,
  Wand2,
  MessageSquare,
  Check,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { SectionBadge } from '@/components/landing/section-badge';
import { SectionHeader } from '@/components/landing/section-header';
import { staggerContainer, fadeIn } from '@/lib/motion';

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  content: React.ReactNode;
}

const features: FeatureCard[] = [
  {
    title: 'Multi-Persona AI Reviews',
    description:
      'Three distinct AI personas analyze every pull request — a security-focused critic, a patient mentor, and a performance optimizer.',
    icon: <Users className="h-5 w-5" />,
    className: 'lg:col-span-2 lg:row-span-2',
    content: (
      <div className="mt-6 space-y-3">
        <div className="flex items-start gap-3 rounded-lg border-l-2 border-red-500 bg-red-500/5 p-3">
          <div className="flex-shrink-0 rounded bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-500">
            Critic
          </div>
          <p className="font-mono text-xs text-muted-foreground">
            SQL injection vulnerability in the query builder. Use parameterized queries.
          </p>
        </div>
        <div className="flex items-start gap-3 rounded-lg border-l-2 border-blue-500 bg-blue-500/5 p-3">
          <div className="flex-shrink-0 rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-500">
            Mentor
          </div>
          <p className="font-mono text-xs text-muted-foreground">
            Consider extracting this into a custom hook for reusability across components.
          </p>
        </div>
        <div className="flex items-start gap-3 rounded-lg border-l-2 border-green-500 bg-green-500/5 p-3">
          <div className="flex-shrink-0 rounded bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-500">
            Optimizer
          </div>
          <p className="font-mono text-xs text-muted-foreground">
            This loop runs in O(n²). Use a hash map to reduce to O(n).
          </p>
        </div>
      </div>
    ),
  },
  {
    title: 'Real-time GitHub PR Analysis',
    description:
      'Instant analysis the moment a PR is opened. See inline comments, diffs, and suggestions directly on your pull request.',
    icon: <GitPullRequest className="h-5 w-5" />,
    content: (
      <div className="mt-4 overflow-hidden rounded-lg border border-border/50 bg-background/50 font-mono text-xs">
        <div className="border-b border-border/50 px-3 py-1.5 text-muted-foreground">
          src/auth.ts
        </div>
        <div className="space-y-0">
          <div className="flex">
            <span className="w-8 flex-shrink-0 select-none px-2 text-right text-muted-foreground/50">
              12
            </span>
            <span className="flex-1 bg-red-500/10 px-2 py-0.5 text-red-400">
              - const token = jwt.sign(user, SECRET);
            </span>
          </div>
          <div className="flex">
            <span className="w-8 flex-shrink-0 select-none px-2 text-right text-muted-foreground/50">
              12
            </span>
            <span className="flex-1 bg-green-500/10 px-2 py-0.5 text-green-400">
              + const token = jwt.sign(user, SECRET, &#123; expiresIn: &apos;1h&apos; &#125;);
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Code Quality Scoring',
    description:
      'Get a comprehensive quality score across multiple dimensions for every review.',
    icon: <BarChart3 className="h-5 w-5" />,
    content: (
      <div className="mt-4 space-y-3">
        {[
          { label: 'Security', value: 92, color: 'bg-green-500' },
          { label: 'Performance', value: 88, color: 'bg-blue-500' },
          { label: 'Readability', value: 95, color: 'bg-purple-500' },
          { label: 'Maintainability', value: 78, color: 'bg-yellow-500' },
        ].map((metric) => (
          <div key={metric.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{metric.label}</span>
              <span className="font-mono font-medium">{metric.value}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full ${metric.color}`}
                style={{ width: `${metric.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'Security Scanner',
    description:
      'Automatically detect vulnerabilities, secrets exposure, and insecure patterns in every commit.',
    icon: <Shield className="h-5 w-5" />,
    content: (
      <div className="mt-4 space-y-2">
        {[
          'SQL injection patterns detected',
          'Exposed API keys & secrets',
          'Insecure dependency versions',
        ].map((check) => (
          <div
            key={check}
            className="flex items-center gap-2 rounded-md bg-green-500/5 px-3 py-2 text-xs"
          >
            <Check className="h-3.5 w-3.5 flex-shrink-0 text-green-500" />
            <span className="text-muted-foreground">{check}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'Auto-Fix Suggestions',
    description:
      'Get one-click fix suggestions for common issues. Apply patches directly from the review.',
    icon: <Wand2 className="h-5 w-5" />,
    content: (
      <div className="mt-4 overflow-hidden rounded-lg border border-border/50 bg-background/50 font-mono text-xs">
        <div className="border-b border-border/50 px-3 py-1.5 text-muted-foreground">
          Suggested fix
        </div>
        <div className="space-y-0">
          <div className="flex">
            <span className="w-8 flex-shrink-0 select-none px-2 text-right text-muted-foreground/50">
              7
            </span>
            <span className="flex-1 bg-red-500/10 px-2 py-0.5 text-red-400">
              - if (password == input)
            </span>
          </div>
          <div className="flex">
            <span className="w-8 flex-shrink-0 select-none px-2 text-right text-muted-foreground/50">
              7
            </span>
            <span className="flex-1 bg-green-500/10 px-2 py-0.5 text-green-400">
              + if (await bcrypt.compare(input, hash))
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Repository Chatbot',
    description:
      'Chat with your codebase. Ask questions about architecture, find bugs, or get explanations of complex logic.',
    icon: <MessageSquare className="h-5 w-5" />,
    className: 'lg:col-span-2',
    content: (
      <div className="mt-4 space-y-3">
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-xl rounded-br-sm bg-primary/10 px-3 py-2 text-xs text-foreground">
            How does the auth middleware handle token refresh?
          </div>
        </div>
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-xl rounded-bl-sm bg-muted px-3 py-2 text-xs text-muted-foreground">
            The middleware checks the JWT expiry in <code className="text-primary">middleware.ts:23</code>. When a token is within 5 min of expiry, it calls <code className="text-primary">refreshToken()</code> and sets the new cookie.
          </div>
        </div>
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-xl rounded-br-sm bg-primary/10 px-3 py-2 text-xs text-foreground">
            What happens if the refresh token is also expired?
          </div>
        </div>
      </div>
    ),
  },
];

export function FeaturesBento(): React.JSX.Element {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <SectionBadge text="Features" />
        </div>
        <div className="mt-4">
          <SectionHeader
            title="Everything you need for better code"
            subtitle="Powerful tools that integrate seamlessly into your GitHub workflow — so your team ships higher quality code, faster."
          />
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeIn}
              className={`group rounded-xl border border-border/50 bg-card/50 p-6 transition-transform hover:-translate-y-1 ${feature.className ?? ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
              {feature.content}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
