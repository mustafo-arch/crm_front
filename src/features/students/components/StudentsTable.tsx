import React from 'react';
import { type StudentItem, type PaginationMeta } from '../api/StudentsApi';

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
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider">O‘quvchilar Ro‘yxati</h2>
        <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-background text-text-muted rounded-full border border-border">
          Jami: {meta?.total || 0} ta
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-background/50 text-text-muted font-bold uppercase border-b border-border">
            <tr>
              <th className="px-5 py-3">F.I.Sh</th>
              <th className="px-5 py-3">Telefon</th>
              <th className="px-5 py-3">O'qish boshlangan vaqt</th>
              <th className="px-5 py-3">Holati</th>
              <th className="px-5 py-3 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-10 font-medium text-text-muted">
                  Backenddan ma'lumotlar yuklanmoqda...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 font-medium text-text-muted">
                  O‘quvchilar topilmadi.
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr 
                  key={s.id} 
                  className={`hover:bg-background/40 transition-all ${!s.isActive ? 'opacity-60 bg-background/20' : ''}`}
                >
                  <td className="px-5 py-3.5 font-semibold text-text-main">{s.fullName}</td>
                  <td className="px-5 py-3.5 text-text-muted">{s.phone}</td>
                  <td className="px-5 py-3.5 text-text-main font-medium">
                    {s.startDate ? new Date(s.startDate).toLocaleDateString('uz-UZ') : 'Belgilanmagan'}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                      s.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {s.isActive ? 'Faol' : 'Muzlatilgan'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => onEdit(s)}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg border bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-all cursor-pointer"
                    >
                      Tahrirlash
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleStatus(s)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                        s.isActive 
                          ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20' 
                          : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20'
                      }`}
                    >
                      {s.isActive ? 'Muzlatish' : 'Aktivlashtirish'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATSIYA */}
      {meta && meta.pages > 1 && (
        <div className="p-4 border-t border-border flex items-center justify-between bg-background/30">
          <button
            disabled={page <= 1}
            onClick={() => onPageChange(Math.max(page - 1, 1))}
            className="px-3 py-1 text-xs rounded-lg border border-border text-text-muted hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Orqaga
          </button>
          <span className="text-xs font-semibold text-text-muted">
            {page} / {meta.pages}-sahifa
          </span>
          <button
            disabled={page >= meta.pages}
            onClick={() => onPageChange(Math.min(page + 1, meta.pages))}
            className="px-3 py-1 text-xs rounded-lg border border-border text-text-muted hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Oldinga
          </button>
        </div>
      )}
    </div>
  );
};