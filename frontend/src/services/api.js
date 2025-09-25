import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await api.post('/auth/refresh', {
            refreshToken
          });
          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          
          // Retry original request with new token
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return api.request(error.config);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
};

// Users API
export const usersAPI = {
  getProfile: (userId) => api.get(`/users/${userId}`),
  updateProfile: (userId, data) => api.put(`/users/${userId}`, data),
  getStats: (userId) => api.get(`/users/${userId}/stats`),
  getActivity: (userId) => api.get(`/users/${userId}/activity`),
  uploadAvatar: (formData) => api.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Auctions API
export const auctionsAPI = {
  getAll: (params) => api.get('/auctions', { params }),
  getById: (id) => api.get(`/auctions/${id}`),
  create: (auctionData) => api.post('/auctions', auctionData),
  update: (id, data) => api.put(`/auctions/${id}`, data),
  delete: (id) => api.delete(`/auctions/${id}`),
  getFeatured: () => api.get('/auctions?status=active&limit=6'),
  getLive: () => api.get('/auctions?status=live'),
  getUpcoming: () => api.get('/auctions?status=upcoming'),
};

// Items API
export const itemsAPI = {
  getAll: (params) => api.get('/items', { params }),
  getById: (id) => api.get(`/items/${id}`),
  create: (itemData) => api.post('/items', itemData),
  update: (id, data) => api.put(`/items/${id}`, data),
  delete: (id) => api.delete(`/items/${id}`),
  search: (query) => api.get(`/items/search?q=${encodeURIComponent(query)}`),
  getFeatured: () => api.get('/items?status=active&featured=true&limit=8'),
  getByCategory: (category) => api.get(`/items?category=${category}`),
  uploadImages: (formData) => api.post('/items/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Bids API
export const bidsAPI = {
  getAll: (params) => api.get('/bids', { params }),
  getById: (id) => api.get(`/bids/${id}`),
  create: (bidData) => api.post('/bids', bidData),
  getByItem: (itemId) => api.get(`/bids/item/${itemId}`),
  getByUser: (userId) => api.get(`/bids/user/${userId}`),
  getUserBids: () => api.get('/bids/my-bids'),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/users/dashboard/stats'),
  getActivity: () => api.get('/users/dashboard/activity'),
  getRecommendations: () => api.get('/users/dashboard/recommendations'),
  getWatchlist: () => api.get('/users/dashboard/watchlist'),
};

// Stats API
export const statsAPI = {
  getGlobalStats: () => api.get('/stats/global'),
  getMarketTrends: () => api.get('/stats/trends'),
  getTopCategories: () => api.get('/stats/categories'),
};

export default api;