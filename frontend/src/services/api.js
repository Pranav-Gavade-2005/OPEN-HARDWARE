import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Repository API functions
export const createRepository = async (formData) => {
  const response = await fetch(`${API_URL}/repositories`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: formData
  });
  
  if (!response.ok) {
    throw new Error('Failed to create repository');
  }
  
  return response.json();
};

export const getUserRepositories = async () => {
  const response = await fetch(`${API_URL}/repositories/user`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch repositories');
  }
  
  return response.json();
};

export const getRepository = async (id) => {
  const response = await fetch(`${API_URL}/repositories/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch repository');
  }
  
  return response.json();
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
  const response = await fetch(`${API_URL}/repositories/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete repository');
  }
  
  return response.json();
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

export default api; 