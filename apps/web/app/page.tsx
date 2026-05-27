'use client';

import { Code2, Palette, Moon, Sparkles, Check } from 'lucide-react';

import { ThemeToggle } from '@/components/ui/theme-toggle';
import { MotionDiv } from '@/components/ui/motion-div';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { staggerContainer, scaleIn } from '@/lib/motion';
import { motion } from 'framer-motion';

/**
 * Day 2 Smoke Test Page.
 *
 * Visually confirms that the entire design system is loaded and functional:
 * - Geist fonts rendering
 * - Tailwind v4 CSS variable tokens (light + dark)
 * - shadcn/ui components working
 * - Framer Motion animations active
 * - ThemeToggle switching between dark/light
 * - Custom utility classes (gradient-text, glass, glow)
 */
export default function SmokeTestPage(): React.JSX.Element {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-chart-4/5 blur-[100px]" />
        <div className="bg-dot-grid absolute inset-0 opacity-[0.15]" />
      </div>

      {/* Top bar */}
      <header className="glass sticky top-0 z-50 border-b">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            <span className="font-semibold tracking-tight">CodeReview.ai</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-5xl px-6 py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-12"
        >
          {/* Hero */}
          <MotionDiv className="text-center" variants={scaleIn}>
            <Badge variant="outline" className="mb-4">
              <Sparkles className="mr-1 h-3 w-3" />
              Day 2 Complete
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="gradient-text">Design System</span>
              <br />
              <span className="text-muted-foreground">Loaded Successfully</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Tailwind CSS v4 tokens, shadcn/ui components, Geist fonts, Framer Motion
              animations, and dark mode — all working.
            </p>
          </MotionDiv>

          <Separator />

          {/* Component showcase */}
          <MotionDiv delay={0.1}>
            <h2 className="mb-6 text-2xl font-semibold tracking-tight">
              <Palette className="mr-2 inline-block h-5 w-5" />
              Component Showcase
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Buttons Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Buttons</CardTitle>
                  <CardDescription>All shadcn/ui button variants</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Button size="sm">Default</Button>
                  <Button size="sm" variant="secondary">Secondary</Button>
                  <Button size="sm" variant="outline">Outline</Button>
                  <Button size="sm" variant="ghost">Ghost</Button>
                  <Button size="sm" variant="destructive">Destructive</Button>
                  <Button size="sm" variant="link">Link</Button>
                </CardContent>
              </Card>

              {/* Badges Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Badges</CardTitle>
                  <CardDescription>Status and label indicators</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </CardContent>
              </Card>

              {/* Typography Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Typography</CardTitle>
                  <CardDescription>Geist Sans + Geist Mono</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="font-sans text-sm">Geist Sans — The quick brown fox</p>
                  <p className="font-mono text-sm text-muted-foreground">
                    Geist Mono — const x = 42;
                  </p>
                  <p className="gradient-text text-sm font-semibold">Gradient text utility</p>
                </CardContent>
              </Card>

              {/* Colors Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Color Tokens</CardTitle>
                  <CardDescription>CSS variable-based theme</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-1.5">
                    <div className="h-8 w-8 rounded-md bg-primary" title="primary" />
                    <div className="h-8 w-8 rounded-md bg-secondary" title="secondary" />
                    <div className="h-8 w-8 rounded-md bg-muted" title="muted" />
                    <div className="h-8 w-8 rounded-md bg-accent" title="accent" />
                    <div className="h-8 w-8 rounded-md bg-destructive" title="destructive" />
                  </div>
                  <div className="mt-2 flex gap-1.5">
                    <div className="h-8 w-8 rounded-md bg-chart-1" title="chart-1" />
                    <div className="h-8 w-8 rounded-md bg-chart-2" title="chart-2" />
                    <div className="h-8 w-8 rounded-md bg-chart-3" title="chart-3" />
                    <div className="h-8 w-8 rounded-md bg-chart-4" title="chart-4" />
                    <div className="h-8 w-8 rounded-md bg-chart-5" title="chart-5" />
                  </div>
                </CardContent>
              </Card>

              {/* Custom Utilities Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Custom Utilities</CardTitle>
                  <CardDescription>Glass, glow, and grid effects</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="glass rounded-lg p-3 text-center text-sm">
                    .glass (glassmorphism)
                  </div>
                  <div className="glow rounded-lg border bg-card p-3 text-center text-sm">
                    .glow (primary shadow)
                  </div>
                </CardContent>
              </Card>

              {/* Dark Mode Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    <Moon className="mr-1.5 inline-block h-4 w-4" />
                    Dark Mode
                  </CardTitle>
                  <CardDescription>Toggle with the button in the header</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Theme is managed by <code className="font-mono text-xs">next-themes</code> via
                    CSS class strategy. Default theme is <strong>dark</strong>.
                  </p>
                </CardContent>
              </Card>
            </div>
          </MotionDiv>

          <Separator />

          {/* Checklist */}
          <MotionDiv delay={0.2}>
            <h2 className="mb-6 text-2xl font-semibold tracking-tight">
              <Check className="mr-2 inline-block h-5 w-5 text-green-500" />
              Everything Loaded
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                'Tailwind CSS v4 with CSS variable tokens',
                'shadcn/ui components (Zinc base)',
                'Geist Sans + Geist Mono fonts',
                'Dark mode via next-themes (class strategy)',
                'Framer Motion animations',
                'Custom keyframes (fade-in, shimmer, slide-up)',
                'Utility classes (glass, gradient-text, glow)',
                'Custom scrollbar + selection styles',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 shrink-0 text-green-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </MotionDiv>
        </motion.div>
      </main>
    </div>
  );
}
