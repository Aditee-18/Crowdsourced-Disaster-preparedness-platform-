import { Shield, AlertTriangle, Users, Menu, User, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const Header = () => {
    const navigate = useNavigate();
    const [theme, setTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle("dark", savedTheme === "dark");
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-card">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo and Title */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-hero rounded-lg shadow-glow">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-foreground">SafetyNet</h1>
                            <p className="text-sm text-muted-foreground">Community Disaster Preparedness</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <a href="#resources" className="text-foreground hover:text-primary transition-colors">
                            Resources
                        </a>
                        <a href="#map" className="text-foreground hover:text-primary transition-colors">
                            Map
                        </a>
                        <a href="#community" className="text-foreground hover:text-primary transition-colors">
                            Community
                        </a>
                        <a href="#alerts" className="text-foreground hover:text-primary transition-colors">
                            Alerts
                        </a>
                    </nav>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="rounded-full"
                        >
                            {theme === "light" ? (
                                <Moon className="h-5 w-5" />
                            ) : (
                                <Sun className="h-5 w-5" />
                            )}
                        </Button>
                        <Button variant="emergency" size="sm" className="hidden sm:flex">
                            <AlertTriangle className="h-4 w-4" />
                            Report Emergency
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="hidden sm:flex"
                            onClick={() => navigate("/profile")}
                        >
                            <User className="h-4 w-4 mr-2" />
                            Profile
                        </Button>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};