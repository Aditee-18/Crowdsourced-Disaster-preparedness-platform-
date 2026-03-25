const db = require('../db'); 

// This function creates the table if it doesn't already exist
const createAlertTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS alerts (
            id SERIAL PRIMARY KEY,
            disaster_type VARCHAR(255) NOT NULL,
            risk_level VARCHAR(50) DEFAULT 'HIGH',
            latitude FLOAT NOT NULL,
            longitude FLOAT NOT NULL,
            confidence FLOAT,
            message TEXT,
            status VARCHAR(50) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        await db.query(query);
        console.log("✅ Alerts table is ready in the database!");
    } catch (error) {
        console.error("❌ Error creating alerts table:", error);
    }
};

module.exports = {
    createAlertTable
};