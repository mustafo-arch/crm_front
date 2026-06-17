import { apiClient } from "../../../api/apiClient";

export interface GetEnrollmentsParams {
  studentId?: string;
  groupId?: string;
  status?: 'ACTIVE' | 'PAUSED' | 'LEFT';
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface CreateEnrollmentPayload {
  studentId: string;
  groupId: string;
  joinDate?: string;
}

export interface EnrollmentItem {
  id: string;
  status: 'ACTIVE' | 'PAUSED' | 'LEFT';
  joinDate: string;
  leaveDate?: string;
  group: { id: string; name: string };
  student: { id: string; fullName: string; phone: string };
}

export interface EnrollmentPaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface GetEnrollmentsResponse {
  items: EnrollmentItem[];
  meta: EnrollmentPaginationMeta;
}

export const enrollmentApi = {
  create: async (payload: CreateEnrollmentPayload): Promise<EnrollmentItem> => {
    const response = await apiClient.post<EnrollmentItem>('/enrollments', payload);
    return response.data;
  },
  findAll: async (params?: GetEnrollmentsParams): Promise<GetEnrollmentsResponse> => {
    const response = await apiClient.get<GetEnrollmentsResponse>('/enrollments', { params });
    return response.data;
  },
  update: async (id: string, payload: { status: 'ACTIVE' | 'PAUSED' | 'LEFT' }): Promise<EnrollmentItem> => {
    const response = await apiClient.patch<EnrollmentItem>(`/enrollments/${id}`, payload);
    return response.data;
  }
};