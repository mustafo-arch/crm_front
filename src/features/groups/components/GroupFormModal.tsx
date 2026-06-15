import React, { useState, useEffect } from 'react';
import { useGroupsStore } from '../store/useGroupsStore';
import { type GroupItem, type CreateGroupPayload } from '../api/GroupsApi';
import { useRoomsStore } from '../../rooms/store/RoomsStore';

interface GroupFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  group: GroupItem | null;
  onClose: () => void;
}

// Formaning ichki state-i uchun qat'iy interfeys
interface GroupFormData {
  name: string;
  capacity: number;
  daysPattern: 'ODD' | 'EVEN';
  startTime: string;
  endTime: string;
  monthlyFee: number;
  roomId: string;
}

export const GroupFormModal: React.FC<GroupFormModalProps> = ({ isOpen, mode, group, onClose }) => {
  const { createGroup, updateGroup, error, clearError, isLoading } = useGroupsStore();
  const { rooms, fetchRooms } = useRoomsStore();

  const [formData, setFormData] = useState<GroupFormData>({
    name: '',
    capacity: 15,
    daysPattern: 'ODD',
    startTime: '14:00',
    endTime: '16:00',
    monthlyFee: 300000,
    roomId: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchRooms(); // Har safar modal ochilganda xonalarni yangilab olamiz
    }
    
    if (mode === 'edit' && group) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: group.name,
        capacity: group.capacity,
        daysPattern: group.daysPattern,
        startTime: group.startTime,
        endTime: group.endTime,
        monthlyFee: group.monthlyFee,
        roomId: group.roomId || ''
      });
    } else {
      setFormData({
        name: '',
        capacity: 15,
        daysPattern: 'ODD',
        startTime: '14:00',
        endTime: '16:00',
        monthlyFee: 300000,
        roomId: ''
      });
    }
    clearError();
  }, [mode, group, isOpen, clearError, fetchRooms]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Backend CreateGroupPayload-ga moslab ma'lumotlarni tayyorlaymiz
    const payload: CreateGroupPayload = {
      name: formData.name.trim(),
      capacity: formData.capacity,
      daysPattern: formData.daysPattern,
      startTime: formData.startTime,
      endTime: formData.endTime,
      monthlyFee: formData.monthlyFee,
      roomId: formData.roomId || undefined // Agar bo'sh string bo'lsa, yubormaymiz
    };

    try {
      if (mode === 'create') {
        await createGroup(payload);
      } else if (mode === 'edit' && group) {
        // Tahrirlashda isActive holatini ham ixtiyoriy yuborish mumkin
        await updateGroup(group.id, payload);
      }
      onClose();
    } catch (err) {
      // Xatolik yuz bersa, Zustand do'konidagi `error` avtomat yangilanadi va formada chiqadi
      console.error('Guruh saqlashda xatolik:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-xl p-6 space-y-4 text-text-main">
        <h2 className="text-sm font-black tracking-wider uppercase">
          {mode === 'create' ? 'Yangi Guruh Ochish' : 'Guruhni Tahrirlash'}
        </h2>
        
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Guruh Nomi *</label>
            <input 
              type="text" 
              name="name"
              required 
              value={formData.name} 
              onChange={handleInputChange} 
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-text-main" 
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Sig'imi (Maks) *</label>
            <input 
              type="number" 
              name="capacity"
              required 
              min="1" 
              value={formData.capacity} 
              onChange={handleInputChange} 
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-text-main" 
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Dars kunlari *</label>
            <select 
              name="daysPattern"
              value={formData.daysPattern} 
              onChange={handleSelectChange} 
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-text-main"
            >
              <option value="ODD">Toq Kunlar (Dsh-Chsh-Jum)</option>
              <option value="EVEN">Juft Kunlar (Ssh-Phsh-Shnh)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Boshlanish vaqti *</label>
            <input 
              type="text" 
              name="startTime"
              placeholder="14:00" 
              required 
              value={formData.startTime} 
              onChange={handleInputChange} 
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-text-main font-mono" 
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Tugash vaqti *</label>
            <input 
              type="text" 
              name="endTime"
              placeholder="16:00" 
              required 
              value={formData.endTime} 
              onChange={handleInputChange} 
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-text-main font-mono" 
            />
          </div>
          
          <div className="col-span-2">
            <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Xona biriktirish</label>
            <select 
              name="roomId"
              value={formData.roomId} 
              onChange={handleSelectChange} 
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-text-main"
            >
              <option value="">Xona tanlanmagan</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} (max {r.capacity} kishi)
                </option>
              ))}
            </select>
          </div>
          
          <div className="col-span-2">
            <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Oylik To'lov (UZS) *</label>
            <input 
              type="number" 
              name="monthlyFee"
              required 
              min="0" 
              value={formData.monthlyFee} 
              onChange={handleInputChange} 
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-text-main" 
            />
          </div>
          
          <div className="col-span-2 flex justify-end gap-2 pt-2 border-t border-border">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-xs font-bold rounded-xl border border-border hover:bg-background/50 transition-colors"
            >
              Bekor qilish
            </button>
            <button 
              type="submit" 
              disabled={isLoading} 
              className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl disabled:opacity-50 transition-all shadow-md hover:opacity-90"
            >
              {isLoading ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};