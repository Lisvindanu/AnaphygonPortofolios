const express = require('express');
const projectsController = require('../controllers/projects.controller');
const { verifyToken } = require('../middleware/auth.middleware');
// Import instance multer
const upload = require('../middleware/upload.middleware');

const router = express.Router();

// Definisikan field-field yang akan di-upload
const projectUploadFields = [
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 5 }
];

router.get('/', projectsController.getAllProjects);
router.get('/:id', projectsController.getProjectById);

// Gunakan upload.fields() untuk menangani upload file
router.post('/', verifyToken, upload.fields(projectUploadFields), projectsController.createProject);
router.put('/:id', verifyToken, upload.fields(projectUploadFields), projectsController.updateProject);

router.delete('/:id', verifyToken, projectsController.deleteProject);

module.exports = router;
