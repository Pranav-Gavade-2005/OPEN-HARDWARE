import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Repository API functions
export const repositoryApi = {
  // Create a new repository
  createRepository: async (formData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/repositories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type header when sending FormData
          // The browser will set it automatically with the correct boundary
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create repository');
      }

      return response.json();
    } catch (error) {
      if (error.message === 'No authentication token found') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }
      throw error;
    }
  },

  // Get all repositories for the current user
  getUserRepositories: async () => {
    try {
      const response = await api.get('/repositories/user');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch repositories' };
    }
  },

  //  Get all repositories for the public user profile
  getPublicUserRepositories: async (id) => {
    try{
      const response = await api.get(`/repositories/user/${id}`);
      return response.data;
    }catch(error){
      throw error.response?.data || { message: 'Failed to fetch repositories' };
    }
  },

  // Get a single repository
  getRepository: async (id) => {
    try {
      const response = await api.get(`/repositories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch repository' };
    }
  },


  // Get the owner of a repository
  getRepositoryOwner: async (id) => {
    const response = await api.get(`/repositories/owner/${id}`);
    return response.data;
  },

  // Search repositories
  searchRepositories: async (query) => {
    try {
      const response = await api.get(`/repositories/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to search repositories' };
    }
  },

  // Download repository
  downloadRepository: async (id) => {
    try {
      const response = await api.get(`/repositories/${id}/download`, {
        responseType: 'blob'
      });

      // Create a blob from the response data
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `project-${id}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      throw error.response?.data || { message: 'Failed to download repository' };
    }
  }
};

export default repositoryApi;

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


export const userApi = {
  updateUserProfilePicture: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', imageFile);

      // Get auth token from localStorage (adjust based on your auth strategy)
      const token = localStorage.getItem('token');

      // Make API request
      const response = await fetch(`${API_URL}/user/profile-picture`, {
        method: 'POST',
        headers: {
          // Don't set Content-Type when using FormData - the browser will set it with the boundary
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      // Check for errors
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload profile picture');
      }

      // Parse and return the response
      const data = await response.json();
      return data.profilePictureUrl;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  },

  getPublicUser: async (id) => {
    try {
      const res = await fetch(`${API_URL}/user/publicUser/${id}`);
      const data = await res.json();
      return data;
    }
    catch (err) {
      alert('Failed to fetch the user profile')
      console.log(err);
    }
  },

  updateUserProfile: async(userData) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/user/update-profile/${userData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: userData.name,
          occupation: userData.occupation
        })
      });
       const data = await response.json();
       return data;
    } catch (error) {
      console.log(error)
    }
  }, 

  updatePassword: async(id, password) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/user/update-password/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          password: password
        })
      });
       const data = await response.json();
       return data;
    } catch (error) {
      console.log(error)
    }
  }
}



export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = async () => {
  const user = localStorage.getItem('user');
  const u = JSON.parse(user);
  const res = await fetch(`${API_URL}/user/${u._id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
  });
  const data = await res.json();
  return data;
};


export const updateRepository = async (id, formData) => {    

  const response = await fetch(`${API_URL}/repositories/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error('Failed to update repository');
  }
  return response.json();
};

export const deleteRepository = async (id) => {
  try {
    const response = await fetch(`${API_URL}/repositories/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete repository');
    }

    return response.json();
  } catch (error) {
    if (error.message === 'No authentication token found') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
    throw error;
  }
};

export const downloadFile = async (repositoryId, filename) => {
  const response = await fetch(`${API_URL}/repositories/${repositoryId}/files/${filename}`);

  if (!response.ok) {
    throw new Error('Failed to download file');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const starRepository = async (id) => {
  const response = await fetch(`${API_URL}/repositories/${id}/star`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to star repository');
  }

  return response.json();
}; 