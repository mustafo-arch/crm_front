import { useState, useEffect, useCallback } from 'react';
import { managersApi, type ManagerListItem } from '../api/ManagerApi';
import { ManagersTable } from '../components/ManagersTable';
import { ManagerFormModal } from '../components/ManagerFormModal';

export const ManagersPage = () => {
  const [managers, setManagers] = useState<ManagerListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal boshqaruvi uchun holatlar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedManager, setSelectedManager] = useState<ManagerListItem | null>(null);

  // Ma'lumotlarni yuklash xizmati
  const loadManagers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await managersApi.list();
      setManagers(data);
    } catch (err) {
      console.error('Menejerlarni yuklashda xatolik:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadManagers();
  }, [loadManagers]);

  // Qo'shish oynasini ochish
  const handleOpenCreateModal = () => {
    setModalMode('create');
    setSelectedManager(null);
    setIsModalOpen(true);
  };

  // Tahrirlash oynasini ochish
  const handleOpenEditModal = (manager: ManagerListItem) => {
    setModalMode('edit');
    setSelectedManager(manager);
    setIsModalOpen(true);
  };

  // Muvaffaqiyatli yakunlanganda toast chiqarish
  const handleSuccess = () => {
    setToast({
      type: 'success',
      text: modalMode === 'create' ? 'Menejer muvaffaqiyatli qo‘shildi!' : 'Menejer ma’lumotlari yangilandi!',
    });
    loadManagers();
    setTimeout(() => setToast(null), 3000);
  };

  // O'chirish xizmati
  const handleDeleteManager = async (id: string, fullName: string) => {
    if (window.confirm(`Diqqat! ${fullName}ni tizimdan butkul o‘chirib tashlamoqchimisiz?`)) {
      try {
        await managersApi.remove(id);
        setToast({ type: 'success', text: 'Menejer tizimdan o‘chirildi.' });
        loadManagers();
        setTimeout(() => setToast(null), 3000);
      } catch (err) {
        console.error(err);
        setToast({ type: 'error', text: 'Menejerni o‘chirishda xatolik yuz berdi.' });
      }
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen text-text-main transition-colors duration-300">
      
      {/* Yuqori panel: Sarlavha va burchakdagi tugma */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Menejerlar boshqaruvi</h1>
          <p className="text-xs text-text-muted">Faqat tizim Administratori uchun ochiq bo‘lgan nazorat paneli.</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:opacity-90 transition-all cursor-pointer self-start sm:self-auto"
        >
          + Yangi menejer qo‘shish
        </button>
      </div>

      {/* Global Bildirishnoma (Toast) */}
      {toast && (
        <div className={`p-3 rounded-xl text-xs font-semibold border max-w-sm animate-slideIn ${
          toast.type === 'success' 
            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
            : 'bg-red-500/10 text-red-500 border-red-500/20'
        }`}>
          {toast.text}
        </div>
      )}

      {/* Jadval qismi */}
      <ManagersTable
        managers={managers}
        isLoading={isLoading}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteManager}
      />

      {/* Universal Oyna (Modal) */}
      <ManagerFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        manager={selectedManager}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
};