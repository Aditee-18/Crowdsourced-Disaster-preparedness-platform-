const db = require('../db');
const bcrypt = require('bcryptjs');

class User {
  static async create({ name, phone_number, password, location, role }) {
 
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

   
    const userRole = role || 'citizen';

    const sql = `
      INSERT INTO users (name, phone_number, password_hash, last_known_location, role)
      VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($4, $5), 4326), $6)
      RETURNING id, name, phone_number, role;
    `;

    const params = [
      name,
      phone_number,
      password_hash,
      location.longitude, // Longitude first
      location.latitude,  // Latitude second
      userRole
    ];

    const { rows } = await db.query(sql, params);
    return rows[0];
  }

  static async findByPhone(phone_number) {
    const sql = `SELECT * FROM users WHERE phone_number = $1`;
    const { rows } = await db.query(sql, [phone_number]);
    return rows[0]; // Returns the user object if found, or undefined
  }
}

module.exports = User;