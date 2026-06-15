import React, { useEffect, useState } from 'react';
import { useGroupsStore } from '../store/useGroupsStore';
import { GroupFilters } from '../components/GroupFilters';
import { GroupFormModal } from '../components/GroupFormModal';
import { type GroupItem } from '../api/GroupsApi';
import { useRoomsStore } from '../../rooms/store/RoomsStore';

interface ModalState {
  open: boolean;
  mode: 'create' | 'edit';
  data: GroupItem | null;
}

export const GroupsPage: React.FC = () => {
  const { groups, meta, isLoading, fetchGroups, deleteGroup, updateGroup, setFilters } = useGroupsStore();
  const { rooms, fetchRooms } = useRoomsStore(); // 🚀 Xonalar ro'yxatini do'kondan olamiz
  
  const [modal, setModal] = useState<ModalState>({ 
    open: false, 
    mode: 'create', 
    data: null 
  });

  useEffect(() => {
    fetchGroups();
    fetchRooms(); // 🚀 Sahifa ochilganda xonalarni ham yuklab qo'yamiz
  }, [fetchGroups, fetchRooms]);

  // Guruhni arxivga yuborish (Soft Delete)
  const handleArchive = async (id: string, name: string): Promise<void> => {
    const reason = window.prompt(`${name} guruhini arxivlash sababini yozing (ixtiyoriy):`);
    if (reason !== null) {
      try {
        await deleteGroup(id, reason.trim() || undefined);
      } catch (err) {
        console.error('Guruhni arxivlashda xatolik:', err);
      }
    }
  };

  // Guruhni arxivdan chiqarish (Backend PATCH update orqali isActive: true qilish)
  const handleActivate = async (id: string, name: string): Promise<void> => {
    const confirmActive = window.confirm(`${name} guruhini qayta faollashtirib, arxivdan chiqarishni xohlaysizmi?`);
    if (confirmActive) {
      try {
        await updateGroup(id, { isActive: true });
      } catch (err) {
        console.error('Guruhni arxivdan chiqarishda xatolik:', err);
      }
    }
  };

  const handlePageChange = (newPage: number): void => {
    setFilters({ page: newPage });
    fetchGroups();
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen text-text-main">
      {/* Sarlavha qismi */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Guruhlar paneli</h1>
          <p className="text-xs text-text-muted">Kurs jadvallari, dars vaqtlari va xonalar taqsimoti.</p>
        </div>
        <button 
          onClick={() => setModal({ open: true, mode: 'create', data: null })} 
          className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:opacity-90 transition-all"
        >
          + Yangi Guruh
        </button>
      </div>

      {/* Filtrlar komponenti */}
      <GroupFilters />

      {/* Jadval qismi */}
      <div className="border border-border bg-card rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/50 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                <th className="p-4">Guruh Nomi</th>
                <th className="p-4">Xona</th>
                <th className="p-4">Kunlar</th>
                <th className="p-4">Dars Vaqti</th>
                <th className="p-4">Narxi</th>
                <th className="p-4">Holati</th>
                <th className="p-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {isLoading && groups.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-muted animate-pulse font-medium">
                    Ma'lumotlar yuklanmoqda...
                  </td>
                </tr>
              ) : groups.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-muted font-medium">
                    Guruhlar topilmadi.
                  </td>
                </tr>
              ) : (
                groups.map((g) => {
                  // 🚀 Bizdagi xonalar orasidan guruhga tegishli xonani topamiz
                  const currentRoom = rooms.find((r) => r.id === g.roomId);

                  return (
                    <tr key={g.id} className="hover:bg-background/30 transition-colors">
                      {/* Guruh nomi */}
                      <td className="p-4 font-bold">
                        <div className="flex flex-col">
                          <span>{g.name}</span>
                          <span className="text-[10px] text-text-muted font-normal mt-0.5">
                            Sig'im: max {g.capacity} talaba
                          </span>
                          {g.deactivateReason && (
                            <span className="text-[10px] text-red-500 font-medium italic mt-0.5">
                              Sabab: {g.deactivateReason}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 🚀 Xona nomi va xona sig'imi */}
                      <td className="p-4">
                        {currentRoom ? (
                          <div className="flex flex-col">
                            <span className="font-bold text-text-main bg-background/60 border border-border px-2 py-1 rounded-xl w-max">
                              {currentRoom.name}
                            </span>
                            <span className="text-[9px] text-text-muted mt-0.5">
                              Xona sig'imi: {currentRoom.capacity} kishi
                            </span>
                          </div>
                        ) : (
                          <span className="text-text-muted italic text-[11px]">Biriktirilmagan</span>
                        )}
                      </td>

                      {/* Kunlar */}
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          g.daysPattern === 'ODD' 
                            ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' 
                            : 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                        }`}>
                          {g.daysPattern === 'ODD' ? 'Toq Kunlar' : 'Juft Kunlar'}
                        </span>
                      </td>

                      {/* Dars vaqti */}
                      <td className="p-4 font-mono text-xs text-text-main font-semibold">
                        {g.startTime} - {g.endTime}
                      </td>

                      {/* Narxi */}
                      <td className="p-4 font-bold text-text-main">
                        {g.monthlyFee.toLocaleString('uz-UZ')} UZS
                      </td>

                      {/* Holati */}
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          g.isActive 
                            ? 'bg-emerald-500/10 text-emerald-500' 
                            : 'bg-red-500/10 text-red-500'
                        }`}>
                          {g.isActive ? 'Faol' : 'Arxivda'}
                        </span>
                      </td>

                      {/* Amallar */}
                      <td className="p-4 text-right space-x-2 whitespace-nowrap">
                        <button 
                          onClick={() => setModal({ open: true, mode: 'edit', data: g })} 
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-border text-text-main hover:bg-background/50 transition-colors"
                        >
                          Tahrirlash
                        </button>
                        
                        {g.isActive ? (
                          <button 
                            onClick={() => handleArchive(g.id, g.name)} 
                            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                          >
                            Arxivlash
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleActivate(g.id, g.name)} 
                            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors"
                          >
                            Faollashtirish
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Paginatsiya boshqaruvi */}
        <div className="p-4 border-t border-border flex items-center justify-between text-xs text-text-muted bg-background/20">
          <span className="font-medium">Jami: {meta.total} ta guruh</span>
          <div className="flex items-center gap-3">
            <button 
              disabled={meta.page <= 1 || isLoading} 
              onClick={() => handlePageChange(meta.page - 1)} 
              className="px-3 py-1 border border-border rounded-xl disabled:opacity-50 hover:bg-background/50 transition-colors font-bold"
            >
              Orqaga
            </button>
            <span className="font-mono font-bold">
              Sahifa {meta.page} / {meta.pages}
            </span>
            <button 
              disabled={meta.page >= meta.pages || isLoading} 
              onClick={() => handlePageChange(meta.page + 1)} 
              className="px-3 py-1 border border-border rounded-xl disabled:opacity-50 hover:bg-background/50 transition-colors font-bold"
            >
              Oldinga
            </button>
          </div>
        </div>
      </div>

      {/* Guruh Formasi Modali */}
      <GroupFormModal 
        isOpen={modal.open} 
        mode={modal.mode} 
        group={modal.data} 
        onClose={() => setModal({ open: false, mode: 'create', data: null })} 
      />
    </div>
  );
};