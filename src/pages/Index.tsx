import { Layout } from "@/components/layout/Layout";
import { HeroSlider } from "@/components/home/HeroSlider";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ServicesSection } from "@/components/home/ServicesSection";
import { StatsSection } from "@/components/home/StatsSection";
import { PartnersSection } from "@/components/home/PartnersSection";
import { LocationSection } from "@/components/home/LocationSection";
import About from "@/components/home/AboutHomePage";

const Index = () => {
  return (
    <Layout>
      <HeroSlider />
      <StatsSection />
      <About />
      <FeaturedProducts />
      <ServicesSection />
      <PartnersSection />
      <LocationSection />
    </Layout>
  );
};

export default Index;
