import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Check,
  X,
  Clock,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';

import {
  attendanceApi,
  AttendanceStatus,
} from '../../../api/attendance';

interface StudentRow {
  id: string;
  fullName: string;
  status: AttendanceStatus;
  note: string;
}

export const AttendancePage = () => {
  const { groupId } = useParams<{ groupId: string }>();

  const [sheetId, setSheetId] = useState('');
  const [groupName, setGroupName] = useState('');
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAssigned, setIsAssigned] = useState(true);

  const loadSheet = async () => {
    if (!groupId) return;

    try {
      setLoading(true);
      setIsAssigned(true);

      // To'g'rilandi: attendanceApi nomi to'g'ri chaqirildi
      const data = await attendanceApi.getGroupSheet(
        groupId,
        date
      );

      setSheetId(data.sheetId);
      setGroupName(data.group?.name || '');

      setStudents(
        data.students.map((student: { studentId: string; fullName: string; status: AttendanceStatus; comment: string | null; }) => ({
          id: student.studentId,
          fullName: student.fullName,
          status: student.status,
          note: student.comment ?? '',
        }))
      );
    } catch (error: any) {
      console.error(error);

      if (error?.response?.status === 403) {
        setIsAssigned(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSheet();
  }, [groupId, date]);

  const handleStatusChange = (
    studentId: string,
    status: AttendanceStatus
  ) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? { ...student, status }
          : student
      )
    );
  };

  const handleCommentChange = (
    studentId: string,
    comment: string
  ) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? { ...student, note: comment }
          : student
      )
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // To'g'rilandi: attendanceApi ishlatildi
      await attendanceApi.updateSheet(
        sheetId,
        students.map((student) => ({
          studentId: student.id,
          status: student.status,
          comment: student.note || undefined,
        }))
      );

      alert("Davomat muvaffaqiyatli saqlandi");
    } catch (error) {
      console.error(error);
      alert("Saqlashda xatolik");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full" />
      </div>
    );
  }

  if (!isAssigned) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
          <AlertCircle size={18} />
          Siz bu guruhga biriktirilmagansiz yoki guruh topilmadi
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="border border-[color-mix(in_srgb,var(--border)_30%,transparent)] bg-[color-mix(in_srgb,var(--card)_45%,transparent)] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-[color-mix(in_srgb,var(--border)_20%,transparent)]">
          <div>
            <h2 className="text-xl font-bold">Guruh Yo'qlamasi</h2>
            <p className="text-sm text-text-muted">
              Guruh: <span className="font-semibold ml-1">{groupName}</span>
            </p>
          </div>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 rounded-xl border text-black"
          />
        </div>

        {students.length === 0 ? (
          <div className="text-center py-10 text-text-muted">
            O'quvchilar topilmadi
          </div>
        ) : (
          <>
            <div className="overflow-x-auto mt-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">O'quvchi</th>
                    <th className="text-center py-3">Holati</th>
                    <th className="text-left py-3">Izoh</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-t">
                      <td className="py-4 font-medium">{student.fullName}</td>
                      <td className="py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'PRESENT')}
                            className={`p-2 rounded-lg transition-colors ${
                              student.status === 'PRESENT'
                                ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                                : 'hover:bg-gray-500/10'
                            }`}
                          >
                            <Check size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'ABSENT')}
                            className={`p-2 rounded-lg transition-colors ${
                              student.status === 'ABSENT'
                                ? 'bg-red-500/20 text-red-500 border border-red-500/30'
                                : 'hover:bg-gray-500/10'
                            }`}
                          >
                            <X size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'LATE')}
                            className={`p-2 rounded-lg transition-colors ${
                              student.status === 'LATE'
                                ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                                : 'hover:bg-gray-500/10'
                            }`}
                          >
                            <Clock size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="py-4">
                        <input
                          type="text"
                          value={student.note}
                          onChange={(e) => handleCommentChange(student.id, e.target.value)}
                          placeholder="Izoh..."
                          className="w-full px-3 py-1.5 rounded-lg border bg-transparent"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex items-center justify-between border-t pt-5">
              <div className="flex items-center gap-2 text-sm text-yellow-500">
                <Lightbulb size={16} />
                Saqlash tugmasini bosishni unutmang
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saqlanmoqda...' : "Yo'qlamani saqlash"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};