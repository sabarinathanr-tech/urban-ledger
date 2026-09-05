import { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FileText,
  Receipt,
  CreditCard,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  Menu,
  X,
  ChevronLeft,
  LogOut,
  Search,
  Building2,
  ShieldCheck,
  Briefcase,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_CONFIG, ROUTES } from '@/app/config';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  section?: string;
  adminOnly?: boolean;
}

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isContact } = useAuth();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  // Full ERP navigation for Admin/Accountant; restricted portal view for Contact role
  const NAV_ITEMS: NavItem[] = isContact
    ? [
        { label: 'Portal Overview', path: ROUTES.DASHBOARD, icon: <LayoutDashboard size={18} /> },
        { label: 'My Invoices', path: ROUTES.INVOICES, icon: <FileText size={18} />, section: 'My Documents' },
        { label: 'My Bills', path: ROUTES.BILLS, icon: <Receipt size={18} /> },
        { label: 'My Payments', path: ROUTES.PAYMENTS, icon: <CreditCard size={18} /> },
        { label: 'Account Profile', path: ROUTES.CONTACTS, icon: <Users size={18} />, section: 'Master Data' },
      ]
    : [
        { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: <LayoutDashboard size={18} /> },
        { label: 'Sales', path: ROUTES.SALES, icon: <ShoppingCart size={18} />, section: 'Transactions' },
        { label: 'Purchases', path: ROUTES.PURCHASES, icon: <Package size={18} /> },
        { label: 'Invoices', path: ROUTES.INVOICES, icon: <FileText size={18} /> },
        { label: 'Bills', path: ROUTES.BILLS, icon: <Receipt size={18} /> },
        { label: 'Payments', path: ROUTES.PAYMENTS, icon: <CreditCard size={18} /> },
        { label: 'Contacts', path: ROUTES.CONTACTS, icon: <Users size={18} />, section: 'Master Data' },
        { label: 'Products', path: ROUTES.PRODUCTS, icon: <Package size={18} /> },
        { label: 'Accounting', path: ROUTES.ACCOUNTING, icon: <BookOpen size={18} />, section: 'Finance' },
        { label: 'Reports', path: ROUTES.REPORTS, icon: <BarChart3 size={18} /> },
      ];

  const currentPage = NAV_ITEMS.find((item) =>
    item.path === ROUTES.DASHBOARD
      ? location.pathname === ROUTES.DASHBOARD
      : location.pathname.startsWith(item.path)
  ) || { label: 'Financial ERP', path: ROUTES.DASHBOARD };

  const getRoleBadgeVariant = () => {
    switch (user?.role) {
      case 'ADMIN':
        return 'danger';
      case 'ACCOUNTANT':
        return 'info';
      case 'CONTACT':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'ADMIN':
        return <ShieldCheck size={13} className="text-red-600" />;
      case 'ACCOUNTANT':
        return <Briefcase size={13} className="text-blue-600" />;
      default:
        return <User size={13} className="text-amber-600" />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface-secondary">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-navy-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col bg-white shadow-sidebar transition-all duration-200 lg:static border-r border-surface-border',
          sidebarCollapsed ? 'lg:w-16' : 'lg:w-60',
          sidebarOpen ? 'w-60 translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo area */}
        <div
          className={cn(
            'flex h-14 items-center border-b border-surface-border px-4',
            sidebarCollapsed && 'lg:justify-center lg:px-2'
          )}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-700 text-white shadow-sm">
              <Building2 size={18} />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-navy-900 leading-tight">
                  {APP_CONFIG.name}
                </span>
                <span className="text-[10px] text-navy-400 leading-tight">
                  {APP_CONFIG.companyName}
                </span>
              </div>
            )}
          </div>

          {/* Close button (mobile) */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto rounded p-1 text-navy-400 hover:bg-surface-tertiary hover:text-navy-600 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-2">
          {NAV_ITEMS.map((item, index) => {
            const showSection =
              item.section && (index === 0 || NAV_ITEMS[index - 1]?.section !== item.section);

            return (
              <div key={item.path}>
                {showSection && !sidebarCollapsed && (
                  <div className="mb-1 mt-3 px-4 first:mt-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-navy-400">
                      {item.section}
                    </span>
                  </div>
                )}
                <NavLink
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'mx-2 mb-0.5 flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium transition-colors',
                      sidebarCollapsed && 'lg:justify-center lg:px-2',
                      isActive
                        ? 'bg-brand-50 text-brand-700 font-semibold dark:bg-slate-800'
                        : 'text-navy-600 hover:bg-surface-tertiary hover:text-navy-900'
                    )
                  }
                  title={sidebarCollapsed ? item.label : undefined}
                  aria-label={item.label}
                >
                  {item.icon}
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </NavLink>
              </div>
            );
          })}
        </nav>

        {/* User Info & Quick Logout in sidebar footer */}
        <div className="border-t border-surface-border p-2 bg-surface-secondary/40">
          {!sidebarCollapsed ? (
            <div className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-md bg-white border border-surface-border">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-800 font-semibold text-xs">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="truncate text-xs font-medium text-navy-900 leading-tight">
                    {user?.fullName || 'ERP User'}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    {getRoleIcon()}
                    <span className="text-[10px] text-navy-400 capitalize">
                      {user?.role?.toLowerCase() || 'guest'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="rounded p-1.5 text-navy-400 hover:bg-status-danger-bg hover:text-status-danger transition"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div className="flex justify-center py-1">
              <button
                onClick={handleLogout}
                className="rounded p-1.5 text-navy-400 hover:bg-status-danger-bg hover:text-status-danger transition"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}

          {/* Collapse toggle (desktop only) */}
          <div className="hidden pt-1 lg:block">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-navy-400 hover:bg-surface-tertiary hover:text-navy-600',
                sidebarCollapsed && 'justify-center px-1'
              )}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <ChevronLeft
                size={16}
                className={cn('transition-transform', sidebarCollapsed && 'rotate-180')}
              />
              {!sidebarCollapsed && <span>Collapse Sidebar</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header bar */}
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-surface-border bg-white px-4 lg:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded p-1.5 text-navy-500 hover:bg-surface-tertiary hover:text-navy-700 lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs font-medium text-navy-400">Urban Ledger</span>
              <span className="hidden sm:inline text-xs text-navy-300">/</span>
              <h1 className="text-sm font-semibold text-navy-900">{currentPage.label}</h1>
            </div>
          </div>

          {/* Top bar right section */}
          <div className="flex items-center gap-3">
            {/* Compact Search Bar */}
            <div className="relative hidden md:block w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-navy-400" size={14} />
              <input
                type="text"
                placeholder="Search transactions, accounts..."
                className="w-full rounded-md border border-surface-border bg-surface-secondary/60 py-1.5 pl-8 pr-3 text-xs text-navy-800 placeholder-navy-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            {/* Role Badge */}
            <Badge variant={getRoleBadgeVariant()} className="hidden sm:inline-flex capitalize">
              {user?.role?.toLowerCase()}
            </Badge>

            {/* Settings button */}
            <button
              className="flex items-center justify-center rounded-md p-1.5 text-navy-500 hover:bg-surface-tertiary hover:text-navy-700 transition"
              aria-label="Settings"
              title="ERP Settings"
            >
              <Settings size={18} />
            </button>

            {/* User Avatar & Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-md border border-surface-border bg-white px-2.5 py-1 text-xs font-medium text-navy-700 hover:bg-surface-secondary hover:text-status-danger transition"
              title="Log out of session"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
