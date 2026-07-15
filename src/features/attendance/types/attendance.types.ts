export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | 'UNKNOWN';

export interface Student {
  id?: string;
  studentId: string;
  fullName: string;
  status: AttendanceStatus;
  comment?: string;
}

export interface AttendanceSheetResponse {
  id: string;
  groupId: string;
  date: string;
  students: Student[];
}

export interface BulkUpdateAttendanceDto {
  items: {
    studentId: string;
    status: AttendanceStatus;
    comment?: string;
  }[];
}