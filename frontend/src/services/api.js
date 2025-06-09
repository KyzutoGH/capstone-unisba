import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
  login: (data) => api.post('/auth/login', data),           // hapus /api
  register: (data) => api.post('/auth/register', data),     // hapus /api
  getCurrentUser: () => api.get('/auth/me'),                // hapus /api
  updateProfile: (data) => api.put('/auth/profile', data),  // hapus /api
  changePassword: (data) => api.put('/auth/change-password', data), // hapus /api
};

// Student services
export const studentService = {
  getAllStudents: (params) => api.get('/api/students', { params }),      // hapus /api
  getStudentById: (id) => api.get(`/api/students/${id}`),               // hapus /api
  createStudent: (data) => api.post('/api/students', data),             // hapus /api
  updateStudent: (id, data) => api.put(`/api/students/${id}`, data),    // hapus /api
  deleteStudent: (id) => api.delete(`/api/students/${id}`),             // hapus /api
};

// Prediction services (hapus /api)
export const predictionService = {
  getStudentPredictions: (studentId) => api.get(`/api/predictions/student/${studentId}`),
  getPredictionById: (id) => api.get(`/api/predictions/${id}`),
  createPrediction: (studentId, data) => api.post(`/api/predictions/student/${studentId}`, data),
  updatePrediction: (id, data) => api.put(`/api/predictions/${id}`, data),
  deletePrediction: (id) => api.delete(`/api/predictions/${id}`),
};

// Dashboard services (hapus /api)
export const dashboardService = {
  getDashboardStats: () => api.get('/api/dashboard/stats'),
};

export default api;