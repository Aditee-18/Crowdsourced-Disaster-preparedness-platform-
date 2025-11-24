import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  Navigation,
  Zap,
  ScanLine,
  ExternalLink,
  MapPin
} from "lucide-react";

// Mock medical centers
const MEDICAL_CENTERS = [
  { id: 1, name: "City General Hospital", type: "Hospital", latOffset: 0.01, lngOffset: 0.01 },
  { id: 2, name: "Community Health Clinic", type: "Clinic", latOffset: -0.01, lngOffset: 0.005 },
  { id: 3, name: "Emergency Care Unit", type: "Emergency", latOffset: 0.005, lngOffset: -0.01 },
  { id: 4, name: "St. Mary's Medical Center", type: "Hospital", latOffset: -0.005, lngOffset: -0.008 },
];

export const MapSection = () => {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition([position.coords.latitude, position.coords.longitude]);
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setUserPosition([40.7128, -74.0060]);
          setLoading(false);
        }
      );
    } else {
      setUserPosition([40.7128, -74.0060]);
      setLoading(false);
    }
  }, []);

  const handleViewInGoogleMaps = () => {
    if (userPosition) {
      const [lat, lng] = userPosition;
      window.open(`https://www.google.com/maps/search/hospitals+near+me/@${lat},${lng},14z`, '_blank');
    }
  };

  const handleViewCenterInGoogleMaps = (center: typeof MEDICAL_CENTERS[0]) => {
    if (userPosition) {
      const lat = userPosition[0] + center.latOffset;
      const lng = userPosition[1] + center.lngOffset;
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(center.name)}/@${lat},${lng},15z`, '_blank');
    }
  };

  return (
    <section id="map" className="py-16 lg:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
            Interactive Resource Map
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore medical centers and resources near you.
          </p>
          <Button
            onClick={handleViewInGoogleMaps}
            className="mt-4 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
            disabled={loading || !userPosition}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View All in Google Maps
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="p-6 shadow-xl border-2 border-primary/20 bg-gradient-to-br from-background to-muted/20">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Nearby Medical Centers
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {MEDICAL_CENTERS.map((center) => (
                  <Card key={center.id} className="p-4 hover:shadow-xl transition-all duration-300 hover:scale-105 border-l-4 border-l-primary bg-gradient-to-r from-background to-primary/5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{center.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                          <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                          {center.type}
                        </p>
                        {userPosition && (
                          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {(Math.sqrt(center.latOffset ** 2 + center.lngOffset ** 2) * 111).toFixed(1)} km away
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewCenterInGoogleMaps(center)}
                        disabled={!userPosition}
                        className="hover:bg-primary/10"
                      >
                        <ExternalLink className="h-4 w-4 text-primary" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-4 shadow-card">
              <h4 className="font-semibold text-foreground mb-3">Search Resources</h4>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Search className="h-4 w-4 mr-2" />
                  Find nearby shelters
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Navigation className="h-4 w-4 mr-2" />
                  Get directions
                </Button>
              </div>
            </Card>

            <Card className="p-4 shadow-card">
              <h4 className="font-semibold text-foreground mb-3">Filter Layers</h4>
              <div className="space-y-2">
                {[
                  { name: 'Emergency Shelters', active: true },
                  { name: 'Medical Centers', active: true },
                  { name: 'Supply Points', active: false },
                  { name: 'Transport Routes', active: false }
                ].map((filter) => (
                  <div key={filter.name} className="flex items-center justify-between">
                    <span className={`text-sm ${filter.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {filter.name}
                    </span>
                    <div className={`w-8 h-4 rounded-full ${filter.active ? 'bg-primary' : 'bg-muted'} relative cursor-pointer transition-colors`}>
                      <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${filter.active ? 'translate-x-4' : 'translate-x-0.5'}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 shadow-card">
              <h4 className="font-semibold text-foreground mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <Button variant="safety" size="sm" className="w-full justify-start">
                  <Zap className="h-4 w-4 mr-2" />
                  Report Resource
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <ScanLine className="h-4 w-4 mr-2" />
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
