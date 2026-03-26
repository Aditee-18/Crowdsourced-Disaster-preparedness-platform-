import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddResource from "./AddResource";
import ReportEmergency from "./ReportEmergency";

import {
  Zap,
  AlertTriangle,
  X 
} from "lucide-react";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "./MapStyles.css";

// Fix leaflet default icon bug
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

interface Resource {
  id: number;
  name: string;
  type: string;
  status: string;
  description: string;
  contact_number: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
}

const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 13);
  }, [lat, lng, map]);
  return null;
};

const userLocationIcon = L.divIcon({
  className: 'custom-location-marker',
  html: '<div class="my-red-dot"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export const MapSection = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number]>([28.6139, 77.209]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => console.error("Error getting user location:", error)
      );
    }
  }, []);

  const fetchResources = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/resources");
      const data = await res.json();
      setResources(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleResourceSubmit = async (resourceData: any) => {
    await fetch("http://localhost:5000/api/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resourceData)
    });
    fetchResources();
    setShowModal(false);
  };

  return (
    <>
      <section id="map" className="pt-6 pb-16 lg:pt-8 lg:pb-24 bg-muted/30 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Interactive Resource Map</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore resources near you with our real-time mapping system.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card className="p-1">
                <div className="rounded-lg overflow-hidden h-96 lg:h-[600px] relative">
                  <MapContainer
                    center={userLocation}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <RecenterMap lat={userLocation[0]} lng={userLocation[1]} />
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    <Marker position={userLocation} icon={userLocationIcon}>
                       <Popup>You are here</Popup>
                    </Marker>

                    {resources.map((res) => {
                      if (!res.location || !res.location.coordinates) return null;
                      const [lng, lat] = res.location.coordinates;
                      return (
                        <Marker 
                          key={res.id} 
                          position={[lat, lng]}
                          eventHandlers={{ click: () => setSelectedResource(res) }}
                        >
                          <Popup>
                            <strong>{res.name}</strong><br />{res.type}
                          </Popup>
                        </Marker>
                      );
                    })}
                  </MapContainer>

                  {selectedResource && (
                    <div className="absolute bottom-4 left-4 z-[1000] w-72 animate-in slide-in-from-bottom-5">
                      <Card className="p-4 shadow-2xl border-l-4 border-blue-600 bg-white/95 backdrop-blur-sm">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold bg-white text-black">{selectedResource.name}</h3>
                          <button onClick={() => setSelectedResource(null)} className="text-gray-400 hover:text-black">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-xs text-blue-600 font-semibold mb-2 uppercase">{selectedResource.type}</p>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{selectedResource.description}</p>
                        <div className="flex flex-col gap-1 text-xs bg-muted/50 p-2 rounded">
                          <span className="flex items-center gap-2">📞 {selectedResource.contact_number}</span>
                          <span className="flex items-center gap-2">📍 Status: <span className="text-green-600 font-bold">{selectedResource.status}</span></span>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-4">
                <h4 className="font-semibold mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <Button
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setShowModal(true)}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Report Resource
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="destructive"
                    className="w-full justify-start bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => setShowEmergencyModal(true)}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Report Emergency
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <AddResource
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleResourceSubmit}
      />

      <ReportEmergency 
        isOpen={showEmergencyModal} 
        onClose={() => setShowEmergencyModal(false)} 
      />
    </>
  );
};