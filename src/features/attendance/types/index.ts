// src/features/attendance/types/index.ts

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | 'UNKNOWN';

export interface AttendanceStudent {
  studentId: string;
  fullName: string;
  status: AttendanceStatus;
  comment?: string;
}

export interface AttendanceSheetResponse {
  sheetId: string;
  group: {
    id: string;
    name: string;
    daysPattern: string;
    startMinutes: number;
    endMinutes: number;
    room: { name: string } | null;
  };
  date: string;
  lesson: number | null;
  status: 'OPEN' | 'LOCKED';
  students: AttendanceStudent[];
}