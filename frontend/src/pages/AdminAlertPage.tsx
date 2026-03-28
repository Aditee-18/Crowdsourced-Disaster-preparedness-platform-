import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast"; 
import { Camera } from "lucide-react"; 
import axios from 'axios';

interface Alert {
    id: number;
    disaster_type: string;
    latitude: number;
    longitude: number;
    confidence: number;
    message: string;
}

const AdminAlertPage = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const { toast } = useToast();

    const fetchAlerts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/alerts/pending');
            setAlerts(res.data);
        } catch (err) {
            console.error("Error fetching alerts", err);
            toast({
                title: "Error",
                description: "Could not load pending alerts.",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    const handleApprove = async (id: number) => {
        try {
            await axios.post(`http://localhost:5000/api/alerts/approve/${id}`);
            toast({
                title: "Success",
                description: "Alert Approved & SMS Broadcasted!",
            });
            fetchAlerts(); 
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to approve alert.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            
            {/* --- TOP HEADER (Title Left, Button Right) --- */}
            <div className="flex justify-between items-center mb-8">
                
                {/* Left Side: Title & Description */}
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-red-600">🚨 Admin Disaster Approval Panel</h1>
                    <p className="text-muted-foreground">Review and approve AI-generated alerts before broadcasting them to users.</p>
                </div>

                {/* Right Side: The Modal Button */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2 px-6">
                            <Camera size={20} />
                            Open Live AI Camera
                        </Button>
                    </DialogTrigger>
                    
                    {/* --- THE BIG MODAL --- */}
                    {/* The X (cut) button is automatically added by shadcn/ui to the top right of this DialogContent */}
                    <DialogContent className="max-w-5xl bg-black border-gray-800 p-4">
                        <DialogHeader>
                            <DialogTitle className="text-white flex items-center gap-2 mb-2">
                                <span className="relative flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                                LIVE: Rescue Camera Feed
                            </DialogTitle>
                        </DialogHeader>
                        
                        {/* The AI Video Feed */}
                        <div className="w-full aspect-video bg-gray-900 rounded-md overflow-hidden flex items-center justify-center border border-gray-700">
                            <img 
                                src="http://127.0.0.1:5000/video_feed" 
                                alt="Live AI Feed" 
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement?.insertAdjacentHTML('beforeend', '<span class="text-white text-lg">Camera Offline. Start cv_server.py</span>');
                                }}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* --- ALERTS SECTION --- */}
            {alerts.length === 0 ? (
                <Card className="bg-muted/50">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                        <p className="text-lg font-medium">No pending alerts</p>
                        <p>The system is currently quiet.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {alerts.map(alert => (
                        <Card key={alert.id} className="border-l-4 border-l-red-500 shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xl capitalize flex items-center gap-2">
                                    {alert.disaster_type} Warning
                                    <Badge variant="destructive">HIGH RISK</Badge>
                                </CardTitle>
                                <span className="text-sm font-semibold bg-red-100 text-red-800 px-2 py-1 rounded">
                                    Confidence: {(alert.confidence * 100).toFixed(1)}%
                                </span>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-2 text-gray-700">{alert.message}</p>
                                <p className="text-sm text-gray-500 mb-4">
                                    <strong>Location:</strong> {alert.latitude}, {alert.longitude}
                                </p>
                                <div className="flex justify-end gap-2">
                                    <Button 
                                        onClick={() => handleApprove(alert.id)}
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold"
                                    >
                                        Approve & Broadcast
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminAlertPage;