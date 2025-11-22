import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ResourceCategories } from "@/components/ResourceCategories";
import { MapSection } from "@/components/MapSection";
import { CommunitySection } from "@/components/CommunitySection";
import { EmergencyAlerts } from "@/components/EmergencyAlerts";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ResourceCategories />
        <MapSection />
        <CommunitySection />
        <EmergencyAlerts />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
