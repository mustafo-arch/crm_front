import { useState, useEffect, useCallback } from 'react';
import { managersApi, type ManagerListItem } from '../api/ManagerApi';
import { ManagersTable } from '../components/ManagersTable';
import { ManagerFormModal } from '../components/ManagerFormModal';
import { toast } from 'sonner'; // 🔥 Sonner daxshatli tarzda global ulandi
import { Users, UserPlus } from 'lucide-react';

export const ManagersPage = () => {
  const [managers, setManagers] = useState<ManagerListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
      toast.error('Menejerlar roʻyxatini yuklashda xatolik yuz berdi!');
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

  // Muvaffaqiyatli yakunlanganda Sonner toast ishlatish
  const handleSuccess = () => {
    const successMsg = modalMode === 'create' 
      ? 'Menejer muvaffaqiyatli qo‘shildi!' 
      : 'Menejer ma’lumotlari tahrirlandi!';
    
    toast.success(successMsg, {
      description: "O'zgarishlar saqlandi.",
    });
    loadManagers();
  };

  // O'chirish xizmati Sonner bildirishnomasi bilan
  const handleDeleteManager = async (id: string, fullName: string) => {
    if (window.confirm(`Diqqat! ${fullName}ni tizimdan o‘chirib tashlamoqchimisiz?`)) {
      try {
        await managersApi.remove(id);
        toast.success('Menejer tizimdan o‘chirildi.', {
          description: `Manager muvaffaqiyatli o'chirildi.`
        });
        loadManagers();
      } catch (err) {
        console.error(err);
        toast.error('Menejerni o‘chirishda xatolik yuz berdi.', {
          description: "Tarmoq ulanishini yoki server holatini tekshiring."
        });
      }
    }
  };

  return (
    <div className="space-y-6 text-text-main transition-colors duration-300">
      
      {/* Yuqori premium panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 bg-[color-mix(in_srgb,var(--card)_60%,transparent)] backdrop-blur-xl p-6 border border-[color-mix(in_srgb,var(--border)_35%,transparent)] rounded-3xl shadow-xl shadow-black/5 hover:border-primary/20 transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-inner">
            <Users size={22} className="text-primary animate-pulse"/>
          </div>
          <div className="space-y-0.5">
            <h1 className="text-xl font-black tracking-tight text-text-main">Menejerlar boshqaruvi</h1>
            <p className="text-[11px] text-text-muted font-semibold tracking-wide">Faqat tizim Administratori uchun ochiq bo‘lgan nazorat paneli.</p>
          </div>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-3 bg-primary text-white text-xs font-black rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer self-start sm:self-auto uppercase tracking-wider flex items-center gap-2 group"
        >
          <UserPlus size={15} className="group-hover:translate-x-0.5 transition-transform"/>
          <span>Yangi menejer</span>
        </button>
      </div>

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