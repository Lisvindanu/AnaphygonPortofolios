// server/models/content.model.js
const db = require('../config/db');

class Content {
  static async getAll() {
    try {
      const [rows] = await db.execute('SELECT * FROM content ORDER BY section, order_index');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getBySection(section) {
    try {
      const [rows] = await db.execute('SELECT * FROM content WHERE section = ? ORDER BY order_index', [section]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await db.execute('SELECT * FROM content WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(contentData) {
    try {
      const {
        section,
        title,
        subtitle,
        content,
        order_index
      } = contentData;
      
      const [result] = await db.execute(
        'INSERT INTO content (section, title, subtitle, content, order_index) VALUES (?, ?, ?, ?, ?)',
        [section, title, subtitle, content, order_index || 0]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, contentData) {
    try {
      const {
        title,
        subtitle,
        content,
        order_index
      } = contentData;
      
      await db.execute(
        'UPDATE content SET title = ?, subtitle = ?, content = ?, order_index = ? WHERE id = ?',
        [title, subtitle, content, order_index, id]
      );
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      await db.execute('DELETE FROM content WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Content;
