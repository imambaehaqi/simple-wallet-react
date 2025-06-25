import api from './api';

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response; // <-- KEMBALIKAN 'response' UTUH
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response; // <-- KEMBALIKAN 'response' UTUH
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response; // <-- KEMBALIKAN 'response' UTUH
};

export const refreshToken = async () => {
  const oldToken = localStorage.getItem('token');
  if (!oldToken) {
    return Promise.reject(new Error("No token available for refresh"));
  }
  const response = await api.post('/auth/refresh-token', { token: oldToken });
  return response; // <-- KEMBALIKAN 'response' UTUH
};