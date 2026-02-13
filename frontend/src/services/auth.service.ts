// src/services/auth.service.ts

import api from "./api";
// Tipleri buradan çekiyoruz
import type { LoginValues, RegisterValues, User } from "@/types"; 

export const authService = {
  // Login isteği
  login: async (data: LoginValues) => {
    // Backend access/refresh token döner (Cookie modunda body boş dönebilir)
    const response = await api.post("/login/", data);
    return response.data;
  },

  // Register isteği
  register: async (data: RegisterValues) => {
    const response = await api.post("/register/", data);
    return response.data;
  },

  // Logout isteği
  logout: async () => {
    const response = await api.post("/logout/");
    return response.data;
  },

  // Kullanıcı bilgilerini getir (Me endpoint)
  // Cevabın bir 'User' objesi olacağını taahhüt ediyoruz (Promise<User>)
  getMe: async (): Promise<User> => {
    const response = await api.get("/me/");
    return response.data;
  },
};