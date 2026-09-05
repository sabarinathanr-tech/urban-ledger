import apiClient from '@/lib/axios';

export interface BudgetData {
  id: string;
  name: string;
  analyticAccount: string;
  plannedAmount: number;
  actualAmount: number;
  remainingAmount: number;
  utilization: number;
  status: 'HEALTHY' | 'WARNING' | 'EXCEEDED';
  startDate: string;
  endDate: string;
  responsibleUser: string;
}

export async function fetchBudgets() {
  const res = await apiClient.get<{ success: boolean; data: BudgetData[] }>('/budgets');
  return res.data.data;
}

export async function createBudget(data: {
  name: string;
  analyticAccount: string;
  plannedAmount: number;
  startDate: string;
  endDate: string;
  responsibleUser?: string;
}) {
  const res = await apiClient.post<{ success: boolean; data: BudgetData }>('/budgets', data);
  return res.data.data;
}
