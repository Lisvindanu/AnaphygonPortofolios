// server/models/skill.model.js
const db = require('../config/database');


class Skill {
  static async getAll() {
    try {
      const [rows] = await db.execute('SELECT * FROM skills ORDER BY category, order_index');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getByCategory(category) {
    try {
      const [rows] = await db.execute('SELECT * FROM skills WHERE category = ? ORDER BY order_index', [category]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await db.execute('SELECT * FROM skills WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(skillData) {
    try {
      const {
        name,
        category,
        proficiency,
        icon,
        order_index
      } = skillData;
      
      const [result] = await db.execute(
        'INSERT INTO skills (name, category, proficiency, icon, order_index) VALUES (?, ?, ?, ?, ?)',
        [name, category, proficiency || 0, icon, order_index || 0]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, skillData) {
    try {
      const {
        name,
        category,
        proficiency,
        icon,
        order_index
      } = skillData;
      
      await db.execute(
        'UPDATE skills SET name = ?, category = ?, proficiency = ?, icon = ?, order_index = ? WHERE id = ?',
        [name, category, proficiency, icon, order_index, id]
      );
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      await db.execute('DELETE FROM skills WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Skill;