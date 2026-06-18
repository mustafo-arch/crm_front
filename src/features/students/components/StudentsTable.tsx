import React from 'react';
import { type StudentItem, type PaginationMeta } from '../api/StudentsApi';
import { Users, Phone, Calendar, Edit3, Snowflake, CheckCircle } from 'lucide-react';

interface StudentsTableProps {
  students: StudentItem[];
  isLoading: boolean;
  meta: PaginationMeta | null;
  page: number;
  onPageChange: (newPage: number) => void;
  onEdit: (student: StudentItem) => void;
  onToggleStatus: (student: StudentItem) => void;
}

export const StudentsTable: React.FC<StudentsTableProps> = ({
  students,
  isLoading,
  meta,
  page,
  onPageChange,
  onEdit,
  onToggleStatus,
}) => {
  return (
    <div className="bg-[color-mix(in_srgb,var(--card)_65%,transparent)] backdrop-blur-xl border border-[color-mix(in_srgb,var(--border)_35%,transparent)] rounded-3xl shadow-xl overflow-hidden shadow-black/5">
      
      {/* Jadval Tepasi */}
      <div className="p-5 border-b border-[color-mix(in_srgb,var(--border)_30%,transparent)] flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-primary animate-pulse" />
          <h2 className="text-xs font-black text-text-main uppercase tracking-widest">O‘quvchilar Ro‘yxati</h2>
        </div>
        <span className="px-3 py-1 text-[10px] font-black bg-[color-mix(in_srgb,var(--background)_80%,transparent)] text-primary rounded-full border border-primary/20 shadow-inner">
          Jami: {meta?.total || 0} ta
        </span>
      </div>

      {/* Asosiy Jadval */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[color-mix(in_srgb,var(--background)_40%,transparent)] text-text-muted font-black uppercase tracking-wider text-[10px] border-b border-[color-mix(in_srgb,var(--border)_30%,transparent)]">
              <th className="px-6 py-4">F.I.Sh</th>
              <th className="px-6 py-4">Telefon</th>
              <th className="px-6 py-4">O'qish boshlangan vaqt</th>
              <th className="px-6 py-4">Holati</th>
              <th className="px-6 py-4 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color-mix(in_srgb,var(--border)_20%,transparent)]">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-14 font-bold text-text-muted tracking-wide animate-pulse">
                  Ma'lumotlar yuklanmoqda...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-14 font-bold text-text-muted tracking-wide">
                  O‘quvchilar topilmadi.
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr 
                  key={s.id} 
                  className={`hover:bg-[color-mix(in_srgb,var(--primary)_4%,transparent)] transition-all duration-200 group ${!s.isActive ? 'opacity-50 bg-background/10' : ''}`}
                >
                  <td className="px-6 py-4 font-bold text-text-main group-hover:text-primary transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-black text-primary capitalize">
                        {s.fullName?.split(' ')[0]?.[0] || 'S'}
                        {s.fullName?.split(' ')[1]?.[0] || ''}
                      </div>
                      <span>{s.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-muted font-medium">
                    <div className="flex items-center gap-1.5">
                      <Phone size={12} className="text-text-muted/50" />
                      <span>{s.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-main font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-text-muted/50" />
                      <span>{s.startDate ? new Date(s.startDate).toLocaleDateString('uz-UZ') : 'Belgilanmagan'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-black rounded-full border ${
                      s.isActive 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {s.isActive ? 'Faol' : 'Muzlatilgan'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(s)}
                        className="px-3 py-1.5 text-[11px] font-black rounded-xl border bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Edit3 size={12} />
                        <span>Tahrirlash</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleStatus(s)}
                        className={`px-3 py-1.5 text-[11px] font-black rounded-xl border hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5 ${
                          s.isActive 
                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                        }`}
                      >
                        {s.isActive ? <Snowflake size={12} /> : <CheckCircle size={12} />}
                        <span>{s.isActive ? 'Muzlatish' : 'Aktiv qilish'}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginatsiya */}
      {meta && meta.pages > 1 && (
        <div className="p-4 border-t border-[color-mix(in_srgb,var(--border)_30%,transparent)] flex items-center justify-between bg-[color-mix(in_srgb,var(--background)_40%,transparent)]">
          <button
            disabled={page <= 1}
            onClick={() => onPageChange(Math.max(page - 1, 1))}
            className="px-4 py-1.5 text-[11px] font-black rounded-xl border border border-[color-mix(in_srgb,var(--border)_60%,transparent)] bg-transparent text-text-muted hover:bg-border/10 hover:text-text-main disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
          >
            Orqaga
          </button>
          <span className="text-xs font-black text-text-muted">
            {page} / {meta.pages}-sahifa
          </span>
          <button
            disabled={page >= meta.pages}
            onClick={() => onPageChange(Math.min(page + 1, meta.pages))}
            className="px-4 py-1.5 text-[11px] font-black rounded-xl border border border-[color-mix(in_srgb,var(--border)_60%,transparent)] bg-transparent text-text-muted hover:bg-border/10 hover:text-text-main disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
          >
            Oldinga
          </button>
        </div>
      )}
    </div>
  );
};