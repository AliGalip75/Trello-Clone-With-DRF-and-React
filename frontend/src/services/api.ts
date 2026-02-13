// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/auth', // URL yapına göre ayarla
  withCredentials: true, // 🔑 ÇOK ÖNEMLİ: Cookie gönderip almak için şart
});

// Response Interceptor: Token süresi bittiyse (401) otomatik yenile
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Eğer hata 401 (Unauthorized) ise ve daha önce denememişsek
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh endpointine istek at (Cookie'deki refresh token'ı kullanır)
        await api.post('/token/refresh/');
        
        // Başarılı olursa asıl isteği tekrarla
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh de başarısızsa (Süre tamamen bitmiş) kullanıcıyı dışarı at
        console.error("Oturum süresi doldu.");
        // Opsiyonel: window.location.href = '/login'; yapabilirsin
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;