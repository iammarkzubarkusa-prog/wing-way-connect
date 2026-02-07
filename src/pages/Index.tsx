import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import TrackingBar from "@/components/home/TrackingBar";
import ServicesSection from "@/components/home/ServicesSection";
import ShippingCalculator from "@/components/home/ShippingCalculator";
import TrustSection from "@/components/home/TrustSection";
import HowItWorks from "@/components/home/HowItWorks";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <TrackingBar />
      <ServicesSection />
      <ShippingCalculator />
      <TrustSection />
      <HowItWorks />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
