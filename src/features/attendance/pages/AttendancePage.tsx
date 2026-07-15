import { useState, useEffect } from "react";
import { attendanceApi } from "../api/attendance.api";
import { AttendanceTable } from "../components/AttendanceTable";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { Student } from "../types/attendance.types";

export const AttendancePage = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [sheet, setSheet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 1. O'qituvchining faol guruhlarini yuklash
  useEffect(() => {
    const token = useAuthStore.getState().accessToken;
    console.log(
      "🔑 [PAGE-DIAG] useAuthStore ichidagi token mavjudligi:",
      !!token,
    );

    attendanceApi
      .getTeacherGroups()
      .then((data) => {
        console.log("📋 [PAGE-DIAG] Kelgan guruhlar ro'yxati:", data);
        setGroups(data);
      })
      .catch((err) => {
        console.error("❌ [PAGE-DIAG] Guruhlarni olishda xato:", err);
        toast.error("Guruhlar ro'yxatini olib bo'lmadi.");
      });
  }, []);

  // 2. Davomat varaqasini yuklash funksiyasi
  const loadSheet = async (groupId: string, date: string) => {
    console.log(
      `🔄 [PAGE-DIAG] loadSheet chaqirildi. Guruh: "${groupId}", Sana: "${date}"`,
    );

    if (!groupId || groupId === "null" || groupId === "undefined" || !date) {
      console.warn(
        "⚠️ [PAGE-DIAG] loadSheet to'xtatildi: yaroqsiz groupId yoki sana.",
      );
      setSheet(null);
      return;
    }

    setIsLoading(true);
    try {
      const data = await attendanceApi.getSheet(groupId, date);
      setSheet(data);
    } catch (err: any) {
      console.error("❌ [PAGE-DIAG] loadSheet ichida xato ushlandi:", err);
      toast.error("Ushbu dars uchun davomatni yuklashda xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  // Guruh o'zgarganda
  const handleGroupChange = (groupId: string) => {
    console.log(
      `🎯 [PAGE-DIAG] Foydalanuvchi guruhni tanladi. Qiymat: "${groupId}"`,
    );
    setSelectedGroupId(groupId);
    if (groupId && groupId !== "null" && groupId !== "undefined") {
      loadSheet(groupId, selectedDate);
    } else {
      setSheet(null);
    }
  };

  // Sana o'zgarganda
  const handleDateChange = (date: string) => {
    console.log(
      `📅 [PAGE-DIAG] Foydalanuvchi sanani o'zgartirdi. Qiymat: "${date}"`,
    );
    setSelectedDate(date);
    if (
      selectedGroupId &&
      selectedGroupId !== "null" &&
      selectedGroupId !== "undefined"
    ) {
      loadSheet(selectedGroupId, date);
    }
  };

  const handleSave = async (updatedStudents: Student[]) => {
    if (!sheet) return;
    setIsSaving(true);

    const payload = {
      items: updatedStudents.map((s) => ({
        studentId: s.studentId,
        status: s.status,
        comment: s.comment,
      })),
    };

    try {
      await attendanceApi.updateSheet(sheet.id, payload);
      toast.success("Davomat muvaffaqiyatli saqlandi! ✨");
      await loadSheet(selectedGroupId, selectedDate);
    } catch (err) {
      console.error(err);
      toast.error("Davomatni saqlashda xatolik yuz berdi.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Davomat Paneli
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Guruhni tanlang va o'quvchilar darsga kelishini belgilang.
          </p>
        </div>

        <div className="bg-[#0a101d] border border-slate-800/80 rounded-2xl px-4 py-2.5 flex items-center gap-3">
          <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">
            Kunni tanlang:
          </span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="bg-transparent border-none text-white text-sm font-black focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-slate-300 text-sm font-bold">
          Guruhni tanlang:
        </label>
        <select
          className="bg-slate-900 border border-slate-800 text-white p-3.5 rounded-2xl focus:outline-none focus:border-blue-500 cursor-pointer transition-all text-sm font-semibold"
          value={selectedGroupId}
          onChange={(e) => handleGroupChange(e.target.value)}
        >
          <option value="">-- Guruhni tanlang --</option>
          {groups &&
            groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
        </select>
      </div>

      {selectedGroupId &&
      selectedGroupId !== "null" &&
      selectedGroupId !== "undefined" ? (
        <AttendanceTable
          data={sheet}
          isLoading={isLoading}
          onSave={handleSave}
          isSaving={isSaving}
        />
      ) : (
        <div className="text-center py-28 text-slate-500 border border-dashed border-slate-800 rounded-3xl bg-slate-900/10">
          <div className="text-5xl mb-3 animate-bounce">🎓</div>
          <p className="text-lg font-bold text-slate-300">Guruh tanlanmagan</p>
          <p className="text-slate-500 text-sm mt-1">
            Iltimos, dars darsliklarini boshqarish uchun yuqoridagi ro'yxatdan
            faol guruhni tanlang.
          </p>
        </div>
      )}
    </div>
  );
};
  