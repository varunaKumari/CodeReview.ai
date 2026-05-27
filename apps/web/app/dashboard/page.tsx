'use client';

import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowDownRight,
  GitBranch,
  MessageSquareCode,
  Shield,
  Code,
  UserPlus,
  BookOpen,
  Plus,
  Star,
  Check,
  Circle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AnimatedCounter } from '@/components/landing/animated-counter';
import { staggerContainer, fadeIn } from '@/lib/motion';

/* ═══════════════════════════════════════════════════════
 * MOCK DATA — Replace with real API calls (Day 7+)
 * ═══════════════════════════════════════════════════════ */

const MOCK_STATS = [
  {
    label: 'Total Reviews',
    value: 142,
    change: '+12%',
    trend: 'up' as const,
    suffix: '',
    icon: MessageSquareCode,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    label: 'Avg Score',
    value: 78,
    change: '+3 pts',
    trend: 'up' as const,
    suffix: '/100',
    icon: Star,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  {
    label: 'Issues Found',
    value: 847,
    change: '-8%',
    trend: 'down' as const,
    suffix: '',
    icon: Shield,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  {
    label: 'Repos Connected',
    value: 6,
    change: '2 new',
    trend: 'up' as const,
    suffix: '',
    icon: GitBranch,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
];

const MOCK_REVIEWS = [
  {
    id: '1',
    repo: 'codereview-ai/web',
    pr: 'feat: add user authentication flow',
    score: 82,
    status: 'Completed' as const,
    timeAgo: '5m ago',
    avatar: 'SC',
    avatarColor: 'bg-violet-500',
  },
  {
    id: '2',
    repo: 'codereview-ai/api',
    pr: 'fix: rate limiter edge case',
    score: 91,
    status: 'Completed' as const,
    timeAgo: '22m ago',
    avatar: 'MJ',
    avatarColor: 'bg-blue-500',
  },
  {
    id: '3',
    repo: 'acme-corp/dashboard',
    pr: 'refactor: migrate to server components',
    score: 67,
    status: 'Completed' as const,
    timeAgo: '1h ago',
    avatar: 'PP',
    avatarColor: 'bg-pink-500',
  },
  {
    id: '4',
    repo: 'acme-corp/api',
    pr: 'feat: add webhook handlers',
    score: 0,
    status: 'Processing' as const,
    timeAgo: '2h ago',
    avatar: 'AR',
    avatarColor: 'bg-green-500',
  },
  {
    id: '5',
    repo: 'personal/blog',
    pr: 'chore: update dependencies',
    score: 95,
    status: 'Completed' as const,
    timeAgo: '5h ago',
    avatar: 'TN',
    avatarColor: 'bg-orange-500',
  },
];

const MOCK_REPOS = [
  {
    id: '1',
    name: 'codereview-ai/web',
    isPrivate: false,
    language: 'TypeScript',
    langColor: 'bg-blue-500',
    lastReview: '5 minutes ago',
    reviewCount: 48,
    avgScore: 78,
    stars: 234,
  },
  {
    id: '2',
    name: 'codereview-ai/api',
    isPrivate: true,
    language: 'TypeScript',
    langColor: 'bg-blue-500',
    lastReview: '22 minutes ago',
    reviewCount: 65,
    avgScore: 85,
    stars: 0,
  },
  {
    id: '3',
    name: 'acme-corp/dashboard',
    isPrivate: true,
    language: 'TypeScript',
    langColor: 'bg-blue-500',
    lastReview: '1 hour ago',
    reviewCount: 29,
    avgScore: 72,
    stars: 12,
  },
];

const ONBOARDING_STEPS = [
  { label: 'Create your account', done: true },
  { label: 'Connect your first repository', done: false },
  { label: 'Review your first pull request', done: false },
  { label: 'Invite a team member', done: false },
  { label: 'Set up Slack notifications', done: false },
];

/* ═══════════════════════════════════════════════════════ */

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function scoreColor(score: number): string {
  if (score >= 80) return 'text-green-500 bg-green-500/10';
  if (score >= 60) return 'text-yellow-500 bg-yellow-500/10';
  return 'text-red-500 bg-red-500/10';
}

export default function DashboardPage(): React.JSX.Element {
  const { user } = useUser();
  const completedSteps = ONBOARDING_STEPS.filter((s) => s.done).length;
  const progress = (completedSteps / ONBOARDING_STEPS.length) * 100;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* ── Welcome header ────────────────────────────── */}
      <motion.div
        variants={fadeIn}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {getGreeting()}, {user?.firstName ?? 'there'} 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here&apos;s what&apos;s happening with your code today.
          </p>
        </div>
        <Button className="gap-2 rounded-full">
          <Plus className="h-4 w-4" />
          New Review
        </Button>
      </motion.div>

      {/* ── Stats row ─────────────────────────────────── */}
      <motion.div
        variants={fadeIn}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {MOCK_STATS.map((stat) => (
          <Card key={stat.label} className="border-border/50 bg-card/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                </span>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bgColor}`}
                >
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  <AnimatedCounter target={stat.value} duration={1500} />
                  {stat.suffix}
                </span>
                <Badge
                  variant="secondary"
                  className={`text-xs ${
                    stat.trend === 'up'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="mr-0.5 h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="mr-0.5 h-3 w-3" />
                  )}
                  {stat.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* ── Activity + Quick actions ──────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Recent reviews (3/5 width) */}
        <motion.div variants={fadeIn} className="lg:col-span-3">
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="flex-row items-center justify-between pb-4">
              <CardTitle className="text-base">Recent Reviews</CardTitle>
              <Button asChild variant="ghost" size="sm" className="text-xs">
                <Link href="/dashboard/reviews">View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-1 px-4 pb-4">
              {MOCK_REVIEWS.map((review) => (
                <Link
                  key={review.id}
                  href="/dashboard/reviews"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50"
                >
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${review.avatarColor}`}
                  >
                    {review.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{review.pr}</p>
                    <p className="text-xs text-muted-foreground">
                      {review.repo} · {review.timeAgo}
                    </p>
                  </div>
                  {review.status === 'Processing' ? (
                    <Badge variant="secondary" className="text-xs">
                      Processing
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className={`text-xs ${scoreColor(review.score)}`}
                    >
                      {review.score}/100
                    </Badge>
                  )}
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick actions (2/5 width) */}
        <motion.div variants={fadeIn} className="lg:col-span-2">
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 px-4 pb-4">
              {[
                {
                  label: 'Connect Repo',
                  icon: GitBranch,
                  href: '/dashboard/repositories',
                  color: 'text-green-500',
                },
                {
                  label: 'Review Code',
                  icon: Code,
                  href: '/dashboard/reviews',
                  color: 'text-blue-500',
                },
                {
                  label: 'Invite Member',
                  icon: UserPlus,
                  href: '/dashboard/settings',
                  color: 'text-violet-500',
                },
                {
                  label: 'View Docs',
                  icon: BookOpen,
                  href: '/docs',
                  color: 'text-orange-500',
                },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-muted/30 p-4 text-center transition-colors hover:bg-muted/60"
                >
                  <action.icon className={`h-6 w-6 ${action.color}`} />
                  <span className="text-xs font-medium">{action.label}</span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Repositories overview ─────────────────────── */}
      <motion.div variants={fadeIn}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Repositories</h2>
          <Button asChild variant="ghost" size="sm" className="text-xs">
            <Link href="/dashboard/repositories">View all</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_REPOS.map((repo) => (
            <Card
              key={repo.id}
              className="border-border/50 bg-card/50 transition-transform hover:-translate-y-0.5"
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="truncate text-sm font-semibold">{repo.name}</h3>
                  <Badge variant="outline" className="text-[10px]">
                    {repo.isPrivate ? 'Private' : 'Public'}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${repo.langColor}`}
                    />
                    {repo.language}
                  </span>
                  {repo.stars > 0 && (
                    <span className="flex items-center gap-0.5">
                      <Star className="h-3 w-3" />
                      {repo.stars}
                    </span>
                  )}
                </div>
                <Separator className="my-3" />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {repo.reviewCount} reviews · {repo.lastReview}
                  </span>
                </div>
                {/* Avg score mini bar */}
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Avg Score</span>
                    <span className="font-medium">{repo.avgScore}/100</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${
                        repo.avgScore >= 80
                          ? 'bg-green-500'
                          : repo.avgScore >= 60
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${repo.avgScore}%` }}
                    />
                  </div>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full text-xs"
                >
                  <Link href="/dashboard/reviews">Review Now</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* ── Onboarding checklist ──────────────────────── */}
      <motion.div variants={fadeIn}>
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">
              Get started with CodeReview.ai
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Complete these steps to unlock the full experience.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6">
            {/* Progress bar */}
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {completedSteps}/{ONBOARDING_STEPS.length} completed
                </span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <div className="mt-1.5 h-2 w-full rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-2">
              {ONBOARDING_STEPS.map((step, i) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 rounded-lg px-3 py-2"
                >
                  {step.done ? (
                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  ) : (
                    <Circle className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  )}
                  <span
                    className={`text-sm ${
                      step.done
                        ? 'text-muted-foreground line-through'
                        : 'font-medium'
                    }`}
                  >
                    {step.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
