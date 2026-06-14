import React, { useState, useEffect } from 'react';
import { managersApi, type ManagerListItem } from '../api/ManagerApi';

// Axios xatolik turi uchun interfeys
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
      // any o'rniga unknown va xavfsiz casting ishlatildi
      const error = err as AxiosErrorLike;
      const errMsg = error.response?.data?.message || 'Xatolik yuz berdi!';
      setError(Array.isArray(errMsg) ? errMsg[0] : errMsg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden space-y-4 p-6 relative">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-text-main text-lg cursor-pointer">&times;</button>
        
        <h2 className="text-base font-black uppercase tracking-wider text-text-main">
          {mode === 'create' ? 'Yangi menejer qo‘shish' : 'Menejer ma’lumotlarini tahrirlash'}
        </h2>

        {error && (
          <div className="p-3 rounded-xl text-xs font-semibold bg-red-500/10 text-red-500 border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase">Ism *</label>
              <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full mt-1 px-3 py-2 text-xs rounded-lg border border-border bg-background text-text-main focus:outline-none focus:border-primary"/>
            </div>
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase">Familiya *</label>
              <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} className="w-full mt-1 px-3 py-2 text-xs rounded-lg border border-border bg-background text-text-main focus:outline-none focus:border-primary"/>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-text-muted uppercase">Telefon raqami *</label>
            <input type="text" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full mt-1 px-3 py-2 text-xs rounded-lg border border-border bg-background text-text-main focus:outline-none focus:border-primary"/>
          </div>

          <div>
            <label className="text-[10px] font-bold text-text-muted uppercase">
              {mode === 'create' ? 'Tizim paroli *' : 'Yangi parol (o‘zgartirmaslik uchun bo‘sh qoldiring)'}
            </label>
            <input type="password" required={mode === 'create'} value={password} onChange={e => setPassword(e.target.value)} className="w-full mt-1 px-3 py-2 text-xs rounded-lg border border-border bg-background text-text-main focus:outline-none focus:border-primary"/>
          </div>

          <div>
            <label className="text-[10px] font-bold text-text-muted uppercase">
              {mode === 'create' ? 'Oylik maoshi (UZS) *' : 'Oylik maoshi (o‘zgartirmaslik uchun bo‘sh qoldiring)'}
            </label>
            <input type="number" required={mode === 'create'} value={monthlySalary} onChange={e => setMonthlySalary(e.target.value)} className="w-full mt-1 px-3 py-2 text-xs rounded-lg border border-border bg-background text-text-main focus:outline-none focus:border-primary"/>
          </div>

          <div>
            <label className="text-[10px] font-bold text-text-muted uppercase">Profil rasm URL</label>
            <input type="url" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} className="w-full mt-1 px-3 py-2 text-xs rounded-lg border border-border bg-background text-text-main focus:outline-none focus:border-primary"/>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-background border border-border rounded-xl text-xs font-bold text-text-muted hover:bg-border/30 cursor-pointer">
              Bekor qilish
            </button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:opacity-90 shadow-md cursor-pointer">
              {mode === 'create' ? 'Saqlash' : 'Yangilash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};