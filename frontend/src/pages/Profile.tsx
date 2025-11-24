import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [name, setName] = useState("Community Member");

    useEffect(() => {
        // 1. GET REAL NAME FROM STORAGE
        const storedName = localStorage.getItem("userName");
        if (storedName) {
            setName(storedName);
        }
    }, []);

    const handleLogout = () => {
        // 2. REAL LOGOUT (Destroy the Token)
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        
        toast({
            title: "Logged Out",
            description: "See you next time.",
        });
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Manage your account settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-20 w-20">
                                {/* If we don't have an image, it falls back to Initials */}
                                <AvatarImage src="" alt={name} />
                                <AvatarFallback className="text-xl bg-blue-100 text-blue-700">
                                    {name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-xl font-semibold">{name}</h2>
                                <p className="text-gray-500 dark:text-gray-400">Verified User</p>
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 mt-2">
                                    Active
                                </span>
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="text-lg font-medium mb-4">Account Actions</h3>
                            <Button variant="destructive" onClick={handleLogout}>
                                Log Out
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Profile;