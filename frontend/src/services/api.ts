import axios from 'axios';
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// 1. Temel Axios Instance Oluşturma
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/auth/', // Vite env değişkeni
  withCredentials: true, // ÖNEMLİ: Cookie'lerin backend'e gitmesi için şart
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor (İstek Atılmadan Önce)
// Django CSRF koruması kullanıyorsa, CSRF token'ı cookie'den alıp header'a eklemeliyiz.
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Cookie'den csrftoken'ı bulma fonksiyonu
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };

    const csrfToken = getCookie('csrftoken');
    
    // Eğer CSRF token varsa header'a ekle (Django genelde X-CSRFToken bekler)
    if (csrfToken && config.headers) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor (Cevap Geldikten Sonra)
// Token süresi dolduğunda (401 hatası) otomatik refresh işlemi yapar.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // --- DEBUG LOG EKLE ---
    console.log("🚨 AXIOS ERROR:", {
        url: originalRequest.url,
        status: error.response?.status,
        isRetry: originalRequest._retry,
        isRefreshUrl: originalRequest.url?.includes('token/refresh/')
    });

    // Eğer hata veren istek zaten 'token/refresh/' ise, asla tekrar deneme!
    // Bu sonsuz döngünün en büyük sebebidir.
    if (originalRequest.url?.includes('token/refresh/')) {
        return Promise.reject(error);
    }

    // Hata 401 ise ve daha önce denenmemişse
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/auth'}/token/refresh/`,
          {},
          { withCredentials: true }
        );
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh başarısız olduysa yapacak bir şey yok, hatayı fırlat
        // useQuery bunu yakalayıp isError true yapacak.
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;