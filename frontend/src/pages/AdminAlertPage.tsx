import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast"; // Adjust path if your toast hook is elsewhere
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
            // Adjust port if your backend runs on something other than 5000
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
            fetchAlerts(); // Refresh the list
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to approve alert.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-red-600">🚨 Admin Disaster Approval Panel</h1>
            <p className="mb-6 text-muted-foreground">Review and approve AI-generated alerts before broadcasting them to users.</p>
            
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