const express = require('express');
const router = express.Router();
const db = require('../db'); 
const twilio = require('twilio');

// Initialize Twilio
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// 1. RECEIVE FROM AI SERVER (Automated)
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

// 2. CITIZEN MANUAL REPORT (From Frontend Modal)
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
        res.status(500).json({ error: "Failed to save report" });
    }
});

// 3. ADMIN APPROVE & BROADCAST (The Twilio Trigger)
router.post('/approve/:id', async (req, res) => {
    const alertId = req.params.id;
    try {
        const alertRes = await db.query("SELECT * FROM alerts WHERE id = $1", [alertId]);
        if (alertRes.rows.length === 0) return res.status(404).json({ error: "Alert not found" });
        const alert = alertRes.rows[0];

        // 1. Find users within 50km
        const userQuery = `
            SELECT phone_number FROM users 
            WHERE (6371 * acos(cos(radians($1)) * cos(radians(latitude)) * cos(radians(longitude) - radians($2)) + sin(radians($1)) * sin(radians(latitude)))) <= 50
        `;
        const users = await db.query(userQuery, [alert.latitude, alert.longitude]);

        // 2. Find 5 Nearby Resources
        const resQuery = `SELECT name FROM resources LIMIT 5`;
        const resources = await db.query(resQuery);
        const resourceList = resources.rows.map(r => r.name).join(", ");

        // 3. Send SMS via Twilio
        const messageBody = `🚨 ALERT: ${alert.disaster_type}! ${alert.message}. Nearby help: ${resourceList || 'Check App'}`;
        
        const smsPromises = users.rows.map(user => {
            return client.messages.create({
                body: messageBody,
                from: process.env.TWILIO_PHONE,
                to: user.phone_number
            });
        });
        await Promise.all(smsPromises);

        // 4. Update status
        await db.query("UPDATE alerts SET status = 'approved' WHERE id = $1", [alertId]);

        res.json({ success: true, message: `Alert sent to ${users.rows.length} users.` });
    } catch (err) {
        console.error("Broadcast Error:", err);
        res.status(500).json({ error: "Failed to broadcast alert" });
    }
});

// 4. GET PENDING (For Admin Dashboard)
router.get('/pending', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM alerts WHERE status = 'pending' ORDER BY id DESC");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. GET ACTIVE (For Map Display)
router.get('/active', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM alerts WHERE status = 'approved' ORDER BY id DESC LIMIT 5");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;