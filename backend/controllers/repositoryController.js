const Repository = require('../models/Repository');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

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

// Create a new repository
exports.createRepository = async (req, res) => {
  try {
    const { title, description, readme, bom } = req.body;
    const files = req.files || [];
    const images = req.images || [];

    const repository = new Repository({
      title,
      description,
      readme,
      owner: req.user._id,
      files: files.map(file => ({
        name: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
        type: file.mimetype
      })),
      images: images.map(image => ({
        name: image.filename,
        originalName: image.originalname,
        path: image.path,
        size: image.size
      })),
      bom
    });

    await repository.save();
    res.status(201).json(repository);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's repositories
exports.getUserRepositories = async (req, res) => {
  try {
    const repositories = await Repository.find({ owner: req.user._id })
      .select('-files -images -bom')
      .sort({ createdAt: -1 });
    res.json(repositories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get repository by ID
exports.getRepository = async (req, res) => {
  try {
    const repository = await Repository.findById(req.params.id)
      .populate('owner', 'name username');
    
    if (!repository) {
      return res.status(404).json({ message: 'Repository not found' });
    }

    res.json(repository);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update repository
exports.updateRepository = async (req, res) => {
  try {
    const repository = await Repository.findById(req.params.id);
    
    if (!repository) {
      return res.status(404).json({ message: 'Repository not found' });
    }

    if (repository.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this repository' });
    }

    const { title, description, readme, bom } = req.body;
    const files = req.files || [];
    const images = req.images || [];

    repository.title = title;
    repository.description = description;
    repository.readme = readme;
    repository.bom = bom;

    if (files.length > 0) {
      repository.files.push(...files.map(file => ({
        name: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
        type: file.mimetype
      })));
    }

    if (images.length > 0) {
      repository.images.push(...images.map(image => ({
        name: image.filename,
        originalName: image.originalname,
        path: image.path,
        size: image.size
      })));
    }

    await repository.save();
    res.json(repository);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete repository
exports.deleteRepository = async (req, res) => {
  try {
    const repository = await Repository.findById(req.params.id);
    
    if (!repository) {
      return res.status(404).json({ message: 'Repository not found' });
    }

    if (repository.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this repository' });
    }

    // Delete files from storage
    for (const file of repository.files) {
      await fs.unlink(file.path);
    }

    for (const image of repository.images) {
      await fs.unlink(image.path);
    }

    await repository.remove();
    res.json({ message: 'Repository deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Download file
exports.downloadFile = async (req, res) => {
  try {
    const repository = await Repository.findById(req.params.id);
    
    if (!repository) {
      return res.status(404).json({ message: 'Repository not found' });
    }

    const file = repository.files.find(f => f.name === req.params.filename);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Increment download count
    repository.downloads += 1;
    await repository.save();

    res.download(file.path, file.originalName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Star repository
exports.starRepository = async (req, res) => {
  try {
    const repository = await Repository.findById(req.params.id);
    
    if (!repository) {
      return res.status(404).json({ message: 'Repository not found' });
    }

    repository.stars += 1;
    await repository.save();

    res.json({ stars: repository.stars });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 