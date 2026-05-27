import { Navbar } from '@/components/landing/navbar';
import { Hero } from '@/components/landing/hero';
import { LogosBar } from '@/components/landing/logos-bar';
import { FeaturesBento } from '@/components/landing/features-bento';
import { HowItWorks } from '@/components/landing/how-it-works';
import { PersonasShowcase } from '@/components/landing/personas-showcase';
import { CodeDiffDemo } from '@/components/landing/code-diff-demo';
import { Pricing } from '@/components/landing/pricing';
import { Testimonials } from '@/components/landing/testimonials';
import { CtaBanner } from '@/components/landing/cta-banner';
import { Footer } from '@/components/landing/footer';

/**
 * CodeReview.ai — Landing Page
 *
 * Multi-section marketing page composed of 11 independently animated sections.
 * This is a Server Component that imports client components as needed.
 */
export default function LandingPage(): React.JSX.Element {
  return (
    <main>
      <Navbar />
      <Hero />
      <LogosBar />
      <FeaturesBento />
      <HowItWorks />
      <PersonasShowcase />
      <CodeDiffDemo />
      <Pricing />
      <Testimonials />
      <CtaBanner />
      <Footer />
    </main>
  );
}
