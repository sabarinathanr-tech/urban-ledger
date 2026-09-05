import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { SignupPage } from '@/features/auth/pages/SignupPage';
import { CreateUserPage } from '@/features/auth/pages/CreateUserPage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { ROUTES } from '@/app/config';

/**
 * Application route configuration.
 *
 * OWNERSHIP:
 * - /dashboard routes → Rugenthra (DashboardPage wrapped in AppLayout)
 * - /login, /signup, /create-user → Sabari (Auth pages wrapped in AuthLayout)
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* ── Dashboard (Rugenthra) ────────────────────────── */}
      <Route element={<AppLayout />}>
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
      </Route>

      {/* ── Auth Routes (Sabari) ─────────────────────────── */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
        <Route path={ROUTES.CREATE_USER} element={<CreateUserPage />} />
      </Route>

      {/* ── Default Redirect ─────────────────────────────── */}
      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />

      {/* ── 404 Catch-all ────────────────────────────────── */}
      <Route
        path="*"
        element={
          <div className="flex min-h-screen items-center justify-center bg-surface-secondary">
            <div className="text-center">
              <h1 className="text-display text-navy-900">404</h1>
              <p className="mt-2 text-body text-navy-400">Page not found</p>
              <a
                href={ROUTES.DASHBOARD}
                className="mt-4 inline-block text-body font-medium text-brand-600 hover:text-brand-700"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
