const express = require('express');
const contentController = require('../controllers/content.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', contentController.getAllContent);
router.get('/:section', contentController.getContentBySection);
router.put('/:id', verifyToken, contentController.updateContent);

module.exports = router;