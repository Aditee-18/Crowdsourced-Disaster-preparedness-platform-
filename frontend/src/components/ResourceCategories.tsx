import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Heart, 
  Package, 
  Truck, 
  Users, 
  Phone,
  MapPin,
  Clock,
  ChevronRight
} from "lucide-react";

const categories = [
  {
    title: "Emergency Shelters",
    description: "Find safe places to stay during disasters",
    icon: Building2,
    count: 1247,
    color: "safety-green",
    bgColor: "bg-safety-green/10",
    available: true
  },
  {
    title: "Medical Facilities",
    description: "Hospitals and emergency medical centers",
    icon: Heart,
    count: 89,
    color: "emergency-red",
    bgColor: "bg-emergency-red/10",
    available: true
  },
  {
    title: "Supply Centers",
    description: "Food, water, and emergency supplies",
    icon: Package,
    count: 432,
    color: "info-blue",
    bgColor: "bg-info-blue/10",
    available: true
  },
  {
    title: "Transportation",
    description: "Emergency transport and evacuation routes",
    icon: Truck,
    count: 156,
    color: "warning",
    bgColor: "bg-warning/10",
    available: false
  },
  {
    title: "Community Centers",
    description: "Local coordination and meeting points",
    icon: Users,
    count: 78,
    color: "primary",
    bgColor: "bg-primary/10",
    available: true
  },
  {
    title: "Emergency Contacts",
    description: "Critical phone numbers and services",
    icon: Phone,
    count: 24,
    color: "emergency-red",
    bgColor: "bg-emergency-red/10",
    available: true
  }
];

export const ResourceCategories = () => {
  return (
    <section id="resources" className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Emergency Resources
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access critical resources and services in your area. All information is 
            crowd-sourced and verified by our community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.title} className="p-6 hover:shadow-card transition-all duration-300 border group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${category.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-6 w-6 text-${category.color}`} />
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${category.available ? 'bg-safety-green' : 'bg-warning'}`}></div>
                    <span className="text-xs text-muted-foreground">
                      {category.available ? 'Available' : 'Limited'}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {category.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {category.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{category.count}</span>
                    <span className="text-muted-foreground">locations</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button variant="default" size="lg">
            <MapPin className="h-5 w-5" />
            View All on Map
          </Button>
        </div>
      </div>
    </section>
  );
};