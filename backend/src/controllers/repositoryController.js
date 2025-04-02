const Repository = require('../models/Repository');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const BASE_URL = 'http://localhost:5000/';


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
    const files = [];

    const images = [];

    

    // Process uploaded files
    if (req.files) {
      if (req.files.files) {
        req.files.files.forEach(file => {
          files.push({
            name: file.originalname,
            size: file.size,
            path: `${BASE_URL}${file.path}`
          });
        });
      }
      if (req.files.images) {
        req.files.images.forEach(file => {
          images.push({
            name: file.originalname,
            size: file.size,
            path: `${BASE_URL}${file.path}`
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
    const repositories = await Repository.find({ owner: req.user._id }).sort({ createdAt: -1 });

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
      _id: req.params.id
      //owner: req.user._id
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

// Get the owner of a repository
exports.getRepositoryOwner = async (req, res) => {
  try {
    
    const user = await User.findOne({
      _id: req.params.id
    });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch repository owner'
    });
  }
};

// Delete a repository
exports.deleteRepository = async (req, res) => {
  try {
    const repository = await Repository.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    // Check if repository exists
    if (!repository) {
      return res.status(404).json({
        success: false,
        message: 'Repository not found'
      });
    }

    // Delete associated files
    const deleteFiles = (filesArray) => {
      filesArray.forEach(file => {
        const filePath = path.join(__dirname, '../', file.path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // Delete the file
        }
      });
    };

    // Delete uploaded files and images
    if (repository.files && repository.files.cad) {
      deleteFiles(repository.files.cad);
    }
    if (repository.images) {
      deleteFiles(repository.images);
    }

    // Delete the repository from the database
    await Repository.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Repository deleted successfully'
    });
  } catch (error) {
    console.error('Repository deletion error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete repository'
    });
  }
};

// Search repositories
exports.searchRepositories = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const repositories = await Repository.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    })
    .populate('owner', 'name profilePicture')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: repositories
    });
  } catch (error) {
    console.error('Repository search error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to search repositories'
    });
  }
};

// Download repository
exports.downloadRepository = async (req, res) => {
  try {
    const repository = await Repository.findOne({
      _id: req.params.id
    }).populate('owner');

    if (!repository) {
      return res.status(404).json({
        success: false,
        message: 'Repository not found'
      });
    }

    // Create a zip file containing all repository files
    const archiver = require('archiver');
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    res.attachment(`${repository.title.toLowerCase().replace(/\s+/g, '-')}.zip`);
    archive.pipe(res);

    // Add files to the archive
    if (repository.files && repository.files.cad) {
      repository.files.cad.forEach(file => {
        archive.file(file.path, { name: `files/${file.name}` });
      });
    }

    if (repository.images) {
      repository.images.forEach(image => {
        archive.file(image.path, { name: `images/${image.name}` });
      });
    }

    // Add README and other text files
    archive.append(repository.readme, { name: 'README.md' });
    archive.append(JSON.stringify(repository.bom, null, 2), { name: 'bom.json' });

    await archive.finalize();
  } catch (error) {
    console.error('Repository download error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to download repository'
    });
  }
};
