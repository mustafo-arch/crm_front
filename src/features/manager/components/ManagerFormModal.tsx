import React, { useState, useEffect } from 'react';
import { managersApi, type ManagerListItem } from '../api/ManagerApi';
import { X, User, Phone, Lock, DollarSign, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface AxiosErrorLike {
  response?: {
    data?: {
      message?: string | string[];
    };
  };
}

interface ManagerFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  manager: ManagerListItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ManagerFormModal: React.FC<ManagerFormModalProps> = ({
  isOpen,
  mode,
  manager,
  onClose,
  onSuccess,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [monthlySalary, setMonthlySalary] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError(null);
      if (mode === 'edit' && manager) {
        setFirstName(manager.firstName);
        setLastName(manager.lastName);
        setPhone(manager.phone);
        setPassword(''); 
        setPhotoUrl(''); 
        setMonthlySalary('');
      } else {
        setFirstName(''); setLastName(''); setPhone(''); setPassword(''); setPhotoUrl(''); setMonthlySalary('');
      }
    }
  }, [isOpen, mode, manager]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const salaryNum = parseFloat(monthlySalary);
    if (mode === 'create' && (isNaN(salaryNum) || salaryNum < 0)) {
      setError('Oylik maoshni to‘g‘ri kiriting.');
      return;
    }

    try {
      if (mode === 'create') {
        await managersApi.create({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          password,
          photoUrl: photoUrl.trim() || undefined,
          monthlySalary: salaryNum,
        });
      } else if (mode === 'edit' && manager) {
        await managersApi.update(manager.id, {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          password: password ? password : undefined,
          photoUrl: photoUrl.trim() || undefined,
          monthlySalary: monthlySalary ? parseFloat(monthlySalary) : undefined,
        });
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const error = err as AxiosErrorLike;
      const errMsg = error.response?.data?.message || 'Xatolik yuz berdi!';
      setError(Array.isArray(errMsg) ? errMsg[0] : errMsg);
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
            {mode === 'create' ? 'Yangi menejer qo‘shish' : 'Menejer ma’lumotlari'}
          </h2>
          <p className="text-[11px] text-text-muted font-medium">Kiber-panel tizimi uchun barcha maydonlarni to'ldiring.</p>
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
                placeholder="Alisher"
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
                placeholder="Asimov"
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
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-[color-mix(in_srgb,var(--border)_70%,transparent)] bg-[color-mix(in_srgb,var(--background)_50%,transparent)] text-text-main focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-muted/40"
              placeholder="+998901234567"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-wider flex items-center gap-1">
              <Lock size={10} /> {mode === 'create' ? 'Tizim paroli *' : 'Yangi parol'}
            </label>
            <input 
              type="password" 
              required={mode === 'create'} 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-[color-mix(in_srgb,var(--border)_70%,transparent)] bg-[color-mix(in_srgb,var(--background)_50%,transparent)] text-text-main focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-muted/40"
              placeholder={mode === 'create' ? "••••••••" : "O'zgarishsiz qoldirish uchun bo'sh qo'ying"}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-wider flex items-center gap-1">
              <DollarSign size={10} /> Oylik maoshi (UZS) {mode === 'create' ? '*' : ''}
            </label>
            <input 
              type="number" 
              required={mode === 'create'} 
              value={monthlySalary} 
              onChange={e => setMonthlySalary(e.target.value)} 
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-[color-mix(in_srgb,var(--border)_70%,transparent)] bg-[color-mix(in_srgb,var(--background)_50%,transparent)] text-text-main focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-muted/40"
              placeholder={mode === 'create' ? "5000000" : "O'zgarishsiz qoldirish uchun bo'sh qo'ying"}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-wider flex items-center gap-1">
              <ImageIcon size={10} /> Profil rasm URL
            </label>
            <input 
              type="url" 
              value={photoUrl} 
              onChange={e => setPhotoUrl(e.target.value)} 
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-[color-mix(in_srgb,var(--border)_70%,transparent)] bg-[color-mix(in_srgb,var(--background)_50%,transparent)] text-text-main focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-muted/40"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          {/* Pastki tugmalar panel */}
          <div className="flex justify-end gap-2 pt-2 border-t border-[color-mix(in_srgb,var(--border)_30%,transparent)]">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2.5 bg-transparent border border-[color-mix(in_srgb,var(--border)_60%,transparent)] rounded-xl text-xs font-black text-text-muted hover:bg-border/20 hover:text-text-main transition-all cursor-pointer"
            >
              Bekor qilish
            </button>
            <button 
              type="submit" 
              className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-black hover:shadow-lg hover:shadow-primary/20 hover:opacity-95 transition-all cursor-pointer uppercase tracking-wider"
            >
              {mode === 'create' ? 'Saqlash' : 'Yangilash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};