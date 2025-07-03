const express = require('express');
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware'); // Import middleware

const router = express.Router();

router.post('/login', authController.login);

// Tambahkan rute baru di sini
router.get('/me', verifyToken, authController.getMe);

module.exports = router;
