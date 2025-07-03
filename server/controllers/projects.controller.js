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
    const { title, description, tags, url, github_url, featured, order_index } = req.body;

    // req.files sekarang adalah objek: { thumbnail: [file], images: [file1, file2, ...] }
    const thumbnail = req.files && req.files.thumbnail ? `/uploads/${req.files.thumbnail[0].filename}` : null;
    const images = req.files && req.files.images ? req.files.images.map(file => `/uploads/${file.filename}`).join(',') : null;

    const [result] = await db.execute(
        'INSERT INTO projects (title, description, thumbnail, images, tags, url, github_url, featured, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [title, description, thumbnail, images, tags, url, github_url, (featured === 'true' || featured === true) ? 1 : 0, order_index || 0]
    );

    res.status(201).json({
      message: 'Project created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, url, github_url, featured, order_index } = req.body;

    const [existingProjectRows] = await db.execute('SELECT thumbnail, images FROM projects WHERE id = ?', [id]);
    if (existingProjectRows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const existingProject = existingProjectRows[0];

    // Gunakan file baru jika ada, jika tidak, pertahankan yang lama
    const thumbnail = req.files && req.files.thumbnail ? `/uploads/${req.files.thumbnail[0].filename}` : existingProject.thumbnail;
    const images = req.files && req.files.images ? req.files.images.map(file => `/uploads/${file.filename}`).join(',') : existingProject.images;

    await db.execute(
        'UPDATE projects SET title = ?, description = ?, thumbnail = ?, images = ?, tags = ?, url = ?, github_url = ?, featured = ?, order_index = ? WHERE id = ?',
        [title, description, thumbnail, images, tags, url, github_url, (featured === 'true' || featured === true) ? 1 : 0, order_index, id]
    );

    res.status(200).json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Anda mungkin ingin menambahkan logika untuk menghapus file dari folder 'uploads' di sini

    await db.execute('DELETE FROM projects WHERE id = ?', [id]);

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};