const express = require('express');
const projectsController = require('../controllers/projects.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', projectsController.getAllProjects);
router.get('/:id', projectsController.getProjectById);
router.post('/', verifyToken, projectsController.createProject);
router.put('/:id', verifyToken, projectsController.updateProject);
router.delete('/:id', verifyToken, projectsController.deleteProject);

module.exports = router;