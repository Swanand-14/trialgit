const API_BASE = process.env.REACT_APP_API_URL || 'https://api.example.com';

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  return apiRequest(`/users/${userId}`, {
    method: 'PUT',
    body: userData,
  });
};

export const deleteUser = async (userId) => {
  return apiRequest(`/users/${userId}`, {
    method: 'DELETE',
  });
};

export const fetchUsers = async (page = 1, limit = 10) => {
  return apiRequest(`/users?page=${page}&limit=${limit}`);
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};


export const isAdmin = (user) => {
  return user.role === 'admin' || user.email === 'admin@example.com';
};