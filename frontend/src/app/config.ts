/** Application-wide configuration constants. */
export const APP_CONFIG = {
  name: 'Urban Ledger',
  tagline: 'Furniture business. Clearer finances.',
  companyName: 'Urban Furniture',
  currency: 'INR',
  locale: 'en-IN',
} as const;

/** Route path constants for the application. */
export const ROUTES = {
  // Dashboard
  DASHBOARD: '/dashboard',

  // Auth (owned by Sabari — do not modify)
  LOGIN: '/login',
  SIGNUP: '/signup',
  CREATE_USER: '/create-user',

  // Future modules (navigation contracts)
  SALES: '/sales',
  SALES_NEW: '/sales/new',
  PURCHASES: '/purchases',
  PURCHASES_NEW: '/purchases/new',
  INVOICES: '/invoices',
  INVOICES_NEW: '/invoices/new',
  BILLS: '/bills',
  BILLS_NEW: '/bills/new',
  PAYMENTS: '/payments',
  PAYMENTS_NEW: '/payments/new',
  CONTACTS: '/contacts',
  CONTACTS_NEW: '/contacts/new',
  PRODUCTS: '/products',
  PRODUCTS_NEW: '/products/new',
  ACCOUNTING: '/accounting',
  JOURNAL_ENTRIES: '/accounting/journal-entries',
  CHART_OF_ACCOUNTS: '/accounting/chart-of-accounts',

  // Reports
  REPORTS: '/reports',
  REPORT_PROFIT_LOSS: '/reports/profit-loss',
  REPORT_BALANCE_SHEET: '/reports/balance-sheet',
  REPORT_BUDGET: '/reports/budget',
} as const;
