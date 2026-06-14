import React, { useState, useEffect } from 'react';
import { studentsApi, type StudentItem } from '../api/StudentsApi';

// Axios xatolik interfeysi
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

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError(null);
      if (mode === 'edit' && student) {
        // Agar backend fullName qaytarsa, uni ajratib olamiz
        const nameParts = student.fullName ? student.fullName.split(' ') : ['', ''];
        setFirstName(nameParts[0] || '');
        setLastName(nameParts[1] || '');
        setPhone(student.phone);
        setPassword(''); 
        setDateOfBirth(student.dateOfBirth ? student.dateOfBirth.split('T')[0] : '');
        setStartDate(student.startDate ? student.startDate.split('T')[0] : '');
      } else {
        setFirstName(''); setLastName(''); setPhone(''); setPassword(''); setDateOfBirth(''); setStartDate('');
      }
    }
  }, [isOpen, mode, student]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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
        // Mutlaqo toza chaqiruv - hech qanday 'any'larsiz!
        if ('update' in studentsApi && typeof studentsApi.update === 'function') {
          await studentsApi.update(student.id, payload);
        }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden space-y-4 p-6 relative">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-text-main text-lg cursor-pointer">&times;</button>
        
        <h2 className="text-base font-black uppercase tracking-wider text-text-main">
          {mode === 'create' ? 'Talaba Ro‘yxatdan O‘tkazish' : 'Talaba ma’lumotlarini tahrirlash'}
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
            <label className="text-[10px] font-bold text-text-muted uppercase">Telefon Raqam *</label>
            <input type="text" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full mt-1 px-3 py-2 text-xs rounded-lg border border-border bg-background text-text-main focus:outline-none focus:border-primary"/>
          </div>

          <div>
            <label className="text-[10px] font-bold text-text-muted uppercase">
              {mode === 'create' ? 'Tizim paroli *' : 'Yangi parol (o‘zgartirmaslik uchun bo‘sh qoldiring)'}
            </label>
            <input type="password" required={mode === 'create'} value={password} onChange={e => setPassword(e.target.value)} className="w-full mt-1 px-3 py-2 text-xs rounded-lg border border-border bg-background text-text-main focus:outline-none focus:border-primary"/>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase">Tug‘ilgan Sana</label>
              <input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-border bg-background text-text-main focus:outline-none"/>
            </div>
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase">Boshlash Sana</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-border bg-background text-text-main focus:outline-none"/>
            </div>
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