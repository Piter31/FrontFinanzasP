import { LandingNav } from "@/components/landing/landing-nav";
import { Hero } from "@/components/landing/hero";
import { ProblemSection } from "@/components/landing/problem-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { PricingSection } from "@/components/landing/pricing-section";
import { ComparisonTable } from "@/components/landing/comparison-table";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { RoadmapSection } from "@/components/landing/roadmap-section";
import { Testimonials } from "@/components/landing/testimonials";
import { Faq } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/final-cta";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNav />
      <main className="flex-1">
        <Hero />
        <ProblemSection />
        <FeaturesSection />
        <DashboardPreview />
        <PricingSection />
        <ComparisonTable />
        <BenefitsSection />
        <RoadmapSection />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
  );
}
