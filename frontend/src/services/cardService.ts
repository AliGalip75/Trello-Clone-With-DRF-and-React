import api from "./api";
import type { Card } from "../types";

export interface CreateCardData {
  name: string;
  list_id: number;
  order: number;
}

export const createCard = async (data: CreateCardData): Promise<Card> => {
  const response = await api.post<Card>('/cards/', data);
  return response.data;
};

export const deleteCard = async (id: number): Promise<void> => {
  await api.delete(`/cards/${id}/`);
};
