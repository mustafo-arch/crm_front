import { useState, useEffect, useCallback } from 'react';
import { studentsApi, type StudentItem, type PaginationMeta, type GetStudentsParams } from '../api/StudentsApi';
import { StudentsTable } from '../components/StudentsTable';
import { StudentFormModal } from '../components/StudentFormModal';
import { toast } from 'sonner'; // 🔥 Global Sonner ulandi
import { GraduationCap, UserPlus, Search } from 'lucide-react';

export const StudentsPage = () => {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(null);

  const loadStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams: GetStudentsParams = {
        page,
        limit: 10,
        search: search.trim() ? search.trim() : undefined,
        isActive: statusFilter === 'all' ? undefined : statusFilter === 'true',
      };

      const data = await studentsApi.getAll(queryParams);
      
      if (data && Array.isArray(data.items)) {
        setStudents(data.items);
        setMeta(data.meta);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error('Talabalarni yuklashda xatolik:', err);
      toast.error('O‘quvchilar ro‘yxatini yuklashda muammo yuz berdi!');
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadStudents();
  }, [loadStudents]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadStudents();
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (student: StudentItem) => {
    setModalMode('edit');
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    const message = modalMode === 'create' 
      ? 'O‘quvchi muvaffaqiyatli qo‘shildi!' 
      : 'O‘quvchi ma’lumotlari muvaffaqiyatli yangilandi!';

    toast.success(message, {
      description: "O'quvchi ma'lumotlar bazasida muvaffaqiyatli sinxronizatsiya qilindi.",
    });
    setPage(1);
    loadStudents();
  };

  const handleToggleStatus = async (student: StudentItem) => {
    try {
      if (student.isActive) {
        if (window.confirm(`${student.fullName} talabalik safidan chiqarilsinmi (Muzlatilsinmi)?`)) {
          await studentsApi.delete(student.id);
          toast.success('O‘quvchi muvaffaqiyatli muzlatildi.', {
            description: `${student.fullName} profili hozircha nofaol rejimga o'tkazildi.`
          });
        } else {
          return;
        }
      } else {
        await studentsApi.update(student.id, { isActive: true });
        toast.success('O‘quvchi faol holatga qaytarildi.', {
          description: `${student.fullName} darslar va guruhlarga qayta biriktirilishi mumkin.`
        });
      }
      loadStudents();
    } catch (err) {
      console.error('Statusni o‘zgartirishda xatolik:', err);
      toast.error('Amalni bajarishda kutilmagan xatolik yuz berdi.');
    }
  };

  return (
    <div className="space-y-6 text-text-main transition-colors duration-300">
      
      {/* Premium Glassmorphism Boshqaruv paneli */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 bg-[color-mix(in_srgb,var(--card)_60%,transparent)] backdrop-blur-xl p-6 border border-[color-mix(in_srgb,var(--border)_35%,transparent)] rounded-3xl shadow-xl shadow-black/5 hover:border-primary/20 transition-all duration-300">
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-inner">
            <GraduationCap size={22} className="text-primary animate-pulse"/>
          </div>
          <div className="space-y-0.5">
            <h1 className="text-xl font-black tracking-tight">O‘quvchilar Paneli</h1>
            <p className="text-[11px] text-text-muted font-semibold tracking-wide">O'quvchilar shaxsiy ma'lumotlari, guruh holatlari va faollik statusini kiber-boshqarish.</p>
          </div>
        </div>
        
        {/* Filtr va Qidiruv Qismi */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-2 flex-1 sm:flex-initial">
            <select 
              value={statusFilter} 
              onChange={e => { setPage(1); setStatusFilter(e.target.value); }}
              className="px-3 py-2.5 text-xs font-bold rounded-xl border border-[color-mix(in_srgb,var(--border)_50%,transparent)] bg-[color-mix(in_srgb,var(--card)_70%,transparent)] text-text-main focus:outline-none focus:border-primary cursor-pointer transition-all"
            >
              <option value="all">Hamma holatlar</option>
              <option value="true">Faollar</option>
              <option value="false">Muzlatilganlar</option>
            </select>

            <div className="flex flex-1 sm:w-64 relative">
              <input
                type="text"
                placeholder="Ism, familiya..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-3 pr-20 py-2.5 text-xs rounded-xl border border-[color-mix(in_srgb,#0b60f1,transparent)] bg-[color-mix(in_srgb,var(--card)_70%,transparent)] text-text-main focus:outline-none focus:border-primary transition-all placeholder:text-text-muted/40"
              />
              <button 
                type="submit" 
                className="absolute right-1 top-1 bottom-1 px-3 bg-primary text-white text-[11px] font-black rounded-lg hover:opacity-90 cursor-pointer transition-all flex items-center gap-1"
              >
                <Search size={12} />
                <span>Qidirish</span>
              </button>
            </div>
          </form>

          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 bg-primary text-white text-xs font-black rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer uppercase tracking-wider flex items-center gap-2 group"
          >
            <UserPlus size={15} className="group-hover:translate-x-0.5 transition-transform"/>
            <span>Yangi o‘quvchi</span>
          </button>
        </div>
      </div>

      {/* Jadval komponenti */}
      <StudentsTable
        students={students}
        isLoading={isLoading}
        meta={meta}
        page={page}
        onPageChange={setPage}
        onEdit={handleOpenEditModal}
        onToggleStatus={handleToggleStatus}
      />

      {/* Universal Oyna (Modal) */}
      <StudentFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        student={selectedStudent}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
};