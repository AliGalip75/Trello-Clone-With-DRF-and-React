// src/lib/schemas.ts
import * as z from "zod";

export const loginSchema = z.object({
  email: z.email({ message: "Geçerli bir email giriniz." }),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı."),
});

export const registerSchema = z.object({
  email: z.email({ message: "Geçerli bir email giriniz." }),
  first_name: z.string().min(2, "İsim en az 2 karakter olmalı."),
  last_name: z.string().min(2, "Soyisim en az 2 karakter olmalı."),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı."),
  confirmPassword: z.string().min(1, "Şifre tekrarı zorunludur."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor.",
  path: ["confirmPassword"],
});
