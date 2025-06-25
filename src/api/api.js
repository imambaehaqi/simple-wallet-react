import axios from 'axios';
import { refreshToken } from './authService';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Request Interceptor: Tetap sama, menambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Logika baru untuk refresh token
api.interceptors.response.use(
  (response) => response, // Langsung teruskan jika response sukses
  async (error) => {
    const originalRequest = error.config;

    // Cek jika error adalah 401 dan request ini BUKAN request retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Tandai sebagai request retry

      try {
        const response = await refreshToken();
        const newToken = response.data.data.token;

        // Simpan token baru
        localStorage.setItem('token', newToken);

        // Update header default Axios untuk semua request selanjutnya
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

        // Update header dari request original yang gagal
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

        // Ulangi request original dengan token baru
        return api(originalRequest);

      } catch (refreshError) {
        // Jika refresh token gagal, sesi benar-benar berakhir
        console.error("Session expired. Could not refresh token.", refreshError);

        // Bersihkan storage dan paksa logout
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Redirect ke halaman login dengan alasan yang jelas
        window.location.href = '/login?reason=session-expired';

        return Promise.reject(refreshError);
      }
    }

    // Untuk error selain 401, langsung tolak promise-nya
    return Promise.reject(error);
  }
);

export default api;