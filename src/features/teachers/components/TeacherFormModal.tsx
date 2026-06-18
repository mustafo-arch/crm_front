import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { teachersApi, type TeacherItem, type TeacherPayload } from '../api/TeachersApi';
import { X, User, Phone, Lock, DollarSign, Percent, Briefcase, AlertCircle } from 'lucide-react';

interface TeacherFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  teacher: TeacherItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [payScheme, setPayScheme] = useState<'salary' | 'percent'>('salary');
  const [monthlySalary, setMonthlySalary] = useState<string>('');
  const [percentShare, setPercentShare] = useState<string>('');
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError(null);
      if (mode === 'edit' && teacher) {
        const nameParts = teacher.fullName.split(' ');
        setFirstName(nameParts[0] || '');
        setLastName(nameParts.slice(1).join(' ') || '');
        setPhone(teacher.phone);
        setPassword(''); 
        
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
    }
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
            {mode === 'create' ? 'Yangi o‘qituvchi qo‘shish' : 'O‘qituvchi ma’lumotlari'}
          </h2>
          <p className="text-[11px] text-text-muted font-medium">Ustozning shaxsiy profili va moliya hisobini sozlash.</p>
        </div>

        {/* Xatolik oynasi */}
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
                placeholder="Asliddin"
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
                placeholder="Karimov"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-wider flex items-center gap-1">
              <Phone size={10} /> Telefon raqami *
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
              <Lock size={10} /> Tizim paroli {mode === 'edit' && '(Ixtiyoriy)'}
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

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-wider flex items-center gap-1">
              <Briefcase size={10} /> To‘lov sxemasi *
            </label>
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-[color-mix(in_srgb,var(--background)_60%,transparent)] border border-[color-mix(in_srgb,var(--border)_40%,transparent)] rounded-xl">
              <button
                type="button"
                onClick={() => setPayScheme('salary')}
                className={`py-2 text-[11px] font-black rounded-lg transition-all cursor-pointer border ${
                  payScheme === 'salary' 
                    ? 'bg-primary text-white border-primary/20 shadow-lg shadow-primary/15' 
                    : 'text-text-muted border-transparent hover:text-text-main hover:bg-border/10'
                }`}
              >
                Fiksirlangan Oylik
              </button>
              <button
                type="button"
                onClick={() => setPayScheme('percent')}
                className={`py-2 text-[11px] font-black rounded-lg transition-all cursor-pointer border ${
                  payScheme === 'percent' 
                    ? 'bg-primary text-white border-primary/20 shadow-lg shadow-primary/15' 
                    : 'text-text-muted border-transparent hover:text-text-main hover:bg-border/10'
                }`}
              >
                Foizli Ulush (%)
              </button>
            </div>
          </div>

          {payScheme === 'salary' ? (
            <div className="space-y-1.5 animate-fade-in">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-wider flex items-center gap-1">
                <DollarSign size={10} /> Oylik Maoshi (UZS) *
              </label>
              <input
                type="text"
                required
                value={monthlySalary}
                onChange={e => setMonthlySalary(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-[color-mix(in_srgb,var(--border)_70%,transparent)] bg-[color-mix(in_srgb,var(--background)_50%,transparent)] text-text-main focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-muted/40"
                placeholder="5000000"
              />
            </div>
          ) : (
            <div className="space-y-1.5 animate-fade-in">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-wider flex items-center gap-1">
                <Percent size={10} /> Ustoz ulushi (Foizda) *
              </label>
              <input
                type="text"
                required
                value={percentShare}
                onChange={e => setPercentShare(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-[color-mix(in_srgb,var(--border)_70%,transparent)] bg-[color-mix(in_srgb,var(--background)_50%,transparent)] text-text-main focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-muted/40"
                placeholder="40"
              />
            </div>
          )}

          {/* Pastki tugmalar paneli */}
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
              {isSubmitting ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};