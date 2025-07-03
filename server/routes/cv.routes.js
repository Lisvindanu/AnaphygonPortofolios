// server/routes/cv.routes.js
const express = require('express');
const cvController = require('../controllers/cv.controller');
const { verifyToken } = require('../middleware/auth.middleware');
// Import instance multer
const upload = require('../middleware/upload.middleware');

const router = express.Router();

// Rute Publik
router.get('/', cvController.getAllCVs);
router.get('/:id', cvController.getCVById);
router.get('/download/:id', cvController.downloadCV);
router.get('/view/:id', cvController.viewCV); // Rute baru untuk pratinjau

// Rute Terproteksi (khusus admin)
// Gunakan upload.single() untuk menangani upload file
router.post('/', verifyToken, upload.single('cv_file'), cvController.uploadCV);
router.put('/:id', verifyToken, cvController.updateCV);
router.delete('/:id', verifyToken, cvController.deleteCV);
router.put('/:id/toggle-active', verifyToken, cvController.toggleActive);

module.exports = router;
