import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X, MapPin } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportEmergency({ isOpen, onClose }: Props) {
  const [type, setType] = useState("Fire");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    // Grab exactly where the user is standing
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const payload = {
            disaster_type: type,
            description: description,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          const res = await fetch("http://localhost:5000/api/alerts/report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (res.ok) {
            setStatus("success");
            setTimeout(() => {
              setStatus("idle");
              onClose();
            }, 2000);
          } else {
            setStatus("error");
          }
        } catch (error) {
          setStatus("error");
        }
      },
      (error) => {
        console.error("Location error:", error);
        alert("Please enable location services to report an emergency.");
        setStatus("idle");
      }
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <Card className="w-full max-w-md p-6 relative shadow-2xl animate-in zoom-in-95">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-black">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-white">Report Emergency</h2>
        </div>

        {status === "success" ? (
          <div className="text-center py-8">
            <h3 className="text-lg font-bold text-green-600 mb-2">Report Sent!</h3>
            <p className="text-gray-600">Authorities have been notified. Please stay safe.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Emergency Type</label>
              <select 
                className="w-full border rounded-md p-2 text-black bg-white"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Fire">Fire</option>
                <option value="Flood">Flood</option>
                <option value="Accident">Major Accident</option>
                <option value="Earthquake">Earthquake Damage</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea 
                required
                rows={3}
                placeholder="Briefly describe the situation..."
                className="w-full border rounded-md p-2 text-black bg-white"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
              <MapPin className="h-4 w-4" />
              <span>Your exact location will be attached automatically.</span>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Sending..." : "Submit Report"}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}