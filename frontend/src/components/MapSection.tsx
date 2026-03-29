import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddResource from "./AddResource";
import ReportEmergency from "./ReportEmergency";
import React, { useEffect, useState } from "react";

import {
  Zap,
  AlertTriangle,
  X,
  Trash2
} from "lucide-react";

import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapStyles.css";

// Fix Leaflet marker icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

// --- Interfaces ---
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

interface Alert {
  id: number;
  disaster_type: string;
  status: string;
  latitude: number;
  longitude: number;
  message: string;
  danger_zone?: { 
    type: string;
    coordinates: number[][][]; 
  };
}

// Helper to center map
const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 13);
  }, [lat, lng, map]);
  return null;
};

// Your live location red dot
const userLocationIcon = L.divIcon({
  className: 'custom-location-marker',
  html: '<div class="my-red-dot"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export const MapSection = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number]>([23.25, 77.41]); 

  // 1. Get User Location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => console.error("Geolocation error:", error)
      );
    }
  }, []);

  // 2. Fetch Resources
  const fetchResources = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/resources");
      const data = await res.json();
      setResources(data);
    } catch (err) {
      console.error("Resource fetch error:", err);
    }
  };

  // 3. Fetch Alerts
  const fetchAlerts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/alerts/active"); 
      const data = await res.json();
      if (Array.isArray(data)) {
        setAlerts(data);
      }
    } catch (err) {
      console.error("Alert fetch error:", err);
    }
  };

  useEffect(() => {
    fetchResources();
    fetchAlerts();
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

  // Function to instantly wipe polygons from the screen for presentations
  const handleClearDemo = () => {
    setAlerts(alerts.filter(alert => !alert.danger_zone));
  };

  return (
    <section id="map" className="pt-6 pb-16 lg:pt-8 lg:pb-24 bg-muted/30 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Real-Time Hazard Map</h2>
          <p className="text-muted-foreground">Showing verified resources and AI-detected risk zones.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="p-1 border-2 border-primary/10 shadow-lg">
              <div className="rounded-lg overflow-hidden h-[600px] relative">
                <MapContainer
                  center={userLocation}
                  zoom={12}
                  style={{ height: "100%", width: "100%" }}
                >
                  <RecenterMap lat={userLocation[0]} lng={userLocation[1]} />
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                  {/* ONLY RED DOT ON THE MAP: User Position */}
                  <Marker position={userLocation} icon={userLocationIcon}>
                     <Popup>You are here</Popup>
                  </Marker>

                  {/* Rendering Resources (Standard Pins) */}
                  {resources.map((res) => {
                    if (!res.location?.coordinates) return null;
                    const [lng, lat] = res.location.coordinates;
                    return (
                      <Marker 
                        key={`res-${res.id}`} 
                        position={[lat, lng]}
                        eventHandlers={{ click: () => setSelectedResource(res) }}
                      >
                        <Popup>
                          <strong>{res.name}</strong><br />{res.type}
                        </Popup>
                      </Marker>
                    );
                  })}

                  {/* RENDERING ONLY AI POLYGONS (Ignores citizen reports entirely) */}
                  {alerts.map((alert) => {
                    const zoneColor = alert.disaster_type === 'flood' ? '#3b82f6' : '#ef4444';
                    const hasPolygon = Boolean(alert.danger_zone?.coordinates && alert.danger_zone.coordinates.length > 0);
                    
                    // If it is a citizen report with no polygon, draw absolutely nothing.
                    if (!hasPolygon) return null;

                    // If it is an AI alert, draw the polygon.
                    const leafletCoords = alert.danger_zone!.coordinates[0].map(
                      (coord: any) => [coord[1], coord[0]] as [number, number]
                    );
                    
                    return (
                      <Polygon 
                        key={`poly-${alert.id}`}
                        positions={leafletCoords}
                        pathOptions={{ color: zoneColor, fillColor: zoneColor, fillOpacity: 0.35, weight: 3 }}
                      >
                         <Popup>
                            <strong className="text-red-600">🚨 AI WARNING: {alert.disaster_type?.toUpperCase()}</strong><br/>
                            {alert.message}
                         </Popup>
                      </Polygon>
                    );
                  })}
                </MapContainer>

                {/* Info Card Overlay */}
                {selectedResource && (
                  <div className="absolute bottom-6 left-6 z-[1000] w-80">
                    <Card className="p-4 shadow-2xl border-l-4 border-blue-600 bg-white/95 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-black bg-white">{selectedResource.name}</h3>
                        <button onClick={() => setSelectedResource(null)} className="text-gray-400 hover:text-red-500">
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <p className="text-xs font-bold text-blue-600 uppercase mb-2">{selectedResource.type}</p>
                      <p className="text-sm text-gray-600 mb-4">{selectedResource.description}</p>
                      <div className="space-y-1 text-sm bg-muted p-2 rounded">
                        <p>📞 {selectedResource.contact_number}</p>
                        <p>✅ Status: <span className="text-green-600 font-bold">{selectedResource.status}</span></p>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar Controls */}
          <div className="space-y-4">
            <Card className="p-4">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" /> Control Panel
              </h4>
              <div className="flex flex-col gap-3">
                <Button className="w-full" onClick={() => setShowModal(true)}>
                  <Zap className="h-4 w-4 mr-2" /> Register Resource
                </Button>
                <Button variant="destructive" className="w-full" onClick={() => setShowEmergencyModal(true)}>
                  <AlertTriangle className="h-4 w-4 mr-2" /> Report Emergency
                </Button>
                {/* Presentation Demo Button */}
                <Button variant="outline" className="w-full mt-2 border-dashed border-2" onClick={handleClearDemo}>
                  <Trash2 className="h-4 w-4 mr-2 text-gray-500" /> Clear AI Demo
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <AddResource isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={handleResourceSubmit} />
      <ReportEmergency isOpen={showEmergencyModal} onClose={() => setShowEmergencyModal(false)} />
    </section>
  );
};