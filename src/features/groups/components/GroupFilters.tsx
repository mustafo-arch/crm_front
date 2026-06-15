import React from 'react';
import { useGroupsStore } from '../store/useGroupsStore';
import { type QueryGroupDto } from '../api/GroupsApi';
import { useRoomsStore } from '../../rooms/store/RoomsStore';

export const GroupFilters: React.FC = () => {
  const { filters, setFilters, fetchGroups } = useGroupsStore();
  const { rooms } = useRoomsStore();

  const handleChange = <K extends keyof QueryGroupDto>(field: K, value: QueryGroupDto[K]) => {
    setFilters({ [field]: value });
    // State to'liq yangilanishi uchun ozgina kechikish bilan chaqiramiz
    setTimeout(() => {
      fetchGroups();
    }, 10);
  };

  const handleActiveChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'all') {
      handleChange('isActive', undefined); // Hammasini chiqarish
    } else {
      handleChange('isActive', val === 'true'); // Haqiqiy boolean true yoki false yuboramiz
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-card p-4 rounded-2xl border border-border">
      {/* Qidiruv input */}
      <input
        type="text"
        placeholder="Guruh nomini qidirish..."
        value={filters.search || ''}
        onChange={(e) => handleChange('search', e.target.value || undefined)}
        className="px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-text-main"
      />

      {/* Kunlar tartibi */}
      <select
        value={filters.daysPattern || ''}
        onChange={(e) => handleChange('daysPattern', (e.target.value as 'ODD' | 'EVEN') || undefined)}
        className="px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-text-main"
      >
        <option value="">Kunlar tartibi (Barchasi)</option>
        <option value="ODD">Toq kunlar (ODD)</option>
        <option value="EVEN">Juft kunlar (EVEN)</option>
      </select>

      {/* Xonalar filtri */}
      <select
        value={filters.roomId || ''}
        onChange={(e) => handleChange('roomId', e.target.value || undefined)}
        className="px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-text-main"
      >
        <option value="">Xonalar (Barchasi)</option>
        {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
      </select>

      {/* Ishlamayotgan Faol/Arxiv filtri — Endi 100% to'g'ri boolean yuboradi */}
      <select
        value={filters.isActive === undefined ? 'all' : String(filters.isActive)}
        onChange={handleActiveChange}
        className="px-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-text-main font-bold"
      >
        <option value="all">Holati (Barchasi)</option>
        <option value="true">Faol guruhlar</option>
        <option value="false">Arxivlanganlar</option>
      </select>
    </div>
  );
};