import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_CONFIG, ROUTES } from '@/app/config';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  section?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: <LayoutDashboard size={20} /> },
  { label: 'Sales', path: ROUTES.SALES, icon: <ShoppingCart size={20} />, section: 'Transactions' },
  { label: 'Purchases', path: ROUTES.PURCHASES, icon: <Package size={20} /> },
  { label: 'Invoices', path: ROUTES.INVOICES, icon: <FileText size={20} /> },
  { label: 'Bills', path: ROUTES.BILLS, icon: <Receipt size={20} /> },
  { label: 'Payments', path: ROUTES.PAYMENTS, icon: <CreditCard size={20} /> },
  { label: 'Contacts', path: ROUTES.CONTACTS, icon: <Users size={20} />, section: 'Master Data' },
  { label: 'Products', path: ROUTES.PRODUCTS, icon: <Package size={20} /> },
  { label: 'Accounting', path: ROUTES.ACCOUNTING, icon: <BookOpen size={20} />, section: 'Finance' },
  { label: 'Reports', path: ROUTES.REPORTS, icon: <BarChart3 size={20} /> },
];

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const currentPage = NAV_ITEMS.find((item) => location.pathname.startsWith(item.path));

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
          'fixed inset-y-0 left-0 z-40 flex flex-col bg-white shadow-sidebar transition-all duration-200 lg:static',
          sidebarCollapsed ? 'lg:w-16' : 'lg:w-60',
          sidebarOpen ? 'w-60 translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo area */}
        <div className={cn(
          'flex h-14 items-center border-b border-surface-border px-4',
          sidebarCollapsed && 'lg:justify-center lg:px-2'
        )}>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-card bg-brand-500 text-white">
              <BookOpen size={18} />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-bold text-navy-900 leading-tight">
                  {APP_CONFIG.name}
                </span>
                <span className="text-[10px] text-navy-400 leading-tight">
                  {APP_CONFIG.tagline}
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

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-3">
          {NAV_ITEMS.map((item, index) => {
            const showSection =
              item.section && (index === 0 || NAV_ITEMS[index - 1]?.section !== item.section);

            return (
              <div key={item.path}>
                {showSection && !sidebarCollapsed && (
                  <div className="mb-1 mt-4 px-4 first:mt-0">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-navy-300">
                      {item.section}
                    </span>
                  </div>
                )}
                <NavLink
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'mx-2 mb-0.5 flex items-center gap-3 rounded-md px-3 py-2 text-body font-medium transition-colors',
                      sidebarCollapsed && 'lg:justify-center lg:px-2',
                      isActive
                        ? 'bg-brand-50 text-brand-600'
                        : 'text-navy-500 hover:bg-surface-tertiary hover:text-navy-700'
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

        {/* Collapse toggle (desktop only) */}
        <div className="hidden border-t border-surface-border p-2 lg:block">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={cn(
              'flex w-full items-center gap-2 rounded-md px-3 py-2 text-body text-navy-400 hover:bg-surface-tertiary hover:text-navy-600',
              sidebarCollapsed && 'justify-center px-2'
            )}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft
              size={18}
              className={cn('transition-transform', sidebarCollapsed && 'rotate-180')}
            />
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header bar */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-surface-border bg-white px-4 lg:px-6">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded p-1 text-navy-500 hover:bg-surface-tertiary hover:text-navy-700 lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>

          {/* Page breadcrumb */}
          <div className="flex items-center gap-2">
            {currentPage && (
              <>
                <span className="text-body font-medium text-navy-800">{currentPage.label}</span>
              </>
            )}
          </div>

          {/* Right actions placeholder (for future: search, notifications, user menu) */}
          <div className="ml-auto flex items-center gap-2">
            <button
              className="flex items-center gap-2 rounded-md px-3 py-1.5 text-body text-navy-500 hover:bg-surface-tertiary hover:text-navy-700"
              aria-label="Settings"
            >
              <Settings size={18} />
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
