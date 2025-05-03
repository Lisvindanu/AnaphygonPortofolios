// server/routes/skills.routes.js
const express = require('express');
const skillsController = require('../controllers/skills.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Public routes
router.get('/', skillsController.getAllSkills);
router.get('/:id', skillsController.getSkillById);
router.get('/category/:category', skillsController.getSkillsByCategory);

// Protected routes
router.post('/', verifyToken, skillsController.createSkill);
router.put('/:id', verifyToken, skillsController.updateSkill);
router.delete('/:id', verifyToken, skillsController.deleteSkill);

module.exports = router;
