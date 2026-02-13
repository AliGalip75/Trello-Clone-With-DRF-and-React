import * as z from "zod"
import { loginSchema, registerSchema } from "@/lib/schemas";


// Corresponds to the UserSerializer
export interface User {
  id: number;
  username: string;
}

// Corresponds to the CommentSerializer
export interface Comment {
  id: number;
  text: string;
  author: User;
  card: number; // Assuming the serializer sends the card ID
  created_at: string;
}

// Corresponds to the CardSerializer
export interface Card {
  id: number;
  name: string;
  description: string;
  order: number;
  list: number; // Assuming the serializer sends the list ID
  comments: Comment[];
}

// Corresponds to the ListSerializer
export interface List {
  id: number;
  name: string;
  order: number;
  board: number; // Assuming the serializer sends the board ID
  cards: Card[];
}

// Corresponds to the BoardSerializer
export interface Board {
  id: number;
  name: string;
  owner: User;
  lists: List[];
}

// 1. KULLANICI MODELİ (Backend UserSerializer ile birebir aynı olmalı)
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name?: string; // Backend'de read_only alan olarak eklemiştik
  bio?: string;
  profile_image?: string | null;
  date_joined?: string;
  is_active?: boolean;
  is_staff?: boolean;
}

// 2. LOGİN İÇİN GEREKEN VERİLER
export interface LoginValues {
  email: string;
  password: string;
}

// 3. REGISTER İÇİN GEREKEN VERİLER
export interface RegisterValues {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

// 4. AUTH RESPONSE (Login cevabı)
export interface AuthResponse {
  access: string;
  refresh: string;
  user?: User; // Bazı backend yapıları login olunca user objesi de döner, bizde dönmüyor ama opsiyonel kalsın.
}

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;