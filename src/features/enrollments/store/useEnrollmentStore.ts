import { create } from 'zustand';
import { 
  enrollmentApi, 
  type CreateEnrollmentPayload, 
  type EnrollmentItem, 
  type GetEnrollmentsParams,
  type EnrollmentPaginationMeta
} from '../api/enrollmentApi';

interface EnrollmentState {
  enrollments: EnrollmentItem[];
  meta: EnrollmentPaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  filters: GetEnrollmentsParams;
  setFilters: (filters: Partial<GetEnrollmentsParams>) => void;
  fetchEnrollments: () => Promise<void>;
  createEnrollment: (payload: CreateEnrollmentPayload) => Promise<boolean>;
  updateEnrollment: (id: string, payload: { status: 'ACTIVE' | 'PAUSED' | 'LEFT' }) => Promise<boolean>;
}

export const useEnrollmentStore = create<EnrollmentState>((set, get) => ({
  enrollments: [],
  meta: null,
  isLoading: false,
  error: null,
  filters: { page: 1, limit: 10 }, // Boshlang'ich filtrlar

  setFilters: (newFilters) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters } }));
  },

  fetchEnrollments: async () => {
    set({ isLoading: true, error: null });
    try {
      const currentFilters = get().filters;
      const data = await enrollmentApi.findAll(currentFilters);
      set({ enrollments: data.items, meta: data.meta, isLoading: false });
    } catch (err: unknown) {
      set({ error: 'Ro‘yxatni yuklashda xatolik', isLoading: false });
    }
  },

  createEnrollment: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await enrollmentApi.create(payload);
      await get().fetchEnrollments();
      return true;
    } catch (err: unknown) {
      set({ error: 'Qo‘shishda xatolik', isLoading: false });
      return false;
    }
  },

  updateEnrollment: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      await enrollmentApi.update(id, payload);
      await get().fetchEnrollments();
      return true;
    } catch (err: unknown) {
      set({ error: 'Tahrirlashda xatolik', isLoading: false });
      return false;
    }
  },
}));