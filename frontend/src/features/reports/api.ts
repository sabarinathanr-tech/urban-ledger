import apiClient from '@/lib/axios';

export interface ProfitLossData {
  period: string;
  revenue: {
    items: Array<{ name: string; amount: number }>;
    total: number;
  };
  cogs: {
    items: Array<{ name: string; amount: number }>;
    total: number;
  };
  grossProfit: number;
  operatingExpenses: {
    items: Array<{ name: string; amount: number }>;
    total: number;
  };
  netProfit: number;
}

export interface BalanceSheetData {
  asOfDate: string;
  assets: {
    items: Array<{ name: string; amount: number }>;
    total: number;
  };
  liabilities: {
    items: Array<{ name: string; amount: number }>;
    total: number;
  };
  equity: {
    items: Array<{ name: string; amount: number }>;
    currentYearProfit: number;
    total: number;
  };
  totalLiabilitiesAndEquity: number;
  isBalanced: boolean;
}

export async function fetchProfitLoss() {
  const res = await apiClient.get<{ success: boolean; data: ProfitLossData }>('/reports/profit-loss');
  return res.data.data;
}

export async function fetchBalanceSheet() {
  const res = await apiClient.get<{ success: boolean; data: BalanceSheetData }>('/reports/balance-sheet');
  return res.data.data;
}
