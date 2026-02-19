import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";     
import type { LoginValues, RegisterValues } from "@/types";
import { toast } from "sonner"

export const useAuth = () => {
  const queryClient = useQueryClient();

  const { 
    data: user, 
    isError,
    isLoading: isUserLoading,
  } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        return await authService.getMe();
      } catch (error: any) {
        if (error.response?.status === 401) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });


  const loginMutation = useMutation({
    mutationFn: (data: LoginValues) => authService.login(data),
    onSuccess: async () => {
      toast.success("Logged in successfully", { position: "bottom-right" });
      await queryClient.invalidateQueries({ queryKey: ["me"] });
    }
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterValues) => authService.register(data),
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      toast.success("Logged out successfully", { position: "bottom-right" });
      queryClient.setQueryData(["me"], null);
      queryClient.cancelQueries({ queryKey: ["me"] });
    },
  });

  return {
    loginMutation,
    registerMutation,
    logoutMutation,
    user: user || null,
    isLoading: isUserLoading || loginMutation.isPending || registerMutation.isPending,
    isAuthenticated: !isError && !!user,
  };
};