import React, { useState, useEffect, useCallback } from 'react';
import { teachersApi, type TeacherItem, type PaginationMeta, type GetTeachersParams } from '../api/TeachersApi';
import { TeachersTable } from '../components/TeachersTable';
import { TeacherFormModal } from '../components/TeacherFormModal';

export const TeachersPage = () => {
  // Data states
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherItem | null>(null);

  // API orqali ma'lumotlarni yuklash funksiyasi
  const loadTeachers = useCallback(async () => {
    setIsLoading(true);
    try {
      // API parametrlari qat'iy tipizatsiya qilindi
      const queryParams: GetTeachersParams = {
        page,
        limit: 10,
        search: search.trim() ? search.trim() : undefined,
        // Backend text yoki boolean kutayotganiga qarab moslashtirildi
        isActive: statusFilter === 'all' ? undefined : statusFilter === 'true',
      };

      const data = await teachersApi.getAll(queryParams);
      
      if (data && Array.isArray(data.items)) {
        setTeachers(data.items);
        setMeta(data.meta);
      } else {
        setTeachers([]);
      }
    } catch (err) {
      console.error('Ustozlarni yuklashda xatolik yuz berdi:', err);
      setTeachers([]);
    } finally {
      // 🚀 MANA BU YERDA TO'XTATISH QOLIB KETGANDI - yuklanishni o'chiramiz!
      setIsLoading(false);
    }
  }, [page, statusFilter, search]);

  // Sahifa yoki holat filtri o'zgarganda avtomatik yuklash
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTeachers();
  }, [loadTeachers]); // useCallback zanjiri orqali toza boshqaruv

  // Qidiruv formasi yuborilganda
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadTeachers();
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setSelectedTeacher(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (teacher: TeacherItem) => {
    setModalMode('edit');
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setToast({
      type: 'success',
      text: modalMode === 'create' ? 'Ustoz muvaffaqiyatli ro‘yxatdan o‘tdi!' : 'Ustoz ma’lumotlari muvaffaqiyatli yangilandi!',
    });
    setPage(1);
    loadTeachers();
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleStatus = async (teacher: TeacherItem) => {
    try {
      if (teacher.isActive) {
        if (window.confirm(`${teacher.fullName}ni nofaol holatga o‘tkazmoqchimisiz?`)) {
          await teachersApi.delete(teacher.id);
          setToast({ type: 'success', text: 'Ustoz statusi muvaffaqiyatli o‘zgartirildi.' });
        } else {
          return; // Tasdiqlanmasa to'xtatadi
        }
      } else {
        await teachersApi.restore(teacher.id);
        setToast({ type: 'success', text: 'Ustoz faol holatga qaytarildi.' });
      }
      loadTeachers();
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error('Statusni o‘zgartirishda xatolik:', err);
      setToast({ type: 'error', text: 'Amalni bajarishda xatolik yuz berdi.' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen text-text-main transition-colors duration-300">
      
      {/* Sarlavha qismi */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">O‘qituvchilar paneli</h1>
          <p className="text-xs text-text-muted">Tizimdagi ustozlarning oylik maoshi va ulushlarini boshqarish.</p>
        </div>
        
        {/* Filtr, Qidiruv va Qo'shish paneli */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <select 
              value={statusFilter} 
              onChange={e => { setPage(1); setStatusFilter(e.target.value); }}
              className="px-3 py-2 text-xs rounded-xl border border-border bg-card text-text-main focus:outline-none cursor-pointer"
            >
              <option value="all">Hamma holatlar</option>
              <option value="true">Faollar</option>
              <option value="false">Nofaollar</option>
            </select>

            <div className="flex w-48 sm:w-64">
              <input
                type="text"
                placeholder="Ism, familiya..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-4 py-2 text-xs rounded-l-xl border border-border bg-card text-text-main focus:outline-none"
              />
              <button type="submit" className="px-4 bg-primary text-white text-xs font-bold rounded-r-xl hover:opacity-90 cursor-pointer transition-opacity">
                Qidirish
              </button>
            </div>
          </form>

          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:opacity-90 transition-all cursor-pointer"
          >
            + Yangi ustoz
          </button>
        </div>
      </div>

      {/* Global Toast ogohlantirish paneli */}
      {toast && (
        <div className={`p-3 rounded-xl text-xs font-semibold border max-w-sm animate-slideIn fixed bottom-5 right-5 z-50 shadow-lg ${
          toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
        }`}>
          {toast.text}
        </div>
      )}

      {/* Jadval komponenti */}
      <TeachersTable
        teachers={teachers}
        isLoading={isLoading}
        meta={meta}
        page={page}
        onPageChange={setPage}
        onEdit={handleOpenEditModal}
        onToggleStatus={handleToggleStatus}
      />

      {/* Universal Oyna (Modal) */}
      <TeacherFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        teacher={selectedTeacher}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
};