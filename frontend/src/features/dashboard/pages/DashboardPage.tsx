import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/app/config';
import type { DashboardData } from '../types';
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

type DashboardState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: DashboardData };

export function DashboardPage() {
  const [state, setState] = useState<DashboardState>({ status: 'loading' });
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  // Empty state check — no transactions and no metrics
  const isEmpty =
    data.recentTransactions.length === 0 &&
    data.metrics.every((m) => m.amount === 0);

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
    <div className="mx-auto max-w-dashboard space-y-6 p-4 lg:p-6">
      {/* TOP: Header + Period + Refresh */}
      <DashboardHeader
        period={data.period}
        lastUpdated={data.lastUpdated}
        onRefresh={() => fetchDashboard(true)}
        isRefreshing={isRefreshing}
      />

      {/* Alerts */}
      <FinancialAlerts alerts={data.alerts} />

      {/* Quick Actions */}
      <QuickActions actions={data.quickActions} />

      {/* FIRST ROW: Financial KPI Cards */}
      <FinancialSummary metrics={data.metrics} />

      {/* SECOND ROW: Revenue vs Expense Chart */}
      <RevenueExpenseChart data={data.revenueExpenseTrend} />

      {/* THIRD ROW: Budget Health + Receivables + Payables */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <BudgetHealthCard budgets={data.budgetHealth} />
        <ReceivablesCard data={data.receivables} />
        <PayablesCard data={data.payables} />
      </div>

      {/* FOURTH ROW: Accounting Health + Recent Transactions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <AccountingHealthCard checks={data.accountingHealth} />
        </div>
        <div className="lg:col-span-3">
          <RecentTransactions transactions={data.recentTransactions} />
        </div>
      </div>

      {/* FIFTH ROW: Reports */}
      <ReportsSection reports={data.reports} />
    </div>
  );
}
