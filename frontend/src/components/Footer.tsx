import { Shield, Mail, Phone, MapPin, Github, Twitter, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-bold">SafetyNet</h3>
                <p className="text-sm text-primary-foreground/70">Community Disaster Preparedness</p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Building resilient communities through crowdsourced disaster preparedness 
              and real-time emergency response coordination.
            </p>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Emergency Shelters</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Medical Facilities</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Supply Centers</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Training Programs</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Emergency Contacts</a></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Join Our Network</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Volunteer</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Training Events</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Success Stories</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Partner Organizations</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-sm text-primary-foreground/80">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>1-800-SAFETY</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>help@safetynet.org</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Emergency Response Center</span>
              </div>
            </div>
            
            <div className="flex gap-3 mt-4">
              <div className="w-8 h-8 bg-primary-foreground/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-foreground/20 transition-colors">
                <Twitter className="h-4 w-4" />
              </div>
              <div className="w-8 h-8 bg-primary-foreground/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-foreground/20 transition-colors">
                <Github className="h-4 w-4" />
              </div>
              <div className="w-8 h-8 bg-primary-foreground/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-foreground/20 transition-colors">
                <Mail className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/60">
            © 2024 SafetyNet. All rights reserved. Building safer communities together.
          </p>
          <div className="flex items-center gap-1 text-sm text-primary-foreground/60">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-emergency-red fill-current" />
            <span>for community safety</span>
          </div>
        </div>
      </div>
    </footer>
  );
};