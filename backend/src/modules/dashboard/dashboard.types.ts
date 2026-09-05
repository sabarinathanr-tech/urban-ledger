import type { TransactionType } from '../../config/constants.js';

export interface DashboardSummary {
  revenue: number;
  expenses: number;
  netProfit: number;
  cashAndBank: number;
  receivables: number;
  payables: number;
}

export interface RevenueExpenseItem {
  period: string;
  revenue: number;
  expenses: number;
}

export interface BudgetHealth {
  budgetName: string;
  plannedAmount: number;
  actualAmount: number;
  remainingAmount: number;
  utilizationPercent: number;
  status: 'HEALTHY' | 'WARNING' | 'EXCEEDED';
}

export interface ReceivablesSummary {
  outstanding: number;
  overdue: number;
  openInvoices: number;
}

export interface PayablesSummary {
  outstanding: number;
  overdue: number;
  openBills: number;
}

export interface AccountingHealth {
  booksBalanced: boolean;
  confirmedInvoicesAccounted: boolean;
  postedEntriesValid: boolean;
  overdueReceivables: number;
  budgetWarning: boolean;
  unreconciledPayments: number;
}

export interface RecentTransaction {
  id: string;
  reference: string;
  type: TransactionType;
  party: string;
  date: string;
  amount: number;
  status: string;
}
