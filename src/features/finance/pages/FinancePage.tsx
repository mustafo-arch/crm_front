import { useEffect, useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { FinanceModal } from '../components/FinanceModal';
import { formatCurrency } from '../../../utils/currencyFormatter';

export const FinancePage = () => {
  const { 
    globalBalance, 
    debtors, 
    recentPayments, 
    isLoading, 
    fetchGlobalBalance, 
    fetchDebtors, 
    fetchRecentPayments 
  } = useFinanceStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sahifaga kirganda barcha moliyaviy ma'lumotlarni yuklash
  useEffect(() => {
    fetchGlobalBalance();
    fetchDebtors();
    fetchRecentPayments();
  }, [fetchGlobalBalance, fetchDebtors, fetchRecentPayments]);

  return (
    <div className="p-6 space-y-8 text-white min-h-screen bg-[#0b0d17]">
      
      {/* 🔝 TEPA QISM: SARLAVHA VA TUGMA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-wide uppercase">Moliya & Kassa</h1>
          <p className="text-xs text-slate-400 mt-1">
            Haqiqiy vaqtdagi balans, kirim-chiqimlar tarixi va qarzlar nazorati.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-black px-5 py-3 rounded-xl transition shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          💰 YANGI TOʻLOV QABUL QILISH
        </button>
      </div>

      {/* 📊 STATISTIKA VIDJETLARI PANELI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. Jami Hisoblangan Qarz */}
        <div className="bg-[#141625] p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Jami Hisoblangan</span>
          <div className="text-lg font-black mt-2 text-slate-200">
            {globalBalance ? formatCurrency(globalBalance.totalCharges) : '0 UZS'}
          </div>
        </div>

        {/* 2. Jami Kirim (Kassa) */}
        <div className="bg-[#141625] p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition">
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block">Kassa (Jami Kirim)</span>
          <div className="text-lg font-black text-emerald-400 mt-2">
            {globalBalance ? formatCurrency(globalBalance.totalIncome) : '0 UZS'}
          </div>
        </div>

        {/* 3. Jami Chiqim (Xarajatlar) */}
        <div className="bg-[#141625] p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition">
          <span className="text-[10px] font-black text-rose-400 uppercase tracking-wider block">Xarajatlar (Chiqim)</span>
          <div className="text-lg font-black text-rose-400 mt-2">
            {globalBalance ? formatCurrency(globalBalance.totalExpense) : '0 UZS'}
          </div>
        </div>

        {/* 4. Sof Qoldiq (Net Cash) */}
        <div className="bg-[#141625] p-5 rounded-2xl border border-indigo-500/20 hover:border-indigo-500/30 transition bg-gradient-to-br from-[#141625] to-[#1a1c3a]">
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-wider block">Sof Qoldiq (Kassada)</span>
          <div className="text-lg font-black text-indigo-400 mt-2">
            {globalBalance ? formatCurrency(globalBalance.netCash) : '0 UZS'}
          </div>
        </div>
      </div>

      {/* 🔄 YUKLANISH HOLATI (LOADING STATE) */}
      {isLoading && (
        <div className="text-center py-4 text-xs font-bold text-indigo-400 tracking-widest animate-pulse">
          MAʻLUMOTLAR YANGILANMOQDA...
        </div>
      )}

      {/* 📅 JADVALLAR BLOKI: QARZDORLAR VA KIRIMLAR TARIXI */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* CHAP TOMON: QARZDORLAR RO'YXATI */}
        <div className="bg-[#141625] rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl flex flex-col">
          <div className="p-4 bg-[#111321] border-b border-slate-800 flex justify-between items-center">
            <span className="text-xs font-black text-rose-400 uppercase tracking-wider">⚠️ QARZDORLIK ROʻYXATI</span>
            <span className="text-[10px] bg-rose-950/50 border border-rose-900/50 text-rose-400 px-2 py-0.5 rounded-md font-bold">
              Jami: {Array.isArray(debtors) ? debtors.length : 0} ta
            </span>
          </div>
          <div className="overflow-x-auto max-h-[400px] custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-black text-slate-400 bg-[#141625] uppercase sticky top-0 z-10">
                  <th className="p-3 bg-[#141625]">O'quvchi</th>
                  <th className="p-3 bg-[#141625]">Guruhlari</th>
                  <th className="p-3 bg-[#141625] text-right">Umumiy Qarz</th>
                </tr>
              </thead>
              <tbody>
                {!Array.isArray(debtors) || debtors.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-slate-500 font-bold">Qarzdor o'quvchilar mavjud emas</td>
                  </tr>
                ) : (
                  debtors.map(d => (
                    <tr key={d.studentId} className="border-b border-slate-800/40 hover:bg-slate-800/20 transition">
                      <td className="p-3">
                        <div className="font-bold text-white">{d.fullName}</div>
                        <div className="text-[10px] text-slate-500 font-medium">{d.phone}</div>
                      </td>
                      <td className="p-3 text-slate-400">
                        {Array.isArray(d.groups) ? d.groups.map(g => g.name).join(', ') : "-"}
                      </td>
                      <td className="p-3 text-right text-rose-400 font-black tracking-wide">
                        {formatCurrency(d.totalDebt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* O'NG TOMON: REAL VAQTDAGI KIRIMLAR TARIXI (AUDIT LOG) */}
        <div className="bg-[#141625] rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl flex flex-col">
          <div className="p-4 bg-[#111321] border-b border-slate-800 flex justify-between items-center">
            <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">📜 REAL VAQTDAGI KIRIMLAR TARIXI</span>
            <span className="text-[10px] bg-emerald-950/50 border border-emerald-900/50 text-emerald-400 px-2 py-0.5 rounded-md font-bold">
              Kassa Logi
            </span>
          </div>
          <div className="overflow-x-auto max-h-[400px] custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-black text-slate-400 bg-[#141625] uppercase sticky top-0 z-10">
                  <th className="p-3 bg-[#141625]">O'quvchi / Guruh</th>
                  <th className="p-3 bg-[#141625]">To'lov vaqti</th>
                  <th className="p-3 bg-[#141625]">Kim qabul qildi</th>
                  <th className="p-3 bg-[#141625] text-right">Summa</th>
                </tr>
              </thead>
              <tbody>
                {!Array.isArray(recentPayments) || recentPayments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500 font-bold">Kassaga hali hech qanday to'lov kirim qilinmagan</td>
                  </tr>
                ) : (
                  recentPayments.map(p => (
                    <tr key={p.id} className="border-b border-slate-800/40 hover:bg-slate-800/20 transition">
                      <td className="p-3">
                        <div className="font-bold text-white">{p.studentName}</div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          {p.groupName} • <span className="text-[9px] text-indigo-400 uppercase font-black">{p.method}</span>
                        </div>
                      </td>
                      <td className="p-3 text-slate-400 font-medium">
                        {p.paidAt ? new Date(p.paidAt).toLocaleString('uz-UZ', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        }) : "-"}
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 bg-indigo-950 text-indigo-400 border border-indigo-900/50 px-2 py-0.5 rounded text-[10px] font-bold">
                          👤 {p.recordedBy || 'Tizim'}
                        </span>
                      </td>
                      <td className="p-3 text-right text-emerald-400 font-black tracking-wide">
                        +{formatCurrency(p.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* 🎴 TO'LOV QABUL QILISH MODAL OYNASI */}
      {isModalOpen && (
        <FinanceModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};