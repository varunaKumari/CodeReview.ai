import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@codereview-ai/utils";

// ────────────────────────────────────────────────
// Variants
// ────────────────────────────────────────────────

/**
 * Class-variance-authority configuration for the `Button` component.
 *
 * Provides variant and size modifiers that map to Tailwind CSS classes.
 * The default variant uses a brand indigo gradient.
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-md text-sm font-medium",
    "transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        /** Brand indigo gradient — primary call-to-action. */
        default: [
          "bg-gradient-to-r from-indigo-600 to-indigo-500",
          "text-white shadow-sm",
          "hover:from-indigo-500 hover:to-indigo-400",
          "active:from-indigo-700 active:to-indigo-600",
        ],
        /** Red destructive action (delete, remove, etc.). */
        destructive: [
          "bg-destructive text-destructive-foreground shadow-sm",
          "hover:bg-destructive/90",
          "active:bg-destructive/80",
        ],
        /** Bordered outline button. */
        outline: [
          "border border-input bg-background shadow-sm",
          "hover:bg-accent hover:text-accent-foreground",
          "active:bg-accent/80",
        ],
        /** Muted secondary action. */
        secondary: [
          "bg-secondary text-secondary-foreground shadow-sm",
          "hover:bg-secondary/80",
          "active:bg-secondary/70",
        ],
        /** Transparent ghost button — hover reveals background. */
        ghost: [
          "hover:bg-accent hover:text-accent-foreground",
          "active:bg-accent/80",
        ],
        /** Styled as a text link with underline on hover. */
        link: [
          "text-primary underline-offset-4",
          "hover:underline",
          "active:text-primary/80",
        ],
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

// ────────────────────────────────────────────────
// Component Types
// ────────────────────────────────────────────────

/**
 * Props for the {@link Button} component.
 *
 * Extends native `<button>` attributes with CVA variant props
 * and an optional `asChild` flag for polymorphic rendering.
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * When `true`, the `Button` delegates rendering to its single child
   * element via Radix UI's `Slot`, merging props and styles.
   *
   * Useful for rendering buttons as `<a>`, Next.js `<Link>`, etc.
   *
   * @default false
   */
  asChild?: boolean;
}

// ────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────

/**
 * A polymorphic button component styled with shadcn/ui conventions.
 *
 * Supports multiple visual variants and sizes via
 * `class-variance-authority`. Use `asChild` to render as a different
 * element while retaining button styles.
 *
 * @example
 * ```tsx
 * // Standard button
 * <Button variant="default" size="lg">Get Started</Button>
 *
 * // As a Next.js Link
 * <Button asChild variant="outline">
 *   <Link href="/dashboard">Dashboard</Link>
 * </Button>
 *
 * // Icon button
 * <Button variant="ghost" size="icon">
 *   <TrashIcon />
 * </Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
