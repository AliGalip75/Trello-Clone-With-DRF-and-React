// src/store/authStore.ts

import { create } from "zustand";
import type { User } from "@/types"; // Tipi içe aktar

interface AuthState {
  user: User | null; // User tipinde olabilir ya da null (giriş yapmamış)
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  logout: () => set({ user: null, isAuthenticated: false }),
}));