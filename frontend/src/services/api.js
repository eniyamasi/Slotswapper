import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

// Events API
export const eventsAPI = {
  getAll: () => api.get('/events'),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`)
};

// Swaps API
export const swapsAPI = {
  getSwappableSlots: () => api.get('/swaps/swappable-slots'),
  createSwapRequest: (data) => api.post('/swaps/swap-request', data),
  respondToSwap: (requestId, accepted) => api.post(`/swaps/swap-response/${requestId}`, { accepted }),
  getIncomingRequests: () => api.get('/swaps/incoming-requests'),
  getOutgoingRequests: () => api.get('/swaps/outgoing-requests')
};

export default api;

