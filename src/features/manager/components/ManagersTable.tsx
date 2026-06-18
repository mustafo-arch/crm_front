import React from 'react';
import { type ManagerListItem } from '../api/ManagerApi';
import { Edit3, Trash2, Calendar, Phone, ShieldUser } from 'lucide-react';

interface ManagersTableProps {
  managers: ManagerListItem[];
  isLoading: boolean;
  onEdit: (manager: ManagerListItem) => void;
  onDelete: (id: string, fullName: string) => void;
}

export const ManagersTable: React.FC<ManagersTableProps> = ({
  managers,
  isLoading,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-[color-mix(in_srgb,var(--card)_65%,transparent)] backdrop-blur-xl border border-[color-mix(in_srgb,var(--border)_35%,transparent)] rounded-3xl shadow-xl overflow-hidden shadow-black/5">
      
      {/* Jadval tepasi */}
      <div className="p-5 border-b border-[color-mix(in_srgb,var(--border)_30%,transparent)] flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center gap-2">
          <ShieldUser size={18} className="text-primary animate-pulse" />
          <h2 className="text-xs font-black text-text-main uppercase tracking-widest">Menejerlar ro‘yxati</h2>
        </div>
        <span className="px-3 py-1 text-[10px] font-black bg-[color-mix(in_srgb,var(--background)_80%,transparent)] text-primary rounded-full border border-primary/20 shadow-inner">
          Jami: {managers.length} ta
        </span>
      </div>

      {/* Jadval Tanasi */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[color-mix(in_srgb,var(--background)_40%,transparent)] text-text-muted font-black uppercase tracking-wider text-[10px] border-b border-[color-mix(in_srgb,var(--border)_30%,transparent)]">
              <th className="px-6 py-4">Menejer F.I.Sh</th>
              <th className="px-6 py-4">Telefon raqam</th>
              <th className="px-6 py-4">Ro‘yxatdan o‘tgan sana</th>
              <th className="px-6 py-4 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color-mix(in_srgb,var(--border)_20%,transparent)]">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="text-center py-14 font-bold text-text-muted tracking-wide animate-pulse">
                  Kiber-tizim yuklanmoqda...
                </td>
              </tr>
            ) : managers.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-14 font-bold text-text-muted tracking-wide">
                  Tizimda menejerlar topilmadi.
                </td>
              </tr>
            ) : (
              managers.map((m) => {
                const fullName = `${m.firstName} ${m.lastName}`;
                return (
                  <tr key={m.id} className="hover:bg-[color-mix(in_srgb,var(--primary)_4%,transparent)] transition-all duration-200 group">
                    <td className="px-6 py-4 font-bold text-text-main group-hover:text-primary transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-[11px] font-black text-primary capitalize">
                          {m.firstName[0]}{m.lastName[0]}
                        </div>
                        <span>{fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-muted font-medium">
                      <div className="flex items-center gap-1.5">
                        <Phone size={12} className="text-text-muted/50" />
                        <span>{m.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-muted font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-text-muted/50" />
                        <span>{new Date(m.createdAt).toLocaleDateString('uz-UZ')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(m)}
                          className="px-3 py-1.5 text-[11px] font-black rounded-xl border bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Edit3 size={12} />
                          <span>Tahrirlash</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(m.id, fullName)}
                          className="px-3 py-1.5 text-[11px] font-black rounded-xl border bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Trash2 size={12} />
                          <span>O‘chirish</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};