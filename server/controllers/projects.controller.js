// server/controllers/projects.controller.js
const db = require('../config/database');


exports.getAllProjects = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM projects ORDER BY order_index');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute('SELECT * FROM projects WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { title, description, thumbnail, images, tags, url, github_url, featured, order_index } = req.body;
    
    const [result] = await db.execute(
      'INSERT INTO projects (title, description, thumbnail, images, tags, url, github_url, featured, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, thumbnail, images, tags, url, github_url, featured || false, order_index || 0]
    );
    
    res.status(201).json({ 
      message: 'Project created successfully',
      id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, thumbnail, images, tags, url, github_url, featured, order_index } = req.body;
    
    await db.execute(
      'UPDATE projects SET title = ?, description = ?, thumbnail = ?, images = ?, tags = ?, url = ?, github_url = ?, featured = ?, order_index = ? WHERE id = ?',
      [title, description, thumbnail, images, tags, url, github_url, featured, order_index, id]
    );
    
    res.status(200).json({ message: 'Project updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.execute('DELETE FROM projects WHERE id = ?', [id]);
    
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};