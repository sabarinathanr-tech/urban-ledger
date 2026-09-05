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
  USERS: '/users',

  // Operations modules & Detail Routes
  SALES: '/sales',
  SALES_NEW: '/sales/new',
  SALES_DETAIL: '/sales/:id',
  PURCHASES: '/purchases',
  PURCHASES_NEW: '/purchases/new',
  PURCHASES_DETAIL: '/purchases/:id',
  INVOICES: '/invoices',
  INVOICES_NEW: '/invoices/new',
  INVOICES_DETAIL: '/invoices/:id',
  BILLS: '/bills',
  BILLS_NEW: '/bills/new',
  BILLS_DETAIL: '/bills/:id',
  PAYMENTS: '/payments',
  PAYMENTS_NEW: '/payments/new',
  PAYMENTS_DETAIL: '/payments/:id',
  CONTACTS: '/contacts',
  CONTACTS_NEW: '/contacts/new',
  CONTACTS_DETAIL: '/contacts/:id',
  PRODUCTS: '/products',
  PRODUCTS_NEW: '/products/new',
  PRODUCTS_DETAIL: '/products/:id',

  // Accounting & Subroutes
  ACCOUNTING: '/accounting',
  ACCOUNTING_COA: '/accounting/chart-of-accounts',
  ACCOUNTING_JOURNALS: '/accounting/journals',
  ACCOUNTING_ENTRIES: '/accounting/journal-entries',
  ACCOUNTING_LEDGER: '/accounting/ledger',
  JOURNAL_ENTRIES: '/accounting/journal-entries',
  CHART_OF_ACCOUNTS: '/accounting/chart-of-accounts',

  // Budgets
  BUDGETS: '/budgets',

  // Reports
  REPORTS: '/reports',
  REPORT_PROFIT_LOSS: '/reports/profit-loss',
  REPORT_BALANCE_SHEET: '/reports/balance-sheet',
  REPORT_BUDGET: '/reports/budget',
  REPORT_STOCK: '/reports/stock',
} as const;

