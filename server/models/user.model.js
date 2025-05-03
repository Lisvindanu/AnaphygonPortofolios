// server/models/user.model.js
const db = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  static async getById(id) {
    try {
      const [rows] = await db.execute('SELECT id, username, created_at FROM users WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getByUsername(username) {
    try {
      const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(username, password) {
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Insert user
      const [result] = await db.execute(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async updatePassword(id, password) {
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Update password
      await db.execute(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, id]
      );
      
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
