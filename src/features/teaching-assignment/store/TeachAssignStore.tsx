// src/store/useTAStore.ts
import { create } from 'zustand';
import axios from 'axios';
import { 
  teachingAssignmentsApi, 
  type CreateTeachingAssignmentPayload, 
  type QueryTAParams, 
  type TeachingAssignmentItem 
} from '../api/Teach-assignApi';
import { teachersApi, type TeacherItem } from '../../teachers/api/TeachersApi';
import { groupsApi, type GroupItem } from '../../groups/api/GroupsApi';
      // Yo'lni tekshiring

// 1. Interfeyslar (API'dan kelgan turlar bilan birlashtirilgan)
export interface TAState {
  assignments: TeachingAssignmentItem[];
  isLoading: boolean;
  error: string | null;
  fetchAssignments: (params: QueryTAParams) => Promise<void>;
  assignTeacher: (payload: CreateTeachingAssignmentPayload) => Promise<boolean>;
  deleteAssignment: (id: string, reason?: string) => Promise<boolean>;
}

// 2. Store yaratish
export const useTAStore = create<TAState>((set) => ({
  assignments: [],
  isLoading: false,
  error: null,

  fetchAssignments: async (params) => {
    set({ isLoading: true, error: null });
    try {
      // Parallel yuklash (barcha resurslarni bir vaqtda so'raymiz)
      const [assignmentsRes, teachersRes, groupsRes] = await Promise.all([
        teachingAssignmentsApi.findAll(params),
        teachersApi.getAll({ page: 1, limit: 1000 }), // O'qituvchilarni olish
        groupsApi.getAll({ limit: 1000 })              // Guruhlarni olish
      ]);

      // Map (tezkor qidiruv uchun)
      const teachersMap = new Map<string, TeacherItem>(
        teachersRes.items.map((t) => [t.id, t])
      );
      const groupsMap = new Map<string, GroupItem>(
        groupsRes.items.map((g) => [g.id, g])
      );

      // Ma'lumotlarni birlashtirish (Enrichment)
      const enrichedAssignments = assignmentsRes.items.map((item) => ({
        ...item,
        teacher: teachersMap.get(item.teacherId),
        group: groupsMap.get(item.groupId)
      }));

      set({ assignments: enrichedAssignments, isLoading: false });
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? (err.response?.data?.message?.toString() || 'Yuklashda xatolik')
        : 'Kutilmagan xatolik yuz berdi';
      set({ error: errorMessage, isLoading: false });
    }
  },

  assignTeacher: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await teachingAssignmentsApi.create(payload);
      set({ isLoading: false });
      return true;
    } catch (err) {
      set({ error: 'Biriktirishda xatolik yuz berdi', isLoading: false });
      console.log(err);

      return false;
    }
  },

  deleteAssignment: async (id, reason) => {
    set({ isLoading: true, error: null });
    try {
      await teachingAssignmentsApi.remove(id, reason);
      set({ isLoading: false });
      return true;
    } catch (err) {
      set({ error: 'O‘chirishda xatolik yuz berdi', isLoading: false });
      console.log(err);
      
      return false;
    }
  },
}));