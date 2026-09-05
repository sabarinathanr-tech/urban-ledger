import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { ROUTES } from '@/app/config';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface BreadcrumbProps {
  section?: string;
  sectionPath?: string;
  currentPage?: string;
  items?: BreadcrumbItem[];
  className?: string;
}

/**
 * Derives default section and page name based on URL path when not explicitly provided.
 */
function deriveBreadcrumbInfo(pathname: string): { section: string; sectionPath?: string; page: string } {
  if (pathname === ROUTES.DASHBOARD || pathname === '/') {
    return { section: '', page: 'Dashboard' };
  }

  if (pathname.startsWith('/sales') || pathname.startsWith('/invoices')) {
    if (pathname.includes('/new')) return { section: 'Sales', sectionPath: ROUTES.SALES, page: 'New Order / Invoice' };
    if (pathname.startsWith('/invoices')) return { section: 'Sales', sectionPath: ROUTES.INVOICES, page: 'Customer Invoices' };
    return { section: 'Sales', sectionPath: ROUTES.SALES, page: 'Sales Orders' };
  }

  if (pathname.startsWith('/purchases') || pathname.startsWith('/bills')) {
    if (pathname.includes('/new')) return { section: 'Purchases', sectionPath: ROUTES.PURCHASES, page: 'New Order / Bill' };
    if (pathname.startsWith('/bills')) return { section: 'Purchases', sectionPath: ROUTES.BILLS, page: 'Vendor Bills' };
    return { section: 'Purchases', sectionPath: ROUTES.PURCHASES, page: 'Purchase Orders' };
  }

  if (pathname.startsWith('/accounting') || pathname.startsWith('/payments')) {
    if (pathname.startsWith('/payments')) return { section: 'Accounting', sectionPath: ROUTES.PAYMENTS, page: 'Payments' };
    if (pathname.includes('/ledger')) return { section: 'Accounting', sectionPath: ROUTES.ACCOUNTING_LEDGER, page: 'General Ledger' };
    if (pathname.includes('/journal-entries') || pathname.includes('/entries')) return { section: 'Accounting', sectionPath: ROUTES.ACCOUNTING_ENTRIES, page: 'Journal Entries' };
    if (pathname.includes('/chart-of-accounts') || pathname.includes('/accounts')) return { section: 'Accounting', sectionPath: ROUTES.ACCOUNTING_COA, page: 'Chart of Accounts' };
    if (pathname.includes('/journals')) return { section: 'Accounting', sectionPath: ROUTES.ACCOUNTING_JOURNALS, page: 'Journals' };
    if (pathname.includes('/one-truth')) return { section: 'Accounting', sectionPath: ROUTES.ACCOUNTING_ONE_TRUTH, page: 'Double-Entry Monitor' };
    return { section: 'Accounting', sectionPath: ROUTES.ACCOUNTING, page: 'Accounting Overview' };
  }

  if (pathname.startsWith('/reports')) {
    if (pathname.includes('/balance-sheet')) return { section: 'Reporting', sectionPath: ROUTES.REPORT_BALANCE_SHEET, page: 'Balance Sheet' };
    if (pathname.includes('/profit-loss')) return { section: 'Reporting', sectionPath: ROUTES.REPORT_PROFIT_LOSS, page: 'Profit & Loss' };
    if (pathname.includes('/budget')) return { section: 'Reporting', sectionPath: ROUTES.REPORT_BUDGET, page: 'Budget Report' };
    return { section: 'Reporting', sectionPath: ROUTES.REPORTS, page: 'Financial Reports' };
  }

  if (pathname.startsWith('/budgets')) {
    if (pathname.includes('/analytic-accounts')) return { section: 'Configuration', sectionPath: ROUTES.BUDGETS, page: 'Analytic Accounts' };
    return { section: 'Configuration', sectionPath: ROUTES.BUDGETS, page: 'Budgets' };
  }

  if (pathname.startsWith('/contacts')) {
    return { section: 'Master Data', sectionPath: ROUTES.CONTACTS, page: 'Contacts Directory' };
  }

  if (pathname.startsWith('/products')) {
    return { section: 'Master Data', sectionPath: ROUTES.PRODUCTS, page: 'Products Catalog' };
  }

  if (pathname.startsWith('/users') || pathname.startsWith('/create-user')) {
    return { section: 'Configuration', sectionPath: ROUTES.USERS, page: 'User Management' };
  }

  if (pathname.startsWith('/settings')) {
    return { section: 'Configuration', sectionPath: '/settings', page: 'Settings' };
  }

  return { section: 'General', page: pathname.replace('/', '') };
}

export function Breadcrumb({
  section,
  sectionPath,
  currentPage,
  items,
  className = '',
}: BreadcrumbProps) {
  const location = useLocation();

  if (items && items.length > 0) {
    return (
      <nav aria-label="Breadcrumb" className={`flex items-center text-xs text-text-muted ${className}`}>
        <Link to={ROUTES.DASHBOARD} className="hover:text-navy-900 transition-colors font-medium">
          Urban Ledger
        </Link>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <span key={item.label} className="flex items-center">
              <ChevronRight size={12} className="mx-1.5 text-slate-400 shrink-0" />
              {item.path && !isLast ? (
                <Link to={item.path} className="hover:text-navy-900 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'font-semibold text-navy-900' : 'text-text-muted'}>
                  {item.label}
                </span>
              )}
            </span>
          );
        })}
      </nav>
    );
  }

  const derived = deriveBreadcrumbInfo(location.pathname);
  const activeSection = section ?? derived.section;
  const activeSectionPath = sectionPath ?? derived.sectionPath;
  const activePage = currentPage ?? derived.page;

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-xs text-text-muted ${className}`}>
      <Link to={ROUTES.DASHBOARD} className="hover:text-navy-900 transition-colors font-medium">
        Urban Ledger
      </Link>
      {activeSection && (
        <>
          <ChevronRight size={12} className="mx-1.5 text-slate-400 shrink-0" />
          {activeSectionPath ? (
            <Link to={activeSectionPath} className="hover:text-navy-900 transition-colors">
              {activeSection}
            </Link>
          ) : (
            <span className="text-text-muted">{activeSection}</span>
          )}
        </>
      )}
      {activePage && (
        <>
          <ChevronRight size={12} className="mx-1.5 text-slate-400 shrink-0" />
          <span className="font-semibold text-navy-900">{activePage}</span>
        </>
      )}
    </nav>
  );
}
