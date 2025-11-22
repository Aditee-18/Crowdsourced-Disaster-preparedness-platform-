import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Map, 
  Layers,
  Filter,
  Search,
  Navigation,
  Zap,
  Globe,
  ScanLine
} from "lucide-react";

export const MapSection = () => {
  return (
    <section id="map" className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Interactive Resource Map
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore resources near you with our real-time mapping system. 
            Filter by resource type, check availability, and get directions.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Map Placeholder */}
          <div className="lg:col-span-3">
            <Card className="p-1 shadow-card">
              <div className="relative bg-accent rounded-lg h-96 lg:h-[600px] flex items-center justify-center overflow-hidden">
                {/* Map Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-8 grid-rows-8 h-full gap-1">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div key={i} className="bg-primary/10 rounded-sm"></div>
                    ))}
                  </div>
                </div>
                
                {/* Map Content */}
                <div className="relative z-10 text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center mx-auto shadow-glow">
                    <Map className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Interactive Map Loading</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Geospatial mapping system will display real-time resource locations, 
                    emergency routes, and community updates.
                  </p>
                  <Button variant="hero">
                    <Globe className="h-4 w-4" />
                    Initialize Map View
                  </Button>
                </div>

                {/* Floating Resource Markers */}
                <div className="absolute top-20 left-20 w-8 h-8 bg-safety-green rounded-full shadow-lg flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div className="absolute top-32 right-32 w-8 h-8 bg-emergency-red rounded-full shadow-lg flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div className="absolute bottom-24 left-32 w-8 h-8 bg-info-blue rounded-full shadow-lg flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </Card>
          </div>

          {/* Map Controls Sidebar */}
          <div className="space-y-6">
            {/* Search */}
            <Card className="p-4 shadow-card">
              <h4 className="font-semibold text-foreground mb-3">Search Resources</h4>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Search className="h-4 w-4" />
                  Find nearby shelters
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Navigation className="h-4 w-4" />
                  Get directions
                </Button>
              </div>
            </Card>

            {/* Filters */}
            <Card className="p-4 shadow-card">
              <h4 className="font-semibold text-foreground mb-3">Filter Layers</h4>
              <div className="space-y-2">
                {[
                  { name: 'Emergency Shelters', active: true, color: 'safety-green' },
                  { name: 'Medical Centers', active: true, color: 'emergency-red' },
                  { name: 'Supply Points', active: false, color: 'info-blue' },
                  { name: 'Transport Routes', active: false, color: 'warning' }
                ].map((filter) => (
                  <div key={filter.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full bg-${filter.color} ${!filter.active && 'opacity-30'}`}></div>
                      <span className={`text-sm ${filter.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {filter.name}
                      </span>
                    </div>
                    <div className={`w-8 h-4 rounded-full ${filter.active ? 'bg-primary' : 'bg-muted'} relative cursor-pointer transition-colors`}>
                      <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${filter.active ? 'translate-x-4' : 'translate-x-0.5'}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-4 shadow-card">
              <h4 className="font-semibold text-foreground mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <Button variant="safety" size="sm" className="w-full justify-start">
                  <Zap className="h-4 w-4" />
                  Report Resource
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <ScanLine className="h-4 w-4" />
                  Verify Location
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};