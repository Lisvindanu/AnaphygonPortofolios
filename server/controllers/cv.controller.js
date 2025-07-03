// server/controllers/cv.controller.js
const db = require('../config/database'); // Pastikan path ini benar
const fs = require('fs');
const path = require('path');

const getAllCVs = async (req, res) => {
    try {
        const query = 'SELECT * FROM cvs ORDER BY created_at DESC';
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching CVs:', error);
        res.status(500).json({ error: 'Failed to fetch CVs' });
    }
};

const getCVById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM cvs WHERE id = ?';
        const [rows] = await db.execute(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'CV not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching CV:', error);
        res.status(500).json({ error: 'Failed to fetch CV' });
    }
};

const uploadCV = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }
        if (req.file.mimetype !== 'application/pdf') {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ error: 'Only PDF files are allowed for CV' });
        }

        const query = `
            INSERT INTO cvs (title, description, file_path, file_name, file_size)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [
            title,
            description || '',
            `/uploads/${req.file.filename}`,
            req.file.originalname,
            req.file.size
        ];

        const [result] = await db.execute(query, values);
        res.status(201).json({
            message: 'CV uploaded successfully',
            cvId: result.insertId
        });
    } catch (error) {
        console.error('Error uploading CV:', error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: 'Failed to upload CV' });
    }
};

const updateCV = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const query = 'UPDATE cvs SET title = ?, description = ? WHERE id = ?';
        const [result] = await db.execute(query, [title, description || '', id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'CV not found' });
        }
        res.json({ message: 'CV updated successfully' });
    } catch (error) {
        console.error('Error updating CV:', error);
        res.status(500).json({ error: 'Failed to update CV' });
    }
};

const deleteCV = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute('SELECT file_path FROM cvs WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'CV not found' });
        }

        const filePath = path.join(__dirname, '..', '..', rows[0].file_path);
        const [result] = await db.execute('DELETE FROM cvs WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'CV not found after trying to delete' });
        }

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        res.json({ message: 'CV deleted successfully' });
    } catch (error) {
        console.error('Error deleting CV:', error);
        res.status(500).json({ error: 'Failed to delete CV' });
    }
};

const downloadCV = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM cvs WHERE id = ? AND is_active = 1';
        const [rows] = await db.execute(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'CV not found or inactive' });
        }

        const cv = rows[0];
        const filePath = path.join(__dirname, '..', '..', cv.file_path);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'CV file not found on server' });
        }

        await db.execute('UPDATE cvs SET download_count = download_count + 1 WHERE id = ?', [id]);
        res.download(filePath, cv.file_name);

    } catch (error) {
        console.error('Error downloading CV:', error);
        res.status(500).json({ error: 'Failed to download CV' });
    }
};

const toggleActive = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'UPDATE cvs SET is_active = NOT is_active WHERE id = ?';
        const [result] = await db.execute(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'CV not found' });
        }
        res.json({ message: 'CV status updated successfully' });
    } catch (error) {
        console.error('Error toggling CV status:', error);
        res.status(500).json({ error: 'Failed to update CV status' });
    }
};

module.exports = {
    getAllCVs,
    getCVById,
    uploadCV,
    updateCV,
    deleteCV,
    downloadCV,
    toggleActive
};