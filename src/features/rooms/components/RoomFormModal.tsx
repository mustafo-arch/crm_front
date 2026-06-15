import React, { useState, useEffect } from 'react';
import { type RoomItem } from '../api/RoomsApi';
import { useRoomsStore } from '../store/RoomsStore';

interface RoomFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  room: RoomItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const RoomFormModal: React.FC<RoomFormModalProps> = ({
  isOpen,
  mode,
  room,
  onClose,
  onSuccess,
}) => {
  const { createRoom, updateRoom, error, clearError, isLoading } = useRoomsStore();
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState<string>('');

  useEffect(() => {
    if (mode === 'edit' && room) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(room.name);
      setCapacity(room.capacity.toString());
    } else {
      setName('');
      setCapacity('');
    }
    clearError();
  }, [mode, room, isOpen, clearError]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedCapacity = parseInt(capacity, 10);
    if (isNaN(parsedCapacity) || parsedCapacity < 1) {
      return; // Frontend qo'shimcha validatsiya
    }

    const payload = {
      name: name.trim(),
      capacity: parsedCapacity,
    };

    try {
      if (mode === 'create') {
        await createRoom(payload);
      } else if (mode === 'edit' && room) {
        await updateRoom(room.id, payload);
      }
      onSuccess();
      onClose();
    } catch {
      // Xatolikni Zustand do'konining o'zi catch qiladi va `error` state'ga yozadi
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border w-full max-w-sm rounded-2xl shadow-xl p-6 space-y-4 relative text-text-main">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-text-main transition-colors">✕</button>

        <h2 className="text-sm font-black tracking-wider uppercase text-center md:text-left">
          {mode === 'create' ? 'Yangi xona qo‘shish' : 'Xonani tahrirlash'}
        </h2>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Xona nomi *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-text-main"
              placeholder="Sariq xona (3-qavat)"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Xona sig‘imi (Odam soni) *</label>
            <input
              type="number"
              required
              min="1"
              value={capacity}
              onChange={e => setCapacity(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-text-main"
              placeholder="15"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-border hover:bg-background transition-all"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:opacity-90 transition-all min-w-20"
            >
              {isLoading ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};