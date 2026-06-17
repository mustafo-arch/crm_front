import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useFinanceStore, type PaymentMethod } from "../store/useFinanceStore";


interface FinanceModalProps {
  onClose: () => void;
}

export const FinanceModal = ({ onClose }: FinanceModalProps) => {
  const { 
    groups, 
    groupStudents, 
    isLoading, 
    fetchGroups, 
    fetchStudentsByGroup, 
    createPayment 
  } = useFinanceStore();

  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState<PaymentMethod>('CASH');
  const [comment, setComment] = useState<string>('');

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  useEffect(() => {
    if (selectedGroup) {
      fetchStudentsByGroup(selectedGroup);
    }
  }, [selectedGroup, fetchStudentsByGroup]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedStudent || !amount || Number(amount) <= 0) return;

    const success = await createPayment({
      studentId: selectedStudent,
      groupId: selectedGroup || undefined,
      amount: Number(amount),
      method,
      comment: comment.trim() || undefined,
    });

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#141625] border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold transition"
        >
          ✕
        </button>

        <h3 className="text-xs font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
          💰 YANGI TOʻLOV QABUL QILISH
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Guruhni Tanlang *</label>
            <select
              required
              value={selectedGroup}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setSelectedGroup(e.target.value);
                setSelectedStudent('');
              }}
              className="w-full bg-[#0b0d17] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">Guruhni tanlang</option>
              {Array.isArray(groups) && groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">O'quvchi *</label>
            <select
              required
              value={selectedStudent}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedStudent(e.target.value)}
              disabled={!selectedGroup || isLoading}
              className="w-full bg-[#0b0d17] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 disabled:opacity-40"
            >
              <option value="">
                {isLoading ? 'Oʻquvchilar yuklanmoqda...' : 'Oʻquvchini tanlang'}
              </option>
              {/* Array.isArray tekshiruvi .map xatoligini batamom oldini oladi */}
              {Array.isArray(groupStudents) && groupStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.fullName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">To'lov Summasi (UZS) *</label>
            <input
              required
              type="number"
              placeholder="Masalan: 500000"
              value={amount}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
              className="w-full bg-[#0b0d17] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">To'lov Usuli *</label>
            <div className="grid grid-cols-3 gap-2">
              {(['CASH', 'CARD', 'BANK'] as PaymentMethod[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`p-2.5 rounded-xl border text-[10px] font-black uppercase transition ${
                    method === m
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-[#0b0d17] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {m === 'CASH' ? 'Naqd' : m === 'CARD' ? 'Plastik' : 'Bank'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Izoh</label>
            <textarea
              placeholder="Qo'shimcha eslatmalar..."
              value={comment}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
              className="w-full bg-[#0b0d17] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 h-20 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold p-3 rounded-xl transition"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={isLoading || !selectedStudent || !amount}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black p-3 rounded-xl transition shadow-lg"
            >
              {isLoading ? 'Saqlanmoqda...' : 'Kirim Qilish'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};