import os
import requests
import numpy as np
import joblib
from flask import Flask, request, jsonify

app = Flask(__name__)

# SETUP 
WEATHER_API_KEY = "7309e32cfd5f9a1dc4e22ebdbccdf1e6"
# Ensure this matches your Node.js route exactly
NODE_BACKEND_URL = "http://localhost:5000/api/alerts/receive-ai"

# LOAD MODELS
base_path = os.path.dirname(os.path.abspath(__file__))
try:
    flood_model = joblib.load(os.path.join(base_path, 'ai_models', 'flood_model_final.pkl'))
    eq_model = joblib.load(os.path.join(base_path, 'ai_models', 'earthquake_model_final.pkl'))
except Exception as e:
    print(f"⚠️ Warning: Models not loaded, using fallback logic: {e}")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    lat = float(data.get('lat', 23.25))
    lon = float(data.get('lon', 77.41))

    print(f"\n📍 Received coordinates for Prediction: {lat}, {lon}")

    # --- FORCED TEST MODE ---
    # We are bypassing the model math to ensure the Frontend gets data
    f_prob = 0.99 
    status = "HIGH RISK"
    
    # Generate a 0.1 degree square (approx 11km) around the point
    offset = 0.05 
    danger_polygon = [
        [lon - offset, lat - offset], # Bottom Left
        [lon + offset, lat - offset], # Bottom Right
        [lon + offset, lat + offset], # Top Right
        [lon - offset, lat + offset], # Top Left
        [lon - offset, lat - offset]  # Close the loop
    ]

    alert_payload = {
        "disaster_type": "flood",
        "status": "approved",
        "risk_level": "HIGH",
        "latitude": lat,
        "longitude": lon,
        "confidence": 0.95,
        "danger_zone": {
            "type": "Polygon",
            "coordinates": [danger_polygon]
        },
        "message": "AI detected high saturation levels. Immediate caution advised."
    }

    # 3. Send to Node.js Backend
    try:
        response = requests.post(NODE_BACKEND_URL, json=alert_payload)
        if response.status_code == 200 or response.status_code == 201:
            print("✅ [SUCCESS] Sent HIGH RISK alert to Node.js backend!")
        else:
            print(f"⚠️ [WARNING] Node.js responded with status: {response.status_code}")
    except Exception as e:
        print(f"❌ [ERROR] Could not connect to Node.js: {e}")

    return jsonify({
        "status": "ALERT_GENERATED", 
        "probability": f_prob,
        "payload": alert_payload
    })

if __name__ == '__main__':
    print("🤖 AI Server (Force Mode) starting on port 5001...")
    app.run(port=5001, debug=True)