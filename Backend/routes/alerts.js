require('dotenv').config(); // <-- FAILSAFE: Forces .env to load right here
const express = require('express');
const router = express.Router();
const db = require('../db'); 
const twilio = require('twilio');

// === FORCE PRINT DEBUGGING ===
// This is outside the if-statement so it MUST print when the server starts
console.log("\n====== TWILIO DEBUG CHECK ======");
console.log("1. SID:", process.env.TWILIO_SID ? "✅ FOUND" : "❌ UNDEFINED");
console.log("2. TOKEN:", process.env.TWILIO_AUTH_TOKEN ? "✅ FOUND" : "❌ UNDEFINED");
console.log("3. PHONE:", process.env.TWILIO_PHONE ? "✅ FOUND" : "❌ UNDEFINED");
console.log("================================\n");

// SAFE TWILIO SETUP
let client = null;
if (process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN) {
    client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
}

// 1. RECEIVE FROM AI SERVER
router.post('/receive-ai', async (req, res) => {
    try {
        const { disaster_type, risk_level, latitude, longitude, confidence, message } = req.body;
        
        let placeName = "an unknown location";
        try {
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`, {
                headers: { 'User-Agent': 'SafetyNet-Disaster-App/1.0' }
            });
            const geoData = await geoRes.json();
            if (geoData && geoData.address) {
                placeName = geoData.address.city || geoData.address.town || geoData.address.village || "the area";
            }
        } catch (geoError) {
            console.error("⚠️ Nominatim Error:", geoError.message);
        }

        const enhancedMessage = `[Location: ${placeName}] ${message}`;

        const query = `
            INSERT INTO alerts (disaster_type, risk_level, latitude, longitude, confidence, message, status)
            VALUES ($1, $2, $3, $4, $5, $6, 'pending')
            RETURNING id;
        `;
        const result = await db.query(query, [disaster_type, risk_level, latitude, longitude, confidence, enhancedMessage]);

        res.status(201).json({ success: true, alertId: result.rows[0].id });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 2. CITIZEN MANUAL REPORT
router.post('/report', async (req, res) => {
    const { disaster_type, description, latitude, longitude } = req.body;
    try {
        const query = `
            INSERT INTO alerts (disaster_type, message, latitude, longitude, status)
            VALUES ($1, $2, $3, $4, 'pending')
            RETURNING id;
        `;
        const result = await db.query(query, [disaster_type, description, latitude, longitude]);
        res.status(201).json({ success: true, alertId: result.rows[0].id });
    } catch (err) {
        console.error("Report Error:", err);
        res.status(500).json({ error: "Failed to save report" });
    }
});

// 3. ADMIN APPROVE & BROADCAST (Loud Debugging Version)
router.post('/approve/:id', async (req, res) => {
    const alertId = req.params.id;
    try {
        const alertRes = await db.query("SELECT * FROM alerts WHERE id = $1", [alertId]);
        if (alertRes.rows.length === 0) return res.status(404).json({ error: "Alert not found" });
        const alert = alertRes.rows[0];

        // --- TEST MODE OVERRIDE ---
        const MY_PERSONAL_NUMBER = "+917982889509"; 
        const targetPhones = [MY_PERSONAL_NUMBER]; 
        // --------------------------

        // SAFE RESOURCE QUERY
        const resQuery = `SELECT name FROM resources LIMIT 5`;
        const resources = await db.query(resQuery);
        const resourceList = resources.rows.map((r, index) => `${index + 1}. ${r.name}`).join("\n");

        // --- START OF LOUD TWILIO LOGGING ---
        console.log("\n==============================================");
        console.log("🔘 APPROVE BUTTON CLICKED FOR ALERT ID:", alertId);
        console.log("1. Is Twilio Client loaded?", client ? "✅ YES" : "❌ NO");
        console.log("2. Twilio Sender Phone (.env):", process.env.TWILIO_PHONE || "❌ MISSING");
        console.log("3. Target Citizen Phone:", targetPhones[0]);

        if (client && process.env.TWILIO_PHONE) {
            try {
                const messageBody = `🚨 SAFETYNET ALERT: ${alert.disaster_type}!\n\n${alert.message}\n\nNearest Safe Zones:\n${resourceList || 'None found nearby.'}`;
                
                console.log("4. Attempting to contact Twilio API right now...");
                
                const response = await client.messages.create({
                    body: messageBody,
                    from: process.env.TWILIO_PHONE,
                    to: targetPhones[0]
                });
                
                console.log("5. ✅ TWILIO SAYS SUCCESS! Message ID:", response.sid);
            } catch (twilioError) {
                console.log("5. ❌ TWILIO API BLOCKED IT! Reason:");
                console.error(twilioError.message);
                console.error("Error Code:", twilioError.code);
            }
        } else {
            console.log("⚠️ SKIPPED SENDING: Missing keys in .env file.");
        }
        console.log("==============================================\n");
        // --- END OF LOUD TWILIO LOGGING ---

        // Update status in DB
        await db.query("UPDATE alerts SET status = 'approved' WHERE id = $1", [alertId]);

        res.json({ success: true, message: `Alert approved! SMS sent to ${targetPhones.length} users.` });
    } catch (err) {
        console.error("Broadcast Error Details:", err);
        res.status(500).json({ error: "Failed to broadcast alert" });
    }
});

// 4. GET PENDING
router.get('/pending', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM alerts WHERE status = 'pending' ORDER BY id DESC");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. GET ACTIVE
router.get('/active', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM alerts WHERE status = 'approved' ORDER BY id DESC LIMIT 5");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;