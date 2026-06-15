import { useEffect, useState, type ChangeEvent } from "react";
import { useTAStore } from "../store/TeachAssignStore";
import type { QueryTAParams } from "../api/Teach-assignApi";
import { AssignTeacherModal } from "../components/TeachAssignFormModal";


// Backenddan keladigan munosabatlar (Relations) uchun qat'iy interfeyslar
interface BackendTeacher {
  id: string;
  fullName: string;
}

interface BackendGroup {
  id: string;
  name: string;
}

// Global assignment obyektining to'liq tipi
interface FullAssignment {
    
  id: string;
  teacherId: string;
  groupId: string;
  role: 'LEAD' | 'ASSISTANT' | 'SUBSTITUTE';
  isActive: boolean;
  period: {
    fromDate: string;
    toDate?: string;
  };
  schedule: {
    startTime: string;
    endTime: string;
    daysPattern: 'ODD' | 'EVEN';
    inherit: boolean;
  };
  // Backend relations (ixtiyoriy, chunki hali yuklanmagan bo'lishi mumkin)
  teacher?: BackendTeacher;
  group?: BackendGroup;
}

export const TeachingAssignmentsPage: React.FC = () => {
  // Store'dan kelayotgan assignments massivini FullAssignment[] sifatida qabul qilamiz
  const { assignments, isLoading, error, fetchAssignments, deleteAssignment } = useTAStore();
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [filters, setFilters] = useState<QueryTAParams>({
    page: 1,
    limit: 10,
    role: undefined,
    isActive: undefined,
  });

  useEffect(() => {
    fetchAssignments(filters).catch((err: unknown) => {
      console.error('Assignments yuklashda kutilmagan xatolik:', err);
    });
  }, [filters, fetchAssignments]);

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFilters((prev) => ({
      ...prev,
      page: 1, 
      [name]: value === 'all' 
        ? undefined 
        : value === 'true' 
          ? true 
          : value === 'false' 
            ? false 
            : value,
    }));
  };

  const handleDelete = async (id: string) => {
    const reason = prompt("Ushbu biriktirishni bekor qilish sababini kiriting (ixtiyoriy):");
    
    if (reason !== null) {
      const success = await deleteAssignment(id, reason || undefined);
      if (success) {
        fetchAssignments(filters).catch(() => {});
      }
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#0f1422] min-h-screen text-slate-200">
      
      {/* Sahifa Sarlavhasi va Tugma */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black tracking-wider uppercase text-white">
            O‘qituvchilar Biriktiruvi
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Guruhlarga dars o'tish uchun biriktirilgan ustozlar jadvali va ularning rollarini boshqarish
          </p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl shadow-lg transition-all self-start sm:self-center"
        >
          + Yangi biriktirish
        </button>
      </div>

      {/* Xatolik paneli */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Filtrlar paneli */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-card border border-border rounded-2xl text-xs">
        <div>
          <label className="block font-bold text-text-muted uppercase mb-1.5">Vazifa (Rol)</label>
          <select
            name="role"
            value={filters.role || 'all'}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-text-main cursor-pointer"
          >
            <option value="all">Barcha rollar</option>
            <option value="LEAD">Asosiy Ustoz (LEAD)</option>
            <option value="ASSISTANT">Assistent (Yordamchi)</option>
            <option value="SUBSTITUTE">O‘rinbosar (Vaqtinchalik)</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-text-muted uppercase mb-1.5">Holati</label>
          <select
            name="isActive"
            value={filters.isActive === undefined ? 'all' : filters.isActive.toString()}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-text-main cursor-pointer"
          >
            <option value="all">Barcha holatlar</option>
            <option value="true">Faol dars o‘tayotganlar</option>
            <option value="false">Arxivlanganlar / Yakunlanganlar</option>
          </select>
        </div>
      </div>

      {/* Ma'lumotlar jadvali (Table) */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-background/50 text-text-muted font-bold uppercase tracking-wider">
                <th className="p-4">O‘qituvchi</th>
                <th className="p-4">Guruh</th>
                <th className="p-4">Rol / Vazifasi</th>
                <th className="p-4">Biriktirilgan Davr</th>
                <th className="p-4">Dars Vaqti</th>
                <th className="p-4">Holat</th>
                <th className="p-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-text-muted font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full animate-ping" />
                      Ma'lumotlar yuklanmoqda...
                    </div>
                  </td>
                </tr>
              ) : assignments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-text-muted">
                    Hech qanday o‘qituvchi biriktiruvi ma'lumotlari topilmadi.
                  </td>
                </tr>
              ) : (
                (assignments as FullAssignment[]).map((item) => (
                  <tr key={item.id} className="hover:bg-background/30 transition-colors">
                    
                    {/* O'qituvchi ismi (Strict type bilan) */}
                    <td className="p-4">
                      <div className="font-semibold text-text-main">
                        {item.teacher?.fullName || item.teacherId}
                      </div>
                    </td>

                    {/* Guruh nomi (Strict type bilan) */}
                    <td className="p-4 text-slate-300">
                      <div className="font-medium">
                        {item.group?.name || item.groupId}
                      </div>
                    </td>

                    {/* Roli */}
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold tracking-wider border ${
                        item.role === 'LEAD' 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                          : item.role === 'ASSISTANT' 
                            ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                      }`}>
                        {item.role === 'LEAD' ? 'ASOSIY (LEAD)' : item.role === 'ASSISTANT' ? 'ASSISTENT' : 'O‘RINBOSAR'}
                      </span>
                    </td>

                    {/* Sanasi */}
                    <td className="p-4 text-text-muted font-medium">
                      {new Date(item.period.fromDate).toLocaleDateString('uz-UZ')} - {item.period.toDate ? new Date(item.period.toDate).toLocaleDateString('uz-UZ') : '∞'}
                    </td>

                    {/* Dars vaqtlari */}
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <div className="text-text-main font-semibold">
                          {item.schedule.startTime} - {item.schedule.endTime}
                        </div>
                        <div className="text-[10px] text-text-muted flex items-center gap-1">
                          <span>{item.schedule.daysPattern === 'ODD' ? 'Toq kunlar' : 'Juft kunlar'}</span>
                          {item.schedule.inherit && (
                            <span className="text-[9px] bg-slate-800 px-1 py-0.2 rounded text-slate-400 border border-slate-700">meros</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${item.isActive ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-rose-500'}`} />
                        <span className="text-text-main font-medium">{item.isActive ? 'Faol' : 'Arxiv'}</span>
                      </div>
                    </td>

                    {/* Amallar */}
                    <td className="p-4 text-right">
                      {item.isActive ? (
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-2.5 py-1 text-[11px] font-bold bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        >
                          Bekor qilish
                        </button>
                      ) : (
                        <span className="text-[11px] text-text-muted italic">Tugallangan</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AssignTeacherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchAssignments(filters).catch(() => {});
        }}
      />
    </div>
  );
};