const express = require('express');
const router = express.Router();
const db = require('../db'); // Pulling in your custom db.js

// 1. RECEIVE FROM AI SERVER
router.post('/receive-ai', async (req, res) => {
    try {
        const { disaster_type, risk_level, latitude, longitude, confidence, message } = req.body;
        
        // --- NEW: REVERSE GEOCODING WITH NOMINATIM ---
        let placeName = "an unknown location";
        try {
            // Ask Nominatim what is at these coordinates
            // Note: Nominatim REQUIRES a User-Agent header, or they will block your request!
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`, {
                headers: { 'User-Agent': 'SafetyNet-Disaster-App/1.0' }
            });
            const geoData = await geoRes.json();
            
            if (geoData && geoData.address) {
                // Try to grab the most relevant local name (city, town, village, or state)
                placeName = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.county || geoData.address.state || "the area";
            }
        } catch (geoError) {
            console.error("⚠️ Could not fetch place name from Nominatim:", geoError.message);
        }

        // Enhance the original AI message to include the real place name
        const enhancedMessage = `[Location: ${placeName}] ${message}`;

        // Save to database
        const query = `
            INSERT INTO alerts (disaster_type, risk_level, latitude, longitude, confidence, message, status)
            VALUES ($1, $2, $3, $4, $5, $6, 'pending')
            RETURNING id;
        `;
        const values = [disaster_type, risk_level, latitude, longitude, confidence, enhancedMessage];
        
        const result = await db.query(query, values);

        console.log(`⚠️ New AI Prediction received: ${disaster_type} near ${placeName} (${latitude}, ${longitude})`);
        res.status(201).json({ success: true, alertId: result.rows[0].id });
    } catch (error) {
        console.error("Error saving AI alert:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 2. GET ALL PENDING ALERTS (For Admin Dashboard)
router.get('/pending', async (req, res) => {
    try {
        const query = `SELECT * FROM alerts WHERE status = 'pending' ORDER BY id DESC`;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. ADMIN APPROVE & BROADCAST
router.post('/approve/:id', async (req, res) => {
    try {
        const alertId = req.params.id;

        // Update the status to approved
        const updateQuery = `
            UPDATE alerts 
            SET status = 'approved' 
            WHERE id = $1 
            RETURNING *;
        `;
        const result = await db.query(updateQuery, [alertId]);

        if (result.rowCount === 0) {
            return res.status(404).send("Alert not found");
        }

        const approvedAlert = result.rows[0];

        // --- TWILIO LOGIC HERE ---
        // You would fetch all users from the users table here 
        // and loop through to send SMS
        console.log(`📢 BROADCASTING: ${approvedAlert.message} to all users!`);

        res.json({ message: "Alert approved and broadcasted!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET ACTIVE/APPROVED ALERTS FOR THE PUBLIC
router.get('/active', async (req, res) => {
    try {
        // Fetch alerts that the Admin has approved
        const query = `
            SELECT * FROM alerts 
            WHERE status = 'approved' 
            ORDER BY created_at DESC 
            LIMIT 5;
        `;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;