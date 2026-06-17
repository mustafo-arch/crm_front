import { useState, useEffect } from 'react';
import { useEnrollmentStore } from '../store/useEnrollmentStore';
import { groupsApi, type GroupItem } from '../../groups/api/GroupsApi';
import { type EnrollmentItem } from '../api/enrollmentApi';
import { useStudentStore } from '../../students/store/StudentsStore';

interface EnrollmentFormProps {
  onClose: () => void;
  initialData?: EnrollmentItem;
}

export const EnrollmentForm = ({ onClose, initialData }: EnrollmentFormProps) => {
  const [studentId, setStudentId] = useState(initialData?.student.id || '');
  const [groupId, setGroupId] = useState(initialData?.group.id || '');
  const [status, setStatus] = useState<'ACTIVE' | 'PAUSED' | 'LEFT'>(initialData?.status || 'ACTIVE');
  const [groups, setGroups] = useState<GroupItem[]>([]);
  
  const { createEnrollment, updateEnrollment } = useEnrollmentStore();
  const { students, fetchStudents } = useStudentStore();

  useEffect(() => {
    fetchStudents({ page: 1, limit: 100 });
    groupsApi.getAll().then(res => setGroups(res.items));
  }, [fetchStudents]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialData && (!studentId || !groupId)) return;

    let success = false;
    if (initialData) {
      success = await updateEnrollment(initialData.id, { status });
    } else {
      success = await createEnrollment({ studentId, groupId });
    }
    if (success) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {!initialData ? (
        <div className="grid grid-cols-1 gap-5">
          {/* O'quvchini tanlash inputi */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
              OʻQUVCHI *
            </label>
            <select 
              value={studentId} 
              onChange={(e) => setStudentId(e.target.value)} 
              className="w-full p-3 bg-[#1b1e2f] border border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold text-white outline-none transition"
            >
              <option value="">O'quvchini tanlang</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
            </select>
          </div>

          {/* Guruhni tanlash inputi */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
              GURUH *
            </label>
            <select 
              value={groupId} 
              onChange={(e) => setGroupId(e.target.value)} 
              className="w-full p-3 bg-[#1b1e2f] border border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold text-white outline-none transition"
            >
              <option value="">Guruhni tanlang</option>
              {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
        </div>
      ) : (
        /* Agar tahrirlash rejimi bo'lsa, o'quvchi va guruh nomi shunchaki text formatida ko'rinadi */
        <div className="bg-[#1b1e2f] p-4 rounded-xl border border-slate-800 text-xs space-y-2">
          <div><span className="text-slate-400 font-bold">Oʻquvchi:</span> <span className="text-white font-black">{initialData.student.fullName}</span></div>
          <div><span className="text-slate-400 font-bold">Guruh:</span> <span className="text-white font-black">{initialData.group.name}</span></div>
        </div>
      )}

      {/* Holat (Status) boshqaruvi */}
      <div>
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
          BIRIKTIRUV HOLATI *
        </label>
        <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value as any)} 
          className="w-full p-3 bg-[#1b1e2f] border border-slate-800 focus:border-indigo-500 rounded-xl text-xs font-semibold text-white outline-none transition"
        >
          <option value="ACTIVE">Faol (Active)</option>
          <option value="PAUSED">Muzlatilgan (Paused)</option>
          <option value="LEFT">Chiqib ketgan (Left)</option>
        </select>
      </div>

      {/* Modal formaning pastki qismi (Tugmalar) */}
      <div className="flex justify-end items-center gap-4 pt-4 border-t border-slate-800/60">
        <button 
          type="button" 
          onClick={onClose} 
          className="text-xs font-bold text-slate-400 hover:text-white transition"
        >
          Bekor qilish
        </button>
        <button 
          type="submit" 
          className="bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-lg"
        >
          Saqlash
        </button>
      </div>
    </form>
  );
};