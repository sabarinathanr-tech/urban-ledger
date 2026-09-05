import type {
  DashboardData,
  MetricCardData,
  RevenueExpenseDataPoint,
  BudgetHealthItem,
  ReceivablesSummary,
  PayablesSummary,
  AccountingHealthCheck,
  RecentTransaction,
  ReportCardData,
  QuickAction,
  FinancialAlertData,
  DashboardPeriod,
} from './types';
import { MOCK_DASHBOARD_DATA } from './data/dashboard.mock';

/**
 * Simulates an API delay for development.
 * Remove this when connecting to real backend.
 */
function simulateDelay<T>(data: T, ms = 600): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

/**
 * Dashboard API boundary.
 *
 * Each function currently returns mock data.
 * Mohith can replace the implementations with real API calls:
 *   import { apiClient } from '@/lib/axios';
 *   return apiClient.get('/api/dashboard/summary').then(r => r.data);
 */

export async function getDashboardSummary(): Promise<DashboardData> {
  return simulateDelay(MOCK_DASHBOARD_DATA);
}

export async function getDashboardMetrics(): Promise<MetricCardData[]> {
  return simulateDelay(MOCK_DASHBOARD_DATA.metrics);
}

export async function getRevenueExpenseTrend(): Promise<RevenueExpenseDataPoint[]> {
  return simulateDelay(MOCK_DASHBOARD_DATA.revenueExpenseTrend);
}

export async function getBudgetHealth(): Promise<BudgetHealthItem[]> {
  return simulateDelay(MOCK_DASHBOARD_DATA.budgetHealth);
}

export async function getReceivablesSummary(): Promise<ReceivablesSummary> {
  return simulateDelay(MOCK_DASHBOARD_DATA.receivables);
}

export async function getPayablesSummary(): Promise<PayablesSummary> {
  return simulateDelay(MOCK_DASHBOARD_DATA.payables);
}

export async function getAccountingHealth(): Promise<AccountingHealthCheck[]> {
  return simulateDelay(MOCK_DASHBOARD_DATA.accountingHealth);
}

export async function getRecentTransactions(): Promise<RecentTransaction[]> {
  return simulateDelay(MOCK_DASHBOARD_DATA.recentTransactions);
}

export async function getReportCards(): Promise<ReportCardData[]> {
  return simulateDelay(MOCK_DASHBOARD_DATA.reports);
}

export async function getQuickActions(): Promise<QuickAction[]> {
  return simulateDelay(MOCK_DASHBOARD_DATA.quickActions);
}

export async function getFinancialAlerts(): Promise<FinancialAlertData[]> {
  return simulateDelay(MOCK_DASHBOARD_DATA.alerts);
}

export async function getDashboardPeriod(): Promise<DashboardPeriod> {
  return simulateDelay(MOCK_DASHBOARD_DATA.period);
}
