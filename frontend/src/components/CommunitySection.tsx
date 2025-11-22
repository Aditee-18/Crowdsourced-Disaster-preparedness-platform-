import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Award,
  TrendingUp,
  Clock,
  MapPin,
  Star
} from "lucide-react";

const activities = [
  {
    type: "Resource Added",
    user: "Sarah Chen",
    content: "Added new emergency shelter at Downtown Community Center",
    location: "Downtown District",
    time: "2 hours ago",
    badge: "Verified",
    badgeColor: "bg-safety-green"
  },
  {
    type: "Update",
    user: "Mike Rodriguez",
    content: "Confirmed medical supplies available at Regional Hospital",
    location: "Medical District",
    time: "4 hours ago",
    badge: "Updated",
    badgeColor: "bg-info-blue"
  },
  {
    type: "Training",
    user: "Community Team",
    content: "CPR training session scheduled for this weekend",
    location: "City Park",
    time: "1 day ago",
    badge: "Event",
    badgeColor: "bg-warning"
  }
];

const leaderboard = [
  { name: "Sarah Chen", contributions: 124, badge: "🏆" },
  { name: "Mike Rodriguez", contributions: 98, badge: "🥈" },
  { name: "Lisa Park", contributions: 87, badge: "🥉" },
  { name: "David Kim", contributions: 76, badge: "⭐" }
];

export const CommunitySection = () => {
  return (
    <section id="community" className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Community Contributions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our community is the heart of disaster preparedness. See what members 
            are sharing and contribute to building resilience together.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">Recent Activity</h3>
              <Button variant="outline" size="sm">
                <TrendingUp className="h-4 w-4" />
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {activities.map((activity, index) => (
                <Card key={index} className="p-4 hover:shadow-card transition-all duration-300">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-foreground">{activity.user}</span>
                        <Badge variant="secondary" className={`${activity.badgeColor} text-white text-xs`}>
                          {activity.badge}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {activity.time}
                        </div>
                      </div>
                      <p className="text-sm text-foreground">{activity.content}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {activity.location}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Button variant="hero" className="w-full">
              <MessageSquare className="h-4 w-4" />
              Share Your Update
            </Button>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <Card className="p-6 shadow-card">
              <h4 className="font-semibold text-foreground mb-4">Community Impact</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Contributors</span>
                  <span className="font-semibold text-foreground">15,432</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Resources Added</span>
                  <span className="font-semibold text-foreground">2,847</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Verifications</span>
                  <span className="font-semibold text-foreground">1,956</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">This Month</span>
                  <span className="font-semibold text-safety-green">+234</span>
                </div>
              </div>
            </Card>

            {/* Top Contributors */}
            <Card className="p-6 shadow-card">
              <h4 className="font-semibold text-foreground mb-4">Top Contributors</h4>
              <div className="space-y-3">
                {leaderboard.map((contributor, index) => (
                  <div key={contributor.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{contributor.badge}</span>
                      <div>
                        <div className="text-sm font-medium text-foreground">{contributor.name}</div>
                        <div className="text-xs text-muted-foreground">{contributor.contributions} contributions</div>
                      </div>
                    </div>
                    <Star className="h-4 w-4 text-warning" />
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                <Award className="h-4 w-4" />
                View Leaderboard
              </Button>
            </Card>

            {/* Upcoming Events */}
            <Card className="p-6 shadow-card">
              <h4 className="font-semibold text-foreground mb-4">Upcoming Events</h4>
              <div className="space-y-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">CPR Training</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Saturday, 2:00 PM</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Emergency Drill</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Next Monday, 10:00 AM</p>
                </div>
              </div>
              <Button variant="safety" size="sm" className="w-full mt-4">
                <Calendar className="h-4 w-4" />
                Join Events
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};