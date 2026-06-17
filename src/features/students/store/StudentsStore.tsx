// src/features/students/store/useStudentStore.ts
import { create } from 'zustand';
import axios from 'axios';
import { studentsApi, type GetStudentsParams, type StudentItem, type StudentPayload } from '../api/StudentsApi';

interface StudentState {
  students: StudentItem[];
  isLoading: boolean;
  error: string | null;
  // Metodlar
  fetchStudents: (params: GetStudentsParams) => Promise<void>;
  createStudent: (payload: StudentPayload) => Promise<boolean>;
  updateStudent: (id: string, payload: Partial<StudentPayload>) => Promise<boolean>;
  deleteStudent: (id: string) => Promise<boolean>;
}

export const useStudentStore = create<StudentState>((set) => ({
  students: [],
  isLoading: false,
  error: null,

  fetchStudents: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const data = await studentsApi.getAll(params);
      set({ students: data.items, isLoading: false });
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? (err.response?.data?.message?.toString() || 'Talabalarni yuklashda xatolik')
        : 'Kutilmagan xatolik';
      set({ error: errorMessage, isLoading: false });
    }
  },

  createStudent: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await studentsApi.create(payload);
      set({ isLoading: false });
      return true;
    } catch (err) {
      set({ error: 'Talaba qo‘shishda xatolik', isLoading: false });
      return false;
    }
  },

  updateStudent: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      await studentsApi.update(id, payload);
      set({ isLoading: false });
      return true;
    } catch (err) {
      set({ error: 'Talaba ma‘lumotlarini yangilashda xatolik', isLoading: false });
      return false;
    }
  },

  deleteStudent: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await studentsApi.delete(id);
      set({ isLoading: false });
      return true;
    } catch (err) {
      set({ error: 'Talabani o‘chirishda xatolik', isLoading: false });
      return false;
    }
  },
}));