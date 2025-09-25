import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5001/api';

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

// Add axios interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post('/auth/refresh-token', {
            refreshToken: refreshToken
          });

          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        useAuthStore.getState().logout();
      }
    }

    return Promise.reject(error);
  }
);

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  isAuthenticated: false,

  // Check if user is authenticated on app load
  checkAuth: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        set({ user: null, isAuthenticated: false, loading: false });
        return;
      }

      const response = await axios.get('/auth/me');
      set({ 
        user: response.data, 
        isAuthenticated: true, 
        loading: false 
      });
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },

  // Register user
  register: async (userData) => {
    set({ loading: true });
    try {
      const response = await axios.post('/auth/register', userData);
      
      if (response.data.user) {
        const { user, accessToken, refreshToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        set({ 
          user, 
          isAuthenticated: true, 
          loading: false 
        });
        
        toast.success('Registration successful! Welcome!');
        return { success: true };
      } else {
        toast.success('Registration successful! Please check your email to verify your account.');
        set({ loading: false });
        return { success: true, needsVerification: true };
      }
    } catch (error) {
      set({ loading: false });
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  },

  // Login user
  login: async (credentials) => {
    set({ loading: true });
    try {
      const response = await axios.post('/auth/login', credentials);
      const { user, accessToken, refreshToken } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      set({ 
        user, 
        isAuthenticated: true, 
        loading: false 
      });
      
      toast.success(`Welcome back, ${user.username}!`);
      return { success: true };
    } catch (error) {
      set({ loading: false });
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({ 
        user: null, 
        isAuthenticated: false, 
        loading: false 
      });
      toast.success('Logged out successfully');
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    set({ loading: true });
    try {
      await axios.post('/auth/forgot-password', { email });
      set({ loading: false });
      toast.success('Password reset email sent!');
      return { success: true };
    } catch (error) {
      set({ loading: false });
      const message = error.response?.data?.message || 'Failed to send reset email';
      toast.error(message);
      return { success: false, message };
    }
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    set({ loading: true });
    try {
      await axios.post('/auth/reset-password', { 
        token, 
        newPassword 
      });
      set({ loading: false });
      toast.success('Password reset successful!');
      return { success: true };
    } catch (error) {
      set({ loading: false });
      const message = error.response?.data?.message || 'Password reset failed';
      toast.error(message);
      return { success: false, message };
    }
  },

  // Verify email
  verifyEmail: async (token) => {
    set({ loading: true });
    try {
      const response = await axios.post('/auth/verify-email', { token });
      
      if (response.data.user) {
        const { user, accessToken, refreshToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        set({ 
          user, 
          isAuthenticated: true, 
          loading: false 
        });
      } else {
        set({ loading: false });
      }
      
      toast.success('Email verified successfully!');
      return { success: true };
    } catch (error) {
      set({ loading: false });
      const message = error.response?.data?.message || 'Email verification failed';
      toast.error(message);
      return { success: false, message };
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    set({ loading: true });
    try {
      const response = await axios.put('/users/profile', userData);
      set({ 
        user: response.data, 
        loading: false 
      });
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      set({ loading: false });
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      return { success: false, message };
    }
  },

  // Get user stats
  getUserStats: async () => {
    try {
      const response = await axios.get('/users/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to get user stats:', error);
      return null;
    }
  },

  // Follow/Unfollow user
  toggleFollow: async (userId) => {
    try {
      const response = await axios.post(`/users/${userId}/follow`);
      
      // Update current user's following count
      const currentUser = get().user;
      if (currentUser) {
        set({
          user: {
            ...currentUser,
            followingCount: response.data.isFollowing 
              ? currentUser.followingCount + 1 
              : currentUser.followingCount - 1
          }
        });
      }
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update follow status';
      toast.error(message);
      throw error;
    }
  }
}));