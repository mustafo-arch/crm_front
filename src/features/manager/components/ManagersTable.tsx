import React from 'react';
import { type ManagerListItem } from '../api/ManagerApi';

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
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider">Menejerlar ro‘yxati</h2>
        <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-background text-text-muted rounded-full border border-border">
          Jami: {managers.length} ta
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-background/50 text-text-muted font-bold uppercase border-b border-border">
            <tr>
              <th className="px-5 py-3">Menejer F.I.Sh</th>
              <th className="px-5 py-3">Telefon raqam</th>
              <th className="px-5 py-3">Ro‘yxatdan o‘tgan sana</th>
              <th className="px-5 py-3 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="text-center py-10 font-medium text-text-muted">Yuklanmoqda...</td>
              </tr>
            ) : managers.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10 font-medium text-text-muted">Tizimda menejerlar topilmadi.</td>
              </tr>
            ) : (
              managers.map((m) => {
                const fullName = `${m.firstName} ${m.lastName}`;
                return (
                  <tr key={m.id} className="hover:bg-background/40 transition-all">
                    <td className="px-5 py-3.5 font-semibold text-text-main">{fullName}</td>
                    <td className="px-5 py-3.5 text-text-muted">{m.phone}</td>
                    <td className="px-5 py-3.5 text-text-muted">
                      {new Date(m.createdAt).toLocaleDateString('uz-UZ')}
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => onEdit(m)}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg border bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-all cursor-pointer"
                      >
                        Tahrirlash
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(m.id, fullName)}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg border bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20 transition-all cursor-pointer"
                      >
                        O‘chirish
                      </button>
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