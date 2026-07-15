import React, { useState, useEffect } from "react";
import { Student, AttendanceStatus } from "../types/attendance.types";

interface AttendanceTableProps {
  data: {
    id: string;
    students: Student[];
  } | null;
  isLoading: boolean;
  onSave: (items: Student[]) => void;
  isSaving: boolean;
}

export const AttendanceTable = ({
  data,
  isLoading,
  onSave,
  isSaving,
}: AttendanceTableProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);

  useEffect(() => {
    if (data?.students) {
      setStudents(data.students);
    } else {
      setStudents([]);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm animate-pulse">
          O'quvchilar ro'yxati yuklanmoqda...
        </p>
      </div>
    );
  }

  if (!data || students.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
        <span className="text-4xl block mb-2">👥</span>
        Ushbu guruhda faol o'quvchilar topilmadi.
      </div>
    );
  }

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setStudents((prev) =>
      prev.map((s) => (s.studentId === studentId ? { ...s, status } : s)),
    );
  };

  const handleCommentChange = (studentId: string, comment: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.studentId === studentId ? { ...s, comment } : s)),
    );
  };

  const markAllPresent = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, status: "PRESENT" })));
  };

  const stats = {
    total: students.length,
    present: students.filter((s) => s.status === "PRESENT").length,
    absent: students.filter((s) => s.status === "ABSENT").length,
    late: students.filter((s) => s.status === "LATE").length,
    excused: students.filter((s) => s.status === "EXCUSED").length,
  };

  return (
    <div className="space-y-6">
      {/* 📊 STATISTIKA DASHBOARD */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all">
          <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
            Jami o'quvchi
          </div>
          <div className="text-2xl font-black text-white mt-1">
            {stats.total}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 hover:bg-emerald-950/30 transition-all">
          <div className="text-xs text-emerald-400 uppercase font-bold tracking-wider">
            Kelganlar
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {stats.present}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 hover:bg-rose-950/30 transition-all">
          <div className="text-xs text-rose-400 uppercase font-bold tracking-wider">
            Kelmaganlar
          </div>
          <div className="text-2xl font-black text-rose-400 mt-1">
            {stats.absent}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 hover:bg-amber-950/30 transition-all">
          <div className="text-xs text-amber-400 uppercase font-bold tracking-wider">
            Kechikkanlar
          </div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {stats.late}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-900/40 hover:bg-sky-950/30 transition-all">
          <div className="text-xs text-sky-400 uppercase font-bold tracking-wider">
            Sababli
          </div>
          <div className="text-2xl font-black text-sky-400 mt-1">
            {stats.excused}
          </div>
        </div>
      </div>

      {/* ⚡ TEZKOR AMALLAR PANELI */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0a101d] p-4 rounded-xl border border-slate-800/80">
        <span className="text-slate-300 text-sm font-medium">
          Tezkor harakatlar paneli:
        </span>
        <button
          onClick={markAllPresent}
          type="button"
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition-all hover:shadow-lg hover:shadow-emerald-900/20 active:scale-95"
        >
          ⚡ Barcha o'quvchilarni "Keldi" deb belgilash
        </button>
      </div>

      {/* 📋 JADVAL */}
      <div className="overflow-hidden border border-slate-800/80 rounded-2xl bg-slate-900/40 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0a101d] border-b border-slate-800/80 text-slate-300 text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Ism Familiya</th>
                <th className="py-4 px-6 text-center">Davomat Holati</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {students.map((student) => (
                <React.Fragment key={student.studentId}>
                  <tr className="hover:bg-slate-900/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex flex-col space-y-1">
                        <span className="text-white font-semibold text-sm md:text-base">
                          {student.fullName}
                        </span>
                        {student.comment && (
                          <span className="text-xs text-amber-400 flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 w-fit px-2 py-0.5 rounded-md">
                            💬 Izoh: {student.comment}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {/* PRESENT BUTTON */}
                        <button
                          onClick={() =>
                            handleStatusChange(student.studentId, "PRESENT")
                          }
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                            student.status === "PRESENT"
                              ? "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/10"
                              : "bg-slate-950 text-slate-400 border-slate-800 hover:text-emerald-400 hover:bg-emerald-950/20"
                          }`}
                        >
                          ✓ Keldi
                        </button>

                        {/* ABSENT BUTTON */}
                        <button
                          onClick={() =>
                            handleStatusChange(student.studentId, "ABSENT")
                          }
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                            student.status === "ABSENT"
                              ? "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/10"
                              : "bg-slate-950 text-slate-400 border-slate-800 hover:text-rose-400 hover:bg-rose-950/20"
                          }`}
                        >
                          ✗ Kelmadi
                        </button>

                        {/* LATE BUTTON */}
                        <button
                          onClick={() =>
                            handleStatusChange(student.studentId, "LATE")
                          }
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                            student.status === "LATE"
                              ? "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/10"
                              : "bg-slate-950 text-slate-400 border-slate-800 hover:text-amber-400 hover:bg-amber-950/20"
                          }`}
                        >
                          ⏰ Kechikdi
                        </button>

                        {/* EXCUSED BUTTON */}
                        <button
                          onClick={() =>
                            handleStatusChange(student.studentId, "EXCUSED")
                          }
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                            student.status === "EXCUSED"
                              ? "bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/10"
                              : "bg-slate-950 text-slate-400 border-slate-800 hover:text-sky-400 hover:bg-sky-950/20"
                          }`}
                        >
                          ✉ Sababli
                        </button>

                        {/* TOGGLE COMMENT INPUT */}
                        <button
                          onClick={() =>
                            setActiveCommentId(
                              activeCommentId === student.studentId
                                ? null
                                : student.studentId,
                            )
                          }
                          className={`p-2 rounded-xl border transition-all ${
                            activeCommentId === student.studentId ||
                            student.comment
                              ? "bg-indigo-600 border-indigo-600 text-white"
                              : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800"
                          }`}
                          title="Izoh kiritish"
                        >
                          ✍
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* SMOOTH INPUT ACCORDION */}
                  {activeCommentId === student.studentId && (
                    <tr className="bg-slate-950/40">
                      <td
                        colSpan={2}
                        className="py-3 px-6 border-t border-slate-800/60"
                      >
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={student.comment || ""}
                            onChange={(e) =>
                              handleCommentChange(
                                student.studentId,
                                e.target.value,
                              )
                            }
                            placeholder="Kechikish sababi yoki o'quvchi haqida qo'shimcha izoh..."
                            className="flex-1 bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                          />
                          <button
                            onClick={() => setActiveCommentId(null)}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors"
                          >
                            Yopish
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 💾 SAQLASH TUGMASI */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => onSave(students)}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-blue-500/10 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-2 border-slate-500 border-t-white rounded-full animate-spin"></div>
              Saqlanmoqda...
            </>
          ) : (
            "💾 Davomatni Tasdiqlash va Saqlash"
          )}
        </button>
      </div>
    </div>
  );
};
