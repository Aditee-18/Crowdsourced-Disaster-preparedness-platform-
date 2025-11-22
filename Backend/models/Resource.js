const db = require('../db');

class Resource {
  // 1. SAVE NEW DATA
  static async create({ name, type, status, location, description, contact_number }) {
    const sql = `
      INSERT INTO resources (name, type, status, location, description, contact_number)
      VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($4, $5), 4326), $6, $7)
      RETURNING *;
    `;
    
    const params = [
      name, 
      type, 
      status || 'open', 
      location.longitude,
      location.latitude,
      description, 
      contact_number
    ];
    
    const { rows } = await db.query(sql, params);
    return rows[0];
  }

  // 2. GET DATA (Handles both "Get All" and "Search/Filter")
  static async findAll(filters = {}) {
    let sql = `
      SELECT id, name, type, status, description, contact_number, 
      ST_AsGeoJSON(location) as location 
      FROM resources
      WHERE 1=1 
    `;

    const params = [];
    let paramIndex = 1;

    // Filter by Type
    if (filters.type) {
      sql += ` AND type = $${paramIndex}`;
      params.push(filters.type);
      paramIndex++;
    }

    // Search by Name
    if (filters.search) {
      sql += ` AND name ILIKE $${paramIndex}`;
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    const { rows } = await db.query(sql, params);
    
    return rows.map(row => ({
      ...row,
      location: JSON.parse(row.location)
    }));
  }
}

module.exports = Resource;