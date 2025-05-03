// server/models/project.model.js
const db = require('../config/db');

class Project {
  static async getAll() {
    try {
      const [rows] = await db.execute('SELECT * FROM projects ORDER BY order_index');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getFeatured() {
    try {
      const [rows] = await db.execute('SELECT * FROM projects WHERE featured = 1 ORDER BY order_index LIMIT 4');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await db.execute('SELECT * FROM projects WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(projectData) {
    try {
      const {
        title,
        description,
        thumbnail,
        images,
        tags,
        url,
        github_url,
        featured,
        order_index
      } = projectData;
      
      const [result] = await db.execute(
        'INSERT INTO projects (title, description, thumbnail, images, tags, url, github_url, featured, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [title, description, thumbnail, images, tags, url, github_url, featured || false, order_index || 0]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, projectData) {
    try {
      const {
        title,
        description,
        thumbnail,
        images,
        tags,
        url,
        github_url,
        featured,
        order_index
      } = projectData;
      
      await db.execute(
        'UPDATE projects SET title = ?, description = ?, thumbnail = ?, images = ?, tags = ?, url = ?, github_url = ?, featured = ?, order_index = ? WHERE id = ?',
        [title, description, thumbnail, images, tags, url, github_url, featured, order_index, id]
      );
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      await db.execute('DELETE FROM projects WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Project;