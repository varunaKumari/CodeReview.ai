// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// @codereview-ai/ui — Barrel Exports
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * @module @codereview-ai/ui
 *
 * Shared React component library for the CodeReview.ai platform.
 * Built on shadcn/ui patterns with Radix UI primitives and
 * class-variance-authority for variant management.
 *
 * @example
 * ```tsx
 * import { Button, buttonVariants } from '@codereview-ai/ui';
 *
 * <Button variant="default" size="lg">Get Started</Button>
 * ```
 */

// ── Components ──────────────────────────────────────────────────────────────
export { Button, buttonVariants, type ButtonProps } from './components/Button';

// ── Utilities ───────────────────────────────────────────────────────────────
// Re-export cn for convenience so consumers don't need a separate import
export { cn } from '@codereview-ai/utils';
