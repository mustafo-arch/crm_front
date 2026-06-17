import { create } from 'zustand';
import { apiClient } from '../../../api/apiClient';

// ============================================================================
// STRICT TYPES (TIPLAR) - HECH QANDAY 'ANY' ISHLATILMAGAN
// ============================================================================
export type PaymentMethod = 'CASH' | 'CARD' | 'BANK';

export interface GroupItem {
  id: string;
  name: string;
}

export interface GroupStudent {
  id: string;
  fullName: string;
}

export interface CreatePaymentPayload {
  studentId: string;
  groupId?: string;
  amount: number;
  method: PaymentMethod;
  comment?: string;
}

export interface GlobalBalance {
  totalCharges: number;
  totalIncome: number;
  totalExpense: number;
  netCash: number;
  totalDebt: number;
  totalDebtRounded: number;
}

export interface DebtorItem {
  studentId: string;
  fullName: string;
  phone: string;
  totalDebt: number;
  groups: Array<{ name: string; debt: number }>;
}

export interface RecentPayment {
  id: string;
  amount: number;
  method: PaymentMethod;
  paidAt: string;
  comment?: string;
  studentName: string;
  groupName: string;
  recordedBy: string;
}

interface FinanceState {
  globalBalance: GlobalBalance | null;
  debtors: DebtorItem[];
  recentPayments: RecentPayment[];
  groups: GroupItem[];
  groupStudents: GroupStudent[];
  isLoading: boolean;
  error: string | null;

  fetchGlobalBalance: () => Promise<void>;
  fetchDebtors: (minDebt?: number) => Promise<void>;
  fetchRecentPayments: () => Promise<void>;
  fetchGroups: () => Promise<void>;
  fetchStudentsByGroup: (groupId: string) => Promise<void>;
  createPayment: (payload: CreatePaymentPayload) => Promise<boolean>;
}

// ============================================================================
// CONSOLIDATED ZUSTAND STORE (QO'SHALOQ QAVS BILAN TO'G'RILANDI)
// ============================================================================
export const useFinanceStore = create<FinanceState>()((set, get) => ({
  globalBalance: null,
  debtors: [],
  recentPayments: [],
  groups: [],
  groupStudents: [],
  isLoading: false,
  error: null,

  // GET /finance/balance
  fetchGlobalBalance: async () => {
    try {
      const res = await apiClient.get<GlobalBalance>('/finance/balance');
      set({ globalBalance: res.data, error: null });
    } catch {
      set({ error: 'Balans maʼlumotlarini yuklashda xatolik.' });
    }
  },

  // GET /finance/debtors
  fetchDebtors: async (minDebt = 0) => {
    set({ isLoading: true });
    try {
      const res = await apiClient.get<DebtorItem[]>('/finance/debtors', { params: { minDebt } });
      set({ debtors: Array.isArray(res.data) ? res.data : [], isLoading: false, error: null });
    } catch {
      set({ debtors: [], isLoading: false, error: 'Qarzdorlar roʻyxatini yuklashda xatolik.' });
    }
  },

  // GET /finance/overview
  fetchRecentPayments: async () => {
    try {
      const toStr = new Date().toISOString().split('T')[0];
      const fromStr = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const res = await apiClient.get<RecentPayment[]>('/finance/overview', { 
        params: { from: fromStr, to: toStr } 
      });
      set({ recentPayments: Array.isArray(res.data) ? res.data : [], error: null });
    } catch {
      set({ recentPayments: [], error: 'Toʻlovlar tarixini yuklashda xatolik.' });
    }
  },

  // GET /groups
  fetchGroups: async () => {
    try {
      const res = await apiClient.get<GroupItem[]>('/groups');
      set({ groups: Array.isArray(res.data) ? res.data : [], error: null });
    } catch {
      set({ groups: [], error: 'Guruhlarni yuklashda xatolik.' });
    }
  },

  // GET /groups/:groupId/students
  fetchStudentsByGroup: async (groupId: string) => {
    set({ isLoading: true, groupStudents: [] });
    try {
      const res = await apiClient.get<GroupStudent[]>(`/groups/${groupId}/students`);
      set({ groupStudents: Array.isArray(res.data) ? res.data : [], isLoading: false, error: null });
    } catch {
      set({ groupStudents: [], isLoading: false, error: 'Oʻquvchilar roʻyxatini yuklashda xatolik.' });
    }
  },

  // POST /finance/payments
  createPayment: async (payload) => {
    set({ isLoading: true });
    try {
      await apiClient.post('/finance/payments', payload);
      await get().fetchGlobalBalance();
      await get().fetchRecentPayments();
      return true;
    } catch {
      set({ error: 'Toʻlovni saqlashda xatolik yuz berdi.', isLoading: false });
      return false;
    }
  },
}));