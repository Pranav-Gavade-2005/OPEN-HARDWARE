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
    const ext = path.extname(file.originalname).toLowerCase();
    const isCAD = ['.stl', '.step', '.stp', '.iges', '.igs'].includes(ext);
    const isDoc = ['.pdf', '.doc', '.docx', '.txt', '.md'].includes(ext);
    const isImage = file.mimetype.startsWith('image/');

    let dest;
    if (isImage) {
      dest = 'uploads/images';
    } else if (isCAD) {
      dest = 'uploads/files/cad';
    } else if (isDoc) {
      dest = 'uploads/files/docs';
    } else {
      dest = 'uploads/files';
    }
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    // Sanitize filename and add timestamp
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, Date.now() + '-' + sanitizedFilename);
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

// Search repositories
router.get('/search', repositoryController.searchRepositories);

// Download repository
router.get('/:id/download', repositoryController.downloadRepository);

// Get all repositories for the authenticated user
router.get('/user', auth, repositoryController.getUserRepositories);

// Get all repositories for the public user profile
router.get('/user/:id',  repositoryController.getPublicUserRepositories);

// Get a single repository
router.get('/:id',  repositoryController.getRepository);

// Update a single repository
router.put('/:id', auth,  upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'docs', maxCount: 10 },
  { name: 'cad', maxCount: 10 }, 
]), repositoryController.updateRepository);

// Get the owner of a repository
router.get('/owner/:id', repositoryController.getRepositoryOwner);

//Deleting a single repo
router.delete('/:id', auth, repositoryController.deleteRepository);

module.exports = router; 

