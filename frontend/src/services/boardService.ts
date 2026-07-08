// services/boardService.ts
import api from "./api";
import type { Board } from "@/types";

export interface BoardData {
  name: string;
  workspace: number;
  background_image?: string;
  background_color: string;
}

export interface BoardResponse extends Omit<Board, "lists"> {
  lists: import("../types").List[];
}

/** Create a new board. Accepts FormData to support file uploads. */
export const createBoard = async (formData: FormData): Promise<Board> => {
  const response = await api.post<Board>("/boards/", formData);
  return response.data;
};

/** Fetch all boards the current user has access to */
export const getBoards = async (): Promise<Board[]> => {
  const response = await api.get<Board[]>("/boards/");
  return response.data;
};

/** Fetch all boards belonging to a specific workspace */
export const getBoardsByWorkspace = async (workspaceId: number): Promise<Board[]> => {
  const response = await api.get<Board[]>("/boards/", {
    params: { workspace: workspaceId },
  });
  return response.data;
};

/** Fetch a single board by ID (includes lists → cards → comments) */
export const getBoard = async (id: string): Promise<Board> => {
  const response = await api.get<Board>(`/boards/${id}/`);
  return response.data;
};

/** Delete a board by ID */
export const deleteBoard = async (id: number): Promise<void> => {
  await api.delete(`/boards/${id}/`);
};