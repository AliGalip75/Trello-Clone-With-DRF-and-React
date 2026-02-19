// services/boardService.ts
import api from "./api";

export interface BoardData {
  name: string;
  background_image?: string; 
  background_color: string;
}

export interface BoardResponse extends BoardData {
  id: number;
  created_at: string;
  updated_at: string;
}

// Update the service to accept FormData for file upload support
export const createBoard = async (formData: FormData): Promise<BoardResponse> => {
  const response = await api.post<BoardResponse>('/boards/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getBoards = async (): Promise<BoardResponse[]> => {
  const response = await api.get<BoardResponse[]>('/boards/');
  return response.data;
};