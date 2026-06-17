import { apiClient } from '../../../api/apiClient';

// ============================================================================
// STRIKT TIPLAR (TYPES) - HECH QANDAY 'ANY' YO'Q
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

// ============================================================================
// MOLIYAVIY API SO'ROVLARI
// ============================================================================
export const financeApi = {
  // GET /finance/balance
  getGlobalBalance: () => 
    apiClient.get<GlobalBalance>('/finance/balance').then(res => res.data),

  // GET /finance/debtors
  getDebtors: (minDebt: number = 0) => 
    apiClient.get<DebtorItem[]>('/finance/debtors', { params: { minDebt } }).then(res => res.data),

  // GET /finance/overview (404 bergan recent o'rniga backenddagi overview manzili)
  getOverview: (from: string, to: string) => 
    apiClient.get<RecentPayment[]>('/finance/overview', { params: { from, to } }).then(res => res.data),

  // GET /groups (Modal oynadagi guruhlar dropdowni uchun)
  getGroups: () => 
    apiClient.get<GroupItem[]>('/groups').then(res => res.data),

  // GET /groups/:groupId/students (Guruh o'quvchilari uchun)
  getStudentsByGroup: (groupId: string) => 
    apiClient.get<GroupStudent[]>(`/groups/${groupId}/students`).then(res => res.data),

  // POST /finance/payments
  createPayment: (payload: CreatePaymentPayload) => 
    apiClient.post('/finance/payments', payload).then(res => res.data),
};