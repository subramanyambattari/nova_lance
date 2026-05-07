import { AnalyticsPreview } from "@/components/nova-pro/analytics-preview"
import { ComparisonTable } from "@/components/nova-pro/comparison-table"
import { FaqSection } from "@/components/nova-pro/faq-section"
import { FeaturesGrid } from "@/components/nova-pro/features-grid"
import { FinalCta } from "@/components/nova-pro/final-cta"
import { HeroSection } from "@/components/nova-pro/hero-section"
import { PricingCards } from "@/components/nova-pro/pricing-cards"
import { Testimonials } from "@/components/nova-pro/testimonials"

export function NovaProPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none fixed inset-0 -z-0">
        <div className="absolute left-1/4 top-16 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-10 top-96 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      </div>
      <div className="relative z-0 mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-6 sm:px-6 lg:px-8">
        <HeroSection />
        <PricingCards />
        <FeaturesGrid />
        <AnalyticsPreview />
        <ComparisonTable />
        <Testimonials />
        <FaqSection />
        <FinalCta />
      </div>
    </div>
  )
}
