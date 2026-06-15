// src/api/TeachingAssignmentsApi.ts

import { apiClient } from "../../../api/apiClient";

export type TeacherRole = 'LEAD' | 'ASSISTANT' | 'SUBSTITUTE';
export type DaysPattern = 'ODD' | 'EVEN';

export interface CreateTeachingAssignmentPayload {
  teacherId: string;
  groupId: string;
  fromDate: string;
  toDate?: string;
  role?: TeacherRole;
  inheritSchedule: boolean;
  daysPatternOverride?: DaysPattern;
  startTimeOverride?: string;
  endTimeOverride?: string;
  note?: string;
}

export interface TeachingAssignmentItem {
  id: string;
  teacherId: string;
  groupId: string;
  role: TeacherRole;
  period: {
    fromDate: string;
    toDate: string | null;
  };
  schedule: {
    daysPattern: DaysPattern;
    startTime: string;
    endTime: string;
    inherit: boolean;
  };
  isActive: boolean;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TAResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  items: TeachingAssignmentItem[];
}

export interface QueryTAParams {
  teacherId?: string;
  groupId?: string;
  role?: TeacherRole;
  isActive?: boolean;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export const teachingAssignmentsApi = {
  create: async (payload: CreateTeachingAssignmentPayload): Promise<TeachingAssignmentItem> => {
    const res = await apiClient.post<TeachingAssignmentItem>('/teaching-assignments', payload);
    return res.data;
  },

  findAll: async (params: QueryTAParams): Promise<TAResponse> => {
    const res = await apiClient.get<TAResponse>('/teaching-assignments', { params });
    return res.data;
  },

  remove: async (id: string, reason?: string): Promise<TeachingAssignmentItem> => {
    const res = await apiClient.delete<TeachingAssignmentItem>(`/teaching-assignments/${id}`, {
      params: { reason },
    });
    return res.data;
  },
};