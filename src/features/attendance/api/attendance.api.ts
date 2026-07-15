import { apiClient } from "@/api/apiClient";
import { AttendanceSheetResponse, BulkUpdateAttendanceDto } from "../types/attendance.types";

export const attendanceApi = {
  getTeacherGroups: async () => {
    console.log("🔍 [DIAGNOSTIKA] getTeacherGroups() chaqirildi.");
    try {
      const { data } = await apiClient.get('/attendance/teacher/groups');
      console.log("✅ [DIAGNOSTIKA] Guruhlar muvaffaqiyatli keldi:", data);
      return data;
    } catch (error: any) {
      console.error("❌ [DIAGNOSTIKA] getTeacherGroups yuborishda xatolik:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        serverData: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  getSheet: async (groupId: string, date: string): Promise<AttendanceSheetResponse> => {
    console.group("📡 [DIAGNOSTIKA SO'ROV] getSheet() dars varaqasini olish");
    console.log(`1. Tanlangan Guruh IDsi (groupId): "${groupId}"`);
    console.log(`2. Tanlangan Sana (date): "${date}"`);
    
    const url = `/attendance/sheet/${groupId}`;
    console.log(`3. So'rov yuborilayotgan to'liq URL: GET ${apiClient.defaults.baseURL || 'http://localhost:3000'}${url}?date=${date}`);
    console.groupEnd();

    try {
      const { data } = await apiClient.get<AttendanceSheetResponse>(url, {
        params: { date },
      });
      console.log("✅ [DIAGNOSTIKA] Serverdan muvaffaqiyatli javob keldi:", data);
      return data;
    } catch (error: any) {
      console.group("🚨 [DIAGNOSTIKA XATOLIK] Server 404 yoki boshqa xato qaytardi!");
      console.error("A) Xato xabari (Message):", error.message);
      console.error("B) Server Status Kodi:", error.response?.status);
      console.error("C) Server qaytargan asl xatolik obyekti (BU JUDA MUHIM):", error.response?.data);
      console.error("D) So'rov yuborilgan oxirgi URL:", error.config?.url);
      console.error("E) Yuborilgan query parametrlar:", error.config?.params);
      console.groupEnd();
      throw error;
    }
  },

  updateSheet: async (sheetId: string, dto: BulkUpdateAttendanceDto) => {
    console.log(`🔍 [DIAGNOSTIKA] updateSheet() chaqirildi. sheetId: "${sheetId}"`, dto);
    try {
      const { data } = await apiClient.patch(`/attendance/sheet/${sheetId}`, dto);
      console.log("✅ [DIAGNOSTIKA] Davomat muvaffaqiyatli yangilandi:", data);
      return data;
    } catch (error: any) {
      console.error("❌ [DIAGNOSTIKA] updateSheet yuborishda xatolik:", {
        status: error.response?.status,
        serverData: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },
};