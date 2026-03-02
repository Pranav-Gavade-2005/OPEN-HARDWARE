// controllers/userController.js
const path = require('path');
const User = require('../models/User');
const fs = require('fs');
const BASE_URL = 'http://localhost:5000';


// Update profile picture controller
const updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get file path relative to server
    const profilePicturePath = `/${req.file.path.replace(/\\/g, '/')}`;
    
    // Find the user's previous profile picture
    const currentUser = await User.findById(req.user.id);
    const previousPicture = currentUser?.profilePicture;
    
    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: `${BASE_URL}${profilePicturePath}` },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete previous profile picture if it exists and isn't the default
    if (previousPicture && 
        previousPicture !== '/default-avatar.png' && 
        fs.existsSync( path.join(__dirname , `${previousPicture}`))) {
      fs.unlinkSync(path.join(__dirname , `${previousPicture}`));
    }

    // Return success with the profile picture URL
    res.status(200).json({ 
      success: true, 
      profilePictureUrl: `${BASE_URL}${profilePicturePath}` 
    });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


const getUser = async (req, res) => {
  try {
    const id  = req.params.id;  
    
    if (req.params.id !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to access this user data' });
    }
    
    const user = await User.findById(id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user); 
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: 'Server error' });
  }
}

const getPublicUser = async (req, res) => {
  try {
    const id  = req.params.id;  
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user); 
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: 'Server error' });
  }
}

  const updateProfile = async (req, res) => {
    try
    {
      const { name, occupation } = req.body;
      const user = await User.findById(req.params.id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.name = name;
      user.occupation = occupation ;
  
      await user.save();
  
      res.status(200).json({ message: 'Profile updated successfully', user });
    }catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: 'Server error'});
    }
  } 

  const updateProfilePassword = async (req, res) => {
    try{
      const { password } = req.body;
      const user = await User.findById(req.params.id).select('+password');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      user.password = password ;
  
      await user.save();
  
      res.status(200).json({ message: 'Profile updated successfully', user });

    }catch(error)
    {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: 'Server error'});
    }
  }

module.exports = {
  updateProfilePicture,
  getUser,
  getPublicUser,
  updateProfile,
  updateProfilePassword
};