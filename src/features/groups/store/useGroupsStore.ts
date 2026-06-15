import { create } from 'zustand';
import { 
  groupsApi, 
  type GroupItem, 
  type CreateGroupPayload, 
  type QueryGroupDto,
  type PaginatedGroups
} from '../api/GroupsApi';
import axios from 'axios';

interface BackendError {
  message: string | string[];
}

interface GroupsState {
  groups: GroupItem[];
  meta: PaginatedGroups['meta'];
  isLoading: boolean;
  error: string | null;
  filters: QueryGroupDto;
  setFilters: (filters: Partial<QueryGroupDto>) => void;
  fetchGroups: () => Promise<void>;
  createGroup: (payload: CreateGroupPayload) => Promise<void>;
  updateGroup: (id: string, payload: Partial<CreateGroupPayload> & { isActive?: boolean }) => Promise<void>;
  deleteGroup: (id: string, reason?: string) => Promise<void>;
  clearError: () => void;
}

export const useGroupsStore = create<GroupsState>((set, get) => ({
  groups: [],
  meta: { page: 1, limit: 10, total: 0, pages: 1 },
  isLoading: false,
  error: null,
  filters: { page: 1, limit: 10, search: '', isActive: true },

  setFilters: (newFilters) => {
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters };
      
      // Agar foydalanuvchi sahifani o'zgartirmagan bo'lsa (ya'ni input yoki select o'zgargan bo'lsa)
      // darslar sahifasini har doim 1-sahifaga qaytaramiz
      if (newFilters.page === undefined) {
        updatedFilters.page = 1;
      }
      
      return { filters: updatedFilters };
    });
  },

  clearError: () => set({ error: null }),

  fetchGroups: async () => {
    set({ isLoading: true, error: null });
    try {
      const currentFilters = get().filters;
      const data = await groupsApi.getAll(currentFilters);
      set({ groups: data.items, meta: data.meta });
    } catch (err) {
      // Xatolik bo'lsa eski ma'lumotlar adashtirmasligi uchun groups bo'shatiladi
      set({ 
        groups: [], 
        meta: { page: 1, limit: 10, total: 0, pages: 1 },
        error: 'Guruhlarni yuklashda xatolik yuz berdi. Ruxsat tekshirilmoqda...' 
      });
      console.error('Fetch Groups Error:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  createGroup: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await groupsApi.create(payload);
      await get().fetchGroups();
    } catch (err) {
      if (axios.isAxiosError<BackendError>(err)) {
        const msg = err.response?.data?.message || 'Guruh yaratib boʻlmadi.';
        set({ error: Array.isArray(msg) ? msg[0] : msg });
      } else {
        set({ error: 'Kutilmagan xatolik yuz berdi.' });
      }
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateGroup: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      await groupsApi.update(id, payload);
      await get().fetchGroups();
    } catch (err) {
      if (axios.isAxiosError<BackendError>(err)) {
        const msg = err.response?.data?.message || 'Guruhni yangilab boʻlmadi.';
        set({ error: Array.isArray(msg) ? msg[0] : msg });
      } else {
        set({ error: 'Kutilmagan xatolik yuz berdi.' });
      }
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteGroup: async (id, reason) => {
    set({ isLoading: true, error: null });
    try {
      await groupsApi.softDelete(id, reason);
      await get().fetchGroups();
    } catch (err) {
      set({ error: 'Guruhni arxivlashda xatolik yuz berdi.' });
      console.error('Delete Group Error:', err);
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
}));