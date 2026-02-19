import api from "./api";
// Tipleri buradan çekiyoruz
import type { LoginValues, RegisterValues, User } from "@/types"; 

export const authService = {
  // Login
  login: async (data: LoginValues) => {
    const response = await api.post("/auth/login/", data);
    console.log(response.data)
    return response.data;
  },

  // Register
  register: async (data: RegisterValues) => {
    const response = await api.post("/auth/register/", data);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post("/auth/logout/");
    return response.data;
  },

  // Me endpoint
  getMe: async (): Promise<User> => {
    console.log("⚡ SERVICE: getMe çağrıldı!");
    const response = await api.get("/auth/me/");
    return response.data;
  },
};