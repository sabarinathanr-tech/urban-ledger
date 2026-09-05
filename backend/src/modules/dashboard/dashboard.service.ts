import type {
  DashboardSummary,
  RevenueExpenseItem,
  BudgetHealth,
  ReceivablesSummary,
  PayablesSummary,
  AccountingHealth,
  RecentTransaction,
} from './dashboard.types.js';
import type { RevenueExpenseQuery, RecentTransactionsQuery } from './dashboard.schema.js';
import { TRANSACTION_TYPES } from '../../config/constants.js';

export class DashboardService {
  /**
   * Financial summary metrics for Urban Ledger.
   * Centralized service boundary: When accounting tables (Invoice, Bill, Payment, JournalEntry)
   * are migrated by Rohith, this method aggregates real DB transactions.
   */
  public async getSummary(): Promise<DashboardSummary> {
    const revenue = 1425000;
    const expenses = 890000;
    const netProfit = revenue - expenses;
    const cashAndBank = 620000;
    const receivables = 340000;
    const payables = 185000;

    return {
      revenue,
      expenses,
      netProfit,
      cashAndBank,
      receivables,
      payables,
    };
  }

  /**
   * Time-series revenue and expense metrics.
   */
  public async getRevenueExpenseTrend(query: RevenueExpenseQuery): Promise<RevenueExpenseItem[]> {
    const limit = Number(query.limit) || 6;

    const allData: RevenueExpenseItem[] = [
      { period: '2026-04', revenue: 620000, expenses: 410000 },
      { period: '2026-05', revenue: 710000, expenses: 460000 },
      { period: '2026-06', revenue: 790000, expenses: 510000 },
      { period: '2026-07', revenue: 830000, expenses: 540000 },
      { period: '2026-08', revenue: 910000, expenses: 580000 },
      { period: '2026-09', revenue: 840000, expenses: 520000 },
    ];

    return allData.slice(-limit);
  }

  /**
   * Budget health and utilization metrics.
   */
  public async getBudgetHealth(): Promise<BudgetHealth> {
    const plannedAmount = 1500000;
    const actualAmount = 1120000;
    const remainingAmount = plannedAmount - actualAmount;
    const utilizationPercent = Number(((actualAmount / plannedAmount) * 100).toFixed(2));

    let status: 'HEALTHY' | 'WARNING' | 'EXCEEDED' = 'HEALTHY';
    if (utilizationPercent > 100) {
      status = 'EXCEEDED';
    } else if (utilizationPercent >= 85) {
      status = 'WARNING';
    }

    return {
      budgetName: 'Q3 2026 Operations & Showroom Budget',
      plannedAmount,
      actualAmount,
      remainingAmount,
      utilizationPercent,
      status,
    };
  }

  /**
   * Accounts receivable summary.
   */
  public async getReceivablesSummary(): Promise<ReceivablesSummary> {
    return {
      outstanding: 340000,
      overdue: 85000,
      openInvoices: 12,
    };
  }

  /**
   * Accounts payable summary.
   */
  public async getPayablesSummary(): Promise<PayablesSummary> {
    return {
      outstanding: 185000,
      overdue: 32000,
      openBills: 7,
    };
  }

  /**
   * Overall accounting health indicators.
   */
  public async getAccountingHealth(): Promise<AccountingHealth> {
    return {
      booksBalanced: true,
      confirmedInvoicesAccounted: true,
      postedEntriesValid: true,
      overdueReceivables: 3,
      budgetWarning: false,
      unreconciledPayments: 2,
    };
  }

  /**
   * Recent normalized transactions across orders, invoices, bills, and payments.
   */
  public async getRecentTransactions(query: RecentTransactionsQuery): Promise<RecentTransaction[]> {
    const limit = Number(query.limit) || 10;

    const sampleTransactions: RecentTransaction[] = [
      {
        id: 'tx-1001',
        reference: 'INV-2026-0042',
        type: TRANSACTION_TYPES.CUSTOMER_INVOICE,
        party: 'Prestige Living Interiors',
        date: '2026-09-04',
        amount: 125000,
        status: 'POSTED',
      },
      {
        id: 'tx-1002',
        reference: 'BILL-2026-0019',
        type: TRANSACTION_TYPES.VENDOR_BILL,
        party: 'Teak Wood Suppliers Ltd',
        date: '2026-09-03',
        amount: 64000,
        status: 'CONFIRMED',
      },
      {
        id: 'tx-1003',
        reference: 'PAY-2026-0031',
        type: TRANSACTION_TYPES.PAYMENT,
        party: 'Modern Living Spaces',
        date: '2026-09-02',
        amount: 45000,
        status: 'RECONCILED',
      },
      {
        id: 'tx-1004',
        reference: 'SO-2026-0089',
        type: TRANSACTION_TYPES.SALES_ORDER,
        party: 'Urban Cafe Concepts',
        date: '2026-09-01',
        amount: 210000,
        status: 'APPROVED',
      },
      {
        id: 'tx-1005',
        reference: 'PO-2026-0038',
        type: TRANSACTION_TYPES.PURCHASE_ORDER,
        party: 'Steelcraft Hardwares',
        date: '2026-08-30',
        amount: 38000,
        status: 'SENT',
      },
      {
        id: 'tx-1006',
        reference: 'INV-2026-0041',
        type: TRANSACTION_TYPES.CUSTOMER_INVOICE,
        party: 'Oakwood Hospitality',
        date: '2026-08-28',
        amount: 88000,
        status: 'PAID',
      },
      {
        id: 'tx-1007',
        reference: 'BILL-2026-0018',
        type: TRANSACTION_TYPES.VENDOR_BILL,
        party: 'ErgoDesign Hardware Co',
        date: '2026-08-27',
        amount: 42000,
        status: 'PAID',
      },
    ];

    let result = sampleTransactions;
    if (query.type) {
      result = result.filter((t) => t.type === query.type);
    }

    return result.slice(0, limit);
  }
}

export const dashboardService = new DashboardService();
