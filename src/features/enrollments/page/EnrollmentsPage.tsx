import { useState, useEffect } from 'react';
import { useEnrollmentStore } from '../store/useEnrollmentStore';
import { EnrollmentForm } from '../components/EnrollmentForm';
import { type EnrollmentItem } from '../api/enrollmentApi';
import { groupsApi, type GroupItem } from '../../groups/api/GroupsApi';
import { useStudentStore } from '../../students/store/StudentsStore';

export const EnrollmentsPage = () => {
  const { enrollments, isLoading, filters, setFilters, fetchEnrollments } = useEnrollmentStore();
  const { students, fetchStudents } = useStudentStore();
  const [groups, setGroups] = useState<GroupItem[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EnrollmentItem | null>(null);

  useEffect(() => {
    fetchStudents({ page: 1, limit: 100 });
    groupsApi.getAll().then(res => setGroups(res.items));
  }, [fetchStudents]);

  useEffect(() => {
    fetchEnrollments();
  }, [filters.status, filters.groupId, filters.studentId, filters.from, filters.to, fetchEnrollments]);

  return (
    <div className="p-6 space-y-6 text-white min-h-screen bg-[#0b0d17]">
      {/* Sarlavha qismi */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-black tracking-wide text-white">Oʻquvchilar biriktiruvi</h1>
          <p className="text-xs text-slate-400 mt-1">Tizimdagi o'quvchilarning guruhlarga biriktirilishi va holatlarini boshqarish.</p>
        </div>
        
        {/* Filtrlar va Tugma */}
        <div className="flex items-center gap-3">
          <select 
            value={filters.status || ''} 
            onChange={(e) => setFilters({ status: (e.target.value as any) || undefined, page: 1 })}
            className="bg-[#141625] border border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-slate-300 outline-none cursor-pointer"
          >
            <option value="">Hamma holatlar</option>
            <option value="ACTIVE">Faol</option>
            <option value="PAUSED">Muzlatilgan</option>
            <option value="LEFT">Chiqib ketgan</option>
          </select>

          <button 
            onClick={() => { setEditingItem(null); setIsModalOpen(true); }} 
            className="bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg"
          >
            + Yangi biriktirish
          </button>
        </div>
      </div>

      {/* Murakkabroq Filtrlar paneli */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#141625] p-4 rounded-2xl border border-slate-800/60">
        <div>
          <select 
            value={filters.studentId || ''} 
            onChange={(e) => setFilters({ studentId: e.target.value || undefined, page: 1 })}
            className="w-full p-2.5 bg-[#1b1e2f] border border-slate-800 rounded-xl text-xs text-slate-300 outline-none"
          >
            <option value="">O'quvchi bo'yicha saralash</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
          </select>
        </div>
        <div>
          <select 
            value={filters.groupId || ''} 
            onChange={(e) => setFilters({ groupId: e.target.value || undefined, page: 1 })}
            className="w-full p-2.5 bg-[#1b1e2f] border border-slate-800 rounded-xl text-xs text-slate-300 outline-none"
          >
            <option value="">Guruh bo'yicha saralash</option>
            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
        <div>
          <input 
            type="date" 
            value={filters.from || ''} 
            onChange={(e) => setFilters({ from: e.target.value || undefined, page: 1 })}
            className="w-full p-2.5 bg-[#1b1e2f] border border-slate-800 rounded-xl text-xs text-slate-400 outline-none"
          />
        </div>
        <div>
          <input 
            type="date" 
            value={filters.to || ''} 
            onChange={(e) => setFilters({ to: e.target.value || undefined, page: 1 })}
            className="w-full p-2.5 bg-[#1b1e2f] border border-slate-800 rounded-xl text-xs text-slate-400 outline-none"
          />
        </div>
      </div>

      {/* Jadval qismi */}
      <div className="bg-[#141625] rounded-2xl border border-slate-800/80 overflow-hidden">
        <div className="p-4 bg-[#141625] border-b border-slate-800 flex justify-between items-center">
          <span className="text-xs font-black tracking-wider text-slate-300 uppercase">ROʻYXAT</span>
          <span className="text-xs font-bold text-slate-400 bg-[#1b1e2f] px-3 py-1 rounded-lg">Jami: {enrollments.length} ta</span>
        </div>

        {isLoading ? (
          <div className="p-10 text-center text-xs text-slate-400 font-bold">Yuklanmoqda...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/60 text-[10px] font-black text-slate-400 tracking-wider uppercase bg-[#111321]">
                <th className="p-4">F.I.SH</th>
                <th className="p-4">GURUH</th>
                <th className="p-4">SANA</th>
                <th className="p-4">HOLATI</th>
                <th className="p-4 text-right">AMALLAR</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-xs text-slate-500 font-bold">Ma'lumot topilmadi</td>
                </tr>
              ) : (
                enrollments.map(item => (
                  <tr key={item.id} className="border-b border-slate-800/40 hover:bg-[#1b1e2f]/40 transition-colors text-xs font-medium">
                    <td className="p-4 text-white font-bold tracking-wide">{item.student.fullName}</td>
                    <td className="p-4 text-slate-300">{item.group.name}</td>
                    <td className="p-4 text-slate-400">{new Date(item.joinDate).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        item.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 
                        item.status === 'PAUSED' ? 'bg-amber-500/10 text-amber-500' : 
                        'bg-rose-500/10 text-rose-500'
                      }`}>
                        {item.status === 'ACTIVE' ? 'Faol' : item.status === 'PAUSED' ? 'Muzlatilgan' : 'Chiqib ketgan'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => { setEditingItem(item); setIsModalOpen(true); }} 
                        className="bg-[#1b1e2f] border border-slate-800 hover:bg-[#23273f] text-indigo-400 text-[11px] font-bold px-3 py-1.5 rounded-lg transition"
                      >
                        Tahrirlash
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Oyna */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#141625] border border-slate-800 p-6 rounded-2xl w-full max-w-lg shadow-2xl relative animate-fade-in">
            <h2 className="text-sm font-black tracking-wider text-white uppercase mb-6">
              {editingItem ? 'BIRIKTIRUVNI TAHRIRLASH' : 'YANGI OʻQUVCHI QOʻSHISH'}
            </h2>
            
            <EnrollmentForm 
              initialData={editingItem || undefined} 
              onClose={() => { setIsModalOpen(false); setEditingItem(null); }} 
            />
            
            <button 
              onClick={() => { setIsModalOpen(false); setEditingItem(null); }} 
              className="absolute top-5 right-5 text-slate-400 hover:text-white text-sm transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};