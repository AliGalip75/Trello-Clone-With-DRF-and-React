import api from "./api";
import type { List } from "../types";

export interface CreateListData {
  name: string;
  board: number;
  order: number;
}

export const createList = async (data: CreateListData): Promise<List> => {
  const response = await api.post<List>('/lists/', data);
  return response.data;
};

export const deleteList = async (id: number): Promise<void> => {
  await api.delete(`/lists/${id}/`);
};

export const updateList = async (id: number, data: Partial<CreateListData>): Promise<List> => {
  const response = await api.patch<List>(`/lists/${id}/`, data);
  return response.data;
};
