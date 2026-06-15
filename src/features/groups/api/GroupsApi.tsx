import { apiClient } from "../../../api/apiClient";

export interface GroupItem {
  id: string;
  name: string;
  capacity: number;
  daysPattern: 'ODD' | 'EVEN';
  startTime: string;
  endTime: string;
  monthlyFee: number;
  isActive: boolean;
  roomId: string | null;
  deactivatedAt: string | null;
  deactivateReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GroupStats {
  group: { id: string; name: string; isActive: boolean; capacity: number };
  activeEnrollments: number;
  remaining: number;
  isFull: boolean;
}

export interface GroupStudent {
  enrollmentId: string;
  studentId: string;
  userId: string;
  fullName: string;
  phone: string;
  joinDate: string;
}

export interface GroupStudentsResponse {
  group: { id: string; name: string };
  students: GroupStudent[];
}

export interface QueryGroupDto {
  search?: string;
  daysPattern?: 'ODD' | 'EVEN';
  isActive?: boolean;
  roomId?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedGroups {
  meta: { page: number; limit: number; total: number; pages: number };
  items: GroupItem[];
}

export interface CreateGroupPayload {
  name: string;
  capacity: number;
  daysPattern: 'ODD' | 'EVEN';
  startTime: string;
  endTime: string;
  monthlyFee: number;
  roomId?: string;
}

export const groupsApi = {
  getAll: async (params?: QueryGroupDto): Promise<PaginatedGroups> => {
    const response = await apiClient.get<PaginatedGroups>('/groups', { params });
    return response.data;
  },

  getOne: async (id: string): Promise<GroupItem> => {
    const response = await apiClient.get<GroupItem>(`/groups/${id}`);
    return response.data;
  },

  getStats: async (id: string): Promise<GroupStats> => {
    const response = await apiClient.get<GroupStats>(`/groups/${id}/stats`);
    return response.data;
  },

  getStudents: async (id: string): Promise<GroupStudentsResponse> => {
    const response = await apiClient.get<GroupStudentsResponse>(`/groups/${id}/students`);
    return response.data;
  },

  create: async (payload: CreateGroupPayload): Promise<GroupItem> => {
    const response = await apiClient.post<GroupItem>('/groups', payload);
    return response.data;
  },

  update: async (id: string, payload: Partial<CreateGroupPayload> & { isActive?: boolean; deactivateReason?: string }): Promise<GroupItem> => {
    const response = await apiClient.patch<GroupItem>(`/groups/${id}`, payload);
    return response.data;
  },

  softDelete: async (id: string, reason?: string): Promise<GroupItem> => {
    const response = await apiClient.delete<GroupItem>(`/groups/${id}`, { params: { reason } });
    return response.data;
  },
};