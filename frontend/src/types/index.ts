import * as z from "zod";
import { loginSchema, registerSchema } from "@/lib/schemas";

// ─── Auth / User ──────────────────────────────────────────────────────────────

/** Corresponds to the backend UserSerializer */
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  bio?: string;
  profile_image?: string | null;
  date_joined?: string;
  is_active?: boolean;
  is_staff?: boolean;
}

export interface LoginValues {
  email: string;
  password: string;
}

export interface RegisterValues {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user?: User;
}

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;

// ─── Board Hierarchy ─────────────────────────────────────────────────────────

/** Corresponds to the backend CommentSerializer */
export interface Comment {
  id: number;
  text: string;
  author: number;
  author_detail: User;
  card: number;
  created_at: string;
}

/** Corresponds to the backend CardSerializer */
export interface Card {
  id: number;
  name: string;
  description: string;
  order: number;
  list_id: number;
  comments: Comment[];
}

/** Corresponds to the backend ListSerializer */
export interface List {
  id: number;
  name: string;
  order: number;
  board: number;
  cards: Card[];
  created_at: string;
}

/** Lightweight board summary used inside WorkspaceSerializer.boards */
export interface BoardSummary {
  id: number;
  name: string;
  background_color: string;
  background_image: string | null;
}

/** Corresponds to the backend BoardSerializer (full detail) */
export interface Board {
  id: number;
  name: string;
  workspace: number;
  owner: number;
  owner_detail: User;
  members: number[];
  members_detail: User[];
  background_color: string;
  background_image: string | null;
  lists: List[];
  created_at: string;
  updated_at: string;
}

// ─── Workspace ────────────────────────────────────────────────────────────────

/** Corresponds to the backend WorkspaceSerializer */
export interface Workspace {
  id: number;
  name: string;
  description: string;
  owner: number;
  owner_detail: User;
  members: number[];
  members_detail: User[];
  /** Lightweight list of boards: [{id, name}] */
  boards: BoardSummary[];
  created_at: string;
  updated_at: string;
}