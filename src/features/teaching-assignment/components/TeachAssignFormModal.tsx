// src/components/AssignTeacherModal.tsx
import React, { useState, useEffect } from 'react';
import { useTAStore } from '../store/TeachAssignStore';
import { apiClient } from '../../../api/apiClient';
 // 🚀 O'zingni token yuboradigan axios instancingni qo'y!

interface SelectOption {
  id: string;
  name?: string;
  fullName?: string;
}

interface AssignTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AssignTeacherModal: React.FC<AssignTeacherModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { assignTeacher, error, isLoading } = useTAStore();
  
  // Dinamik ro'yxatlar steyti
  const [teachers, setTeachers] = useState<SelectOption[]>([]);
  const [groups, setGroups] = useState<SelectOption[]>([]);
  
  // Form ma'lumotlari
  const [groupId, setGroupId] = useState<string>('');
  const [teacherId, setTeacherId] = useState<string>('');
  const [role, setRole] = useState<'LEAD' | 'ASSISTANT' | 'SUBSTITUTE'>('LEAD');
  const [fromDate, setFromDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [inheritSchedule, setInheritSchedule] = useState<boolean>(true);
  
  // Override sozlamalari
  const [daysPatternOverride, setDaysPatternOverride] = useState<'ODD' | 'EVEN'>('ODD');
  const [startTimeOverride, setStartTimeOverride] = useState<string>('14:00');
  const [endTimeOverride, setEndTimeOverride] = useState<string>('16:00');
  const [note, setNote] = useState<string>('');

  // Ustozlar va Guruhlarni parallel ravishda backanddan yuklash
  useEffect(() => {
    if (isOpen) {
      // 🚀 401 xatoligi bo'lmasligi uchun toza endpointlaringdan ma'lumot olamiz
      Promise.all([
        apiClient.get<{ items: SelectOption[] }>('/teachers?page=1&limit=100&isActive=true'),
        apiClient.get<{ items: SelectOption[] }>('/groups?page=1&limit=100')
      ])
        .then(([teachersRes, groupsRes]) => {
          setTeachers(teachersRes.data.items || []);
          setGroups(groupsRes.data.items || []);
        })
        .catch((err: unknown) => {
          console.error("Ma'lumotlarni yuklashda avtorizatsiya yoki tarmoq xatoligi:", err);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!teacherId || !groupId) return;
    
    const payload = {
      teacherId,
      groupId,
      fromDate,
      role,
      inheritSchedule,
      ...(inheritSchedule ? {} : { daysPatternOverride, startTimeOverride, endTimeOverride }),
      ...(note ? { note } : {}),
    };

    const isDone = await assignTeacher(payload);
    if (isDone) {
      onSuccess();
      onClose();
      // Formani tozalash
      setGroupId('');
      setTeacherId('');
      setNote('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#151c2c] border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4 relative text-slate-200">
        
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
          ✕
        </button>

        <div>
          <h2 className="text-base font-black tracking-wider uppercase text-blue-400">
            Ustozni Guruhga Biriktirish
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Yangi dars jadvali va vazifalar taqsimotini belgilash
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* 🚀 GURUH TANLASH QATORI (ENDI DINAMIK KELADI) */}
          <div>
            <label className="block font-bold text-slate-400 uppercase mb-1">Guruh *</label>
            <select
              required
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-[#0f1422] focus:outline-none focus:border-blue-500 text-slate-200 cursor-pointer"
            >
              <option value="">-- Guruhni tanlang --</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.name || 'Nomsiz guruh'}</option>
              ))}
            </select>
          </div>

          {/* 🚀 O'QITUVCHILAR RO'YXATI */}
          <div>
            <label className="block font-bold text-slate-400 uppercase mb-1">O‘qituvchi *</label>
            <select
              required
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-[#0f1422] focus:outline-none focus:border-blue-500 text-slate-200 cursor-pointer"
            >
              <option value="">-- Ustozni tanlang --</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.fullName || 'Nomsiz ustoz'}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* VAZIFASI (ROL) */}
            <div>
              <label className="block font-bold text-slate-400 uppercase mb-1">Vazifasi (Rol)</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'LEAD' | 'ASSISTANT' | 'SUBSTITUTE')}
                className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-[#0f1422] focus:outline-none focus:border-blue-500 text-slate-200"
              >
                <option value="LEAD">Asosiy Ustoz (LEAD)</option>
                <option value="ASSISTANT">Assistent (Yordamchi)</option>
                <option value="SUBSTITUTE">O‘rinbosar (Vaqtinchalik)</option>
              </select>
            </div>

            {/* BOSHLANISH SANASI */}
            <div>
              <label className="block font-bold text-slate-400 uppercase mb-1">Boshlanish sanasi</label>
              <input
                type="date"
                required
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-[#0f1422] focus:outline-none focus:border-blue-500 text-slate-200"
              />
            </div>
          </div>

          {/* MEROSXO'RLIK */}
          <div className="p-3 bg-[#0f1422] border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-200">Guruh jadvalini meros olish</p>
              <p className="text-[11px] text-slate-400">Ustoz guruh ochilgan vaqtda dars o'tadi</p>
            </div>
            <input
              type="checkbox"
              checked={inheritSchedule}
              onChange={(e) => setInheritSchedule(e.target.checked)}
              className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
            />
          </div>

          {/* OVERRIDE JADVALI */}
          {!inheritSchedule && (
            <div className="p-4 bg-[#0f1422]/50 border border-dashed border-slate-800 rounded-xl space-y-3">
              <p className="font-bold text-amber-400 text-[11px] uppercase tracking-wider">
                Guruh vaqtini o'zgartirish (Override)
              </p>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Kunlar</label>
                  <select
                    value={daysPatternOverride}
                    onChange={(e) => setDaysPatternOverride(e.target.value as 'ODD' | 'EVEN')}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-800 bg-[#0f1422] text-slate-200"
                  >
                    <option value="ODD">Toq Kunlar</option>
                    <option value="EVEN">Juft Kunlar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Boshlanishi</label>
                  <input
                    type="text"
                    value={startTimeOverride}
                    onChange={(e) => setStartTimeOverride(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-800 bg-[#0f1422] text-slate-200 text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Tugashi</label>
                  <input
                    type="text"
                    value={endTimeOverride}
                    onChange={(e) => setEndTimeOverride(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-800 bg-[#0f1422] text-slate-200 text-center"
                  />
                </div>
              </div>
            </div>
          )}

          {/* IZOH */}
          <div>
            <label className="block font-bold text-slate-400 uppercase mb-1">Izoh (Note)</label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Qo'shimcha eslatmalar..."
              className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-[#0f1422] focus:outline-none focus:border-blue-500 text-slate-200 resize-none"
            />
          </div>

          {/* AMALLAR */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/60">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 font-bold rounded-xl border border-slate-800 hover:bg-[#0f1422] transition-all"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white font-bold rounded-xl shadow-md hover:bg-blue-600 transition-all"
            >
              {isLoading ? 'Biriktirilmoqda...' : 'Ustozni qo‘shish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};