import React, { useState, useEffect } from 'react';
import { studentsApi, type StudentItem } from '../api/StudentsApi';
import { X, User, Phone, Lock, Calendar, AlertCircle } from 'lucide-react';

interface AxiosErrorLike {
  response?: {
    data?: {
      message?: string | string[];
    };
  };
}

interface StudentFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  student: StudentItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  mode,
  student,
  onClose,
  onSuccess,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [startDate, setStartDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError(null);
      if (mode === 'edit' && student) {
        const nameParts = student.fullName ? student.fullName.split(' ') : ['', ''];
        setFirstName(nameParts[0] || '');
        setLastName(nameParts[1] || '');
        setPhone(student.phone);
        setPassword(''); 
        setDateOfBirth(student.dateOfBirth ? student.dateOfBirth.split('T')[0] : '');
        setStartDate(student.startDate ? student.startDate.split('T')[0] : '');
      } else {
        setFirstName('');
        setLastName('');
        setPhone('+998');
        setPassword('');
        setDateOfBirth('');
        setStartDate('');
      }
    }
  }, [isOpen, mode, student]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      password: password ? password : (mode === 'create' ? '' : undefined),
      dateOfBirth: dateOfBirth || undefined,
      startDate: startDate || undefined,
    };

    try {
      if (mode === 'create') {
        await studentsApi.create(payload);
      } else if (mode === 'edit' && student) {
        if ('update' in studentsApi && typeof studentsApi.update === 'function') {
          await studentsApi.update(student.id, payload);
        }
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const errorResponse = err as AxiosErrorLike;
      const errMsg = errorResponse.response?.data?.message || 'Xatolik yuz berdi!';
      setError(Array.isArray(errMsg) ? errMsg[0] : errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[color-mix(in_srgb,var(--card)_75%,transparent)] backdrop-blur-2xl border border-[color-mix(in_srgb,var(--border)_40%,transparent)] w-full max-w-md rounded-3xl shadow-2xl shadow-black/50 overflow-hidden p-6 relative space-y-5">
        
        {/* Yopish tugmasi */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-text-muted hover:text-text-main p-1.5 hover:bg-border/20 rounded-xl transition-all cursor-pointer"
        >
          <X size={16} />
        </button>
        
        {/* Sarlavha */}
        <div className="space-y-1">
          <h2 className="text-sm font-black uppercase tracking-widest text-text-main flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {mode === 'create' ? 'Talaba Ro‘yxatdan O‘tkazish' : 'Talaba ma’lumotlari'}
          </h2>
          <p className="text-[11px] text-text-muted font-medium">Tizimda yangi o'quvchi profilini va o'qish muddatlarini sozlash.</p>
        </div>

        {/* Xatolik xabari */}
        {error && (
          <div className="p-3.5 rounded-2xl text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20 flex items-center gap-2 animate-shake">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Forma */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-wider flex items-center gap-1">
                <User size={10} /> Ism *
              </label>
              <input 
                type="text" 
                required 
                value={firstName} 
                onChange={e => setFirstName(e.target.value)} 
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-[color-mix(in_srgb,var(--border)_70%,transparent)] bg-[color-mix(in_srgb,var(--background)_50%,transparent)] text-text-main focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-muted/40"
                placeholder="Kamron"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-wider flex items-center gap-1">
                <User size={10} /> Familiya *
              </label>
              <input 
                type="text" 
                required 
                value={lastName} 
                onChange={e => setLastName(e.target.value)} 
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-[color-mix(in_srgb,var(--border)_70%,transparent)] bg-[color-mix(in_srgb,var(--background)_50%,transparent)] text-text-main focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-muted/40"
                placeholder="Aliyev"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-wider flex items-center gap-1">
              <Phone size={10} /> Telefon Raqam *
            </label>
            <input 
              type="text" 
              required 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-[color-mix(in_srgb,var(--border)_70%,transparent)] bg-[color-mix(in_srgb,var(--background)_50%,transparent)] text-text-main focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              placeholder="+998901234567"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-wider flex items-center gap-1">
              <Lock size={10} /> {mode === 'create' ? 'Tizim paroli *' : 'Yangi parol (O‘zgartirmaslik uchun bo‘sh)'}
            </label>
            <input 
              type="password" 
              required={mode === 'create'} 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-[color-mix(in_srgb,var(--border)_70%,transparent)] bg-[color-mix(in_srgb,var(--background)_50%,transparent)] text-text-main focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-muted/40"
              placeholder="••••••••"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-wider flex items-center gap-1">
                <Calendar size={10} /> Tug‘ilgan Sana
              </label>
              <input 
                type="date" 
                value={dateOfBirth} 
                onChange={e => setDateOfBirth(e.target.value)} 
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-[color-mix(in_srgb,var(--border)_70%,transparent)] bg-[color-mix(in_srgb,var(--background)_50%,transparent)] text-text-main focus:outline-none focus:border-primary transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-wider flex items-center gap-1">
                <Calendar size={10} /> Boshlash Sana
              </label>
              <input 
                type="date" 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)} 
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-[color-mix(in_srgb,var(--border)_70%,transparent)] bg-[color-mix(in_srgb,var(--background)_50%,transparent)] text-text-main focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Pastki Harakatlar */}
          <div className="flex justify-end gap-2 pt-2 border-t border-[color-mix(in_srgb,var(--border)_30%,transparent)]">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={isSubmitting}
              className="px-4 py-2.5 bg-transparent border border-[color-mix(in_srgb,var(--border)_60%,transparent)] rounded-xl text-xs font-black text-text-muted hover:bg-border/20 hover:text-text-main transition-all cursor-pointer disabled:opacity-50"
            >
              Bekor qilish
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-black hover:shadow-lg hover:shadow-primary/20 hover:opacity-95 transition-all cursor-pointer uppercase tracking-wider disabled:opacity-50 min-w-[100px]"
            >
              {isSubmitting ? 'Saqlanmoqda...' : (mode === 'create' ? 'Saqlash' : 'Yangilash')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};