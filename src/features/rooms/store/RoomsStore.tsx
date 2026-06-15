import { create } from 'zustand';
import { roomsApi, type RoomItem, type RoomPayload } from '../api/RoomsApi';
import axios from 'axios';

interface BackendError {
  message: string | string[];
}

interface RoomsState {
  rooms: RoomItem[];
  isLoading: boolean;
  error: string | null;
  fetchRooms: () => Promise<void>;
  createRoom: (payload: RoomPayload) => Promise<void>;
  updateRoom: (id: string, payload: Partial<RoomPayload>) => Promise<void>;
  deleteRoom: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useRoomsStore = create<RoomsState>((set, get) => ({
  rooms: [],
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchRooms: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await roomsApi.getAll();
      set({ rooms: data });
    } catch (err) {
      set({ error: 'Xonalarni yuklashda xatolik yuz berdi.' });
      console.error(err);
    } finally {
      set({ isLoading: false });
    }
  },

  createRoom: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const newRoom = await roomsApi.create(payload);
      set({ rooms: [...get().rooms, newRoom] });
    } catch (err) {
      if (axios.isAxiosError<BackendError>(err)) {
        const msg = err.response?.data?.message || 'Xona qoʻshib boʻlmadi.';
        set({ error: Array.isArray(msg) ? msg[0] : msg });
      } else {
        set({ error: 'Kutilmagan xatolik yuz berdi.' });
      }
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateRoom: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await roomsApi.update(id, payload);
      set({
        rooms: get().rooms.map((room) => (room.id === id ? updated : room)),
      });
    } catch (err) {
      if (axios.isAxiosError<BackendError>(err)) {
        const msg = err.response?.data?.message || 'Xonani yangilab boʻlmadi.';
        set({ error: Array.isArray(msg) ? msg[0] : msg });
      } else {
        set({ error: 'Kutilmagan xatolik yuz berdi.' });
      }
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteRoom: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await roomsApi.delete(id);
      // Backend soft-delete qilgani uchun uni frontend ro'yxatidan ham olib tashlaymiz
      set({ rooms: get().rooms.filter((room) => room.id !== id) });
    } catch (err) {
      set({ error: 'Xonani oʻchirishda xatolik yuz berdi.' });
      console.error(err);
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
}));