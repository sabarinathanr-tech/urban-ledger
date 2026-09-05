import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AppLayout } from '@/layouts/AppLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PublicOnlyRoute } from '@/components/auth/PublicOnlyRoute';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { SignupPage } from '@/features/auth/pages/SignupPage';
import { CreateUserPage } from '@/features/auth/pages/CreateUserPage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { SalesPage } from '@/features/sales/pages/SalesPage';
import { PurchasesPage } from '@/features/purchases/pages/PurchasesPage';
import { InvoicesPage } from '@/features/invoices/pages/InvoicesPage';
import { BillsPage } from '@/features/bills/pages/BillsPage';
import { PaymentsPage } from '@/features/payments/pages/PaymentsPage';
import { ContactsPage } from '@/features/contacts/pages/ContactsPage';
import { ProductsPage } from '@/features/products/pages/ProductsPage';
import { AccountingPage } from '@/features/accounting/pages/AccountingPage';
import { BudgetsPage } from '@/features/budgeting/pages/BudgetsPage';
import { ReportsPage } from '@/features/reports/pages/ReportsPage';
import { SettingsPage } from '@/features/settings/pages/SettingsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ROUTES } from '@/app/config';

/**
 * Intelligent index redirect:
 * Unauthenticated users go to /login, authenticated users go to /dashboard.
 */
function IndexRedirect() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-surface-secondary">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  return <Navigate to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN} replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      {/* ── Root Index Redirect ─────────────────────────────── */}
      <Route path="/" element={<IndexRedirect />} />

      {/* ── Public Auth Routes ──────────────────────────────── */}
      <Route
        element={
          <PublicOnlyRoute>
            <AuthLayout />
          </PublicOnlyRoute>
        }
      >
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
      </Route>

      {/* ── Protected ERP Application Shell ─────────────────── */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Main Dashboard */}
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />

        {/* Transactions Modules (List, /new, /:id) */}
        <Route path={ROUTES.SALES} element={<SalesPage />} />
        <Route path={ROUTES.SALES_NEW} element={<SalesPage />} />
        <Route path={ROUTES.SALES_DETAIL} element={<SalesPage />} />

        <Route path={ROUTES.PURCHASES} element={<PurchasesPage />} />
        <Route path={ROUTES.PURCHASES_NEW} element={<PurchasesPage />} />
        <Route path={ROUTES.PURCHASES_DETAIL} element={<PurchasesPage />} />

        <Route path={ROUTES.INVOICES} element={<InvoicesPage />} />
        <Route path={ROUTES.INVOICES_NEW} element={<InvoicesPage />} />
        <Route path={ROUTES.INVOICES_DETAIL} element={<InvoicesPage />} />

        <Route path={ROUTES.BILLS} element={<BillsPage />} />
        <Route path={ROUTES.BILLS_NEW} element={<BillsPage />} />
        <Route path={ROUTES.BILLS_DETAIL} element={<BillsPage />} />

        <Route path={ROUTES.PAYMENTS} element={<PaymentsPage />} />
        <Route path={ROUTES.PAYMENTS_NEW} element={<PaymentsPage />} />
        <Route path={ROUTES.PAYMENTS_DETAIL} element={<PaymentsPage />} />

        {/* Master Data */}
        <Route path={ROUTES.CONTACTS} element={<ContactsPage />} />
        <Route path={ROUTES.CONTACTS_NEW} element={<ContactsPage />} />
        <Route path={ROUTES.CONTACTS_DETAIL} element={<ContactsPage />} />

        <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
        <Route path={ROUTES.PRODUCTS_NEW} element={<ProductsPage />} />
        <Route path={ROUTES.PRODUCTS_DETAIL} element={<ProductsPage />} />

        {/* Finance & Accounting */}
        <Route path={ROUTES.ACCOUNTING} element={<AccountingPage />} />
        <Route path={ROUTES.ACCOUNTING_COA} element={<AccountingPage />} />
        <Route path={ROUTES.ACCOUNTING_ACCOUNTS} element={<AccountingPage />} />
        <Route path={ROUTES.ACCOUNTING_JOURNALS} element={<AccountingPage />} />
        <Route path={ROUTES.ACCOUNTING_ENTRIES} element={<AccountingPage />} />
        <Route path={ROUTES.ACCOUNTING_ENTRIES_SHORT} element={<AccountingPage />} />
        <Route path={ROUTES.ACCOUNTING_LEDGER} element={<AccountingPage />} />
        <Route path={ROUTES.ACCOUNTING_ONE_TRUTH} element={<AccountingPage />} />

        {/* Budgets & Analytic Accounts */}
        <Route path={ROUTES.BUDGETS} element={<BudgetsPage />} />
        <Route path={ROUTES.BUDGETS_ANALYTIC} element={<BudgetsPage />} />

        {/* Reports */}
        <Route path={ROUTES.REPORTS} element={<ReportsPage />} />
        <Route path={ROUTES.REPORT_PROFIT_LOSS} element={<ReportsPage />} />
        <Route path={ROUTES.REPORT_BALANCE_SHEET} element={<ReportsPage />} />
        <Route path={ROUTES.REPORT_BUDGET} element={<ReportsPage />} />
        <Route path={ROUTES.REPORT_STOCK} element={<ReportsPage />} />

        {/* Configuration: Settings */}
        <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />

        {/* User Provisioning (Admin only) */}
        <Route
          path={ROUTES.CREATE_USER}
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <CreateUserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.USERS}
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <CreateUserPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ── 404 Catch-all ─────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;

