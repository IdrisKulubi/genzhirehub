import Navigation from "@/components/landing/navigation";
import HeroSection from "@/components/landing/hero-section";
import ProblemSection from "@/components/landing/problem-section";
import SolutionSection from "@/components/landing/solution-section";
import SocialProofSection from "@/components/landing/social-proof-section";
import CTASection from "@/components/landing/cta-section";
import FooterSection from "@/components/landing/footer-section";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <CTASection />
      </main>
      <FooterSection />
    </div>
  );
} 