import { apiClient } from "../../../api/apiClient";

export interface PaginationMeta {
  total: number;
  itemsCount: number;
  pages: number;
  currentPage: number;
}

export interface TeacherItem {
  id: string;
  fullName: string;
  phone: string;
  monthlySalary: number | null;
  percentShare: number | null;
  isActive: boolean;
  createdAt: string;
}

export interface GetTeachersParams {
  page: number;
  limit: number;
  search?: string;
  isActive?: boolean;
}

export interface GetTeachersResponse {
  items: TeacherItem[];
  meta: PaginationMeta;
}

export interface TeacherPayload {
  firstName: string;
  lastName: string;
  phone: string;
  password?: string;
  monthlySalary?: string | number | null;
  percentShare?: string | number | null;
}

export const teachersApi = {
  getAll: async (params: GetTeachersParams): Promise<GetTeachersResponse> => {
    const response = await apiClient.get<GetTeachersResponse>('/teachers', { params });
    return response.data;
  },

  create: async (payload: TeacherPayload): Promise<TeacherItem> => {
    const response = await apiClient.post<TeacherItem>('/teachers', payload);
    return response.data;
  },

  update: async (id: string, payload: Partial<TeacherPayload>): Promise<TeacherItem> => {
    const response = await apiClient.patch<TeacherItem>(`/teachers/${id}`, payload);
    return response.data;
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    const response = await apiClient.delete<{ success: boolean }>(`/teachers/${id}`);
    return response.data;
  },

  // 🚀 RECOVERY (PATCH METODI BILAN ENPOINT): Soft-delete bo'lgan yozuvni tiklash uchun
  restore: async (id: string): Promise<TeacherItem> => {
    const response = await apiClient.patch<TeacherItem>(`/teachers/${id}/restore`);
    return response.data;
  },
};