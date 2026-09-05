/** Roles that can access the internal dashboard */
export type DashboardRole = 'admin' | 'accountant';

/** Time period for dashboard data */
export interface DashboardPeriod {
  label: string;
  startDate: string;
  endDate: string;
}

/** Trend direction for KPI comparisons */
export type TrendDirection = 'up' | 'down' | 'neutral';

/** KPI metric card data */
export interface MetricCardData {
  id: string;
  label: string;
  amount: number;
  icon: string;
  trend?: {
    direction: TrendDirection;
    value: string;
    label: string;
  };
  href?: string;
}

/** Revenue vs Expense chart data point */
export interface RevenueExpenseDataPoint {
  month: string;
  revenue: number;
  expenses: number;
}

/** Chart period options */
export type ChartPeriod = 'monthly' | 'quarterly' | 'yearly';

/** Budget health status */
export type BudgetStatus = 'on-track' | 'warning' | 'over-budget';

/** Budget health item */
export interface BudgetHealthItem {
  id: string;
  name: string;
  planned: number;
  actual: number;
  remaining: number;
  utilization: number;
  status: BudgetStatus;
}

/** Receivables summary */
export interface ReceivablesSummary {
  totalOutstanding: number;
  overdueAmount: number;
  openInvoices: number;
  topOverdueCustomer?: string;
}

/** Payables summary */
export interface PayablesSummary {
  totalOutstanding: number;
  overdueAmount: number;
  openBills: number;
}

/** Accounting health check status */
export type HealthCheckStatus = 'healthy' | 'warning' | 'error';

/** Single accounting health check */
export interface AccountingHealthCheck {
  id: string;
  label: string;
  description: string;
  status: HealthCheckStatus;
}

/** Transaction types */
export type TransactionType =
  | 'Customer Invoice'
  | 'Vendor Bill'
  | 'Payment'
  | 'Journal Entry'
  | 'Sales Order'
  | 'Purchase Order';

/** Transaction status */
export type TransactionStatus = 'Draft' | 'Posted' | 'Paid' | 'Completed' | 'Cancelled' | 'Overdue';

/** Recent transaction */
export interface RecentTransaction {
  id: string;
  reference: string;
  type: TransactionType;
  party: string;
  date: string;
  amount: number;
  status: TransactionStatus;
}

/** Quick action */
export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  href: string;
}

/** Report card */
export interface ReportCardData {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
}

/** Financial alert */
export interface FinancialAlertData {
  id: string;
  severity: 'info' | 'warning' | 'danger';
  message: string;
  actionLabel?: string;
  actionHref?: string;
}

/** Complete dashboard data */
export interface DashboardData {
  metrics: MetricCardData[];
  revenueExpenseTrend: RevenueExpenseDataPoint[];
  budgetHealth: BudgetHealthItem[];
  receivables: ReceivablesSummary;
  payables: PayablesSummary;
  accountingHealth: AccountingHealthCheck[];
  recentTransactions: RecentTransaction[];
  quickActions: QuickAction[];
  reports: ReportCardData[];
  alerts: FinancialAlertData[];
  lastUpdated: string;
  period: DashboardPeriod;
}
