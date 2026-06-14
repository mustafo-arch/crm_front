import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { teachersApi, type TeacherItem, type TeacherPayload } from '../api/TeachersApi';

interface TeacherFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  teacher: TeacherItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

// Backenddan keladigan validatsiya xatoliklari interfeysi
interface BackendErrorResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

export const TeacherFormModal: React.FC<TeacherFormModalProps> = ({
  isOpen,
  mode,
  teacher,
  onClose,
  onSuccess,
}) => {
  // Form inputlari shtatlari
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [payScheme, setPayScheme] = useState<'salary' | 'percent'>('salary');
  const [monthlySalary, setMonthlySalary] = useState<string>('');
  const [percentShare, setPercentShare] = useState<string>('');
  
  // UI yuklanish va xatolik shtatlari
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal ochilganda yoki rejim o'zgarganda inputlarni to'ldirish
  useEffect(() => {
    if (mode === 'edit' && teacher) {
      const nameParts = teacher.fullName.split(' ');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setPhone(teacher.phone);
      setPassword(''); // Tahrirlashda parolni ko'rsatmaymiz
      
      if (teacher.monthlySalary !== null) {
        setPayScheme('salary');
        setMonthlySalary(teacher.monthlySalary.toString());
        setPercentShare('');
      } else {
        setPayScheme('percent');
        setPercentShare(teacher.percentShare?.toString() || '');
        setMonthlySalary('');
      }
    } else {
      setFirstName('');
      setLastName('');
      setPhone('+998');
      setPassword('');
      setPayScheme('salary');
      setMonthlySalary('');
      setPercentShare('');
    }
    setError(null);
  }, [mode, teacher, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const payload: TeacherPayload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
    };

    if (password) {
      payload.password = password;
    } else if (mode === 'create') {
      payload.password = ''; 
    }

    // 🚀 MUAMMO SHU YERDA EDI: Backend class-validator kutayotgan "number string" formatida yuboramiz (Stringligicha qoladi)
    if (payScheme === 'salary') {
      payload.monthlySalary = monthlySalary.trim() || null;
      payload.percentShare = null;
    } else {
      payload.percentShare = percentShare.trim() || null;
      payload.monthlySalary = null;
    }

    try {
      if (mode === 'create') {
        await teachersApi.create(payload);
      } else if (mode === 'edit' && teacher) {
        await teachersApi.update(teacher.id, payload);
      }
      
      onSuccess();
      onClose();
    } catch (err: unknown) {
      // 🚀 ANY ISHLATMASDAN AXIOS XATOLIGINI TO'G'RI USHLASH
      if (axios.isAxiosError<BackendErrorResponse>(err)) {
        const errMsg = err.response?.data?.message || 'Tizim xatoligi yuz berdi.';
        setError(Array.isArray(errMsg) ? errMsg[0] : errMsg);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Kutilmagan noma’lum xatolik yuz berdi.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden p-6 space-y-4 relative text-text-main">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-main transition-colors text-lg cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-sm font-black tracking-wider uppercase text-center md:text-left">
          {mode === 'create' ? 'Yangi o‘qituvchi qo‘shish' : 'O‘qituvchini tahrirlash'}
        </h2>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Ism *</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-text-main"
                placeholder="Asliddin"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Familiya *</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-text-main"
                placeholder="Karimov"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Telefon raqami *</label>
            <input
              type="text"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-text-main"
              placeholder="+998901234567"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">
              Tizim paroli {mode === 'edit' && '(O‘zgartirish ixtiyoriy)'}
            </label>
            <input
              type="password"
              required={mode === 'create'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-text-main"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">To‘lov sxemasi *</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-background rounded-xl border border-border">
              <button
                type="button"
                onClick={() => setPayScheme('salary')}
                className={`py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  payScheme === 'salary' ? 'bg-card text-primary shadow-sm' : 'text-text-muted hover:text-text-main'
                }`}
              >
                Fiksirlangan Oylik
              </button>
              <button
                type="button"
                onClick={() => setPayScheme('percent')}
                className={`py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  payScheme === 'percent' ? 'bg-card text-primary shadow-sm' : 'text-text-muted hover:text-text-main'
                }`}
              >
                Foizli Ulush (%)
              </button>
            </div>
          </div>

          {payScheme === 'salary' ? (
            <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Oylik Maoshi (UZS) *</label>
              <input
                type="text"
                required
                value={monthlySalary}
                onChange={e => setMonthlySalary(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-text-main"
                placeholder="5000000"
              />
            </div>
          ) : (
            <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Klub ulushi (Foizda) *</label>
              <input
                type="text"
                required
                value={percentShare}
                onChange={e => setPercentShare(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-text-main"
                placeholder="40"
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-border hover:bg-background transition-all cursor-pointer disabled:opacity-50"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:opacity-90 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center min-w-[80px]"
            >
              {isSubmitting ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};