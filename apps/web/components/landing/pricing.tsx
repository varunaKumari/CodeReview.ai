'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Link from 'next/link';

import { staggerContainer, fadeIn } from '@/lib/motion';
import { SectionBadge } from '@/components/landing/section-badge';
import { SectionHeader } from '@/components/landing/section-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PlanFeature {
  text: string;
  badge?: string;
}

interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: PlanFeature[];
  cta: string;
  ctaLink: string;
  highlighted: boolean;
  variant: 'outline' | 'default';
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Perfect for trying out AI-powered code reviews on personal projects.',
    features: [
      { text: '10 AI reviews/month' },
      { text: '1 repository' },
      { text: 'All 3 personas' },
      { text: 'Community support' },
    ],
    cta: 'Get Started Free',
    ctaLink: '/sign-up',
    highlighted: false,
    variant: 'outline',
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 19,
    yearlyPrice: 15,
    description: 'For professional developers who want unlimited reviews and priority processing.',
    features: [
      { text: 'Unlimited AI reviews' },
      { text: 'Unlimited repositories' },
      { text: 'Priority AI processing' },
      { text: 'Slack notifications' },
      { text: 'Email support' },
    ],
    cta: 'Start Pro Trial',
    ctaLink: '/sign-up?plan=pro',
    highlighted: true,
    variant: 'default',
  },
  {
    id: 'team',
    name: 'Team',
    monthlyPrice: 49,
    yearlyPrice: 39,
    description: 'For engineering teams who need collaboration, analytics, and admin controls.',
    features: [
      { text: 'Everything in Pro' },
      { text: 'Up to 10 members' },
      { text: 'Admin dashboard' },
      { text: 'Usage analytics' },
      { text: 'SSO', badge: 'Coming soon' },
      { text: 'Priority support' },
    ],
    cta: 'Start Team Trial',
    ctaLink: '/sign-up?plan=team',
    highlighted: false,
    variant: 'outline',
  },
];

export function Pricing(): React.JSX.Element {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center">
          <SectionBadge text="Pricing" />
          <SectionHeader
            title={
              <>
                Simple,{' '}
                <span className="gradient-text">transparent pricing</span>
              </>
            }
            subtitle="Start free, upgrade when you're ready. No hidden fees, no surprise charges."
          />
        </div>

        {/* Monthly / Yearly toggle */}
        <div className="mt-10 flex justify-center">
          <div className="flex items-center rounded-full bg-muted/30 p-1">
            <button
              onClick={() => setIsYearly(false)}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
                !isYearly
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium transition-colors ${
                isYearly
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Yearly
              <Badge className="bg-primary/10 text-xs text-primary hover:bg-primary/10">
                Save 20%
              </Badge>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              variants={fadeIn}
              className={`relative rounded-xl p-8 ${
                plan.highlighted
                  ? 'border-2 border-primary bg-card shadow-lg shadow-primary/5'
                  : 'border border-border/50 bg-card/50'
              }`}
            >
              {/* Popular badge */}
              {plan.highlighted && (
                <Badge className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-primary px-4 py-1 text-primary-foreground">
                  Most Popular
                </Badge>
              )}

              {/* Plan name */}
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {plan.description}
              </p>

              {/* Price */}
              <div className="mt-6 flex items-baseline gap-1">
                <motion.span
                  key={isYearly ? 'yearly' : 'monthly'}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-5xl font-bold"
                >
                  ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                </motion.span>
                <span className="text-muted-foreground">/month</span>
              </div>

              {isYearly && plan.monthlyPrice > 0 && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Billed annually (${(isYearly ? plan.yearlyPrice : plan.monthlyPrice) * 12}/year)
                </p>
              )}

              {/* Features */}
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-center gap-3">
                    <Check className="h-4 w-4 flex-shrink-0 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {feature.text}
                    </span>
                    {feature.badge && (
                      <Badge
                        variant="secondary"
                        className="ml-auto text-[10px]"
                      >
                        {feature.badge}
                      </Badge>
                    )}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-8">
                <Button
                  variant={plan.variant}
                  className="w-full"
                  asChild
                >
                  <Link href={plan.ctaLink}>{plan.cta}</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
