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
import { ReportsPage } from '@/features/reports/pages/ReportsPage';
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

      {/* ── Internal User Provisioning (Admin) ─────────────── */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.CREATE_USER} element={<CreateUserPage />} />
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

        {/* Transactions Modules */}
        <Route path={ROUTES.SALES} element={<SalesPage />} />
        <Route path={ROUTES.PURCHASES} element={<PurchasesPage />} />
        <Route path={ROUTES.INVOICES} element={<InvoicesPage />} />
        <Route path={ROUTES.BILLS} element={<BillsPage />} />
        <Route path={ROUTES.PAYMENTS} element={<PaymentsPage />} />

        {/* Master Data */}
        <Route path={ROUTES.CONTACTS} element={<ContactsPage />} />
        <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />

        {/* Finance & Accounting */}
        <Route path={ROUTES.ACCOUNTING} element={<AccountingPage />} />
        <Route path={ROUTES.REPORTS} element={<ReportsPage />} />
      </Route>

      {/* ── 404 Catch-all ─────────────────────────────────── */}
      <Route path="*" element={<IndexRedirect />} />
    </Routes>
  );
}

export default AppRoutes;
