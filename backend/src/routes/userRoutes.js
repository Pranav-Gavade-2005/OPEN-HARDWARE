// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const { updateProfilePicture, getUser, getPublicUser, updateProfile, updateProfilePassword } = require('../controllers/userController');

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = 'uploads/profile-pictures';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = `${req.user.id}-${Date.now()}`;
    const fileExt = path.extname(file.originalname);
    cb(null, `profile-${uniqueSuffix}${fileExt}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

// Profile picture update route
router.post('/profile-picture', auth, upload.single('profilePicture'), updateProfilePicture);
router.get('/:id', auth, getUser);
router.put('/update-profile/:id', auth, updateProfile);
router.put('/update-password/:id', auth, updateProfilePassword);
router.get('/publicUser/:id', getPublicUser);
module.exports = router;