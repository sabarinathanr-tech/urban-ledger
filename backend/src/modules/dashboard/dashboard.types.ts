import type { TransactionType } from '../../config/constants.js';

export interface MetricCardData {
  id: string;
  label: string;
  amount: number;
  icon: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
    label: string;
  };
  href?: string;
}

export interface FinancialAlertData {
  id: string;
  severity: 'info' | 'warning' | 'danger';
  message: string;
  actionLabel?: string;
  actionHref?: string;
}

export interface DashboardSummary {
  revenue: number;
  expenses: number;
  netProfit: number;
  cashAndBank: number;
  receivables: number;
  payables: number;
  confirmedSalesCount?: number;
  confirmedSalesTotal?: number;
  unpaidInvoicesCount?: number;
  unpaidBillsCount?: number;
  metrics?: MetricCardData[];
  revenueExpenseTrend?: Array<{ month: string; revenue: number; expenses: number }>;
  budgetHealth?: Array<{
    id: string;
    name: string;
    planned: number;
    actual: number;
    remaining: number;
    utilization: number;
    status: 'on-track' | 'warning' | 'over-budget';
  }>;
  receivablesSummary?: {
    totalOutstanding: number;
    overdueAmount: number;
    openInvoices: number;
    topOverdueCustomer?: string;
  };
  payablesSummary?: {
    totalOutstanding: number;
    overdueAmount: number;
    openBills: number;
  };
  accountingHealthChecks?: Array<{
    id: string;
    label: string;
    description: string;
    status: 'healthy' | 'warning' | 'error';
  }>;
  recentTransactions?: RecentTransaction[];
  alerts?: FinancialAlertData[];
  period?: {
    label: string;
    startDate: string;
    endDate: string;
  };
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
