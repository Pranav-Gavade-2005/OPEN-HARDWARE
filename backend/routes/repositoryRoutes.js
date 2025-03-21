const express = require('express');
const router = express.Router();
const repositoryController = require('../controllers/repositoryController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = file.mimetype.startsWith('image/') ? 'uploads/images' : 'uploads/files';
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Create repository with file uploads
router.post('/', auth, upload.array('files'), async (req, res, next) => {
  try {
    // Separate images from other files
    const images = req.files.filter(file => file.mimetype.startsWith('image/'));
    const files = req.files.filter(file => !file.mimetype.startsWith('image/'));
    
    req.files = files;
    req.images = images;
    next();
  } catch (error) {
    next(error);
  }
}, repositoryController.createRepository);

// Get user's repositories
router.get('/user', auth, repositoryController.getUserRepositories);

// Get repository by ID
router.get('/:id', repositoryController.getRepository);

// Update repository
router.put('/:id', auth, upload.array('files'), async (req, res, next) => {
  try {
    // Separate images from other files
    const images = req.files.filter(file => file.mimetype.startsWith('image/'));
    const files = req.files.filter(file => !file.mimetype.startsWith('image/'));
    
    req.files = files;
    req.images = images;
    next();
  } catch (error) {
    next(error);
  }
}, repositoryController.updateRepository);

// Delete repository
router.delete('/:id', auth, repositoryController.deleteRepository);

// Download file
router.get('/:id/files/:filename', repositoryController.downloadFile);

// Star repository
router.post('/:id/star', auth, repositoryController.starRepository);

module.exports = router; 