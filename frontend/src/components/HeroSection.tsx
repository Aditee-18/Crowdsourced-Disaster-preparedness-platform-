import { Button } from "@/components/ui/button";
import { MapPin, Shield, Users, AlertCircle } from "lucide-react";
import heroImage from "@/assets/hero-disaster-prep.jpg";

export const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-background via-accent/50 to-muted overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Community disaster preparedness" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary">
              <Shield className="h-4 w-4" />
              Building Resilient Communities
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
              Prepare Together,
              <span className="text-primary"> Stay Safe</span>
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Connect with your community to build disaster resilience. Find nearby resources, 
              get real-time alerts, and contribute to local preparedness efforts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="hero" size="lg">
                <MapPin className="h-5 w-5" />
                Explore Resources
              </Button>
              <Button variant="safety" size="lg">
                <Users className="h-5 w-5" />
                Join Your Community
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border rounded-xl p-6 shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-safety-green/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-safety-green" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">1,247</div>
              <div className="text-sm text-muted-foreground">Active Shelters</div>
            </div>

            <div className="bg-card border rounded-xl p-6 shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-info-blue/10 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-info-blue" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">89</div>
              <div className="text-sm text-muted-foreground">Supply Centers</div>
            </div>

            <div className="bg-card border rounded-xl p-6 shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">15,432</div>
              <div className="text-sm text-muted-foreground">Community Members</div>
            </div>

            <div className="bg-card border rounded-xl p-6 shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-warning" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">24/7</div>
              <div className="text-sm text-muted-foreground">Alert System</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};