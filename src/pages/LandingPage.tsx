import MainLayout from '@/layouts/MainLayout'
import HeroSection from '@/components/HeroSection'
import HowItWorksSection from '@/components/HowItWorksSection'
import ScanSection from '@/components/ScanSection'
import FeaturesSection from '@/components/FeaturesSection'
import StatsSection from '@/components/StatsSection'
import CTASection from '@/components/CTASection'

export default function LandingPage() {
  return (
    <MainLayout>
      <HeroSection />
      <HowItWorksSection />
      <ScanSection />
      <StatsSection />
      <FeaturesSection />
      <CTASection />
    </MainLayout>
  )
}
