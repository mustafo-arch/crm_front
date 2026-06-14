import React from 'react';
import { type TeacherItem, type PaginationMeta } from '../api/TeachersApi';

interface TeachersTableProps {
  teachers: TeacherItem[];
  isLoading: boolean;
  meta: PaginationMeta | null;
  page: number;
  onPageChange: (newPage: number) => void;
  onEdit: (teacher: TeacherItem) => void;
  onToggleStatus: (teacher: TeacherItem) => void;
}

export const TeachersTable: React.FC<TeachersTableProps> = ({
  teachers,
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
        <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider">Ro‘yxat</h2>
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
              <th className="px-5 py-3">To‘lov shakli</th>
              <th className="px-5 py-3">Holati</th>
              <th className="px-5 py-3 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-10 font-medium text-text-muted">
                  Yuklanmoqda...
                </td>
              </tr>
            ) : teachers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 font-medium text-text-muted">
                  Ustozlar topilmadi.
                </td>
              </tr>
            ) : (
              teachers.map((t) => (
                <tr 
                  key={t.id} 
                  className={`hover:bg-background/40 transition-all ${!t.isActive ? 'opacity-60 bg-background/20' : ''}`}
                >
                  <td className="px-5 py-3.5 font-semibold text-text-main">{t.fullName}</td>
                  <td className="px-5 py-3.5 text-text-muted">{t.phone}</td>
                  <td className="px-5 py-3.5">
                    {t.monthlySalary ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded">
                        Maosh: {Number(t.monthlySalary).toLocaleString()} UZS
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded">
                        Ulush: {t.percentShare}%
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                      t.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {t.isActive ? 'Faol' : 'Bloklangan'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => onEdit(t)}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg border bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-all cursor-pointer"
                    >
                      Tahrirlash
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleStatus(t)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                        t.isActive 
                          ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20' 
                          : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20'
                      }`}
                    >
                      {t.isActive ? 'Bloklash' : 'Aktivlashtirish'}
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