const Repository = require('../models/Repository');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const BASE_URL = 'http://localhost:5000/';


// // Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // Determine the destination based on file type
//     const dest = file.fieldname === 'images' ? 'uploads/images' : 'uploads/files';
//     cb(null, dest);
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const upload = multer({ 
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     if (file.fieldname === 'images') {
//       // Accept only image files
//       if (!file.mimetype.startsWith('image/')) {
//         return cb(new Error('Only image files are allowed!'), false);
//       }
//     }
//     cb(null, true);
//   }
// });

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
      docs: []
    };
    const images = [];

    // Process uploaded files
    if (req.files) {
      if (req.files.files) {
        req.files.files.forEach(file => {
          // Check file extension to determine type
          const ext = path.extname(file.originalname).toLowerCase();
          const isCAD = ['.stl', '.step', '.stp', '.iges', '.igs'].includes(ext);
          const isDoc = ['.pdf', '.doc', '.docx', '.txt', '.md'].includes(ext);
          
          // Get relative path from uploads directory
          const relativePath = file.path.split('uploads')[1].replace(/\\/g, '/');
          const fileData = {
            name: file.originalname,
            size: file.size,
            path: `${BASE_URL}uploads${relativePath}`
          };
          
          if (isCAD) {
            files.cad.push(fileData);
          } else if (isDoc) {
            files.docs.push(fileData);
          }
        });
      }
      if (req.files.images) {
        req.files.images.forEach(file => {
          // Get relative path from uploads directory
          const relativePath = file.path.split('uploads')[1].replace(/\\/g, '/');
          images.push({
            name: file.originalname,
            size: file.size,
            path: `${BASE_URL}uploads${relativePath}`
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
    res.status(500).json({ 
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


exports.getPublicUserRepositories = async (req, res) => {
  try{
    const repositories = await Repository.find({ owner: req.params.id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: repositories
    });
  }catch(error)
  {
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to fetch repositories'
    });
  }
}

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
    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token, access denied'
      });
    }

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
      if (!Array.isArray(filesArray)) return;
      
      filesArray.forEach(file => {
        try {
          if (file && file.path) {
            // Extract the relative path from the full URL
            const relativePath = file.path.split('uploads')[1];
            if (relativePath) {
              const filePath = path.join(__dirname, '../uploads', relativePath);
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); // Delete the file
              }
            }
          }
        } catch (error) {
          console.error('Error deleting file:', error);
          // Continue with other files even if one fails
        }
      });
    };

    // Delete uploaded files and images
    if (repository.files) {
      if (repository.files.cad) {
        deleteFiles(repository.files.cad);
      }
      if (repository.files.docs) {
        deleteFiles(repository.files.docs);
      }
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

    // console.log(repository.files.cad);
    
    // Add files to the archive
    if (repository.files && repository.files.cad) {
      repository.files.cad.forEach(file => {
        const urlPath = file.path;
        const pathMatch = urlPath.match(/\/uploads\/(.*)/);
        
        if (pathMatch && pathMatch[1]) {
          // Construct the local file system path
          const localPath = path.join(process.cwd(), 'uploads', pathMatch[1]);
          // Add to archive
          archive.file(localPath, { name: `files/cad/${file.name}` });
        }
      });
    }

    if (repository.files && repository.files.docs) {
      repository.files.docs.forEach(file => {
        const urlPath = file.path;
        const pathMatch = urlPath.match(/\/uploads\/(.*)/);
        
        if (pathMatch && pathMatch[1]) {
          // Construct the local file system path
          const localPath = path.join(process.cwd(), 'uploads', pathMatch[1]);
          // Add to archive
          archive.file(localPath, { name: `files/docs/${file.name}` });
        }
      });
    }


    if (repository.images) {
      repository.images.forEach(image => {
        const urlPath = image.path;
        const pathMatch = urlPath.match(/\/uploads\/(.*)/);
        
        if (pathMatch && pathMatch[1]) {
          // Construct the local file system path
          const localPath = path.join(process.cwd(), 'uploads', pathMatch[1]);
          // Add to archive
          archive.file(localPath, { name: `images/${image.name}` });
        }
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

// Update a repository
exports.updateRepository = async (req, res) => {
  try {
    const { title, description, readme, bom } = req.body;
    
    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    // Find the repository to update
    const repository = await Repository.findOne({
      _id: req.params.id,
      owner: req.user._id
    });
    
    if (!repository) {
      return res.status(404).json({ 
        success: false,
        message: 'Repository not found or you do not have permission to update it' 
      });
    }
    
    // Update basic fields if provided
    if (title) repository.title = title;
    if (description) repository.description = description;
    if (readme) repository.readme = readme;
    
    // Parse BOM data if it exists
    if (bom) {
      try {
        repository.bom = JSON.parse(bom);
      } catch (error) {
        console.error('Error parsing BOM:', error);
        return res.status(400).json({
          success: false,
          message: 'Invalid BOM format'
        });
      }
    }

    // Handle file uploads
    if (req.files) {
      // Process new CAD files
      if (req.files.cad) {
        if (!repository.files.cad) repository.files.cad = [];
        
        req.files.cad.forEach(file => {

          // Get relative path from uploads directory
          const relativePath = file.path.split('uploads')[1].replace(/\\/g, '/');
          const fileData = {
            name: file.originalname,
            size: file.size,
            path: `${BASE_URL}uploads${relativePath}`
          };
          
          repository.files.cad.push(fileData);
        });
      }
      
      // Process new docs files
      if (req.files.docs) {
        if (!repository.files.docs) repository.files.docs = [];
        
        req.files.docs.forEach(file => {
          // Get relative path from uploads directory
          const relativePath = file.path.split('uploads')[1].replace(/\\/g, '/');
          const fileData = {
            name: file.originalname,
            size: file.size,
            path: `${BASE_URL}uploads${relativePath}`
          };
          
          repository.files.docs.push(fileData);
        });
      }
      
      // Process new images
      if (req.files.images) {
        if (!repository.images) repository.images = [];
        
        req.files.images.forEach(file => {
          // Get relative path from uploads directory
          const relativePath = file.path.split('uploads')[1].replace(/\\/g, '/');
          repository.images.push({
            name: file.originalname,
            size: file.size,
            path: `${BASE_URL}uploads${relativePath}`
          });
        });
      }
    }
    
    // Handle file deletions if specified
    if (req.body.filesToDelete) {
      let filesToDelete;
      
      // Parse the filesToDelete if it's a string (from FormData)
      if (typeof req.body.filesToDelete === 'string') {
        try {
          filesToDelete = JSON.parse(req.body.filesToDelete);
        } catch (error) {
          console.error('Error parsing filesToDelete:', error);
          filesToDelete = [];
        }
      } else {
        filesToDelete = req.body.filesToDelete;
      }
      
      if (Array.isArray(filesToDelete.docs) && Array.isArray(filesToDelete.cad) && (filesToDelete.docs.length > 0 || filesToDelete.cad.length > 0 || filesToDelete.images.length > 0)) {
        const deleteFile = (filePath) => {
          try {
            const relativePath = filePath.split('uploads')[1];
            if (relativePath) {
              const fullPath = path.join(__dirname, '../uploads', relativePath);
              if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
              }
            }
          } catch (error) {
            console.error('Error deleting file:', error);
          }
        };
        
        // Process each file path to delete

        filesToDelete.cad.forEach(filePath => {
       
          // Remove from CAD files
          if (repository.files.cad) {
            repository.files.cad = repository.files.cad.filter(file => {
              if (file.path === filePath) {
                deleteFile(filePath);
                return false;
              }
              return true;
            });
          }

        });
         
        filesToDelete.docs.forEach(filePath => {
          // Remove from document files
          if (repository.files.docs) {
            repository.files.docs = repository.files.docs.filter(file => {
              if (file.path === filePath) {
                deleteFile(filePath);
                return false;
              }
              return true;
            });
          }
        });
        
        filesToDelete.images.forEach(filePath => {
          // Remove from images
          if (repository.images) {
            repository.images = repository.images.filter(image => {
              if (image.path === filePath) {
                deleteFile(filePath);
                return false;
              }
              return true;
            });
          }
        });
      }
    }

    // Save the updated repository
    await repository.save();
    
    res.status(200).json({
      success: true,
      message: 'Repository updated successfully',
      data: repository
    });
  } catch (error) {
    console.error('Repository update error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to update repository'
    });
  }
};
