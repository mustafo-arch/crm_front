import { apiClient } from './apiClient';

// 1. Backend enumlariga mos keluvchi turlar
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | 'UNKNOWN';
export type AttendanceSheetStatus = 'OPEN' | 'LOCKED';

export interface AttendanceStudent {
  studentId: string;
  fullName: string;
  status: AttendanceStatus;
  comment: string | null;
}

export interface AttendanceSheetResponse {
  sheetId: string;
  group: {
    id: string;
    name: string;
    room: {
      id: string;
      name: string;
    } | null;
  };
  date: string; // YYYY-MM-DD
  lesson: number | null;
  students: AttendanceStudent[];
}

export interface AttendanceItemDto {
  studentId: string;
  status: AttendanceStatus;
  comment?: string;
}

// 2. API So'rovlari Obyekti (Backend Controllerga 100% moslangan)
export const attendanceApi = {
  /**
   * Guruh va sana bo'yicha yo'qlama varaqasini olish
   * @GET /teacher/attendance/group/:groupId
   */
  getGroupSheet: async (groupId: string, date: string, lesson?: number) => {
    const response = await apiClient.get<AttendanceSheetResponse>(
      `/teacher/attendance/group/${groupId}`,
      {
        params: { date, lesson },
      }
    );
    return response.data;
  },

  /**
   * O'quvchilar yo'qlama holatlarini ommaviy saqlash (Bulk Update)
   * @PATCH /teacher/attendance/sheet/:sheetId
   */
  updateSheet: async (sheetId: string, items: AttendanceItemDto[]) => {
    const response = await apiClient.patch<{ success: boolean }>(
      `/teacher/attendance/sheet/${sheetId}`,
      { items }
    );
    return response.data;
  },
};