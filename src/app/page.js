import dns  from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);


import CTASection from "@/components/Ctasection";
import FeaturedJobs from "@/components/FeaturedJobs";
import FeaturesSection from "@/components/Featuressection";
import GlobeStats from "@/components/GlobeStats";
import HeroSection from "@/components/HeroSection";
import PricingSection from "@/components/Pricingsection";


export default function Home() {
  return (
    <div>

      <HeroSection></HeroSection>
      <GlobeStats></GlobeStats>
      <FeaturedJobs></FeaturedJobs>
      <FeaturesSection></FeaturesSection>
      <PricingSection></PricingSection>
      <CTASection></CTASection>
     
    </div>
  );
}
