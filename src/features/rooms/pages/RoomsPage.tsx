import { useEffect, useState } from 'react';
import { RoomFormModal } from '../components/RoomFormModal';
import { type RoomItem } from '../api/RoomsApi';
import { useRoomsStore } from '../store/RoomsStore';

export const RoomsPage = () => {
  const { rooms, isLoading, fetchRooms, deleteRoom } = useRoomsStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedRoom, setSelectedRoom] = useState<RoomItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedRoom(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (room: RoomItem) => {
    setModalMode('edit');
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`${name} xonasini o‘chirib tashlamoqchimisiz?`)) {
      try {
        await deleteRoom(id);
        showToast('Xona muvaffaqiyatli o‘chirildi (Nofaol qilindi).');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen text-text-main">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Xonalar paneli</h1>
          <p className="text-xs text-text-muted">O‘quv markazidagi xonalar ro‘yxati va ularning sig‘im nazorati.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:opacity-90 transition-all"
        >
          + Yangi xona
        </button>
      </div>

      {toast && (
        <div className="p-3 rounded-xl text-xs font-semibold border max-w-sm fixed bottom-5 right-5 z-50 shadow-lg bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
          {toast}
        </div>
      )}

      <div className="border border-border bg-card rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/50 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                <th className="p-4">Xona Nomi</th>
                <th className="p-4">Sig‘imi (Sig‘adigan o‘quvchilar)</th>
                <th className="p-4">Holati</th>
                <th className="p-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {isLoading && rooms.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-text-muted animate-pulse font-medium">
                    Xonalar yuklanmoqda...
                  </td>
                </tr>
              ) : rooms.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-text-muted font-medium">
                    Tizimda faol xonalar topilmadi.
                  </td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-background/30 transition-colors">
                    <td className="p-4 font-bold text-text-main">{room.name}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-lg bg-primary/10 text-primary font-semibold text-[11px]">
                        {room.capacity} ta joy
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                        Faol
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(room)}
                        className="px-3 py-1 text-[11px] font-bold rounded-lg border border-border hover:bg-background transition-all text-text-main"
                      >
                        Tahrirlash
                      </button>
                      <button
                        onClick={() => handleDelete(room.id, room.name)}
                        className="px-3 py-1 text-[11px] font-bold rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                      >
                        O‘chirish
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RoomFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        room={selectedRoom}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => showToast(modalMode === 'create' ? 'Xona muvaffaqiyatli qo‘shildi!' : 'Xona ma’lumotlari yangilandi!')}
      />
    </div>
  );
};