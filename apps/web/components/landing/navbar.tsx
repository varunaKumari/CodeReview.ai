'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Code2, Menu } from 'lucide-react';
import { SignInButton } from '@clerk/nextjs';

import { cn } from '@codereview-ai/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Changelog', href: '#changelog' },
] as const;

export function Navbar(): React.JSX.Element {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed left-0 right-0 top-0 z-50 h-16 glass',
        scrolled && 'border-b border-border',
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Code2 className="h-6 w-6 text-primary" />

          <span className="gradient-text text-lg font-bold tracking-tight">
            CodeReview.ai
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="hidden cursor-pointer gap-1 text-xs sm:inline-flex"
          >
            2.4k ★
          </Badge>

          <ThemeToggle />

          {/* Desktop Auth */}
          <div className="hidden items-center gap-2 md:flex">
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </SignInButton>

            <Button asChild size="sm" className="rounded-full">
              <Link href="/sign-up">Get Started</Link>
            </Button>

            <Button asChild size="sm" className="rounded-full">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-primary" />

                  <span className="gradient-text font-bold">
                    CodeReview.ai
                  </span>
                </SheetTitle>
              </SheetHeader>

              {/* Mobile Nav */}
              <nav className="mt-8 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              {/* Mobile Auth */}
              <div className="mt-6 flex flex-col gap-2 border-t border-border pt-6">
                <SignInButton mode="modal">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    Sign In
                  </Button>
                </SignInButton>

                <Button asChild className="rounded-full">
                  <Link href="/sign-up">Get Started</Link>
                </Button>

                <Button asChild className="rounded-full">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
}