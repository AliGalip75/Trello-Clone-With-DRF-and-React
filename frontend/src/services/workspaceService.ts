// services/workspaceService.ts
import api from "./api";
import type { Workspace } from "@/types";

// ─── Request payload types ────────────────────────────────────────────────────

export interface CreateWorkspaceData {
  name: string;
  description?: string;
}

export interface UpdateWorkspaceData {
  name?: string;
  description?: string;
}

// ─── API calls ───────────────────────────────────────────────────────────────

/** Fetch all workspaces the current user owns or is a member of */
export const getWorkspaces = async (): Promise<Workspace[]> => {
  const response = await api.get<Workspace[]>("/workspaces/");
  return response.data;
};

/** Fetch a single workspace by ID (includes board list) */
export const getWorkspace = async (id: number | string): Promise<Workspace> => {
  const response = await api.get<Workspace>(`/workspaces/${id}/`);
  return response.data;
};

/** Create a new workspace; owner is set automatically by the backend */
export const createWorkspace = async (
  data: CreateWorkspaceData
): Promise<Workspace> => {
  const response = await api.post<Workspace>("/workspaces/", data);
  return response.data;
};

/** Partially update a workspace (name or description) */
export const updateWorkspace = async (
  id: number,
  data: UpdateWorkspaceData
): Promise<Workspace> => {
  const response = await api.patch<Workspace>(`/workspaces/${id}/`, data);
  return response.data;
};

/** Delete a workspace (cascades to all boards, lists, cards) */
export const deleteWorkspace = async (id: number): Promise<void> => {
  await api.delete(`/workspaces/${id}/`);
};
