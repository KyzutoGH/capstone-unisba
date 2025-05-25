import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (token) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, config);
      setUser(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching current user:', err);
      localStorage.removeItem('token');
      setUser(null);
      setError('Sesi Anda telah berakhir. Silakan login kembali.');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        password,
      });
      
      const { token, ...userData } = response.data.data;
      localStorage.setItem('token', token);
      setUser(userData);
      setError(null);
      return userData;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login gagal. Silakan coba lagi.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, userData);
      
      const { token, ...newUser } = response.data.data;
      localStorage.setItem('token', token);
      setUser(newUser);
      setError(null);
      return newUser;
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Pendaftaran gagal. Silakan coba lagi.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (updatedData, profilePicture) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      Object.keys(updatedData).forEach(key => {
        formData.append(key, updatedData[key]);
      });
      
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/profile`,
        formData,
        config
      );
      
      setUser(response.data.data);
      setError(null);
      return response.data.data;
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err.response?.data?.message || 'Gagal memperbarui profil. Silakan coba lagi.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/change-password`,
        { currentPassword, newPassword },
        config
      );
      
      setError(null);
    } catch (err) {
      console.error('Change password error:', err);
      setError(err.response?.data?.message || 'Gagal mengubah password. Silakan coba lagi.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};