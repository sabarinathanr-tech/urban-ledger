/**
 * Urban Ledger - Centralized ERP Master & Transactional Data
 * Embodies: ONE BUSINESS EVENT → ONE ACCOUNTING TRUTH
 *
 * Story: Urban Furniture accounting system
 * Primary customer: Nimesh Pathak
 * Primary vendor: Azure Furniture
 */

export interface ContactItem {
  id: string;
  name: string;
  type: 'CUSTOMER' | 'VENDOR' | 'BOTH';
  email: string;
  mobile: string;
  city: string;
  state: string;
  pincode: string;
  profileImage?: string;
  portalUser?: {
    email: string;
    active: boolean;
  };
  isActive: boolean;
  totalReceivable?: number;
  totalPayable?: number;
}

export interface ProductItem {
  id: string;
  name: string;
  type: 'GOODS' | 'SERVICE' | 'COMBO';
  salesPrice: number;
  purchasePrice: number;
  category: string;
  stock: number;
  image?: string;
  isActive: boolean;
}

export interface AnalyticAccountItem {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSES';
  description?: string;
}

export interface LineItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; // e.g. 18 for 18%
  subtotal: number;
  taxAmount: number;
  total: number;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  status: 'DRAFT' | 'CONFIRMED' | 'INVOICED' | 'CANCELLED';
  lines: LineItem[];
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  invoiceId?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  orderDate: string;
  status: 'DRAFT' | 'CONFIRMED' | 'RECEIVED' | 'BILLED';
  lines: LineItem[];
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  billId?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  status: 'DRAFT' | 'POSTED' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  lines: LineItem[];
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
  journalEntryId?: string;
}

export interface Bill {
  id: string;
  billNumber: string;
  vendorId: string;
  vendorName: string;
  billDate: string;
  dueDate: string;
  status: 'DRAFT' | 'POSTED' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  lines: LineItem[];
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
  journalEntryId?: string;
}

export interface PaymentItem {
  id: string;
  paymentNumber: string;
  paymentDate: string;
  type: 'CUSTOMER_PAYMENT' | 'VENDOR_PAYMENT';
  contactId: string;
  contactName: string;
  documentRef: string; // INV or BILL ref
  amount: number;
  journal: 'BANK' | 'CASH';
  paymentMethod: 'HDFC Bank Transfer' | 'Cash Register' | 'UPI';
  status: 'POSTED';
  journalEntryId: string;
}

export interface AccountItem {
  id: string;
  code: string;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'INCOME' | 'EXPENSE';
  balance: number;
  currency: string;
}

export interface JournalItem {
  id: string;
  code: string;
  name: string;
  type: 'SALES' | 'PURCHASE' | 'BANK' | 'CASH';
  entriesCount: number;
}

export interface JournalLine {
  accountId: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  reference: string;
  journalCode: string;
  journalName: string;
  status: 'POSTED' | 'DRAFT';
  lines: JournalLine[];
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
}

export interface BudgetHealthItem {
  id: string;
  name: string;
  period: string;
  responsible: string;
  analyticAccount: string;
  plannedAmount: number;
  actualAmount: number;
  remainingAmount: number;
  utilization: number;
  status: 'HEALTHY' | 'WARNING' | 'EXCEEDED';
}

// ==========================================
// MASTER DATA: CONTACTS
// ==========================================
export const INITIAL_CONTACTS: ContactItem[] = [
  {
    id: 'cnt-1',
    name: 'Nimesh Pathak',
    type: 'CUSTOMER',
    email: 'nimesh@gmail.com',
    mobile: '+91 98765 43210',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    portalUser: {
      email: 'nimesh@gmail.com',
      active: true,
    },
    isActive: true,
    totalReceivable: 0,
  },
  {
    id: 'cnt-2',
    name: 'Azure Furniture Supplies',
    type: 'VENDOR',
    email: 'azure@furniture.com',
    mobile: '+91 98234 56789',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    portalUser: {
      email: 'azure@furniture.com',
      active: true,
    },
    isActive: true,
    totalPayable: 13040,
  },
  {
    id: 'cnt-3',
    name: 'Metro Spaces Interiors',
    type: 'CUSTOMER',
    email: 'contact@metrospaces.in',
    mobile: '+91 99100 11223',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411001',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    portalUser: {
      email: 'contact@metrospaces.in',
      active: true,
    },
    isActive: true,
    totalReceivable: 42480,
  },
  {
    id: 'cnt-4',
    name: 'Urban Timber & Hardware Co.',
    type: 'BOTH',
    email: 'orders@urbantimber.com',
    mobile: '+91 98450 99887',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600002',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    isActive: true,
    totalPayable: 0,
    totalReceivable: 0,
  },
];

// ==========================================
// MASTER DATA: PRODUCTS
// ==========================================
export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prd-1',
    name: 'Ergonomic Office Chair',
    type: 'GOODS',
    salesPrice: 4500,
    purchasePrice: 2800,
    category: 'Chairs & Seating',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1580481077198-c80753ff6377?w=300&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    id: 'prd-2',
    name: 'Teak Wood Dining Table (6-Seater)',
    type: 'GOODS',
    salesPrice: 18000,
    purchasePrice: 11500,
    category: 'Tables & Desks',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=300&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    id: 'prd-3',
    name: 'Executive Walnut Desk',
    type: 'GOODS',
    salesPrice: 12500,
    purchasePrice: 7800,
    category: 'Tables & Desks',
    stock: 18,
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=300&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    id: 'prd-4',
    name: 'Velvet Sofa (3-Seater)',
    type: 'GOODS',
    salesPrice: 32000,
    purchasePrice: 20000,
    category: 'Living & Lounge',
    stock: 8,
    isActive: true,
  },
  {
    id: 'prd-5',
    name: 'Custom Furniture Assembly & Polishing',
    type: 'SERVICE',
    salesPrice: 1500,
    purchasePrice: 600,
    category: 'Services',
    stock: 999,
    isActive: true,
  },
];

// ==========================================
// TRANSACTIONS: SALES ORDERS
// ==========================================
export const INITIAL_SALES_ORDERS: SalesOrder[] = [
  {
    id: 'so-1',
    orderNumber: 'SO-2026-001',
    customerId: 'cnt-1',
    customerName: 'Nimesh Pathak',
    orderDate: '2026-02-15',
    status: 'INVOICED',
    lines: [
      {
        id: 'sol-1',
        productId: 'prd-1',
        productName: 'Ergonomic Office Chair',
        quantity: 5,
        unitPrice: 4500,
        taxRate: 18,
        subtotal: 22500,
        taxAmount: 4050,
        total: 26550,
      },
    ],
    subtotal: 22500,
    taxTotal: 4050,
    grandTotal: 26550,
    invoiceId: 'inv-1',
  },
  {
    id: 'so-2',
    orderNumber: 'SO-2026-002',
    customerId: 'cnt-3',
    customerName: 'Metro Spaces Interiors',
    orderDate: '2026-02-28',
    status: 'INVOICED',
    lines: [
      {
        id: 'sol-2',
        productId: 'prd-2',
        productName: 'Teak Wood Dining Table (6-Seater)',
        quantity: 2,
        unitPrice: 18000,
        taxRate: 18,
        subtotal: 36000,
        taxAmount: 6480,
        total: 42480,
      },
    ],
    subtotal: 36000,
    taxTotal: 6480,
    grandTotal: 42480,
    invoiceId: 'inv-2',
  },
  {
    id: 'so-3',
    orderNumber: 'SO-2026-003',
    customerId: 'cnt-1',
    customerName: 'Nimesh Pathak',
    orderDate: '2026-03-02',
    status: 'CONFIRMED',
    lines: [
      {
        id: 'sol-3',
        productId: 'prd-3',
        productName: 'Executive Walnut Desk',
        quantity: 1,
        unitPrice: 12500,
        taxRate: 18,
        subtotal: 12500,
        taxAmount: 2250,
        total: 14750,
      },
    ],
    subtotal: 12500,
    taxTotal: 2250,
    grandTotal: 14750,
  },
];

// ==========================================
// TRANSACTIONS: PURCHASE ORDERS
// ==========================================
export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-1',
    poNumber: 'PO-2026-001',
    vendorId: 'cnt-2',
    vendorName: 'Azure Furniture Supplies',
    orderDate: '2026-02-10',
    status: 'BILLED',
    lines: [
      {
        id: 'pol-1',
        productId: 'prd-1',
        productName: 'Ergonomic Office Chair Components',
        quantity: 10,
        unitPrice: 2800,
        taxRate: 18,
        subtotal: 28000,
        taxAmount: 5040,
        total: 33040,
      },
    ],
    subtotal: 28000,
    taxTotal: 5040,
    grandTotal: 33040,
    billId: 'bill-1',
  },
  {
    id: 'po-2',
    poNumber: 'PO-2026-002',
    vendorId: 'cnt-4',
    vendorName: 'Urban Timber & Hardware Co.',
    orderDate: '2026-02-25',
    status: 'CONFIRMED',
    lines: [
      {
        id: 'pol-2',
        productId: 'prd-2',
        productName: 'Seasoned Teak Timber Planks',
        quantity: 5,
        unitPrice: 11500,
        taxRate: 18,
        subtotal: 57500,
        taxAmount: 10350,
        total: 67850,
      },
    ],
    subtotal: 57500,
    taxTotal: 10350,
    grandTotal: 67850,
  },
];

// ==========================================
// TRANSACTIONS: CUSTOMER INVOICES
// ==========================================
export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-001',
    customerId: 'cnt-1',
    customerName: 'Nimesh Pathak',
    issueDate: '2026-02-16',
    dueDate: '2026-03-02',
    status: 'PAID',
    lines: [
      {
        id: 'invl-1',
        productId: 'prd-1',
        productName: 'Ergonomic Office Chair',
        quantity: 5,
        unitPrice: 4500,
        taxRate: 18,
        subtotal: 22500,
        taxAmount: 4050,
        total: 26550,
      },
    ],
    subtotal: 22500,
    taxTotal: 4050,
    grandTotal: 26550,
    amountPaid: 26550,
    balanceDue: 0,
    journalEntryId: 'je-1',
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-002',
    customerId: 'cnt-3',
    customerName: 'Metro Spaces Interiors',
    issueDate: '2026-03-01',
    dueDate: '2026-03-15',
    status: 'POSTED',
    lines: [
      {
        id: 'invl-2',
        productId: 'prd-2',
        productName: 'Teak Wood Dining Table (6-Seater)',
        quantity: 2,
        unitPrice: 18000,
        taxRate: 18,
        subtotal: 36000,
        taxAmount: 6480,
        total: 42480,
      },
    ],
    subtotal: 36000,
    taxTotal: 6480,
    grandTotal: 42480,
    amountPaid: 0,
    balanceDue: 42480,
    journalEntryId: 'je-3',
  },
];

// ==========================================
// TRANSACTIONS: VENDOR BILLS
// ==========================================
export const INITIAL_BILLS: Bill[] = [
  {
    id: 'bill-1',
    billNumber: 'BILL-2026-001',
    vendorId: 'cnt-2',
    vendorName: 'Azure Furniture Supplies',
    billDate: '2026-02-12',
    dueDate: '2026-02-26',
    status: 'PARTIALLY_PAID',
    lines: [
      {
        id: 'bl-1',
        productId: 'prd-1',
        productName: 'Ergonomic Office Chair Components',
        quantity: 10,
        unitPrice: 2800,
        taxRate: 18,
        subtotal: 28000,
        taxAmount: 5040,
        total: 33040,
      },
    ],
    subtotal: 28000,
    taxTotal: 5040,
    grandTotal: 33040,
    amountPaid: 20000,
    balanceDue: 13040,
    journalEntryId: 'je-2',
  },
];

// ==========================================
// TRANSACTIONS: PAYMENTS
// ==========================================
export const INITIAL_PAYMENTS: PaymentItem[] = [
  {
    id: 'pay-1',
    paymentNumber: 'PAY-2026-001',
    paymentDate: '2026-02-20',
    type: 'CUSTOMER_PAYMENT',
    contactId: 'cnt-1',
    contactName: 'Nimesh Pathak',
    documentRef: 'INV-2026-001',
    amount: 26550,
    journal: 'BANK',
    paymentMethod: 'HDFC Bank Transfer',
    status: 'POSTED',
    journalEntryId: 'je-4',
  },
  {
    id: 'pay-2',
    paymentNumber: 'PAY-2026-002',
    paymentDate: '2026-02-24',
    type: 'VENDOR_PAYMENT',
    contactId: 'cnt-2',
    contactName: 'Azure Furniture Supplies',
    documentRef: 'BILL-2026-001',
    amount: 20000,
    journal: 'BANK',
    paymentMethod: 'HDFC Bank Transfer',
    status: 'POSTED',
    journalEntryId: 'je-5',
  },
];

// ==========================================
// ACCOUNTING: CHART OF ACCOUNTS
// ==========================================
export const INITIAL_ACCOUNTS: AccountItem[] = [
  { id: 'acc-1001', code: '1001', name: 'Cash in Hand', type: 'ASSET', balance: 15400, currency: 'INR' },
  { id: 'acc-1002', code: '1002', name: 'HDFC Current Bank Account', type: 'ASSET', balance: 285500, currency: 'INR' },
  { id: 'acc-1003', code: '1003', name: 'Accounts Receivable (Debtors)', type: 'ASSET', balance: 42480, currency: 'INR' },
  { id: 'acc-1004', code: '1004', name: 'Finished Furniture Inventory', type: 'ASSET', balance: 145000, currency: 'INR' },
  { id: 'acc-2001', code: '2001', name: 'Accounts Payable (Creditors)', type: 'LIABILITY', balance: 13040, currency: 'INR' },
  { id: 'acc-2002', code: '2002', name: 'GST Output Tax Liability (18%)', type: 'LIABILITY', balance: 10530, currency: 'INR' },
  { id: 'acc-3001', code: '3001', name: 'Owner Capital Equity', type: 'EQUITY', balance: 400000, currency: 'INR' },
  { id: 'acc-3002', code: '3002', name: 'Retained Earnings', type: 'EQUITY', balance: 44310, currency: 'INR' },
  { id: 'acc-4001', code: '4001', name: 'Furniture Sales Income', type: 'INCOME', balance: 58500, currency: 'INR' },
  { id: 'acc-4002', code: '4002', name: 'Custom Finishing Services Revenue', type: 'INCOME', balance: 4500, currency: 'INR' },
  { id: 'acc-5001', code: '5001', name: 'Raw Material & Stock Purchases', type: 'EXPENSE', balance: 28000, currency: 'INR' },
  { id: 'acc-5002', code: '5002', name: 'Workshop Rent & Power Expense', type: 'EXPENSE', balance: 12500, currency: 'INR' },
  { id: 'acc-5003', code: '5003', name: 'Freight, Logistics & Handling', type: 'EXPENSE', balance: 4500, currency: 'INR' },
];

// ==========================================
// ACCOUNTING: JOURNALS
// ==========================================
export const INITIAL_JOURNALS: JournalItem[] = [
  { id: 'jrn-sales', code: 'SALES', name: 'Customer Sales Journal', type: 'SALES', entriesCount: 2 },
  { id: 'jrn-purch', code: 'PURCH', name: 'Vendor Purchase Journal', type: 'PURCHASE', entriesCount: 1 },
  { id: 'jrn-bank', code: 'BANK', name: 'Bank Account - HDFC', type: 'BANK', entriesCount: 2 },
  { id: 'jrn-cash', code: 'CASH', name: 'Cash Register Journal', type: 'CASH', entriesCount: 0 },
];

// ==========================================
// ACCOUNTING: JOURNAL ENTRIES (DOUBLE-ENTRY)
// ==========================================
export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'je-1',
    entryNumber: 'JE-2026-001',
    date: '2026-02-16',
    reference: 'INV-2026-001 (Nimesh Pathak)',
    journalCode: 'SALES',
    journalName: 'Customer Sales Journal',
    status: 'POSTED',
    lines: [
      { accountId: 'acc-1003', accountCode: '1003', accountName: 'Accounts Receivable', debit: 26550, credit: 0 },
      { accountId: 'acc-4001', accountCode: '4001', accountName: 'Furniture Sales Income', debit: 0, credit: 22500 },
      { accountId: 'acc-2002', accountCode: '2002', accountName: 'GST Output Tax (18%)', debit: 0, credit: 4050 },
    ],
    totalDebit: 26550,
    totalCredit: 26550,
    isBalanced: true,
  },
  {
    id: 'je-2',
    entryNumber: 'JE-2026-002',
    date: '2026-02-12',
    reference: 'BILL-2026-001 (Azure Furniture)',
    journalCode: 'PURCH',
    journalName: 'Vendor Purchase Journal',
    status: 'POSTED',
    lines: [
      { accountId: 'acc-5001', accountCode: '5001', accountName: 'Raw Material Purchases', debit: 28000, credit: 0 },
      { accountId: 'acc-2002', accountCode: '2002', accountName: 'GST Input Tax Credit', debit: 5040, credit: 0 },
      { accountId: 'acc-2001', accountCode: '2001', accountName: 'Accounts Payable', debit: 0, credit: 33040 },
    ],
    totalDebit: 33040,
    totalCredit: 33040,
    isBalanced: true,
  },
  {
    id: 'je-3',
    entryNumber: 'JE-2026-003',
    date: '2026-03-01',
    reference: 'INV-2026-002 (Metro Spaces)',
    journalCode: 'SALES',
    journalName: 'Customer Sales Journal',
    status: 'POSTED',
    lines: [
      { accountId: 'acc-1003', accountCode: '1003', accountName: 'Accounts Receivable', debit: 42480, credit: 0 },
      { accountId: 'acc-4001', accountCode: '4001', accountName: 'Furniture Sales Income', debit: 0, credit: 36000 },
      { accountId: 'acc-2002', accountCode: '2002', accountName: 'GST Output Tax (18%)', debit: 0, credit: 6480 },
    ],
    totalDebit: 42480,
    totalCredit: 42480,
    isBalanced: true,
  },
  {
    id: 'je-4',
    entryNumber: 'JE-2026-004',
    date: '2026-02-20',
    reference: 'PAY-2026-001 (Nimesh Pathak Receipt)',
    journalCode: 'BANK',
    journalName: 'Bank Account - HDFC',
    status: 'POSTED',
    lines: [
      { accountId: 'acc-1002', accountCode: '1002', accountName: 'HDFC Current Bank Account', debit: 26550, credit: 0 },
      { accountId: 'acc-1003', accountCode: '1003', accountName: 'Accounts Receivable', debit: 0, credit: 26550 },
    ],
    totalDebit: 26550,
    totalCredit: 26550,
    isBalanced: true,
  },
  {
    id: 'je-5',
    entryNumber: 'JE-2026-005',
    date: '2026-02-24',
    reference: 'PAY-2026-002 (Azure Furniture Payment)',
    journalCode: 'BANK',
    journalName: 'Bank Account - HDFC',
    status: 'POSTED',
    lines: [
      { accountId: 'acc-2001', accountCode: '2001', accountName: 'Accounts Payable', debit: 20000, credit: 0 },
      { accountId: 'acc-1002', accountCode: '1002', accountName: 'HDFC Current Bank Account', debit: 0, credit: 20000 },
    ],
    totalDebit: 20000,
    totalCredit: 20000,
    isBalanced: true,
  },
];

// ==========================================
// FINANCE: BUDGET HEALTH
// ==========================================
export const INITIAL_BUDGETS: BudgetHealthItem[] = [
  {
    id: 'bdg-1',
    name: 'Timber & Raw Materials Procurement',
    period: 'FY 2025-26 Q4',
    responsible: 'Rohith (Inventory Head)',
    analyticAccount: 'Wood Procurement (Expenses)',
    plannedAmount: 150000,
    actualAmount: 85500,
    remainingAmount: 64500,
    utilization: 57,
    status: 'HEALTHY',
  },
  {
    id: 'bdg-2',
    name: 'Workshop Tools, Machinery & Power',
    period: 'FY 2025-26 Q4',
    responsible: 'Mohith (Production Lead)',
    analyticAccount: 'Operations & Utilities (Expenses)',
    plannedAmount: 40000,
    actualAmount: 34800,
    remainingAmount: 5200,
    utilization: 87,
    status: 'WARNING',
  },
  {
    id: 'bdg-3',
    name: 'Showroom Marketing & Online Promotion',
    period: 'FY 2025-26 Q4',
    responsible: 'Rugenthra (Sales Manager)',
    analyticAccount: 'Showroom Marketing (Expenses)',
    plannedAmount: 25000,
    actualAmount: 14200,
    remainingAmount: 10800,
    utilization: 56.8,
    status: 'HEALTHY',
  },
];

// ==========================================
// FINANCE: ANALYTIC ACCOUNTS (PS Page 4)
// ==========================================
export const INITIAL_ANALYTIC_ACCOUNTS: AnalyticAccountItem[] = [
  { id: 'ana-1', name: 'Wood Procurement (Expenses)', type: 'EXPENSES', description: 'Raw timber, teak logs and veneers' },
  { id: 'ana-2', name: 'Operations & Utilities (Expenses)', type: 'EXPENSES', description: 'Workshop power, tooling and machinery' },
  { id: 'ana-3', name: 'Showroom Marketing (Expenses)', type: 'EXPENSES', description: 'Catalogues, expo stalls, and digital ads' },
  { id: 'ana-4', name: 'Custom Design Studio (Income)', type: 'INCOME', description: 'Architectural custom consulting' },
];
