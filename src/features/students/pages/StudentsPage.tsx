import React, { useState, useEffect, useCallback } from 'react';
import { studentsApi, type StudentItem, type PaginationMeta, type GetStudentsParams } from '../api/StudentsApi';
import { StudentsTable } from '../components/StudentsTable';
import { StudentFormModal } from '../components/StudentFormModal';

export const StudentsPage = () => {
  // Data states
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(null);

  // Talabalarni yuklash funksiyasi
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
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter, search]);

  // Effekt orqali kuzatish
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
    setToast({
      type: 'success',
      text: modalMode === 'create' ? 'O‘quvchi muvaffaqiyatli qo‘shildi!' : 'O‘quvchi ma’lumotlari yangilandi!',
    });
    setPage(1);
    loadStudents();
    setTimeout(() => setToast(null), 3000);
  };

  // 🚀 STATUSNI O'ZGARTIRISH (AKTIVLASHTIRISH MUAMMOSI SHU YERDA YECHILDI)
  const handleToggleStatus = async (student: StudentItem) => {
    try {
      if (student.isActive) {
        if (window.confirm(`${student.fullName} talabalik safidan chiqarilsinmi (Muzlatilsinmi)?`)) {
          await studentsApi.delete(student.id);
          setToast({ type: 'success', text: 'O‘quvchi muvaffaqiyatli muzlatildi.' });
        } else {
          return;
        }
      } else {
        // 🛠️ 404 bergan eski .restore() o'rniga PATCH /students/:id ga { isActive: true } yuboramiz
        await studentsApi.update(student.id, { isActive: true });
        setToast({ type: 'success', text: 'O‘quvchi faol holatga qaytarildi.' });
      }
      loadStudents();
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error('Statusni o‘zgartirishda xatolik:', err);
      setToast({ type: 'error', text: 'Amalni bajarishda xatolik yuz berdi.' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen text-text-main transition-colors duration-300">
      
      {/* Sarlavha paneli */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">O‘quvchilar Paneli</h1>
          <p className="text-xs text-text-muted">Backend DTO modelga asosan to‘liq boshqaruv tizimi.</p>
        </div>
        
        {/* Qidiruv va Filtrlar */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <select 
              value={statusFilter} 
              onChange={e => { setPage(1); setStatusFilter(e.target.value); }}
              className="px-3 py-2 text-xs rounded-xl border border-border bg-card text-text-main focus:outline-none cursor-pointer"
            >
              <option value="all">Hamma holatlar</option>
              <option value="true">Faollar</option>
              <option value="false">Muzlatilganlar</option>
            </select>

            <div className="flex w-48 sm:w-64">
              <input
                type="text"
                placeholder="Ism, familiya..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-4 py-2 text-xs rounded-l-xl border border-border bg-card text-text-main focus:outline-none"
              />
              <button type="submit" className="px-4 bg-primary text-white text-xs font-bold rounded-r-xl hover:opacity-90 cursor-pointer">
                Qidirish
              </button>
            </div>
          </form>

          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:opacity-90 transition-all cursor-pointer"
          >
            + Yangi o‘quvchi
          </button>
        </div>
      </div>

      {/* Toast bildirishnomasi */}
      {toast && (
        <div className={`p-3 rounded-xl text-xs font-semibold border max-w-sm fixed bottom-5 right-5 z-50 shadow-lg animate-slideIn ${
          toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
        }`}>
          {toast.text}
        </div>
      )}

      {/* Jadval */}
      <StudentsTable
        students={students}
        isLoading={isLoading}
        meta={meta}
        page={page}
        onPageChange={setPage}
        onEdit={handleOpenEditModal}
        onToggleStatus={handleToggleStatus}
      />

      {/* Modal oyna */}
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