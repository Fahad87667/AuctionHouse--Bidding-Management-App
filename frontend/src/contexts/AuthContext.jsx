import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set up axios defaults
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token is still valid
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5100/api/auth/me');
      const userData = response.data;
      setUser({
        ...userData,
        role: userData.roles && userData.roles.length > 0 ? userData.roles[0] : 'User',
        id: userData.id || userData.userId || localStorage.getItem('userId')
      });
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5100/api/auth/login', {
        email,
        password
      });
      const { token, username, email: userEmail, roles } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const userData = {
        username,
        email: userEmail,
        role: roles && roles.length > 0 ? roles[0] : 'User',
        roles: roles,
        id: response.data.id || response.data.userId || localStorage.getItem('userId')
      };
      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (username, email, password, confirmPassword) => {
    if (password !== confirmPassword) {
      return { success: false, error: 'Passwords do not match' };
    }
    try {
      const response = await axios.post('http://localhost:5100/api/auth/register', {
        username,
        email,
        password
      });
      const { token, username: userUsername, email: userEmail, roles } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const userData = {
        username: userUsername,
        email: userEmail,
        role: roles && roles.length > 0 ? roles[0] : 'User',
        roles: roles,
        id: response.data.id || response.data.userId || localStorage.getItem('userId')
      };
      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 