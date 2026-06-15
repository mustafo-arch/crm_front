import { apiClient } from "../../../api/apiClient";

export interface RoomItem {
  id: string;
  name: string;
  capacity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoomPayload {
  name: string;
  capacity: number;
  isActive?: boolean;
}

export const roomsApi = {
  // Barcha faol xonalarni olish
  getAll: async (): Promise<RoomItem[]> => {
    const response = await apiClient.get<RoomItem[]>('/rooms');
    return response.data;
  },

  // Bitta xonani ID bo'yicha olish
  getOne: async (id: string): Promise<RoomItem> => {
    const response = await apiClient.get<RoomItem>(`/rooms/${id}`);
    return response.data;
  },

  // Yangi xona yaratish
  create: async (payload: RoomPayload): Promise<RoomItem> => {
    const response = await apiClient.post<RoomItem>('/rooms', payload);
    return response.data;
  },

  // Xona ma'lumotlarini tahrirlash (Aktivlashtirish uchun ham shu ishlaydi)
  update: async (id: string, payload: Partial<RoomPayload>): Promise<RoomItem> => {
    const response = await apiClient.patch<RoomItem>(`/rooms/${id}`, payload);
    return response.data;
  },

  // Xonani o'chirish (Nofaol qilish)
  delete: async (id: string): Promise<RoomItem> => {
    const response = await apiClient.delete<RoomItem>(`/rooms/${id}`);
    return response.data;
  },
};