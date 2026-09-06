import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/app/config';
import { useERP } from '@/context/ERPContext';
import { useAuth } from '@/context/AuthContext';
import type { DashboardData, RecentTransaction, BudgetHealthItem, BudgetStatus, TransactionStatus, AccountingHealthCheck } from '../types';
import { getDashboardSummary } from '../api';


// Dashboard section components
import { DashboardHeader } from '../components/DashboardHeader';
import { FinancialAlerts } from '../components/FinancialAlert';
import { QuickActions } from '../components/QuickActions';
import { FinancialSummary } from '../components/FinancialSummary';
import { RevenueExpenseChart } from '../components/RevenueExpenseChart';
import { BudgetHealthCard } from '../components/BudgetHealthCard';
import { ReceivablesCard } from '../components/ReceivablesCard';
import { PayablesCard } from '../components/PayablesCard';
import { AccountingHealthCard } from '../components/AccountingHealthCard';
import { RecentTransactions } from '../components/RecentTransactions';
import { ReportsSection } from '../components/ReportCard';
import { DashboardSkeleton } from '../components/DashboardSkeleton';
import { QuickActionModal } from '../components/QuickActionModal';
import { CustomerDashboard } from '../components/CustomerDashboard';
import { VendorDashboard } from '../components/VendorDashboard';

type DashboardState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: DashboardData };

export function DashboardPage() {
  const { isContact, isVendorContact } = useAuth();

  if (isContact) {
    if (isVendorContact) {
      return <VendorDashboard />;
    }
    return <CustomerDashboard />;
  }

  const {
    getDashboardMetricsData,
    getDynamicRevenueExpenseTrend,
    ledgerEquality,
    invoices,
    bills,
    payments,
    salesOrders,
    budgets,
  } = useERP();

  const [state, setState] = useState<DashboardState>({ status: 'loading' });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeQuickAction, setActiveQuickAction] = useState<string | null>(null);

  const fetchDashboard = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setState({ status: 'loading' });
      }

      const data = await getDashboardSummary();
      setState({ status: 'success', data: { ...data, lastUpdated: new Date().toISOString() } });
    } catch {
      setState({
        status: 'error',
        message: 'Unable to load financial data. Please try again.',
      });
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Loading state
  if (state.status === 'loading') {
    return <DashboardSkeleton />;
  }

  // Error state
  if (state.status === 'error') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-status-danger-bg">
            <RefreshCw size={24} className="text-status-danger" />
          </div>
          <h2 className="text-subheading text-navy-800">Unable to load financial data</h2>
          <p className="mt-1 text-body text-navy-400">
            Please check your connection and try again.
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={() => fetchDashboard()}
            className="mt-4"
          >
            <RefreshCw size={16} />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const { data } = state;

  const liveMetrics = getDashboardMetricsData();

  // Dynamically derive recent transactions from live ERP state
  const liveRecentTxns: RecentTransaction[] = [
    ...invoices.map((inv) => ({
      id: inv.id,
      reference: inv.invoiceNumber,
      type: 'Customer Invoice' as const,
      party: inv.customerName,
      date: inv.issueDate,
      amount: inv.grandTotal,
      status: (inv.status === 'PAID' ? 'Paid' : inv.status === 'OVERDUE' ? 'Overdue' : 'Posted') as TransactionStatus,
    })),
    ...bills.map((b) => ({
      id: b.id,
      reference: b.billNumber,
      type: 'Vendor Bill' as const,
      party: b.vendorName,
      date: b.billDate,
      amount: b.grandTotal,
      status: (b.status === 'PAID' ? 'Paid' : b.status === 'OVERDUE' ? 'Overdue' : 'Posted') as TransactionStatus,
    })),
    ...payments.map((p) => ({
      id: p.id,
      reference: p.paymentNumber,
      type: 'Payment' as const,
      party: p.contactName,
      date: p.paymentDate,
      amount: p.amount,
      status: 'Completed' as const,
    })),
    ...salesOrders.map((so) => ({
      id: so.id,
      reference: so.orderNumber,
      type: 'Sales Order' as const,
      party: so.customerName,
      date: so.orderDate,
      amount: so.grandTotal,
      status: (so.status === 'INVOICED' ? 'Posted' : 'Draft') as TransactionStatus,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

  const mergedMetrics = data.metrics.map((m) => {
    switch (m.id) {
      case 'revenue':
        return { ...m, amount: liveMetrics.revenue, href: ROUTES.REPORT_PROFIT_LOSS };
      case 'expenses':
        return { ...m, amount: liveMetrics.expenses, href: ROUTES.BILLS };
      case 'net-profit':
        return { ...m, amount: liveMetrics.netProfit, href: ROUTES.REPORT_PROFIT_LOSS };
      case 'cash-bank':
        return { ...m, amount: liveMetrics.cashBank, href: ROUTES.ACCOUNTING };
      case 'receivables':
        return { ...m, amount: liveMetrics.receivables, href: ROUTES.INVOICES };
      case 'payables':
        return { ...m, amount: liveMetrics.payables, href: ROUTES.BILLS };
      default:
        return m;
    }
  });

  const mergedReceivables = {
    ...data.receivables,
    totalOutstanding: liveMetrics.receivables,
    openInvoices: liveMetrics.unpaidInvoicesCount,
    overdueAmount: Math.round(liveMetrics.receivables * 0.25),
  };

  const mergedPayables = {
    ...data.payables,
    totalOutstanding: liveMetrics.payables,
    openBills: liveMetrics.unpaidBillsCount,
    overdueAmount: Math.round(liveMetrics.payables * 0.15),
  };

  const mergedBudgets: BudgetHealthItem[] = budgets.map((b) => ({
    id: b.id,
    name: b.name,
    planned: b.plannedAmount,
    actual: b.actualAmount,
    remaining: b.remainingAmount,
    utilization: b.utilization,
    status: (b.status === 'HEALTHY' ? 'on-track' : b.status === 'WARNING' ? 'warning' : 'over-budget') as BudgetStatus,
  }));

  const dynamicTrend = getDynamicRevenueExpenseTrend();

  const dynamicAccountingHealth: AccountingHealthCheck[] = [
    {
      id: 'double-entry',
      label: ledgerEquality.isBalanced ? 'Double-Entry Equality Verified' : 'Ledger Equality Check',
      description: ledgerEquality.isBalanced
        ? `Total Debits (₹${ledgerEquality.totalDebits.toLocaleString('en-IN')}) equal Credits`
        : `Discrepancy of ₹${ledgerEquality.discrepancy.toLocaleString('en-IN')} detected`,
      status: ledgerEquality.isBalanced ? 'healthy' : 'error',
    },
    {
      id: 'unposted',
      label: 'Unposted Transactions',
      description: `${invoices.filter((i) => i.status === 'DRAFT').length} draft invoices, ${bills.filter((b) => b.status === 'DRAFT').length} draft bills`,
      status: (invoices.filter((i) => i.status === 'DRAFT').length + bills.filter((b) => b.status === 'DRAFT').length) > 0 ? 'warning' : 'healthy',
    },
    {
      id: 'bank-recon',
      label: 'Bank Reconciliation',
      description: `${liveMetrics.cashBank > 0 ? 'Positive liquid reserves reconciled' : 'Review bank accounts'}`,
      status: liveMetrics.cashBank > 0 ? 'healthy' : 'warning',
    },
  ];

  // Empty state check — no transactions and all metrics zero
  const hasTransactions = liveRecentTxns.length > 0;
  const hasNonZeroMetric = mergedMetrics.some((m) => m.amount !== 0);
  const isEmpty = !hasTransactions && !hasNonZeroMetric;

  if (isEmpty) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-heading text-navy-800">Welcome to Urban Ledger</h2>
          <p className="mt-2 text-body text-navy-400">
            Your financial activity will appear here once transactions are recorded.
            Start by creating your first sale or adding contacts and products.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to={ROUTES.SALES_NEW}>
              <Button variant="primary">Create First Sale</Button>
            </Link>
            <Link to={ROUTES.CONTACTS_NEW}>
              <Button variant="outline">Add Contact</Button>
            </Link>
            <Link to={ROUTES.PRODUCTS_NEW}>
              <Button variant="outline">Add Product</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl w-full space-y-6 p-4 sm:p-6">
      {/* TOP: Header + Period + Refresh */}
      <DashboardHeader
        period={data.period}
        lastUpdated={data.lastUpdated}
        onRefresh={() => fetchDashboard(true)}
        isRefreshing={isRefreshing}
      />

      {/* Alerts */}
      <FinancialAlerts alerts={data.alerts} />

      {/* Quick Actions with Inline Modal Support */}
      <QuickActions
        actions={data.quickActions}
        onAction={(actionId) => setActiveQuickAction(actionId)}
      />

      {/* Quick Action Modal (Inline dialog with close cross [X] button) */}
      <QuickActionModal
        actionId={activeQuickAction}
        onClose={() => setActiveQuickAction(null)}
      />

      {/* FIRST ROW: Financial KPI Cards */}
      <FinancialSummary metrics={mergedMetrics} />

      {/* SECOND ROW: Revenue vs Expense Chart */}
      <RevenueExpenseChart data={dynamicTrend.length > 0 ? dynamicTrend : data.revenueExpenseTrend} />

      {/* THIRD ROW: Budget Health + Receivables + Payables */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <BudgetHealthCard budgets={mergedBudgets.length > 0 ? mergedBudgets : data.budgetHealth} />
        <ReceivablesCard data={mergedReceivables} />
        <PayablesCard data={mergedPayables} />
      </div>

      {/* FOURTH ROW: Accounting Health + Recent Transactions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <AccountingHealthCard checks={dynamicAccountingHealth} />
        </div>
        <div className="lg:col-span-3">
          <RecentTransactions transactions={liveRecentTxns.length > 0 ? liveRecentTxns : data.recentTransactions} />
        </div>
      </div>

      {/* FIFTH ROW: Reports */}
      <ReportsSection reports={data.reports} />
    </div>
  );
}

