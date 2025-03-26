const Repository = require('../models/Repository');
const multer = require('multer');
const path = require('path');

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

// Create a new repository
exports.createRepository = async (req, res) => {
  try {
    const { title, description, readme, bom } = req.body;
    
    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    // Validate required fields
    if (!title || !description || !readme) {
      return res.status(400).json({ 
        success: false,
        message: 'Title, description, and README are required' 
      });
    }

    // Parse BOM data if it exists
    let parsedBom = null;
    if (bom) {
      try {
        parsedBom = JSON.parse(bom);
      } catch (error) {
        console.error('Error parsing BOM:', error);
      }
    }

    // Handle file uploads
    const files = {
      cad: [],
      documentation: [],
      report: [],
      layout: []
    };

    const images = [];

    // Process uploaded files
    if (req.files) {
      if (req.files.files) {
        req.files.files.forEach(file => {
          files.cad.push({
            name: file.originalname,
            size: file.size,
            path: file.path
          });
        });
      }
      if (req.files.images) {
        req.files.images.forEach(file => {
          images.push({
            name: file.originalname,
            size: file.size,
            path: file.path
          });
        });
      }
    }

    // Create repository object
    const repositoryData = {
      title,
      description,
      readme,
      owner: req.user._id,
      files,
      images,
      bom: parsedBom
    };

    const repository = new Repository(repositoryData);
    await repository.save();
    
    res.status(201).json({
      success: true,
      data: repository
    });
  } catch (error) {
    console.error('Repository creation error:', error);
    res.status(400).json({ 
      success: false,
      message: error.message || 'Failed to create repository'
    });
  }
};

// Get repositories for a user
exports.getUserRepositories = async (req, res) => {
  try {
    const repositories = await Repository.find({ owner: req.user._id })
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      data: repositories
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to fetch repositories'
    });
  }
};

// Get a single repository
exports.getRepository = async (req, res) => {
  try {
    const repository = await Repository.findOne({
      _id: req.params.id,
      owner: req.user._id
    });
    
    if (!repository) {
      return res.status(404).json({ 
        success: false,
        message: 'Repository not found' 
      });
    }
    
    res.json({
      success: true,
      data: repository
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to fetch repository'
    });
  }
}; 