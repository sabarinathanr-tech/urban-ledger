import type { DashboardData } from '../types';

/**
 * Centralized mock data for the Urban Ledger dashboard.
 * All development/demo values are defined here.
 *
 * This mock layer will be replaced by API calls to:
 *   GET /api/dashboard/summary
 *   GET /api/dashboard/revenue-expense-trend
 *   GET /api/dashboard/budget-health
 *   GET /api/dashboard/receivables
 *   GET /api/dashboard/payables
 *   GET /api/dashboard/accounting-health
 *   GET /api/dashboard/recent-transactions
 */
export const MOCK_DASHBOARD_DATA: DashboardData = {
  period: {
    label: 'September 2026',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
  },

  lastUpdated: new Date().toISOString(),

  metrics: [
    {
      id: 'revenue',
      label: 'Revenue',
      amount: 840000,
      icon: 'TrendingUp',
      trend: { direction: 'up', value: '+12.5%', label: 'vs last month' },
      href: '/reports/profit-loss',
    },
    {
      id: 'expenses',
      label: 'Expenses',
      amount: 520000,
      icon: 'TrendingDown',
      trend: { direction: 'up', value: '+4.2%', label: 'vs last month' },
      href: '/reports/profit-loss',
    },
    {
      id: 'net-profit',
      label: 'Net Profit',
      amount: 320000,
      icon: 'DollarSign',
      trend: { direction: 'up', value: '+28.0%', label: 'vs last month' },
      href: '/reports/profit-loss',
    },
    {
      id: 'cash-bank',
      label: 'Cash & Bank',
      amount: 380000,
      icon: 'Landmark',
      href: '/accounting',
    },
    {
      id: 'receivables',
      label: 'Receivables',
      amount: 120000,
      icon: 'ArrowDownLeft',
      trend: { direction: 'down', value: '-8.3%', label: 'vs last month' },
      href: '/invoices',
    },
    {
      id: 'payables',
      label: 'Payables',
      amount: 90000,
      icon: 'ArrowUpRight',
      trend: { direction: 'down', value: '-5.1%', label: 'vs last month' },
      href: '/bills',
    },
  ],

  revenueExpenseTrend: [
    { month: 'Apr 2026', revenue: 620000, expenses: 430000 },
    { month: 'May 2026', revenue: 680000, expenses: 460000 },
    { month: 'Jun 2026', revenue: 710000, expenses: 480000 },
    { month: 'Jul 2026', revenue: 750000, expenses: 500000 },
    { month: 'Aug 2026', revenue: 790000, expenses: 510000 },
    { month: 'Sep 2026', revenue: 840000, expenses: 520000 },
  ],

  budgetHealth: [
    {
      id: 'budget-procurement',
      name: 'Furniture Procurement',
      planned: 500000,
      actual: 380000,
      remaining: 120000,
      utilization: 76,
      status: 'on-track',
    },
    {
      id: 'budget-marketing',
      name: 'Marketing & Advertising',
      planned: 150000,
      actual: 132000,
      remaining: 18000,
      utilization: 88,
      status: 'warning',
    },
    {
      id: 'budget-operations',
      name: 'Operations & Logistics',
      planned: 200000,
      actual: 145000,
      remaining: 55000,
      utilization: 72,
      status: 'on-track',
    },
  ],

  receivables: {
    totalOutstanding: 120000,
    overdueAmount: 35000,
    openInvoices: 6,
    topOverdueCustomer: 'Nimesh Pathak',
  },

  payables: {
    totalOutstanding: 90000,
    overdueAmount: 20000,
    openBills: 4,
  },

  accountingHealth: [
    { id: 'ah-1', label: 'Books balanced', description: 'All debits and credits are balanced', status: 'healthy' },
    { id: 'ah-2', label: 'Confirmed invoices accounted', description: 'All confirmed invoices have journal entries', status: 'healthy' },
    { id: 'ah-3', label: 'Posted entries valid', description: 'All posted journal entries have valid accounts', status: 'healthy' },
    { id: 'ah-4', label: '3 overdue receivables', description: 'Customer payments past due date', status: 'warning' },
    { id: 'ah-5', label: 'Budget nearing limit', description: 'Marketing budget at 88% utilization', status: 'warning' },
    { id: 'ah-6', label: 'Payments recorded', description: 'All bank payments have been recorded', status: 'healthy' },
  ],

  recentTransactions: [
    {
      id: 'txn-1',
      reference: 'INV/2026/0012',
      type: 'Customer Invoice',
      party: 'Nimesh Pathak',
      date: '2026-09-05',
      amount: 59000,
      status: 'Posted',
    },
    {
      id: 'txn-2',
      reference: 'BILL/2026/0007',
      type: 'Vendor Bill',
      party: 'Azure Furniture',
      date: '2026-09-05',
      amount: 42000,
      status: 'Paid',
    },
    {
      id: 'txn-3',
      reference: 'PAY/2026/0021',
      type: 'Payment',
      party: 'Nimesh Pathak',
      date: '2026-09-05',
      amount: 59000,
      status: 'Completed',
    },
    {
      id: 'txn-4',
      reference: 'INV/2026/0011',
      type: 'Customer Invoice',
      party: 'Priya Sharma',
      date: '2026-09-04',
      amount: 125000,
      status: 'Overdue',
    },
    {
      id: 'txn-5',
      reference: 'SO/2026/0015',
      type: 'Sales Order',
      party: 'Rajesh Kumar',
      date: '2026-09-04',
      amount: 78000,
      status: 'Draft',
    },
    {
      id: 'txn-6',
      reference: 'JE/2026/0033',
      type: 'Journal Entry',
      party: 'Urban Furniture',
      date: '2026-09-03',
      amount: 15000,
      status: 'Posted',
    },
    {
      id: 'txn-7',
      reference: 'PO/2026/0009',
      type: 'Purchase Order',
      party: 'WoodCraft Suppliers',
      date: '2026-09-03',
      amount: 92000,
      status: 'Draft',
    },
  ],

  quickActions: [
    { id: 'qa-1', label: 'New Sale', icon: 'ShoppingCart', href: '/sales/new' },
    { id: 'qa-2', label: 'New Purchase', icon: 'Package', href: '/purchases/new' },
    { id: 'qa-3', label: 'New Invoice', icon: 'FileText', href: '/invoices/new' },
    { id: 'qa-4', label: 'New Payment', icon: 'CreditCard', href: '/payments/new' },
    { id: 'qa-5', label: 'New Contact', icon: 'Users', href: '/contacts/new' },
    { id: 'qa-6', label: 'New Product', icon: 'Package', href: '/products/new' },
  ],

  reports: [
    {
      id: 'rpt-1',
      title: 'Profit & Loss',
      description: 'Review revenue, purchases, expenses and net profit.',
      icon: 'TrendingUp',
      href: '/reports/profit-loss',
    },
    {
      id: 'rpt-2',
      title: 'Balance Sheet',
      description: 'View assets, liabilities and equity position.',
      icon: 'Scale',
      href: '/reports/balance-sheet',
    },
    {
      id: 'rpt-3',
      title: 'Budget Report',
      description: 'Track budget utilization across departments.',
      icon: 'PieChart',
      href: '/reports/budget',
    },
  ],

  alerts: [
    {
      id: 'alert-1',
      severity: 'warning',
      message: '3 customer invoices are past due totalling ₹35,000.',
      actionLabel: 'View Overdue',
      actionHref: '/invoices',
    },
    {
      id: 'alert-2',
      severity: 'warning',
      message: 'Marketing budget is at 88% utilization.',
      actionLabel: 'View Budget',
      actionHref: '/reports/budget',
    },
  ],
};
