const express = require('express');
const router = express.Router();
const db = require('../db'); 

// 1. RECEIVE FROM AI SERVER (Saves with Polygon and Auto-Approves)
// ⚠️ UNTOUCHED: Kept exactly as your team member wrote it
router.post('/receive-ai', async (req, res) => {
    try {
        // Destructure danger_zone from the AI's JSON payload
        const { disaster_type, risk_level, latitude, longitude, confidence, message, danger_zone } = req.body;
        
        console.log("📥 AI Alert Received for:", disaster_type);

        const query = `
            INSERT INTO alerts (disaster_type, risk_level, latitude, longitude, confidence, message, status, danger_zone)
            VALUES ($1, $2, $3, $4, $5, $6, 'approved', $7)
            RETURNING id;
        `;
        
        // Use JSON.stringify to ensure the Polygon object is saved correctly in JSONB column
        const result = await db.query(query, [
            disaster_type, 
            risk_level, 
            latitude, 
            longitude, 
            confidence, 
            message, 
            JSON.stringify(danger_zone) 
        ]);

        console.log("✅ AI Alert Saved to DB. ID:", result.rows[0].id);
        res.status(201).json({ success: true, alertId: result.rows[0].id });
    } catch (error) {
        console.error("❌ DB Error in receive-ai:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 2. CITIZEN MANUAL REPORT
router.post('/report', async (req, res) => {
    const { disaster_type, description, latitude, longitude } = req.body;
    try {
        // ✅ We completely removed danger_zone from this query.
        // Postgres will automatically just leave it blank for manual reports!
        const query = `
            INSERT INTO alerts (disaster_type, message, latitude, longitude, status, risk_level, confidence)
            VALUES ($1, $2, $3, $4, 'pending', 'MEDIUM', 1.0)
            RETURNING id;
        `;
        
        const result = await db.query(query, [
            disaster_type, 
            description, 
            latitude, 
            longitude
        ]);
        
        res.status(201).json({ success: true, alertId: result.rows[0].id });
    } catch (err) {
        console.error("❌ Report Error:", err.message);
        res.status(500).json({ error: "Failed to save report" });
    }
});

// 3. GET ACTIVE ALERTS (What the Map Section calls)
router.get('/active', async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM alerts WHERE status = 'approved' ORDER BY created_at DESC LIMIT 10"
        );
        res.json(result.rows);
    } catch (error) {
        console.error("❌ Error fetching active alerts:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// 4. GET PENDING ALERTS (For Admin Dashboard)
router.get('/pending', async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM alerts WHERE status = 'pending' ORDER BY created_at DESC"
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. ADMIN APPROVE ALERT
router.post('/approve/:id', async (req, res) => {
    const alertId = req.params.id;
    try {
        await db.query("UPDATE alerts SET status = 'approved' WHERE id = $1", [alertId]);
        res.json({ success: true, message: "Alert approved!" });
    } catch (err) {
        console.error("❌ Approval Error:", err);
        res.status(500).json({ error: "Failed to approve alert" });
    }
});

module.exports = router;