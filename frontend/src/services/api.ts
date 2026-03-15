import axios from 'axios';
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// 1. Temel Axios Instance Oluşturma
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/', // Vite env değişkeni
  withCredentials: true, // ÖNEMLİ: Cookie'lerin backend'e gitmesi için şart
  headers: {
    'Accept': 'application/json',
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
let refreshFailed = false;
let isRefreshing = false;


api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Eğer refresh daha önce fail olduysa bir daha deneme
    if (refreshFailed) {
      return Promise.reject(error);
    }

    // Refresh endpoint'ine gelen hata
    if (originalRequest.url?.includes("/token/refresh/")) {
      refreshFailed = true;
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshing
    ) {
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/token/refresh/");
        isRefreshing = false;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshFailed = true; // 🔥 artık sistem login değil
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);




export default api;