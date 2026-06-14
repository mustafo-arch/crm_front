import { apiClient } from "../../../api/apiClient";

export interface PaginationMeta {
  total: number;
  itemsCount: number;
  pages: number;
  currentPage: number;
}

export interface StudentItem {
  id: string;
  fullName: string;
  phone: string;
  dateOfBirth?: string;
  startDate?: string;
  isActive: boolean;
  createdAt: string;
}

export interface GetStudentsParams {
  page: number;
  limit: number;
  search?: string;
  isActive?: boolean;
}

export interface GetStudentsResponse {
  items: StudentItem[];
  meta: PaginationMeta;
}

export interface StudentPayload {
  firstName: string;
  lastName: string;
  phone: string;
  password?: string;
  dateOfBirth?: string;
  startDate?: string;
  isActive?: boolean; // 🚀 Statusni o'zgartirish (aktivlashtirish) so'rovi frontenddan ketishi uchun qo'shildi
}

export const studentsApi = {
  // Barcha talabalarni paginatsiya va filtrlar bilan olish
  getAll: async (params: GetStudentsParams): Promise<GetStudentsResponse> => {
    const response = await apiClient.get<GetStudentsResponse>('/students', { params });
    return response.data;
  },

  // Yangi talaba qo'shish
  create: async (payload: StudentPayload): Promise<StudentItem> => {
    const response = await apiClient.post<StudentItem>('/students', payload);
    return response.data;
  },

  // Talaba ma'lumotlarini tahrirlash (Aktivlashtirish uchun ham shu metod xizmat qiladi)
  update: async (id: string, payload: Partial<StudentPayload>): Promise<StudentItem> => {
    const response = await apiClient.patch<StudentItem>(`/students/${id}`, payload);
    return response.data;
  },

  // Talabani o'chirish (Muzlatish / Soft Delete)
  delete: async (id: string): Promise<{ success: boolean }> => {
    const response = await apiClient.delete<{ success: boolean }>(`/students/${id}`);
    return response.data;
  }
};