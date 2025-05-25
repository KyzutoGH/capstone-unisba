import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      // If we get a 401 response, the token is likely expired
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (data) => api.post('/api/auth/login', data),
  register: (data) => api.post('/api/auth/register', data),
  getCurrentUser: () => api.get('/api/auth/me'),
  updateProfile: (data) => api.put('/api/auth/profile', data),
  changePassword: (data) => api.put('/api/auth/change-password', data),
};

// Student services
export const studentService = {
  getAllStudents: (params) => api.get('/api/students', { params }),
  getStudentById: (id) => api.get(`/api/students/${id}`),
  createStudent: (data) => api.post('/api/students', data),
  updateStudent: (id, data) => api.put(`/api/students/${id}`, data),
  deleteStudent: (id) => api.delete(`/api/students/${id}`),
};

// Prediction services
export const predictionService = {
  getStudentPredictions: (studentId) => api.get(`/api/predictions/student/${studentId}`),
  getPredictionById: (id) => api.get(`/api/predictions/${id}`),
  createPrediction: (studentId, data) => api.post(`/api/predictions/student/${studentId}`, data),
  updatePrediction: (id, data) => api.put(`/api/predictions/${id}`, data),
  deletePrediction: (id) => api.delete(`/api/predictions/${id}`),
};

// Dashboard services
export const dashboardService = {
  getDashboardStats: () => api.get('/api/dashboard/stats'),
};

export default api;