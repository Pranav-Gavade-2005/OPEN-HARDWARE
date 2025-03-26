const express = require('express');
const router = express.Router();
const repositoryController = require('../controllers/repositoryController');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine the destination based on file type
    const dest = file.fieldname === 'images' ? 'uploads/images' : 'uploads/files';
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'images') {
      // Accept only image files
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed!'), false);
      }
    }
    cb(null, true);
  }
});

// Create a new repository with file uploads
router.post('/', auth, 
  upload.fields([
    { name: 'files', maxCount: 10 },
    { name: 'images', maxCount: 10 }
  ]), 
  repositoryController.createRepository
);

// Get all repositories for the authenticated user
router.get('/user', auth, repositoryController.getUserRepositories);

// Get a single repository
router.get('/:id', auth, repositoryController.getRepository);

module.exports = router; 