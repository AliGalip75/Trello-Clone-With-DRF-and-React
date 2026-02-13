// src/hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service"; // Service'i çağırıyoruz
import { useAuthStore } from "@/store/authStore";     // Zustand'ı çağırıyoruz
import type { LoginValues, RegisterValues } from "@/types";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { setUser, logout: clearStore, isAuthenticated } = useAuthStore();

  // 1. LOGIN İŞLEMİ
  const loginMutation = useMutation({
    mutationFn: (data: LoginValues) => authService.login(data),
    onSuccess: () => {
      // Login başarılı olunca hemen kullanıcı bilgisini çekelim
      queryClient.invalidateQueries({ queryKey: ["me"] });
      window.location.reload(); 
    },
  });

  // 2. REGISTER İŞLEMİ
  const registerMutation = useMutation({
    mutationFn: (data: RegisterValues) => authService.register(data),
  });

  // 3. LOGOUT İŞLEMİ
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      clearStore();
      queryClient.clear();
      window.location.reload();
    },
  });

  // 4. ME (Kullanıcı Bilgisi)
  // Sayfa her açıldığında kullanıcıyı kontrol eder ve store'a yazar.
  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: authService.getMe,
    retry: false,
  });
  
  // Eğer query'den user geldiyse store'u güncelle
  if (user && !isAuthenticated) {
     setUser(user);
  }

  return {
    loginMutation,
    registerMutation,
    logoutMutation,
    user,
    isLoading,
    isAuthenticated
  };
};