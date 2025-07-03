// server/routes/upload.routes.js
const express = require('express');
const { uploadSingle, uploadMultiple } = require('../middleware/upload.middleware');
const { verifyToken } = require('../middleware/auth.middleware');
const path = require('path');

const router = express.Router();

// Single file upload endpoint
router.post('/', verifyToken, uploadSingle('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Return the file path that can be used in the frontend
        const filePath = `/uploads/${req.file.filename}`;

        res.json({
            message: 'File uploaded successfully',
            filePath: filePath,
            originalName: req.file.originalname,
            size: req.file.size
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload file' });
    }
});

// Multiple files upload endpoint
router.post('/multiple', verifyToken, uploadMultiple('images', 5), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        // Return array of file paths
        const filePaths = req.files.map(file => `/uploads/${file.filename}`);

        res.json({
            message: 'Files uploaded successfully',
            filePaths: filePaths,
            files: req.files.map(file => ({
                path: `/uploads/${file.filename}`,
                originalName: file.originalname,
                size: file.size
            }))
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload files' });
    }
});

// Thumbnail upload endpoint
router.post('/thumbnail', verifyToken, uploadSingle('thumbnail'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No thumbnail uploaded' });
        }

        const filePath = `/uploads/${req.file.filename}`;

        res.json({
            message: 'Thumbnail uploaded successfully',
            filePath: filePath,
            originalName: req.file.originalname,
            size: req.file.size
        });
    } catch (error) {
        console.error('Thumbnail upload error:', error);
        res.status(500).json({ error: 'Failed to upload thumbnail' });
    }
});

module.exports = router;