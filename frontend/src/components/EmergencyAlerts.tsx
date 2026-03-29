import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Phone,
  Clock,
  MapPin,
  X
} from "lucide-react";
import { useState, useEffect } from "react"; // <-- Added hooks

const emergencyContacts = [
  { name: "Emergency Services", number: "112", type: "Emergency" },
  { name: "District Disaster Control", number: "1077", type: "Disaster" },
  { name: "Ambulance", number: "108", type: "Medical" }
];

export const EmergencyAlerts = () => {
  // State to hold our real database alerts
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveAlerts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/alerts/active');
        const dbAlerts = await response.json();

        // Translate the database rows into the format your UI expects
        const formattedAlerts = dbAlerts.map((dbAlert: any) => {
          const isHighRisk = dbAlert.risk_level === 'HIGH';
          
          return {
            id: dbAlert.id,
            level: isHighRisk ? 'high' : 'medium',
            type: `${dbAlert.disaster_type.toUpperCase()} ALERT`,
            title: isHighRisk ? `Severe ${dbAlert.disaster_type} Warning` : `${dbAlert.disaster_type} Advisory`,
            message: dbAlert.message,
            // Showing coordinates if Nominatim didn't attach a place name
            location: `Lat: ${dbAlert.latitude.toFixed(2)}, Lon: ${dbAlert.longitude.toFixed(2)}`,
            // Simple time formatting
            time: new Date(dbAlert.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            active: true,
            icon: AlertTriangle, 
            // Dynamic colors based on risk level
            bgColor: isHighRisk ? "bg-destructive/10" : "bg-warning/10",
            borderColor: isHighRisk ? "border-destructive" : "border-warning",
            textColor: isHighRisk ? "text-destructive" : "text-warning"
          };
        });

        setAlerts(formattedAlerts.slice(0,3));
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveAlerts();
    
    // Optional: Refresh the alerts every 30 seconds to keep it live
    const interval = setInterval(fetchActiveAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="alerts" className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Emergency Alerts & Contacts
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay informed with real-time emergency alerts and access critical 
            contact information when you need it most.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active Alerts */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">Active Alerts</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-safety-green animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">Live Updates</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Show loading state, empty state, or the alerts */}
              {loading ? (
                  <p className="text-muted-foreground">Loading active alerts...</p>
              ) : alerts.length === 0 ? (
                  <Card className="p-6 text-center bg-safety-green/10 border-safety-green shadow-card">
                      <CheckCircle className="h-8 w-8 text-safety-green mx-auto mb-2" />
                      <h4 className="font-semibold text-safety-green">All Clear</h4>
                      <p className="text-sm text-foreground">There are no active emergencies in your area right now.</p>
                  </Card>
              ) : (
                  alerts.map((alert) => {
                    const Icon = alert.icon;
                    return (
                      <Card key={alert.id} className={`p-4 ${alert.bgColor} border-l-4 ${alert.borderColor} shadow-card`}>
                        <div className="flex gap-4">
                          <div className={`w-10 h-10 ${alert.bgColor} rounded-full flex items-center justify-center shrink-0`}>
                            <Icon className={`h-5 w-5 ${alert.textColor}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge variant={alert.level === 'high' ? 'destructive' : alert.level === 'medium' ? 'secondary' : 'outline'}>
                                  {alert.type}
                                </Badge>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {alert.time}
                                </div>
                              </div>
                            </div>
                            <h4 className={`font-semibold mb-1 ${alert.textColor}`}>{alert.title}</h4>
                            <p className="text-sm text-foreground mb-2">{alert.message}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {alert.location}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })
              )}
            </div>
          </div>

          {/* Emergency Contacts Sidebar (Unchanged) */}
          <div className="space-y-6">
            <Card className="p-6 shadow-card">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5 text-emergency-red" />
                Emergency Contacts
              </h4>
              <div className="space-y-4">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-foreground text-sm">{contact.name}</span>
                      <Badge variant="outline" className="text-xs">{contact.type}</Badge>
                    </div>
                    <a 
                      href={`tel:${contact.number}`} 
                      className="text-primary hover:text-primary/80 font-mono text-sm"
                    >
                      {contact.number}
                    </a>
                  </div>
                ))}
              </div>
              <Button variant="emergency" size="sm" className="w-full mt-4">
                <Phone className="h-4 w-4" />
                Call Emergency Services
              </Button>
            </Card>

            <Card className="p-6 shadow-card bg-emergency-red/5 border-emergency-red/20">
              <h4 className="font-semibold text-foreground mb-2">In an Emergency</h4>
              <Button variant="emergency" size="sm" className="w-full">
                <Phone className="h-4 w-4" />
                Call 112 Now
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};