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
  code?: string;
  balance?: number;
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
  analyticAccountId?: string;
  analyticAccountName?: string;
  chartOfAccount?: string;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  orderDate: string;
  status: 'DRAFT' | 'QUOTATION' | 'CONFIRMED' | 'INVOICED' | 'CANCELLED';
  lines: LineItem[];
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  invoiceId?: string;
  notes?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  vendorEmail?: string;
  vendorPhone?: string;
  orderDate: string;
  status: 'DRAFT' | 'CONFIRMED' | 'RECEIVED' | 'BILLED';
  lines: LineItem[];
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  billId?: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerAddress?: string;
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
  soId?: string;
  soNumber?: string;
  invoiceReference?: string;
  notes?: string;
}

export interface Bill {
  id: string;
  billNumber: string;
  vendorId: string;
  vendorName: string;
  vendorEmail?: string;
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
  poId?: string;
  poNumber?: string;
  billReference?: string;
  notes?: string;
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
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'INCOME' | 'EXPENSE' | 'CAPITAL' | 'BANK' | 'CASH' | 'OTHER_EXPENSE';
  balance: number;
  currency: string;
}

export interface JournalItem {
  id: string;
  code: string;
  name: string;
  type: 'SALES' | 'PURCHASE' | 'BANK' | 'CASH';
  defaultAccountId?: string;
  defaultAccountName?: string;
  entriesCount: number;
}

export interface JournalLine {
  accountId: string;
  accountCode: string;
  accountName: string;
  partnerId?: string;
  partnerName?: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  reference: string;
  partnerName?: string;
  journalCode: string;
  journalName: string;
  status: 'POSTED' | 'DRAFT';
  lines: JournalLine[];
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
}

export type BudgetStage = 'DRAFT' | 'CONFIRM' | 'REVISED' | 'CANCELED';

export interface BudgetLine {
  id: string;
  analyticAccountId: string;
  analyticAccountName: string;
  type: 'INCOME' | 'EXPENSE';
  committedAmount: number;
  achievedAmount: number;
  achievedPercent: number;
  amountToAchieve: number;
}

export interface BudgetHealthItem {
  id: string;
  name: string;
  period: string;
  startDate?: string;
  endDate?: string;
  responsible: string;
  stage?: BudgetStage;
  revisionOfId?: string;
  revisionOfName?: string;
  revisedWithId?: string;
  revisedWithName?: string;
  lines?: BudgetLine[];
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
    "id": "cnt_rohith_customer",
    "name": "Rohith",
    "type": "CUSTOMER",
    "email": "rohith@gmail.com",
    "mobile": "+91 98765 43220",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560001",
    "portalUser": {
      "email": "rohith@gmail.com",
      "active": true
    },
    "isActive": true,
    "totalReceivable": 45000
  },
  {
    "id": "cnt_mohit_vendor",
    "name": "Mohit Timber & Hardware",
    "type": "VENDOR",
    "email": "mohit@gmail.com",
    "mobile": "+91 98765 43221",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "portalUser": {
      "email": "mohit@gmail.com",
      "active": true
    },
    "isActive": true,
    "totalPayable": 62000
  },
  {
    "id": "cnt-1",
    "name": "Nimesh Pathak",
    "type": "CUSTOMER",
    "email": "nimesh@gmail.com",
    "mobile": "+91 98765 43210",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "portalUser": {
      "email": "nimesh@gmail.com",
      "active": true
    },
    "isActive": true,
    "totalReceivable": 0
  },
  {
    "id": "cnt-2",
    "name": "Azure Furniture Supplies",
    "type": "VENDOR",
    "email": "azure@furniture.com",
    "mobile": "+91 98234 56789",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560001",
    "portalUser": {
      "email": "azure@furniture.com",
      "active": true
    },
    "isActive": true,
    "totalPayable": 13040
  },
  {
    "id": "cnt-3",
    "name": "Metro Spaces Interiors",
    "type": "CUSTOMER",
    "email": "metrospacesinteriors@example.com",
    "mobile": "+91 98100 00000",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "isActive": true,
    "totalReceivable": 12500
  },
  {
    "id": "cnt-4",
    "name": "Prestige Living Studios",
    "type": "CUSTOMER",
    "email": "prestigelivingstudios@example.com",
    "mobile": "+91 98101 11111",
    "city": "Bengaluru",
    "state": "Karnataka",
    "pincode": "560001",
    "isActive": true,
    "totalReceivable": 0
  },
  {
    "id": "cnt-5",
    "name": "Horizon Architects",
    "type": "CUSTOMER",
    "email": "horizonarchitects@example.com",
    "mobile": "+91 98102 22222",
    "city": "New Delhi",
    "state": "Delhi",
    "pincode": "110001",
    "isActive": true,
    "totalReceivable": 37500
  }
];

// ==========================================
// MASTER DATA: PRODUCTS
// ==========================================
export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    "id": "prd-1",
    "name": "Ergonomic Office Chair",
    "type": "GOODS",
    "salesPrice": 4500,
    "purchasePrice": 2800,
    "category": "Chairs & Seating",
    "stock": 85,
    "isActive": true
  },
  {
    "id": "prd-2",
    "name": "Teak Wood Dining Table (6-Seater)",
    "type": "GOODS",
    "salesPrice": 18000,
    "purchasePrice": 11500,
    "category": "Tables & Desks",
    "stock": 24,
    "isActive": true
  },
  {
    "id": "prd-3",
    "name": "Executive Walnut Desk",
    "type": "GOODS",
    "salesPrice": 12500,
    "purchasePrice": 7800,
    "category": "Tables & Desks",
    "stock": 32,
    "isActive": true
  },
  {
    "id": "prd-4",
    "name": "Velvet Sofa (3-Seater)",
    "type": "GOODS",
    "salesPrice": 32000,
    "purchasePrice": 20000,
    "category": "Living & Lounge",
    "stock": 16,
    "isActive": true
  },
  {
    "id": "prd-5",
    "name": "Custom Furniture Assembly & Polishing",
    "type": "SERVICE",
    "salesPrice": 1500,
    "purchasePrice": 600,
    "category": "Services",
    "stock": 999,
    "isActive": true
  },
  {
    "id": "prd-6",
    "name": "Solid Oak Credenza Bookshelf",
    "type": "GOODS",
    "salesPrice": 22000,
    "purchasePrice": 14000,
    "category": "Storage & Shelving",
    "stock": 18,
    "isActive": true
  },
  {
    "id": "prd-7",
    "name": "King Size Sheesham Bed Frame",
    "type": "GOODS",
    "salesPrice": 28500,
    "purchasePrice": 18000,
    "category": "Bedroom Suite",
    "stock": 14,
    "isActive": true
  },
  {
    "id": "prd-8",
    "name": "Acoustic Lounge Armchair",
    "type": "GOODS",
    "salesPrice": 9500,
    "purchasePrice": 6200,
    "category": "Chairs & Seating",
    "stock": 28,
    "isActive": true
  },
  {
    "id": "prd-9",
    "name": "Minimalist Coffee Table",
    "type": "GOODS",
    "salesPrice": 6200,
    "purchasePrice": 3800,
    "category": "Tables & Desks",
    "stock": 40,
    "isActive": true
  },
  {
    "id": "prd-10",
    "name": "Modular Workstation Unit (4-Pod)",
    "type": "GOODS",
    "salesPrice": 42000,
    "purchasePrice": 26000,
    "category": "Office Systems",
    "stock": 12,
    "isActive": true
  },
  {
    "id": "prd-11",
    "name": "Reclaimed Teak Timber Planks (Batch 50pc)",
    "type": "GOODS",
    "salesPrice": 15000,
    "purchasePrice": 9500,
    "category": "Raw Materials",
    "stock": 120,
    "isActive": true
  },
  {
    "id": "prd-12",
    "name": "Stainless Steel Joint Brackets & Fasteners",
    "type": "GOODS",
    "salesPrice": 2500,
    "purchasePrice": 1400,
    "category": "Hardware & Fittings",
    "stock": 300,
    "isActive": true
  },
  {
    "id": "prd-13",
    "name": "Architectural Hardwood Veneer Sheets",
    "type": "GOODS",
    "salesPrice": 8500,
    "purchasePrice": 5200,
    "category": "Raw Materials",
    "stock": 75,
    "isActive": true
  },
  {
    "id": "prd-14",
    "name": "High-Density Upholstery Foam (Grade A)",
    "type": "GOODS",
    "salesPrice": 4800,
    "purchasePrice": 3100,
    "category": "Raw Materials",
    "stock": 90,
    "isActive": true
  },
  {
    "id": "prd-15",
    "name": "Italian Brass Cabinet Handles & Hinges",
    "type": "GOODS",
    "salesPrice": 3800,
    "purchasePrice": 2300,
    "category": "Hardware & Fittings",
    "stock": 150,
    "isActive": true
  }
];

// ==========================================
// TRANSACTIONS: SALES ORDERS
// ==========================================
export const INITIAL_SALES_ORDERS: SalesOrder[] = [
  {
    "id": "so-1",
    "orderNumber": "SO-2026-001",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-05",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-1-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 2,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 64000,
        "taxAmount": 11520,
        "total": 75520
      },
      {
        "id": "sol-1-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      }
    ],
    "subtotal": 121000,
    "taxTotal": 21780,
    "grandTotal": 142780,
    "invoiceId": "inv-1",
    "notes": "Executive interior contract SO-1"
  },
  {
    "id": "so-2",
    "orderNumber": "SO-2026-002",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-06",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-2-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 3,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 85500,
        "taxAmount": 15390,
        "total": 100890
      },
      {
        "id": "sol-2-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 1,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 2500,
        "taxAmount": 450,
        "total": 2950
      }
    ],
    "subtotal": 88000,
    "taxTotal": 15840,
    "grandTotal": 103840,
    "invoiceId": "inv-2",
    "notes": "Executive interior contract SO-2"
  },
  {
    "id": "so-3",
    "orderNumber": "SO-2026-003",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-06",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-3-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 4,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 168000,
        "taxAmount": 30240,
        "total": 198240
      },
      {
        "id": "sol-3-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 2,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 36000,
        "taxAmount": 6480,
        "total": 42480
      }
    ],
    "subtotal": 204000,
    "taxTotal": 36720,
    "grandTotal": 240720,
    "invoiceId": "inv-3",
    "notes": "Executive interior contract SO-3"
  },
  {
    "id": "so-4",
    "orderNumber": "SO-2026-004",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-07",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-4-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 1,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 8500,
        "taxAmount": 1530,
        "total": 10030
      },
      {
        "id": "sol-4-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      }
    ],
    "subtotal": 37000,
    "taxTotal": 6660,
    "grandTotal": 43660,
    "notes": "Executive interior contract SO-4"
  },
  {
    "id": "so-5",
    "orderNumber": "SO-2026-005",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-07",
    "status": "QUOTATION",
    "lines": [
      {
        "id": "sol-5-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 2,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 9000,
        "taxAmount": 1620,
        "total": 10620
      },
      {
        "id": "sol-5-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 2,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 5000,
        "taxAmount": 900,
        "total": 5900
      }
    ],
    "subtotal": 14000,
    "taxTotal": 2520,
    "grandTotal": 16520,
    "notes": "Executive interior contract SO-5"
  },
  {
    "id": "so-6",
    "orderNumber": "SO-2026-006",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-08",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-6-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 3,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 96000,
        "taxAmount": 17280,
        "total": 113280
      },
      {
        "id": "sol-6-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 1,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 18000,
        "taxAmount": 3240,
        "total": 21240
      }
    ],
    "subtotal": 114000,
    "taxTotal": 20520,
    "grandTotal": 134520,
    "notes": "Executive interior contract SO-6"
  },
  {
    "id": "so-7",
    "orderNumber": "SO-2026-007",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-08",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-7-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 4,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 114000,
        "taxAmount": 20520,
        "total": 134520
      },
      {
        "id": "sol-7-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      }
    ],
    "subtotal": 171000,
    "taxTotal": 30780,
    "grandTotal": 201780,
    "invoiceId": "inv-7",
    "notes": "Executive interior contract SO-7"
  },
  {
    "id": "so-8",
    "orderNumber": "SO-2026-008",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-09",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-8-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 1,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 42000,
        "taxAmount": 7560,
        "total": 49560
      },
      {
        "id": "sol-8-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 1,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 2500,
        "taxAmount": 450,
        "total": 2950
      }
    ],
    "subtotal": 44500,
    "taxTotal": 8010,
    "grandTotal": 52510,
    "invoiceId": "inv-8",
    "notes": "Executive interior contract SO-8"
  },
  {
    "id": "so-9",
    "orderNumber": "SO-2026-009",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-09",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-9-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 17000,
        "taxAmount": 3060,
        "total": 20060
      },
      {
        "id": "sol-9-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 2,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 36000,
        "taxAmount": 6480,
        "total": 42480
      }
    ],
    "subtotal": 53000,
    "taxTotal": 9540,
    "grandTotal": 62540,
    "invoiceId": "inv-9",
    "notes": "Executive interior contract SO-9"
  },
  {
    "id": "so-10",
    "orderNumber": "SO-2026-010",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-10",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-10-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 3,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 13500,
        "taxAmount": 2430,
        "total": 15930
      },
      {
        "id": "sol-10-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      }
    ],
    "subtotal": 42000,
    "taxTotal": 7560,
    "grandTotal": 49560,
    "notes": "Executive interior contract SO-10"
  },
  {
    "id": "so-11",
    "orderNumber": "SO-2026-011",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-10",
    "status": "QUOTATION",
    "lines": [
      {
        "id": "sol-11-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 4,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 128000,
        "taxAmount": 23040,
        "total": 151040
      },
      {
        "id": "sol-11-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 2,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 5000,
        "taxAmount": 900,
        "total": 5900
      }
    ],
    "subtotal": 133000,
    "taxTotal": 23940,
    "grandTotal": 156940,
    "notes": "Executive interior contract SO-11"
  },
  {
    "id": "so-12",
    "orderNumber": "SO-2026-012",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-11",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-12-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      },
      {
        "id": "sol-12-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 1,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 18000,
        "taxAmount": 3240,
        "total": 21240
      }
    ],
    "subtotal": 46500,
    "taxTotal": 8370,
    "grandTotal": 54870,
    "notes": "Executive interior contract SO-12"
  },
  {
    "id": "so-13",
    "orderNumber": "SO-2026-013",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-11",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-13-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 2,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 84000,
        "taxAmount": 15120,
        "total": 99120
      },
      {
        "id": "sol-13-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      }
    ],
    "subtotal": 141000,
    "taxTotal": 25380,
    "grandTotal": 166380,
    "invoiceId": "inv-13",
    "notes": "Executive interior contract SO-13"
  },
  {
    "id": "so-14",
    "orderNumber": "SO-2026-014",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-12",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-14-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 3,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 25500,
        "taxAmount": 4590,
        "total": 30090
      },
      {
        "id": "sol-14-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 1,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 2500,
        "taxAmount": 450,
        "total": 2950
      }
    ],
    "subtotal": 28000,
    "taxTotal": 5040,
    "grandTotal": 33040,
    "invoiceId": "inv-14",
    "notes": "Executive interior contract SO-14"
  },
  {
    "id": "so-15",
    "orderNumber": "SO-2026-015",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-12",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-15-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 4,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 18000,
        "taxAmount": 3240,
        "total": 21240
      },
      {
        "id": "sol-15-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 2,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 36000,
        "taxAmount": 6480,
        "total": 42480
      }
    ],
    "subtotal": 54000,
    "taxTotal": 9720,
    "grandTotal": 63720,
    "invoiceId": "inv-15",
    "notes": "Executive interior contract SO-15"
  },
  {
    "id": "so-16",
    "orderNumber": "SO-2026-016",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-13",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-16-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 1,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 32000,
        "taxAmount": 5760,
        "total": 37760
      },
      {
        "id": "sol-16-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      }
    ],
    "subtotal": 60500,
    "taxTotal": 10890,
    "grandTotal": 71390,
    "notes": "Executive interior contract SO-16"
  },
  {
    "id": "so-17",
    "orderNumber": "SO-2026-017",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-13",
    "status": "QUOTATION",
    "lines": [
      {
        "id": "sol-17-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      },
      {
        "id": "sol-17-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 2,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 5000,
        "taxAmount": 900,
        "total": 5900
      }
    ],
    "subtotal": 62000,
    "taxTotal": 11160,
    "grandTotal": 73160,
    "notes": "Executive interior contract SO-17"
  },
  {
    "id": "so-18",
    "orderNumber": "SO-2026-018",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-14",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-18-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 3,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 126000,
        "taxAmount": 22680,
        "total": 148680
      },
      {
        "id": "sol-18-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 1,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 18000,
        "taxAmount": 3240,
        "total": 21240
      }
    ],
    "subtotal": 144000,
    "taxTotal": 25920,
    "grandTotal": 169920,
    "notes": "Executive interior contract SO-18"
  },
  {
    "id": "so-19",
    "orderNumber": "SO-2026-019",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-14",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-19-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 4,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 34000,
        "taxAmount": 6120,
        "total": 40120
      },
      {
        "id": "sol-19-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      }
    ],
    "subtotal": 91000,
    "taxTotal": 16380,
    "grandTotal": 107380,
    "invoiceId": "inv-19",
    "notes": "Executive interior contract SO-19"
  },
  {
    "id": "so-20",
    "orderNumber": "SO-2026-020",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-15",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-20-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 1,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 4500,
        "taxAmount": 810,
        "total": 5310
      },
      {
        "id": "sol-20-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 1,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 2500,
        "taxAmount": 450,
        "total": 2950
      }
    ],
    "subtotal": 7000,
    "taxTotal": 1260,
    "grandTotal": 8260,
    "invoiceId": "inv-20",
    "notes": "Executive interior contract SO-20"
  },
  {
    "id": "so-21",
    "orderNumber": "SO-2026-021",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-15",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-21-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 2,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 64000,
        "taxAmount": 11520,
        "total": 75520
      },
      {
        "id": "sol-21-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 2,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 36000,
        "taxAmount": 6480,
        "total": 42480
      }
    ],
    "subtotal": 100000,
    "taxTotal": 18000,
    "grandTotal": 118000,
    "invoiceId": "inv-21",
    "notes": "Executive interior contract SO-21"
  },
  {
    "id": "so-22",
    "orderNumber": "SO-2026-022",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-16",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-22-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 3,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 85500,
        "taxAmount": 15390,
        "total": 100890
      },
      {
        "id": "sol-22-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      }
    ],
    "subtotal": 114000,
    "taxTotal": 20520,
    "grandTotal": 134520,
    "notes": "Executive interior contract SO-22"
  },
  {
    "id": "so-23",
    "orderNumber": "SO-2026-023",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-16",
    "status": "QUOTATION",
    "lines": [
      {
        "id": "sol-23-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 4,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 168000,
        "taxAmount": 30240,
        "total": 198240
      },
      {
        "id": "sol-23-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 2,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 5000,
        "taxAmount": 900,
        "total": 5900
      }
    ],
    "subtotal": 173000,
    "taxTotal": 31140,
    "grandTotal": 204140,
    "notes": "Executive interior contract SO-23"
  },
  {
    "id": "so-24",
    "orderNumber": "SO-2026-024",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-17",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-24-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 1,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 8500,
        "taxAmount": 1530,
        "total": 10030
      },
      {
        "id": "sol-24-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 1,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 18000,
        "taxAmount": 3240,
        "total": 21240
      }
    ],
    "subtotal": 26500,
    "taxTotal": 4770,
    "grandTotal": 31270,
    "notes": "Executive interior contract SO-24"
  },
  {
    "id": "so-25",
    "orderNumber": "SO-2026-025",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-17",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-25-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 2,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 9000,
        "taxAmount": 1620,
        "total": 10620
      },
      {
        "id": "sol-25-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      }
    ],
    "subtotal": 66000,
    "taxTotal": 11880,
    "grandTotal": 77880,
    "invoiceId": "inv-25",
    "notes": "Executive interior contract SO-25"
  },
  {
    "id": "so-26",
    "orderNumber": "SO-2026-026",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-18",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-26-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 3,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 96000,
        "taxAmount": 17280,
        "total": 113280
      },
      {
        "id": "sol-26-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 1,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 2500,
        "taxAmount": 450,
        "total": 2950
      }
    ],
    "subtotal": 98500,
    "taxTotal": 17730,
    "grandTotal": 116230,
    "invoiceId": "inv-26",
    "notes": "Executive interior contract SO-26"
  },
  {
    "id": "so-27",
    "orderNumber": "SO-2026-027",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-18",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-27-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 4,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 114000,
        "taxAmount": 20520,
        "total": 134520
      },
      {
        "id": "sol-27-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 2,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 36000,
        "taxAmount": 6480,
        "total": 42480
      }
    ],
    "subtotal": 150000,
    "taxTotal": 27000,
    "grandTotal": 177000,
    "invoiceId": "inv-27",
    "notes": "Executive interior contract SO-27"
  },
  {
    "id": "so-28",
    "orderNumber": "SO-2026-028",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-19",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-28-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 1,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 42000,
        "taxAmount": 7560,
        "total": 49560
      },
      {
        "id": "sol-28-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      }
    ],
    "subtotal": 70500,
    "taxTotal": 12690,
    "grandTotal": 83190,
    "notes": "Executive interior contract SO-28"
  },
  {
    "id": "so-29",
    "orderNumber": "SO-2026-029",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-19",
    "status": "QUOTATION",
    "lines": [
      {
        "id": "sol-29-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 17000,
        "taxAmount": 3060,
        "total": 20060
      },
      {
        "id": "sol-29-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 2,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 5000,
        "taxAmount": 900,
        "total": 5900
      }
    ],
    "subtotal": 22000,
    "taxTotal": 3960,
    "grandTotal": 25960,
    "notes": "Executive interior contract SO-29"
  },
  {
    "id": "so-30",
    "orderNumber": "SO-2026-030",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-20",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-30-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 3,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 13500,
        "taxAmount": 2430,
        "total": 15930
      },
      {
        "id": "sol-30-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 1,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 18000,
        "taxAmount": 3240,
        "total": 21240
      }
    ],
    "subtotal": 31500,
    "taxTotal": 5670,
    "grandTotal": 37170,
    "notes": "Executive interior contract SO-30"
  },
  {
    "id": "so-31",
    "orderNumber": "SO-2026-031",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-20",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-31-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 4,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 128000,
        "taxAmount": 23040,
        "total": 151040
      },
      {
        "id": "sol-31-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      }
    ],
    "subtotal": 185000,
    "taxTotal": 33300,
    "grandTotal": 218300,
    "invoiceId": "inv-31",
    "notes": "Executive interior contract SO-31"
  },
  {
    "id": "so-32",
    "orderNumber": "SO-2026-032",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-21",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-32-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      },
      {
        "id": "sol-32-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 1,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 2500,
        "taxAmount": 450,
        "total": 2950
      }
    ],
    "subtotal": 31000,
    "taxTotal": 5580,
    "grandTotal": 36580,
    "invoiceId": "inv-32",
    "notes": "Executive interior contract SO-32"
  },
  {
    "id": "so-33",
    "orderNumber": "SO-2026-033",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-21",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-33-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 2,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 84000,
        "taxAmount": 15120,
        "total": 99120
      },
      {
        "id": "sol-33-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 2,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 36000,
        "taxAmount": 6480,
        "total": 42480
      }
    ],
    "subtotal": 120000,
    "taxTotal": 21600,
    "grandTotal": 141600,
    "invoiceId": "inv-33",
    "notes": "Executive interior contract SO-33"
  },
  {
    "id": "so-34",
    "orderNumber": "SO-2026-034",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-22",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-34-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 3,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 25500,
        "taxAmount": 4590,
        "total": 30090
      },
      {
        "id": "sol-34-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      }
    ],
    "subtotal": 54000,
    "taxTotal": 9720,
    "grandTotal": 63720,
    "notes": "Executive interior contract SO-34"
  },
  {
    "id": "so-35",
    "orderNumber": "SO-2026-035",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-22",
    "status": "QUOTATION",
    "lines": [
      {
        "id": "sol-35-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 4,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 18000,
        "taxAmount": 3240,
        "total": 21240
      },
      {
        "id": "sol-35-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 2,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 5000,
        "taxAmount": 900,
        "total": 5900
      }
    ],
    "subtotal": 23000,
    "taxTotal": 4140,
    "grandTotal": 27140,
    "notes": "Executive interior contract SO-35"
  },
  {
    "id": "so-36",
    "orderNumber": "SO-2026-036",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-23",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-36-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 1,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 32000,
        "taxAmount": 5760,
        "total": 37760
      },
      {
        "id": "sol-36-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 1,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 18000,
        "taxAmount": 3240,
        "total": 21240
      }
    ],
    "subtotal": 50000,
    "taxTotal": 9000,
    "grandTotal": 59000,
    "notes": "Executive interior contract SO-36"
  },
  {
    "id": "so-37",
    "orderNumber": "SO-2026-037",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-23",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-37-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      },
      {
        "id": "sol-37-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      }
    ],
    "subtotal": 114000,
    "taxTotal": 20520,
    "grandTotal": 134520,
    "invoiceId": "inv-37",
    "notes": "Executive interior contract SO-37"
  },
  {
    "id": "so-38",
    "orderNumber": "SO-2026-038",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-24",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-38-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 3,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 126000,
        "taxAmount": 22680,
        "total": 148680
      },
      {
        "id": "sol-38-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 1,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 2500,
        "taxAmount": 450,
        "total": 2950
      }
    ],
    "subtotal": 128500,
    "taxTotal": 23130,
    "grandTotal": 151630,
    "invoiceId": "inv-38",
    "notes": "Executive interior contract SO-38"
  },
  {
    "id": "so-39",
    "orderNumber": "SO-2026-039",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-24",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-39-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 4,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 34000,
        "taxAmount": 6120,
        "total": 40120
      },
      {
        "id": "sol-39-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 2,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 36000,
        "taxAmount": 6480,
        "total": 42480
      }
    ],
    "subtotal": 70000,
    "taxTotal": 12600,
    "grandTotal": 82600,
    "invoiceId": "inv-39",
    "notes": "Executive interior contract SO-39"
  },
  {
    "id": "so-40",
    "orderNumber": "SO-2026-040",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-25",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-40-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 1,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 4500,
        "taxAmount": 810,
        "total": 5310
      },
      {
        "id": "sol-40-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      }
    ],
    "subtotal": 33000,
    "taxTotal": 5940,
    "grandTotal": 38940,
    "notes": "Executive interior contract SO-40"
  },
  {
    "id": "so-41",
    "orderNumber": "SO-2026-041",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-25",
    "status": "QUOTATION",
    "lines": [
      {
        "id": "sol-41-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 2,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 64000,
        "taxAmount": 11520,
        "total": 75520
      },
      {
        "id": "sol-41-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 2,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 5000,
        "taxAmount": 900,
        "total": 5900
      }
    ],
    "subtotal": 69000,
    "taxTotal": 12420,
    "grandTotal": 81420,
    "notes": "Executive interior contract SO-41"
  },
  {
    "id": "so-42",
    "orderNumber": "SO-2026-042",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-26",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-42-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 3,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 85500,
        "taxAmount": 15390,
        "total": 100890
      },
      {
        "id": "sol-42-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 1,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 18000,
        "taxAmount": 3240,
        "total": 21240
      }
    ],
    "subtotal": 103500,
    "taxTotal": 18630,
    "grandTotal": 122130,
    "notes": "Executive interior contract SO-42"
  },
  {
    "id": "so-43",
    "orderNumber": "SO-2026-043",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-26",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-43-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 4,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 168000,
        "taxAmount": 30240,
        "total": 198240
      },
      {
        "id": "sol-43-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      }
    ],
    "subtotal": 225000,
    "taxTotal": 40500,
    "grandTotal": 265500,
    "invoiceId": "inv-43",
    "notes": "Executive interior contract SO-43"
  },
  {
    "id": "so-44",
    "orderNumber": "SO-2026-044",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-27",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-44-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 1,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 8500,
        "taxAmount": 1530,
        "total": 10030
      },
      {
        "id": "sol-44-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 1,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 2500,
        "taxAmount": 450,
        "total": 2950
      }
    ],
    "subtotal": 11000,
    "taxTotal": 1980,
    "grandTotal": 12980,
    "invoiceId": "inv-44",
    "notes": "Executive interior contract SO-44"
  },
  {
    "id": "so-45",
    "orderNumber": "SO-2026-045",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-27",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-45-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 2,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 9000,
        "taxAmount": 1620,
        "total": 10620
      },
      {
        "id": "sol-45-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 2,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 36000,
        "taxAmount": 6480,
        "total": 42480
      }
    ],
    "subtotal": 45000,
    "taxTotal": 8100,
    "grandTotal": 53100,
    "invoiceId": "inv-45",
    "notes": "Executive interior contract SO-45"
  },
  {
    "id": "so-46",
    "orderNumber": "SO-2026-046",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-28",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-46-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 3,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 96000,
        "taxAmount": 17280,
        "total": 113280
      },
      {
        "id": "sol-46-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      }
    ],
    "subtotal": 124500,
    "taxTotal": 22410,
    "grandTotal": 146910,
    "notes": "Executive interior contract SO-46"
  },
  {
    "id": "so-47",
    "orderNumber": "SO-2026-047",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-28",
    "status": "QUOTATION",
    "lines": [
      {
        "id": "sol-47-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 4,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 114000,
        "taxAmount": 20520,
        "total": 134520
      },
      {
        "id": "sol-47-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 2,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 5000,
        "taxAmount": 900,
        "total": 5900
      }
    ],
    "subtotal": 119000,
    "taxTotal": 21420,
    "grandTotal": 140420,
    "notes": "Executive interior contract SO-47"
  },
  {
    "id": "so-48",
    "orderNumber": "SO-2026-048",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-29",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-48-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 1,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 42000,
        "taxAmount": 7560,
        "total": 49560
      },
      {
        "id": "sol-48-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 1,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 18000,
        "taxAmount": 3240,
        "total": 21240
      }
    ],
    "subtotal": 60000,
    "taxTotal": 10800,
    "grandTotal": 70800,
    "notes": "Executive interior contract SO-48"
  },
  {
    "id": "so-49",
    "orderNumber": "SO-2026-049",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-29",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-49-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 17000,
        "taxAmount": 3060,
        "total": 20060
      },
      {
        "id": "sol-49-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      }
    ],
    "subtotal": 74000,
    "taxTotal": 13320,
    "grandTotal": 87320,
    "invoiceId": "inv-49",
    "notes": "Executive interior contract SO-49"
  },
  {
    "id": "so-50",
    "orderNumber": "SO-2026-050",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-30",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-50-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 3,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 13500,
        "taxAmount": 2430,
        "total": 15930
      },
      {
        "id": "sol-50-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 1,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 2500,
        "taxAmount": 450,
        "total": 2950
      }
    ],
    "subtotal": 16000,
    "taxTotal": 2880,
    "grandTotal": 18880,
    "invoiceId": "inv-50",
    "notes": "Executive interior contract SO-50"
  },
  {
    "id": "so-51",
    "orderNumber": "SO-2026-051",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-30",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-51-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 4,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 128000,
        "taxAmount": 23040,
        "total": 151040
      },
      {
        "id": "sol-51-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 2,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 36000,
        "taxAmount": 6480,
        "total": 42480
      }
    ],
    "subtotal": 164000,
    "taxTotal": 29520,
    "grandTotal": 193520,
    "invoiceId": "inv-51",
    "notes": "Executive interior contract SO-51"
  },
  {
    "id": "so-52",
    "orderNumber": "SO-2026-052",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-31",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-52-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      },
      {
        "id": "sol-52-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      }
    ],
    "subtotal": 57000,
    "taxTotal": 10260,
    "grandTotal": 67260,
    "notes": "Executive interior contract SO-52"
  },
  {
    "id": "so-53",
    "orderNumber": "SO-2026-053",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-01-31",
    "status": "QUOTATION",
    "lines": [
      {
        "id": "sol-53-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 2,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 84000,
        "taxAmount": 15120,
        "total": 99120
      },
      {
        "id": "sol-53-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 2,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 5000,
        "taxAmount": 900,
        "total": 5900
      }
    ],
    "subtotal": 89000,
    "taxTotal": 16020,
    "grandTotal": 105020,
    "notes": "Executive interior contract SO-53"
  },
  {
    "id": "so-54",
    "orderNumber": "SO-2026-054",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-01",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-54-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 3,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 25500,
        "taxAmount": 4590,
        "total": 30090
      },
      {
        "id": "sol-54-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 1,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 18000,
        "taxAmount": 3240,
        "total": 21240
      }
    ],
    "subtotal": 43500,
    "taxTotal": 7830,
    "grandTotal": 51330,
    "notes": "Executive interior contract SO-54"
  },
  {
    "id": "so-55",
    "orderNumber": "SO-2026-055",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-01",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-55-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 4,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 18000,
        "taxAmount": 3240,
        "total": 21240
      },
      {
        "id": "sol-55-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      }
    ],
    "subtotal": 75000,
    "taxTotal": 13500,
    "grandTotal": 88500,
    "invoiceId": "inv-55",
    "notes": "Executive interior contract SO-55"
  },
  {
    "id": "so-56",
    "orderNumber": "SO-2026-056",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-02",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-56-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 1,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 32000,
        "taxAmount": 5760,
        "total": 37760
      },
      {
        "id": "sol-56-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 1,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 2500,
        "taxAmount": 450,
        "total": 2950
      }
    ],
    "subtotal": 34500,
    "taxTotal": 6210,
    "grandTotal": 40710,
    "invoiceId": "inv-56",
    "notes": "Executive interior contract SO-56"
  },
  {
    "id": "so-57",
    "orderNumber": "SO-2026-057",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-02",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-57-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      },
      {
        "id": "sol-57-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 2,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 36000,
        "taxAmount": 6480,
        "total": 42480
      }
    ],
    "subtotal": 93000,
    "taxTotal": 16740,
    "grandTotal": 109740,
    "invoiceId": "inv-57",
    "notes": "Executive interior contract SO-57"
  },
  {
    "id": "so-58",
    "orderNumber": "SO-2026-058",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-03",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-58-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 3,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 126000,
        "taxAmount": 22680,
        "total": 148680
      },
      {
        "id": "sol-58-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      }
    ],
    "subtotal": 154500,
    "taxTotal": 27810,
    "grandTotal": 182310,
    "notes": "Executive interior contract SO-58"
  },
  {
    "id": "so-59",
    "orderNumber": "SO-2026-059",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-03",
    "status": "QUOTATION",
    "lines": [
      {
        "id": "sol-59-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 4,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 34000,
        "taxAmount": 6120,
        "total": 40120
      },
      {
        "id": "sol-59-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 2,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 5000,
        "taxAmount": 900,
        "total": 5900
      }
    ],
    "subtotal": 39000,
    "taxTotal": 7020,
    "grandTotal": 46020,
    "notes": "Executive interior contract SO-59"
  },
  {
    "id": "so-60",
    "orderNumber": "SO-2026-060",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-04",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-60-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 1,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 4500,
        "taxAmount": 810,
        "total": 5310
      },
      {
        "id": "sol-60-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 1,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 18000,
        "taxAmount": 3240,
        "total": 21240
      }
    ],
    "subtotal": 22500,
    "taxTotal": 4050,
    "grandTotal": 26550,
    "notes": "Executive interior contract SO-60"
  },
  {
    "id": "so-61",
    "orderNumber": "SO-2026-061",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-04",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-61-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 2,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 64000,
        "taxAmount": 11520,
        "total": 75520
      },
      {
        "id": "sol-61-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      }
    ],
    "subtotal": 121000,
    "taxTotal": 21780,
    "grandTotal": 142780,
    "invoiceId": "inv-61",
    "notes": "Executive interior contract SO-61"
  },
  {
    "id": "so-62",
    "orderNumber": "SO-2026-062",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-05",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-62-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 3,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 85500,
        "taxAmount": 15390,
        "total": 100890
      },
      {
        "id": "sol-62-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 1,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 2500,
        "taxAmount": 450,
        "total": 2950
      }
    ],
    "subtotal": 88000,
    "taxTotal": 15840,
    "grandTotal": 103840,
    "invoiceId": "inv-62",
    "notes": "Executive interior contract SO-62"
  },
  {
    "id": "so-63",
    "orderNumber": "SO-2026-063",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-05",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-63-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 4,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 168000,
        "taxAmount": 30240,
        "total": 198240
      },
      {
        "id": "sol-63-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 2,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 36000,
        "taxAmount": 6480,
        "total": 42480
      }
    ],
    "subtotal": 204000,
    "taxTotal": 36720,
    "grandTotal": 240720,
    "invoiceId": "inv-63",
    "notes": "Executive interior contract SO-63"
  },
  {
    "id": "so-64",
    "orderNumber": "SO-2026-064",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-06",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-64-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 1,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 8500,
        "taxAmount": 1530,
        "total": 10030
      },
      {
        "id": "sol-64-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      }
    ],
    "subtotal": 37000,
    "taxTotal": 6660,
    "grandTotal": 43660,
    "notes": "Executive interior contract SO-64"
  },
  {
    "id": "so-65",
    "orderNumber": "SO-2026-065",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-06",
    "status": "QUOTATION",
    "lines": [
      {
        "id": "sol-65-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 2,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 9000,
        "taxAmount": 1620,
        "total": 10620
      },
      {
        "id": "sol-65-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 2,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 5000,
        "taxAmount": 900,
        "total": 5900
      }
    ],
    "subtotal": 14000,
    "taxTotal": 2520,
    "grandTotal": 16520,
    "notes": "Executive interior contract SO-65"
  },
  {
    "id": "so-66",
    "orderNumber": "SO-2026-066",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-07",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-66-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 3,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 96000,
        "taxAmount": 17280,
        "total": 113280
      },
      {
        "id": "sol-66-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 1,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 18000,
        "taxAmount": 3240,
        "total": 21240
      }
    ],
    "subtotal": 114000,
    "taxTotal": 20520,
    "grandTotal": 134520,
    "notes": "Executive interior contract SO-66"
  },
  {
    "id": "so-67",
    "orderNumber": "SO-2026-067",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-07",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-67-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 4,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 114000,
        "taxAmount": 20520,
        "total": 134520
      },
      {
        "id": "sol-67-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      }
    ],
    "subtotal": 171000,
    "taxTotal": 30780,
    "grandTotal": 201780,
    "invoiceId": "inv-67",
    "notes": "Executive interior contract SO-67"
  },
  {
    "id": "so-68",
    "orderNumber": "SO-2026-068",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-08",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-68-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 1,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 42000,
        "taxAmount": 7560,
        "total": 49560
      },
      {
        "id": "sol-68-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 1,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 2500,
        "taxAmount": 450,
        "total": 2950
      }
    ],
    "subtotal": 44500,
    "taxTotal": 8010,
    "grandTotal": 52510,
    "invoiceId": "inv-68",
    "notes": "Executive interior contract SO-68"
  },
  {
    "id": "so-69",
    "orderNumber": "SO-2026-069",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-08",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-69-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 17000,
        "taxAmount": 3060,
        "total": 20060
      },
      {
        "id": "sol-69-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 2,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 36000,
        "taxAmount": 6480,
        "total": 42480
      }
    ],
    "subtotal": 53000,
    "taxTotal": 9540,
    "grandTotal": 62540,
    "invoiceId": "inv-69",
    "notes": "Executive interior contract SO-69"
  },
  {
    "id": "so-70",
    "orderNumber": "SO-2026-070",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-09",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-70-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 3,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 13500,
        "taxAmount": 2430,
        "total": 15930
      },
      {
        "id": "sol-70-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      }
    ],
    "subtotal": 42000,
    "taxTotal": 7560,
    "grandTotal": 49560,
    "notes": "Executive interior contract SO-70"
  },
  {
    "id": "so-71",
    "orderNumber": "SO-2026-071",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-09",
    "status": "QUOTATION",
    "lines": [
      {
        "id": "sol-71-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 4,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 128000,
        "taxAmount": 23040,
        "total": 151040
      },
      {
        "id": "sol-71-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 2,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 5000,
        "taxAmount": 900,
        "total": 5900
      }
    ],
    "subtotal": 133000,
    "taxTotal": 23940,
    "grandTotal": 156940,
    "notes": "Executive interior contract SO-71"
  },
  {
    "id": "so-72",
    "orderNumber": "SO-2026-072",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-10",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-72-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      },
      {
        "id": "sol-72-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 1,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 18000,
        "taxAmount": 3240,
        "total": 21240
      }
    ],
    "subtotal": 46500,
    "taxTotal": 8370,
    "grandTotal": 54870,
    "notes": "Executive interior contract SO-72"
  },
  {
    "id": "so-73",
    "orderNumber": "SO-2026-073",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-10",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-73-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 2,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 84000,
        "taxAmount": 15120,
        "total": 99120
      },
      {
        "id": "sol-73-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      }
    ],
    "subtotal": 141000,
    "taxTotal": 25380,
    "grandTotal": 166380,
    "invoiceId": "inv-73",
    "notes": "Executive interior contract SO-73"
  },
  {
    "id": "so-74",
    "orderNumber": "SO-2026-074",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-11",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-74-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 3,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 25500,
        "taxAmount": 4590,
        "total": 30090
      },
      {
        "id": "sol-74-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 1,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 2500,
        "taxAmount": 450,
        "total": 2950
      }
    ],
    "subtotal": 28000,
    "taxTotal": 5040,
    "grandTotal": 33040,
    "invoiceId": "inv-74",
    "notes": "Executive interior contract SO-74"
  },
  {
    "id": "so-75",
    "orderNumber": "SO-2026-075",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-11",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-75-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 4,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 18000,
        "taxAmount": 3240,
        "total": 21240
      },
      {
        "id": "sol-75-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 2,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 36000,
        "taxAmount": 6480,
        "total": 42480
      }
    ],
    "subtotal": 54000,
    "taxTotal": 9720,
    "grandTotal": 63720,
    "invoiceId": "inv-75",
    "notes": "Executive interior contract SO-75"
  },
  {
    "id": "so-76",
    "orderNumber": "SO-2026-076",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-12",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-76-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 1,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 32000,
        "taxAmount": 5760,
        "total": 37760
      },
      {
        "id": "sol-76-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      }
    ],
    "subtotal": 60500,
    "taxTotal": 10890,
    "grandTotal": 71390,
    "notes": "Executive interior contract SO-76"
  },
  {
    "id": "so-77",
    "orderNumber": "SO-2026-077",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-12",
    "status": "QUOTATION",
    "lines": [
      {
        "id": "sol-77-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      },
      {
        "id": "sol-77-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 2,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 5000,
        "taxAmount": 900,
        "total": 5900
      }
    ],
    "subtotal": 62000,
    "taxTotal": 11160,
    "grandTotal": 73160,
    "notes": "Executive interior contract SO-77"
  },
  {
    "id": "so-78",
    "orderNumber": "SO-2026-078",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-13",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-78-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 3,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 126000,
        "taxAmount": 22680,
        "total": 148680
      },
      {
        "id": "sol-78-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 1,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 18000,
        "taxAmount": 3240,
        "total": 21240
      }
    ],
    "subtotal": 144000,
    "taxTotal": 25920,
    "grandTotal": 169920,
    "notes": "Executive interior contract SO-78"
  },
  {
    "id": "so-79",
    "orderNumber": "SO-2026-079",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-13",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-79-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 4,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 34000,
        "taxAmount": 6120,
        "total": 40120
      },
      {
        "id": "sol-79-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      }
    ],
    "subtotal": 91000,
    "taxTotal": 16380,
    "grandTotal": 107380,
    "invoiceId": "inv-79",
    "notes": "Executive interior contract SO-79"
  },
  {
    "id": "so-80",
    "orderNumber": "SO-2026-080",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-14",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-80-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 1,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 4500,
        "taxAmount": 810,
        "total": 5310
      },
      {
        "id": "sol-80-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 1,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 2500,
        "taxAmount": 450,
        "total": 2950
      }
    ],
    "subtotal": 7000,
    "taxTotal": 1260,
    "grandTotal": 8260,
    "invoiceId": "inv-80",
    "notes": "Executive interior contract SO-80"
  },
  {
    "id": "so-81",
    "orderNumber": "SO-2026-081",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-14",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-81-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 2,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 64000,
        "taxAmount": 11520,
        "total": 75520
      },
      {
        "id": "sol-81-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 2,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 36000,
        "taxAmount": 6480,
        "total": 42480
      }
    ],
    "subtotal": 100000,
    "taxTotal": 18000,
    "grandTotal": 118000,
    "invoiceId": "inv-81",
    "notes": "Executive interior contract SO-81"
  },
  {
    "id": "so-82",
    "orderNumber": "SO-2026-082",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-15",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-82-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 3,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 85500,
        "taxAmount": 15390,
        "total": 100890
      },
      {
        "id": "sol-82-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      }
    ],
    "subtotal": 114000,
    "taxTotal": 20520,
    "grandTotal": 134520,
    "notes": "Executive interior contract SO-82"
  },
  {
    "id": "so-83",
    "orderNumber": "SO-2026-083",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-15",
    "status": "QUOTATION",
    "lines": [
      {
        "id": "sol-83-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 4,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 168000,
        "taxAmount": 30240,
        "total": 198240
      },
      {
        "id": "sol-83-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 2,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 5000,
        "taxAmount": 900,
        "total": 5900
      }
    ],
    "subtotal": 173000,
    "taxTotal": 31140,
    "grandTotal": 204140,
    "notes": "Executive interior contract SO-83"
  },
  {
    "id": "so-84",
    "orderNumber": "SO-2026-084",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-16",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-84-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 1,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 8500,
        "taxAmount": 1530,
        "total": 10030
      },
      {
        "id": "sol-84-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 1,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 18000,
        "taxAmount": 3240,
        "total": 21240
      }
    ],
    "subtotal": 26500,
    "taxTotal": 4770,
    "grandTotal": 31270,
    "notes": "Executive interior contract SO-84"
  },
  {
    "id": "so-85",
    "orderNumber": "SO-2026-085",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-16",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-85-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 2,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 9000,
        "taxAmount": 1620,
        "total": 10620
      },
      {
        "id": "sol-85-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      }
    ],
    "subtotal": 66000,
    "taxTotal": 11880,
    "grandTotal": 77880,
    "invoiceId": "inv-85",
    "notes": "Executive interior contract SO-85"
  },
  {
    "id": "so-86",
    "orderNumber": "SO-2026-086",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-17",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-86-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 3,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 96000,
        "taxAmount": 17280,
        "total": 113280
      },
      {
        "id": "sol-86-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 1,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 2500,
        "taxAmount": 450,
        "total": 2950
      }
    ],
    "subtotal": 98500,
    "taxTotal": 17730,
    "grandTotal": 116230,
    "invoiceId": "inv-86",
    "notes": "Executive interior contract SO-86"
  },
  {
    "id": "so-87",
    "orderNumber": "SO-2026-087",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-17",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-87-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 4,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 114000,
        "taxAmount": 20520,
        "total": 134520
      },
      {
        "id": "sol-87-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 2,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 36000,
        "taxAmount": 6480,
        "total": 42480
      }
    ],
    "subtotal": 150000,
    "taxTotal": 27000,
    "grandTotal": 177000,
    "invoiceId": "inv-87",
    "notes": "Executive interior contract SO-87"
  },
  {
    "id": "so-88",
    "orderNumber": "SO-2026-088",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-18",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-88-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 1,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 42000,
        "taxAmount": 7560,
        "total": 49560
      },
      {
        "id": "sol-88-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      }
    ],
    "subtotal": 70500,
    "taxTotal": 12690,
    "grandTotal": 83190,
    "notes": "Executive interior contract SO-88"
  },
  {
    "id": "so-89",
    "orderNumber": "SO-2026-089",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-18",
    "status": "QUOTATION",
    "lines": [
      {
        "id": "sol-89-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 17000,
        "taxAmount": 3060,
        "total": 20060
      },
      {
        "id": "sol-89-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 2,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 5000,
        "taxAmount": 900,
        "total": 5900
      }
    ],
    "subtotal": 22000,
    "taxTotal": 3960,
    "grandTotal": 25960,
    "notes": "Executive interior contract SO-89"
  },
  {
    "id": "so-90",
    "orderNumber": "SO-2026-090",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-19",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-90-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 3,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 13500,
        "taxAmount": 2430,
        "total": 15930
      },
      {
        "id": "sol-90-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 1,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 18000,
        "taxAmount": 3240,
        "total": 21240
      }
    ],
    "subtotal": 31500,
    "taxTotal": 5670,
    "grandTotal": 37170,
    "notes": "Executive interior contract SO-90"
  },
  {
    "id": "so-91",
    "orderNumber": "SO-2026-091",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-19",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-91-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 4,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 128000,
        "taxAmount": 23040,
        "total": 151040
      },
      {
        "id": "sol-91-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      }
    ],
    "subtotal": 185000,
    "taxTotal": 33300,
    "grandTotal": 218300,
    "invoiceId": "inv-91",
    "notes": "Executive interior contract SO-91"
  },
  {
    "id": "so-92",
    "orderNumber": "SO-2026-092",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-20",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-92-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      },
      {
        "id": "sol-92-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 1,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 2500,
        "taxAmount": 450,
        "total": 2950
      }
    ],
    "subtotal": 31000,
    "taxTotal": 5580,
    "grandTotal": 36580,
    "invoiceId": "inv-92",
    "notes": "Executive interior contract SO-92"
  },
  {
    "id": "so-93",
    "orderNumber": "SO-2026-093",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-20",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-93-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 2,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 84000,
        "taxAmount": 15120,
        "total": 99120
      },
      {
        "id": "sol-93-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 2,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 36000,
        "taxAmount": 6480,
        "total": 42480
      }
    ],
    "subtotal": 120000,
    "taxTotal": 21600,
    "grandTotal": 141600,
    "invoiceId": "inv-93",
    "notes": "Executive interior contract SO-93"
  },
  {
    "id": "so-94",
    "orderNumber": "SO-2026-094",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-21",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-94-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 3,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 25500,
        "taxAmount": 4590,
        "total": 30090
      },
      {
        "id": "sol-94-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      }
    ],
    "subtotal": 54000,
    "taxTotal": 9720,
    "grandTotal": 63720,
    "notes": "Executive interior contract SO-94"
  },
  {
    "id": "so-95",
    "orderNumber": "SO-2026-095",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-21",
    "status": "QUOTATION",
    "lines": [
      {
        "id": "sol-95-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 4,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 18000,
        "taxAmount": 3240,
        "total": 21240
      },
      {
        "id": "sol-95-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 2,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 5000,
        "taxAmount": 900,
        "total": 5900
      }
    ],
    "subtotal": 23000,
    "taxTotal": 4140,
    "grandTotal": 27140,
    "notes": "Executive interior contract SO-95"
  },
  {
    "id": "so-96",
    "orderNumber": "SO-2026-096",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-22",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-96-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 1,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 32000,
        "taxAmount": 5760,
        "total": 37760
      },
      {
        "id": "sol-96-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 1,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 18000,
        "taxAmount": 3240,
        "total": 21240
      }
    ],
    "subtotal": 50000,
    "taxTotal": 9000,
    "grandTotal": 59000,
    "notes": "Executive interior contract SO-96"
  },
  {
    "id": "so-97",
    "orderNumber": "SO-2026-097",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-22",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-97-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      },
      {
        "id": "sol-97-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      }
    ],
    "subtotal": 114000,
    "taxTotal": 20520,
    "grandTotal": 134520,
    "invoiceId": "inv-97",
    "notes": "Executive interior contract SO-97"
  },
  {
    "id": "so-98",
    "orderNumber": "SO-2026-098",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-23",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-98-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 3,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 126000,
        "taxAmount": 22680,
        "total": 148680
      },
      {
        "id": "sol-98-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 1,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 2500,
        "taxAmount": 450,
        "total": 2950
      }
    ],
    "subtotal": 128500,
    "taxTotal": 23130,
    "grandTotal": 151630,
    "invoiceId": "inv-98",
    "notes": "Executive interior contract SO-98"
  },
  {
    "id": "so-99",
    "orderNumber": "SO-2026-099",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-23",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-99-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 4,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 34000,
        "taxAmount": 6120,
        "total": 40120
      },
      {
        "id": "sol-99-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 2,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 36000,
        "taxAmount": 6480,
        "total": 42480
      }
    ],
    "subtotal": 70000,
    "taxTotal": 12600,
    "grandTotal": 82600,
    "invoiceId": "inv-99",
    "notes": "Executive interior contract SO-99"
  },
  {
    "id": "so-100",
    "orderNumber": "SO-2026-100",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerPhone": "+91 98765 43220",
    "orderDate": "2026-02-24",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-100-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 1,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 4500,
        "taxAmount": 810,
        "total": 5310
      },
      {
        "id": "sol-100-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      }
    ],
    "subtotal": 33000,
    "taxTotal": 5940,
    "grandTotal": 38940,
    "notes": "Executive interior contract SO-100"
  },
  {
    "id": "so-101",
    "orderNumber": "SO-2026-101",
    "customerId": "cnt-3",
    "customerName": "Metro Spaces Interiors",
    "customerEmail": "metrospacesinteriors@example.com",
    "customerPhone": "+91 98100 00000",
    "orderDate": "2026-02-24",
    "status": "QUOTATION",
    "lines": [
      {
        "id": "sol-101-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 2,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 64000,
        "taxAmount": 11520,
        "total": 75520
      },
      {
        "id": "sol-101-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 2,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 5000,
        "taxAmount": 900,
        "total": 5900
      }
    ],
    "subtotal": 69000,
    "taxTotal": 12420,
    "grandTotal": 81420,
    "notes": "Executive interior contract SO-101"
  },
  {
    "id": "so-102",
    "orderNumber": "SO-2026-102",
    "customerId": "cnt-1",
    "customerName": "Nimesh Pathak",
    "customerEmail": "nimesh@gmail.com",
    "customerPhone": "+91 98765 43210",
    "orderDate": "2026-02-25",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-102-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 3,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 85500,
        "taxAmount": 15390,
        "total": 100890
      },
      {
        "id": "sol-102-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 1,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 18000,
        "taxAmount": 3240,
        "total": 21240
      }
    ],
    "subtotal": 103500,
    "taxTotal": 18630,
    "grandTotal": 122130,
    "notes": "Executive interior contract SO-102"
  },
  {
    "id": "so-103",
    "orderNumber": "SO-2026-103",
    "customerId": "cnt-2",
    "customerName": "Azure Furniture Supplies",
    "customerEmail": "azure@furniture.com",
    "customerPhone": "+91 98234 56789",
    "orderDate": "2026-02-25",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-103-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 4,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 168000,
        "taxAmount": 30240,
        "total": 198240
      },
      {
        "id": "sol-103-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      }
    ],
    "subtotal": 225000,
    "taxTotal": 40500,
    "grandTotal": 265500,
    "invoiceId": "inv-103",
    "notes": "Executive interior contract SO-103"
  },
  {
    "id": "so-104",
    "orderNumber": "SO-2026-104",
    "customerId": "cnt-3",
    "customerName": "Metro Spaces Interiors",
    "customerEmail": "metrospacesinteriors@example.com",
    "customerPhone": "+91 98100 00000",
    "orderDate": "2026-02-26",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-104-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 1,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 8500,
        "taxAmount": 1530,
        "total": 10030
      },
      {
        "id": "sol-104-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 1,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 2500,
        "taxAmount": 450,
        "total": 2950
      }
    ],
    "subtotal": 11000,
    "taxTotal": 1980,
    "grandTotal": 12980,
    "invoiceId": "inv-104",
    "notes": "Executive interior contract SO-104"
  },
  {
    "id": "so-105",
    "orderNumber": "SO-2026-105",
    "customerId": "cnt-1",
    "customerName": "Nimesh Pathak",
    "customerEmail": "nimesh@gmail.com",
    "customerPhone": "+91 98765 43210",
    "orderDate": "2026-02-26",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-105-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 2,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 9000,
        "taxAmount": 1620,
        "total": 10620
      },
      {
        "id": "sol-105-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 2,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 36000,
        "taxAmount": 6480,
        "total": 42480
      }
    ],
    "subtotal": 45000,
    "taxTotal": 8100,
    "grandTotal": 53100,
    "invoiceId": "inv-105",
    "notes": "Executive interior contract SO-105"
  },
  {
    "id": "so-106",
    "orderNumber": "SO-2026-106",
    "customerId": "cnt-2",
    "customerName": "Azure Furniture Supplies",
    "customerEmail": "azure@furniture.com",
    "customerPhone": "+91 98234 56789",
    "orderDate": "2026-02-27",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-106-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 3,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 96000,
        "taxAmount": 17280,
        "total": 113280
      },
      {
        "id": "sol-106-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      }
    ],
    "subtotal": 124500,
    "taxTotal": 22410,
    "grandTotal": 146910,
    "notes": "Executive interior contract SO-106"
  },
  {
    "id": "so-107",
    "orderNumber": "SO-2026-107",
    "customerId": "cnt-3",
    "customerName": "Metro Spaces Interiors",
    "customerEmail": "metrospacesinteriors@example.com",
    "customerPhone": "+91 98100 00000",
    "orderDate": "2026-02-27",
    "status": "QUOTATION",
    "lines": [
      {
        "id": "sol-107-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 4,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 114000,
        "taxAmount": 20520,
        "total": 134520
      },
      {
        "id": "sol-107-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 2,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 5000,
        "taxAmount": 900,
        "total": 5900
      }
    ],
    "subtotal": 119000,
    "taxTotal": 21420,
    "grandTotal": 140420,
    "notes": "Executive interior contract SO-107"
  },
  {
    "id": "so-108",
    "orderNumber": "SO-2026-108",
    "customerId": "cnt-1",
    "customerName": "Nimesh Pathak",
    "customerEmail": "nimesh@gmail.com",
    "customerPhone": "+91 98765 43210",
    "orderDate": "2026-02-28",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "sol-108-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 1,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 42000,
        "taxAmount": 7560,
        "total": 49560
      },
      {
        "id": "sol-108-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 1,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 18000,
        "taxAmount": 3240,
        "total": 21240
      }
    ],
    "subtotal": 60000,
    "taxTotal": 10800,
    "grandTotal": 70800,
    "notes": "Executive interior contract SO-108"
  },
  {
    "id": "so-109",
    "orderNumber": "SO-2026-109",
    "customerId": "cnt-2",
    "customerName": "Azure Furniture Supplies",
    "customerEmail": "azure@furniture.com",
    "customerPhone": "+91 98234 56789",
    "orderDate": "2026-02-28",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-109-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 17000,
        "taxAmount": 3060,
        "total": 20060
      },
      {
        "id": "sol-109-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      }
    ],
    "subtotal": 74000,
    "taxTotal": 13320,
    "grandTotal": 87320,
    "invoiceId": "inv-109",
    "notes": "Executive interior contract SO-109"
  },
  {
    "id": "so-110",
    "orderNumber": "SO-2026-110",
    "customerId": "cnt-3",
    "customerName": "Metro Spaces Interiors",
    "customerEmail": "metrospacesinteriors@example.com",
    "customerPhone": "+91 98100 00000",
    "orderDate": "2026-03-01",
    "status": "INVOICED",
    "lines": [
      {
        "id": "sol-110-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 3,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 13500,
        "taxAmount": 2430,
        "total": 15930
      },
      {
        "id": "sol-110-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 1,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 2500,
        "taxAmount": 450,
        "total": 2950
      }
    ],
    "subtotal": 16000,
    "taxTotal": 2880,
    "grandTotal": 18880,
    "invoiceId": "inv-110",
    "notes": "Executive interior contract SO-110"
  }
];

// ==========================================
// TRANSACTIONS: PURCHASE ORDERS
// ==========================================
export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    "id": "po-1",
    "poNumber": "PO-2026-001",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-05",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-1-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "pol-1-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 17700,
    "taxTotal": 3186,
    "grandTotal": 20886,
    "billId": "bill-1",
    "notes": "Raw material procurement batch PO-1"
  },
  {
    "id": "po-2",
    "poNumber": "PO-2026-002",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-06",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "pol-2-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "pol-2-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 45600,
    "taxTotal": 8208,
    "grandTotal": 53808,
    "notes": "Raw material procurement batch PO-2"
  },
  {
    "id": "po-3",
    "poNumber": "PO-2026-003",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-06",
    "status": "RECEIVED",
    "lines": [
      {
        "id": "pol-3-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "pol-3-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 31800,
    "taxTotal": 5724,
    "grandTotal": 37524,
    "notes": "Raw material procurement batch PO-3"
  },
  {
    "id": "po-4",
    "poNumber": "PO-2026-004",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-07",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-4-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "pol-4-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 31100,
    "taxTotal": 5598,
    "grandTotal": 36698,
    "billId": "bill-4",
    "notes": "Raw material procurement batch PO-4"
  },
  {
    "id": "po-5",
    "poNumber": "PO-2026-005",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-07",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-5-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "pol-5-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 56800,
    "taxTotal": 10224,
    "grandTotal": 67024,
    "billId": "bill-5",
    "notes": "Raw material procurement batch PO-5"
  },
  {
    "id": "po-6",
    "poNumber": "PO-2026-006",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-08",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-6-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "pol-6-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 17600,
    "taxTotal": 3168,
    "grandTotal": 20768,
    "billId": "bill-6",
    "notes": "Raw material procurement batch PO-6"
  },
  {
    "id": "po-7",
    "poNumber": "PO-2026-007",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-08",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "pol-7-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "pol-7-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 43400,
    "taxTotal": 7812,
    "grandTotal": 51212,
    "notes": "Raw material procurement batch PO-7"
  },
  {
    "id": "po-8",
    "poNumber": "PO-2026-008",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-09",
    "status": "RECEIVED",
    "lines": [
      {
        "id": "pol-8-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "pol-8-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 35200,
    "taxTotal": 6336,
    "grandTotal": 41536,
    "notes": "Raw material procurement batch PO-8"
  },
  {
    "id": "po-9",
    "poNumber": "PO-2026-009",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-09",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-9-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "pol-9-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 30000,
    "taxTotal": 5400,
    "grandTotal": 35400,
    "billId": "bill-9",
    "notes": "Raw material procurement batch PO-9"
  },
  {
    "id": "po-10",
    "poNumber": "PO-2026-010",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-10",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-10-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "pol-10-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 56700,
    "taxTotal": 10206,
    "grandTotal": 66906,
    "billId": "bill-10",
    "notes": "Raw material procurement batch PO-10"
  },
  {
    "id": "po-11",
    "poNumber": "PO-2026-011",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-10",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-11-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "pol-11-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 15400,
    "taxTotal": 2772,
    "grandTotal": 18172,
    "billId": "bill-11",
    "notes": "Raw material procurement batch PO-11"
  },
  {
    "id": "po-12",
    "poNumber": "PO-2026-012",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-11",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "pol-12-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "pol-12-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 46800,
    "taxTotal": 8424,
    "grandTotal": 55224,
    "notes": "Raw material procurement batch PO-12"
  },
  {
    "id": "po-13",
    "poNumber": "PO-2026-013",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-11",
    "status": "RECEIVED",
    "lines": [
      {
        "id": "pol-13-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "pol-13-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 34100,
    "taxTotal": 6138,
    "grandTotal": 40238,
    "notes": "Raw material procurement batch PO-13"
  },
  {
    "id": "po-14",
    "poNumber": "PO-2026-014",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-12",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-14-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "pol-14-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 29900,
    "taxTotal": 5382,
    "grandTotal": 35282,
    "billId": "bill-14",
    "notes": "Raw material procurement batch PO-14"
  },
  {
    "id": "po-15",
    "poNumber": "PO-2026-015",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-12",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-15-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "pol-15-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 54500,
    "taxTotal": 9810,
    "grandTotal": 64310,
    "billId": "bill-15",
    "notes": "Raw material procurement batch PO-15"
  },
  {
    "id": "po-16",
    "poNumber": "PO-2026-016",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-13",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-16-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "pol-16-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 18800,
    "taxTotal": 3384,
    "grandTotal": 22184,
    "billId": "bill-16",
    "notes": "Raw material procurement batch PO-16"
  },
  {
    "id": "po-17",
    "poNumber": "PO-2026-017",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-13",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "pol-17-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "pol-17-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 45700,
    "taxTotal": 8226,
    "grandTotal": 53926,
    "notes": "Raw material procurement batch PO-17"
  },
  {
    "id": "po-18",
    "poNumber": "PO-2026-018",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-14",
    "status": "RECEIVED",
    "lines": [
      {
        "id": "pol-18-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "pol-18-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 34000,
    "taxTotal": 6120,
    "grandTotal": 40120,
    "notes": "Raw material procurement batch PO-18"
  },
  {
    "id": "po-19",
    "poNumber": "PO-2026-019",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-14",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-19-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "pol-19-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 27700,
    "taxTotal": 4986,
    "grandTotal": 32686,
    "billId": "bill-19",
    "notes": "Raw material procurement batch PO-19"
  },
  {
    "id": "po-20",
    "poNumber": "PO-2026-020",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-15",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-20-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "pol-20-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 57900,
    "taxTotal": 10422,
    "grandTotal": 68322,
    "billId": "bill-20",
    "notes": "Raw material procurement batch PO-20"
  },
  {
    "id": "po-21",
    "poNumber": "PO-2026-021",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-15",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-21-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "pol-21-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 17700,
    "taxTotal": 3186,
    "grandTotal": 20886,
    "billId": "bill-21",
    "notes": "Raw material procurement batch PO-21"
  },
  {
    "id": "po-22",
    "poNumber": "PO-2026-022",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-16",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "pol-22-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "pol-22-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 45600,
    "taxTotal": 8208,
    "grandTotal": 53808,
    "notes": "Raw material procurement batch PO-22"
  },
  {
    "id": "po-23",
    "poNumber": "PO-2026-023",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-16",
    "status": "RECEIVED",
    "lines": [
      {
        "id": "pol-23-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "pol-23-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 31800,
    "taxTotal": 5724,
    "grandTotal": 37524,
    "notes": "Raw material procurement batch PO-23"
  },
  {
    "id": "po-24",
    "poNumber": "PO-2026-024",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-17",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-24-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "pol-24-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 31100,
    "taxTotal": 5598,
    "grandTotal": 36698,
    "billId": "bill-24",
    "notes": "Raw material procurement batch PO-24"
  },
  {
    "id": "po-25",
    "poNumber": "PO-2026-025",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-17",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-25-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "pol-25-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 56800,
    "taxTotal": 10224,
    "grandTotal": 67024,
    "billId": "bill-25",
    "notes": "Raw material procurement batch PO-25"
  },
  {
    "id": "po-26",
    "poNumber": "PO-2026-026",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-18",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-26-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "pol-26-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 17600,
    "taxTotal": 3168,
    "grandTotal": 20768,
    "billId": "bill-26",
    "notes": "Raw material procurement batch PO-26"
  },
  {
    "id": "po-27",
    "poNumber": "PO-2026-027",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-18",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "pol-27-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "pol-27-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 43400,
    "taxTotal": 7812,
    "grandTotal": 51212,
    "notes": "Raw material procurement batch PO-27"
  },
  {
    "id": "po-28",
    "poNumber": "PO-2026-028",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-19",
    "status": "RECEIVED",
    "lines": [
      {
        "id": "pol-28-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "pol-28-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 35200,
    "taxTotal": 6336,
    "grandTotal": 41536,
    "notes": "Raw material procurement batch PO-28"
  },
  {
    "id": "po-29",
    "poNumber": "PO-2026-029",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-19",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-29-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "pol-29-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 30000,
    "taxTotal": 5400,
    "grandTotal": 35400,
    "billId": "bill-29",
    "notes": "Raw material procurement batch PO-29"
  },
  {
    "id": "po-30",
    "poNumber": "PO-2026-030",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-20",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-30-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "pol-30-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 56700,
    "taxTotal": 10206,
    "grandTotal": 66906,
    "billId": "bill-30",
    "notes": "Raw material procurement batch PO-30"
  },
  {
    "id": "po-31",
    "poNumber": "PO-2026-031",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-20",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-31-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "pol-31-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 15400,
    "taxTotal": 2772,
    "grandTotal": 18172,
    "billId": "bill-31",
    "notes": "Raw material procurement batch PO-31"
  },
  {
    "id": "po-32",
    "poNumber": "PO-2026-032",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-21",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "pol-32-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "pol-32-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 46800,
    "taxTotal": 8424,
    "grandTotal": 55224,
    "notes": "Raw material procurement batch PO-32"
  },
  {
    "id": "po-33",
    "poNumber": "PO-2026-033",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-21",
    "status": "RECEIVED",
    "lines": [
      {
        "id": "pol-33-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "pol-33-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 34100,
    "taxTotal": 6138,
    "grandTotal": 40238,
    "notes": "Raw material procurement batch PO-33"
  },
  {
    "id": "po-34",
    "poNumber": "PO-2026-034",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-22",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-34-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "pol-34-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 29900,
    "taxTotal": 5382,
    "grandTotal": 35282,
    "billId": "bill-34",
    "notes": "Raw material procurement batch PO-34"
  },
  {
    "id": "po-35",
    "poNumber": "PO-2026-035",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-22",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-35-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "pol-35-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 54500,
    "taxTotal": 9810,
    "grandTotal": 64310,
    "billId": "bill-35",
    "notes": "Raw material procurement batch PO-35"
  },
  {
    "id": "po-36",
    "poNumber": "PO-2026-036",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-23",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-36-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "pol-36-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 18800,
    "taxTotal": 3384,
    "grandTotal": 22184,
    "billId": "bill-36",
    "notes": "Raw material procurement batch PO-36"
  },
  {
    "id": "po-37",
    "poNumber": "PO-2026-037",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-23",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "pol-37-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "pol-37-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 45700,
    "taxTotal": 8226,
    "grandTotal": 53926,
    "notes": "Raw material procurement batch PO-37"
  },
  {
    "id": "po-38",
    "poNumber": "PO-2026-038",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-24",
    "status": "RECEIVED",
    "lines": [
      {
        "id": "pol-38-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "pol-38-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 34000,
    "taxTotal": 6120,
    "grandTotal": 40120,
    "notes": "Raw material procurement batch PO-38"
  },
  {
    "id": "po-39",
    "poNumber": "PO-2026-039",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-24",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-39-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "pol-39-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 27700,
    "taxTotal": 4986,
    "grandTotal": 32686,
    "billId": "bill-39",
    "notes": "Raw material procurement batch PO-39"
  },
  {
    "id": "po-40",
    "poNumber": "PO-2026-040",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-25",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-40-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "pol-40-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 57900,
    "taxTotal": 10422,
    "grandTotal": 68322,
    "billId": "bill-40",
    "notes": "Raw material procurement batch PO-40"
  },
  {
    "id": "po-41",
    "poNumber": "PO-2026-041",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-25",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-41-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "pol-41-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 17700,
    "taxTotal": 3186,
    "grandTotal": 20886,
    "billId": "bill-41",
    "notes": "Raw material procurement batch PO-41"
  },
  {
    "id": "po-42",
    "poNumber": "PO-2026-042",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-26",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "pol-42-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "pol-42-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 45600,
    "taxTotal": 8208,
    "grandTotal": 53808,
    "notes": "Raw material procurement batch PO-42"
  },
  {
    "id": "po-43",
    "poNumber": "PO-2026-043",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-26",
    "status": "RECEIVED",
    "lines": [
      {
        "id": "pol-43-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "pol-43-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 31800,
    "taxTotal": 5724,
    "grandTotal": 37524,
    "notes": "Raw material procurement batch PO-43"
  },
  {
    "id": "po-44",
    "poNumber": "PO-2026-044",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-27",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-44-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "pol-44-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 31100,
    "taxTotal": 5598,
    "grandTotal": 36698,
    "billId": "bill-44",
    "notes": "Raw material procurement batch PO-44"
  },
  {
    "id": "po-45",
    "poNumber": "PO-2026-045",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-27",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-45-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "pol-45-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 56800,
    "taxTotal": 10224,
    "grandTotal": 67024,
    "billId": "bill-45",
    "notes": "Raw material procurement batch PO-45"
  },
  {
    "id": "po-46",
    "poNumber": "PO-2026-046",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-28",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-46-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "pol-46-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 17600,
    "taxTotal": 3168,
    "grandTotal": 20768,
    "billId": "bill-46",
    "notes": "Raw material procurement batch PO-46"
  },
  {
    "id": "po-47",
    "poNumber": "PO-2026-047",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-28",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "pol-47-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "pol-47-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 43400,
    "taxTotal": 7812,
    "grandTotal": 51212,
    "notes": "Raw material procurement batch PO-47"
  },
  {
    "id": "po-48",
    "poNumber": "PO-2026-048",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-29",
    "status": "RECEIVED",
    "lines": [
      {
        "id": "pol-48-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "pol-48-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 35200,
    "taxTotal": 6336,
    "grandTotal": 41536,
    "notes": "Raw material procurement batch PO-48"
  },
  {
    "id": "po-49",
    "poNumber": "PO-2026-049",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-29",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-49-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "pol-49-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 30000,
    "taxTotal": 5400,
    "grandTotal": 35400,
    "billId": "bill-49",
    "notes": "Raw material procurement batch PO-49"
  },
  {
    "id": "po-50",
    "poNumber": "PO-2026-050",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-30",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-50-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "pol-50-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 56700,
    "taxTotal": 10206,
    "grandTotal": 66906,
    "billId": "bill-50",
    "notes": "Raw material procurement batch PO-50"
  },
  {
    "id": "po-51",
    "poNumber": "PO-2026-051",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-30",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-51-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "pol-51-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 15400,
    "taxTotal": 2772,
    "grandTotal": 18172,
    "billId": "bill-51",
    "notes": "Raw material procurement batch PO-51"
  },
  {
    "id": "po-52",
    "poNumber": "PO-2026-052",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-31",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "pol-52-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "pol-52-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 46800,
    "taxTotal": 8424,
    "grandTotal": 55224,
    "notes": "Raw material procurement batch PO-52"
  },
  {
    "id": "po-53",
    "poNumber": "PO-2026-053",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-01-31",
    "status": "RECEIVED",
    "lines": [
      {
        "id": "pol-53-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "pol-53-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 34100,
    "taxTotal": 6138,
    "grandTotal": 40238,
    "notes": "Raw material procurement batch PO-53"
  },
  {
    "id": "po-54",
    "poNumber": "PO-2026-054",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-01",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-54-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "pol-54-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 29900,
    "taxTotal": 5382,
    "grandTotal": 35282,
    "billId": "bill-54",
    "notes": "Raw material procurement batch PO-54"
  },
  {
    "id": "po-55",
    "poNumber": "PO-2026-055",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-01",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-55-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "pol-55-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 54500,
    "taxTotal": 9810,
    "grandTotal": 64310,
    "billId": "bill-55",
    "notes": "Raw material procurement batch PO-55"
  },
  {
    "id": "po-56",
    "poNumber": "PO-2026-056",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-02",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-56-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "pol-56-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 18800,
    "taxTotal": 3384,
    "grandTotal": 22184,
    "billId": "bill-56",
    "notes": "Raw material procurement batch PO-56"
  },
  {
    "id": "po-57",
    "poNumber": "PO-2026-057",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-02",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "pol-57-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "pol-57-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 45700,
    "taxTotal": 8226,
    "grandTotal": 53926,
    "notes": "Raw material procurement batch PO-57"
  },
  {
    "id": "po-58",
    "poNumber": "PO-2026-058",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-03",
    "status": "RECEIVED",
    "lines": [
      {
        "id": "pol-58-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "pol-58-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 34000,
    "taxTotal": 6120,
    "grandTotal": 40120,
    "notes": "Raw material procurement batch PO-58"
  },
  {
    "id": "po-59",
    "poNumber": "PO-2026-059",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-03",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-59-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "pol-59-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 27700,
    "taxTotal": 4986,
    "grandTotal": 32686,
    "billId": "bill-59",
    "notes": "Raw material procurement batch PO-59"
  },
  {
    "id": "po-60",
    "poNumber": "PO-2026-060",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-04",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-60-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "pol-60-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 57900,
    "taxTotal": 10422,
    "grandTotal": 68322,
    "billId": "bill-60",
    "notes": "Raw material procurement batch PO-60"
  },
  {
    "id": "po-61",
    "poNumber": "PO-2026-061",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-04",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-61-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "pol-61-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 17700,
    "taxTotal": 3186,
    "grandTotal": 20886,
    "billId": "bill-61",
    "notes": "Raw material procurement batch PO-61"
  },
  {
    "id": "po-62",
    "poNumber": "PO-2026-062",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-05",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "pol-62-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "pol-62-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 45600,
    "taxTotal": 8208,
    "grandTotal": 53808,
    "notes": "Raw material procurement batch PO-62"
  },
  {
    "id": "po-63",
    "poNumber": "PO-2026-063",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-05",
    "status": "RECEIVED",
    "lines": [
      {
        "id": "pol-63-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "pol-63-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 31800,
    "taxTotal": 5724,
    "grandTotal": 37524,
    "notes": "Raw material procurement batch PO-63"
  },
  {
    "id": "po-64",
    "poNumber": "PO-2026-064",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-06",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-64-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "pol-64-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 31100,
    "taxTotal": 5598,
    "grandTotal": 36698,
    "billId": "bill-64",
    "notes": "Raw material procurement batch PO-64"
  },
  {
    "id": "po-65",
    "poNumber": "PO-2026-065",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-06",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-65-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "pol-65-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 56800,
    "taxTotal": 10224,
    "grandTotal": 67024,
    "billId": "bill-65",
    "notes": "Raw material procurement batch PO-65"
  },
  {
    "id": "po-66",
    "poNumber": "PO-2026-066",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-07",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-66-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "pol-66-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 17600,
    "taxTotal": 3168,
    "grandTotal": 20768,
    "billId": "bill-66",
    "notes": "Raw material procurement batch PO-66"
  },
  {
    "id": "po-67",
    "poNumber": "PO-2026-067",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-07",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "pol-67-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "pol-67-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 43400,
    "taxTotal": 7812,
    "grandTotal": 51212,
    "notes": "Raw material procurement batch PO-67"
  },
  {
    "id": "po-68",
    "poNumber": "PO-2026-068",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-08",
    "status": "RECEIVED",
    "lines": [
      {
        "id": "pol-68-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "pol-68-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 35200,
    "taxTotal": 6336,
    "grandTotal": 41536,
    "notes": "Raw material procurement batch PO-68"
  },
  {
    "id": "po-69",
    "poNumber": "PO-2026-069",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-08",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-69-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "pol-69-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 30000,
    "taxTotal": 5400,
    "grandTotal": 35400,
    "billId": "bill-69",
    "notes": "Raw material procurement batch PO-69"
  },
  {
    "id": "po-70",
    "poNumber": "PO-2026-070",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-09",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-70-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "pol-70-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 56700,
    "taxTotal": 10206,
    "grandTotal": 66906,
    "billId": "bill-70",
    "notes": "Raw material procurement batch PO-70"
  },
  {
    "id": "po-71",
    "poNumber": "PO-2026-071",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-09",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-71-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "pol-71-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 15400,
    "taxTotal": 2772,
    "grandTotal": 18172,
    "billId": "bill-71",
    "notes": "Raw material procurement batch PO-71"
  },
  {
    "id": "po-72",
    "poNumber": "PO-2026-072",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-10",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "pol-72-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "pol-72-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 46800,
    "taxTotal": 8424,
    "grandTotal": 55224,
    "notes": "Raw material procurement batch PO-72"
  },
  {
    "id": "po-73",
    "poNumber": "PO-2026-073",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-10",
    "status": "RECEIVED",
    "lines": [
      {
        "id": "pol-73-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "pol-73-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 34100,
    "taxTotal": 6138,
    "grandTotal": 40238,
    "notes": "Raw material procurement batch PO-73"
  },
  {
    "id": "po-74",
    "poNumber": "PO-2026-074",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-11",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-74-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "pol-74-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 29900,
    "taxTotal": 5382,
    "grandTotal": 35282,
    "billId": "bill-74",
    "notes": "Raw material procurement batch PO-74"
  },
  {
    "id": "po-75",
    "poNumber": "PO-2026-075",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-11",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-75-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "pol-75-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 54500,
    "taxTotal": 9810,
    "grandTotal": 64310,
    "billId": "bill-75",
    "notes": "Raw material procurement batch PO-75"
  },
  {
    "id": "po-76",
    "poNumber": "PO-2026-076",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-12",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-76-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "pol-76-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 18800,
    "taxTotal": 3384,
    "grandTotal": 22184,
    "billId": "bill-76",
    "notes": "Raw material procurement batch PO-76"
  },
  {
    "id": "po-77",
    "poNumber": "PO-2026-077",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-12",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "pol-77-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "pol-77-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 45700,
    "taxTotal": 8226,
    "grandTotal": 53926,
    "notes": "Raw material procurement batch PO-77"
  },
  {
    "id": "po-78",
    "poNumber": "PO-2026-078",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-13",
    "status": "RECEIVED",
    "lines": [
      {
        "id": "pol-78-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "pol-78-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 34000,
    "taxTotal": 6120,
    "grandTotal": 40120,
    "notes": "Raw material procurement batch PO-78"
  },
  {
    "id": "po-79",
    "poNumber": "PO-2026-079",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-13",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-79-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "pol-79-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 27700,
    "taxTotal": 4986,
    "grandTotal": 32686,
    "billId": "bill-79",
    "notes": "Raw material procurement batch PO-79"
  },
  {
    "id": "po-80",
    "poNumber": "PO-2026-080",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-14",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-80-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "pol-80-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 57900,
    "taxTotal": 10422,
    "grandTotal": 68322,
    "billId": "bill-80",
    "notes": "Raw material procurement batch PO-80"
  },
  {
    "id": "po-81",
    "poNumber": "PO-2026-081",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-14",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-81-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "pol-81-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 17700,
    "taxTotal": 3186,
    "grandTotal": 20886,
    "billId": "bill-81",
    "notes": "Raw material procurement batch PO-81"
  },
  {
    "id": "po-82",
    "poNumber": "PO-2026-082",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-15",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "pol-82-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "pol-82-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 45600,
    "taxTotal": 8208,
    "grandTotal": 53808,
    "notes": "Raw material procurement batch PO-82"
  },
  {
    "id": "po-83",
    "poNumber": "PO-2026-083",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-15",
    "status": "RECEIVED",
    "lines": [
      {
        "id": "pol-83-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "pol-83-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 31800,
    "taxTotal": 5724,
    "grandTotal": 37524,
    "notes": "Raw material procurement batch PO-83"
  },
  {
    "id": "po-84",
    "poNumber": "PO-2026-084",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-16",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-84-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "pol-84-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 31100,
    "taxTotal": 5598,
    "grandTotal": 36698,
    "billId": "bill-84",
    "notes": "Raw material procurement batch PO-84"
  },
  {
    "id": "po-85",
    "poNumber": "PO-2026-085",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-16",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-85-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "pol-85-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 56800,
    "taxTotal": 10224,
    "grandTotal": 67024,
    "billId": "bill-85",
    "notes": "Raw material procurement batch PO-85"
  },
  {
    "id": "po-86",
    "poNumber": "PO-2026-086",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-17",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-86-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "pol-86-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 17600,
    "taxTotal": 3168,
    "grandTotal": 20768,
    "billId": "bill-86",
    "notes": "Raw material procurement batch PO-86"
  },
  {
    "id": "po-87",
    "poNumber": "PO-2026-087",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-17",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "pol-87-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "pol-87-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 43400,
    "taxTotal": 7812,
    "grandTotal": 51212,
    "notes": "Raw material procurement batch PO-87"
  },
  {
    "id": "po-88",
    "poNumber": "PO-2026-088",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-18",
    "status": "RECEIVED",
    "lines": [
      {
        "id": "pol-88-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "pol-88-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 35200,
    "taxTotal": 6336,
    "grandTotal": 41536,
    "notes": "Raw material procurement batch PO-88"
  },
  {
    "id": "po-89",
    "poNumber": "PO-2026-089",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-18",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-89-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "pol-89-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 30000,
    "taxTotal": 5400,
    "grandTotal": 35400,
    "billId": "bill-89",
    "notes": "Raw material procurement batch PO-89"
  },
  {
    "id": "po-90",
    "poNumber": "PO-2026-090",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-19",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-90-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "pol-90-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 56700,
    "taxTotal": 10206,
    "grandTotal": 66906,
    "billId": "bill-90",
    "notes": "Raw material procurement batch PO-90"
  },
  {
    "id": "po-91",
    "poNumber": "PO-2026-091",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-19",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-91-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "pol-91-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 15400,
    "taxTotal": 2772,
    "grandTotal": 18172,
    "billId": "bill-91",
    "notes": "Raw material procurement batch PO-91"
  },
  {
    "id": "po-92",
    "poNumber": "PO-2026-092",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-20",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "pol-92-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "pol-92-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 46800,
    "taxTotal": 8424,
    "grandTotal": 55224,
    "notes": "Raw material procurement batch PO-92"
  },
  {
    "id": "po-93",
    "poNumber": "PO-2026-093",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-20",
    "status": "RECEIVED",
    "lines": [
      {
        "id": "pol-93-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "pol-93-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 34100,
    "taxTotal": 6138,
    "grandTotal": 40238,
    "notes": "Raw material procurement batch PO-93"
  },
  {
    "id": "po-94",
    "poNumber": "PO-2026-094",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-21",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-94-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "pol-94-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 29900,
    "taxTotal": 5382,
    "grandTotal": 35282,
    "billId": "bill-94",
    "notes": "Raw material procurement batch PO-94"
  },
  {
    "id": "po-95",
    "poNumber": "PO-2026-095",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-21",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-95-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "pol-95-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 54500,
    "taxTotal": 9810,
    "grandTotal": 64310,
    "billId": "bill-95",
    "notes": "Raw material procurement batch PO-95"
  },
  {
    "id": "po-96",
    "poNumber": "PO-2026-096",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-22",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-96-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "pol-96-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 18800,
    "taxTotal": 3384,
    "grandTotal": 22184,
    "billId": "bill-96",
    "notes": "Raw material procurement batch PO-96"
  },
  {
    "id": "po-97",
    "poNumber": "PO-2026-097",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-22",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "pol-97-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "pol-97-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 45700,
    "taxTotal": 8226,
    "grandTotal": 53926,
    "notes": "Raw material procurement batch PO-97"
  },
  {
    "id": "po-98",
    "poNumber": "PO-2026-098",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-23",
    "status": "RECEIVED",
    "lines": [
      {
        "id": "pol-98-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "pol-98-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 34000,
    "taxTotal": 6120,
    "grandTotal": 40120,
    "notes": "Raw material procurement batch PO-98"
  },
  {
    "id": "po-99",
    "poNumber": "PO-2026-099",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-23",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-99-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "pol-99-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 27700,
    "taxTotal": 4986,
    "grandTotal": 32686,
    "billId": "bill-99",
    "notes": "Raw material procurement batch PO-99"
  },
  {
    "id": "po-100",
    "poNumber": "PO-2026-100",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "vendorPhone": "+91 98765 43221",
    "orderDate": "2026-02-24",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-100-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "pol-100-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 57900,
    "taxTotal": 10422,
    "grandTotal": 68322,
    "billId": "bill-100",
    "notes": "Raw material procurement batch PO-100"
  },
  {
    "id": "po-101",
    "poNumber": "PO-2026-101",
    "vendorId": "cnt-2",
    "vendorName": "Azure Furniture Supplies",
    "vendorEmail": "azure@furniture.com",
    "vendorPhone": "+91 98234 56789",
    "orderDate": "2026-02-24",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-101-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "pol-101-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 17700,
    "taxTotal": 3186,
    "grandTotal": 20886,
    "billId": "bill-101",
    "notes": "Raw material procurement batch PO-101"
  },
  {
    "id": "po-102",
    "poNumber": "PO-2026-102",
    "vendorId": "cnt-2",
    "vendorName": "Azure Furniture Supplies",
    "vendorEmail": "azure@furniture.com",
    "vendorPhone": "+91 98234 56789",
    "orderDate": "2026-02-25",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "pol-102-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "pol-102-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 45600,
    "taxTotal": 8208,
    "grandTotal": 53808,
    "notes": "Raw material procurement batch PO-102"
  },
  {
    "id": "po-103",
    "poNumber": "PO-2026-103",
    "vendorId": "cnt-2",
    "vendorName": "Azure Furniture Supplies",
    "vendorEmail": "azure@furniture.com",
    "vendorPhone": "+91 98234 56789",
    "orderDate": "2026-02-25",
    "status": "RECEIVED",
    "lines": [
      {
        "id": "pol-103-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "pol-103-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 31800,
    "taxTotal": 5724,
    "grandTotal": 37524,
    "notes": "Raw material procurement batch PO-103"
  },
  {
    "id": "po-104",
    "poNumber": "PO-2026-104",
    "vendorId": "cnt-2",
    "vendorName": "Azure Furniture Supplies",
    "vendorEmail": "azure@furniture.com",
    "vendorPhone": "+91 98234 56789",
    "orderDate": "2026-02-26",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-104-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "pol-104-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 31100,
    "taxTotal": 5598,
    "grandTotal": 36698,
    "billId": "bill-104",
    "notes": "Raw material procurement batch PO-104"
  },
  {
    "id": "po-105",
    "poNumber": "PO-2026-105",
    "vendorId": "cnt-2",
    "vendorName": "Azure Furniture Supplies",
    "vendorEmail": "azure@furniture.com",
    "vendorPhone": "+91 98234 56789",
    "orderDate": "2026-02-26",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-105-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "pol-105-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 56800,
    "taxTotal": 10224,
    "grandTotal": 67024,
    "billId": "bill-105",
    "notes": "Raw material procurement batch PO-105"
  },
  {
    "id": "po-106",
    "poNumber": "PO-2026-106",
    "vendorId": "cnt-2",
    "vendorName": "Azure Furniture Supplies",
    "vendorEmail": "azure@furniture.com",
    "vendorPhone": "+91 98234 56789",
    "orderDate": "2026-02-27",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-106-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "pol-106-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 17600,
    "taxTotal": 3168,
    "grandTotal": 20768,
    "billId": "bill-106",
    "notes": "Raw material procurement batch PO-106"
  },
  {
    "id": "po-107",
    "poNumber": "PO-2026-107",
    "vendorId": "cnt-2",
    "vendorName": "Azure Furniture Supplies",
    "vendorEmail": "azure@furniture.com",
    "vendorPhone": "+91 98234 56789",
    "orderDate": "2026-02-27",
    "status": "CONFIRMED",
    "lines": [
      {
        "id": "pol-107-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "pol-107-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 43400,
    "taxTotal": 7812,
    "grandTotal": 51212,
    "notes": "Raw material procurement batch PO-107"
  },
  {
    "id": "po-108",
    "poNumber": "PO-2026-108",
    "vendorId": "cnt-2",
    "vendorName": "Azure Furniture Supplies",
    "vendorEmail": "azure@furniture.com",
    "vendorPhone": "+91 98234 56789",
    "orderDate": "2026-02-28",
    "status": "RECEIVED",
    "lines": [
      {
        "id": "pol-108-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "pol-108-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 35200,
    "taxTotal": 6336,
    "grandTotal": 41536,
    "notes": "Raw material procurement batch PO-108"
  },
  {
    "id": "po-109",
    "poNumber": "PO-2026-109",
    "vendorId": "cnt-2",
    "vendorName": "Azure Furniture Supplies",
    "vendorEmail": "azure@furniture.com",
    "vendorPhone": "+91 98234 56789",
    "orderDate": "2026-02-28",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-109-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "pol-109-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 30000,
    "taxTotal": 5400,
    "grandTotal": 35400,
    "billId": "bill-109",
    "notes": "Raw material procurement batch PO-109"
  },
  {
    "id": "po-110",
    "poNumber": "PO-2026-110",
    "vendorId": "cnt-2",
    "vendorName": "Azure Furniture Supplies",
    "vendorEmail": "azure@furniture.com",
    "vendorPhone": "+91 98234 56789",
    "orderDate": "2026-03-01",
    "status": "BILLED",
    "lines": [
      {
        "id": "pol-110-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "pol-110-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 56700,
    "taxTotal": 10206,
    "grandTotal": 66906,
    "billId": "bill-110",
    "notes": "Raw material procurement batch PO-110"
  }
];

// ==========================================
// TRANSACTIONS: INVOICES
// ==========================================
export const INITIAL_INVOICES: Invoice[] = [
  {
    "id": "inv-1",
    "invoiceNumber": "INV-2026-001",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-05",
    "dueDate": "2026-01-20",
    "status": "POSTED",
    "lines": [
      {
        "id": "invl-1-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 2,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 64000,
        "taxAmount": 11520,
        "total": 75520
      },
      {
        "id": "invl-1-2",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 2,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 84000,
        "taxAmount": 15120,
        "total": 99120
      }
    ],
    "subtotal": 148000,
    "taxTotal": 26640,
    "grandTotal": 174640,
    "amountPaid": 0,
    "balanceDue": 174640,
    "journalEntryId": "je-inv-1",
    "soId": "so-1",
    "soNumber": "SO-2026-001",
    "notes": "Tax invoice ref #0001"
  },
  {
    "id": "inv-2",
    "invoiceNumber": "INV-2026-002",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-06",
    "dueDate": "2026-01-21",
    "status": "OVERDUE",
    "lines": [
      {
        "id": "invl-2-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 3,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 85500,
        "taxAmount": 15390,
        "total": 100890
      },
      {
        "id": "invl-2-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 1,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 18000,
        "taxAmount": 3240,
        "total": 21240
      }
    ],
    "subtotal": 103500,
    "taxTotal": 18630,
    "grandTotal": 122130,
    "amountPaid": 0,
    "balanceDue": 122130,
    "journalEntryId": "je-inv-2",
    "soId": "so-2",
    "soNumber": "SO-2026-002",
    "notes": "Tax invoice ref #0002"
  },
  {
    "id": "inv-3",
    "invoiceNumber": "INV-2026-003",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-06",
    "dueDate": "2026-01-21",
    "status": "PARTIALLY_PAID",
    "lines": [
      {
        "id": "invl-3-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 1,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 42000,
        "taxAmount": 7560,
        "total": 49560
      },
      {
        "id": "invl-3-2",
        "productId": "prd-9",
        "productName": "Minimalist Coffee Table",
        "quantity": 2,
        "unitPrice": 6200,
        "taxRate": 18,
        "subtotal": 12400,
        "taxAmount": 2232,
        "total": 14632
      }
    ],
    "subtotal": 54400,
    "taxTotal": 9792,
    "grandTotal": 64192,
    "amountPaid": 25677,
    "balanceDue": 38515,
    "journalEntryId": "je-inv-3",
    "soId": "so-3",
    "soNumber": "SO-2026-003",
    "notes": "Tax invoice ref #0003"
  },
  {
    "id": "inv-4",
    "invoiceNumber": "INV-2026-004",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-07",
    "dueDate": "2026-01-22",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-4-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 17000,
        "taxAmount": 3060,
        "total": 20060
      },
      {
        "id": "invl-4-2",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 1,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 4500,
        "taxAmount": 810,
        "total": 5310
      }
    ],
    "subtotal": 21500,
    "taxTotal": 3870,
    "grandTotal": 25370,
    "amountPaid": 25370,
    "balanceDue": 0,
    "journalEntryId": "je-inv-4",
    "soId": "so-4",
    "soNumber": "SO-2026-004",
    "notes": "Tax invoice ref #0004"
  },
  {
    "id": "inv-5",
    "invoiceNumber": "INV-2026-005",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-07",
    "dueDate": "2026-01-22",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-5-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 3,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 13500,
        "taxAmount": 2430,
        "total": 15930
      },
      {
        "id": "invl-5-2",
        "productId": "prd-8",
        "productName": "Acoustic Lounge Armchair",
        "quantity": 2,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 19000,
        "taxAmount": 3420,
        "total": 22420
      }
    ],
    "subtotal": 32500,
    "taxTotal": 5850,
    "grandTotal": 38350,
    "amountPaid": 38350,
    "balanceDue": 0,
    "journalEntryId": "je-inv-5",
    "soId": "so-5",
    "soNumber": "SO-2026-005",
    "notes": "Tax invoice ref #0005"
  },
  {
    "id": "inv-6",
    "invoiceNumber": "INV-2026-006",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-08",
    "dueDate": "2026-01-23",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-6-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 1,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 32000,
        "taxAmount": 5760,
        "total": 37760
      },
      {
        "id": "invl-6-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 1,
        "unitPrice": 3800,
        "taxRate": 18,
        "subtotal": 3800,
        "taxAmount": 684,
        "total": 4484
      }
    ],
    "subtotal": 35800,
    "taxTotal": 6444,
    "grandTotal": 42244,
    "amountPaid": 42244,
    "balanceDue": 0,
    "journalEntryId": "je-inv-6",
    "soId": "so-6",
    "soNumber": "SO-2026-006",
    "notes": "Tax invoice ref #0006"
  },
  {
    "id": "inv-7",
    "invoiceNumber": "INV-2026-007",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-08",
    "dueDate": "2026-01-23",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-7-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      },
      {
        "id": "invl-7-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      }
    ],
    "subtotal": 114000,
    "taxTotal": 20520,
    "grandTotal": 134520,
    "amountPaid": 134520,
    "balanceDue": 0,
    "journalEntryId": "je-inv-7",
    "soId": "so-7",
    "soNumber": "SO-2026-007",
    "notes": "Tax invoice ref #0007"
  },
  {
    "id": "inv-8",
    "invoiceNumber": "INV-2026-008",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-09",
    "dueDate": "2026-01-24",
    "status": "POSTED",
    "lines": [
      {
        "id": "invl-8-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 3,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 126000,
        "taxAmount": 22680,
        "total": 148680
      },
      {
        "id": "invl-8-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 1,
        "unitPrice": 4800,
        "taxRate": 18,
        "subtotal": 4800,
        "taxAmount": 864,
        "total": 5664
      }
    ],
    "subtotal": 130800,
    "taxTotal": 23544,
    "grandTotal": 154344,
    "amountPaid": 0,
    "balanceDue": 154344,
    "journalEntryId": "je-inv-8",
    "soId": "so-8",
    "soNumber": "SO-2026-008",
    "notes": "Tax invoice ref #0008"
  },
  {
    "id": "inv-9",
    "invoiceNumber": "INV-2026-009",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-09",
    "dueDate": "2026-01-24",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-9-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 1,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 8500,
        "taxAmount": 1530,
        "total": 10030
      },
      {
        "id": "invl-9-2",
        "productId": "prd-6",
        "productName": "Solid Oak Credenza Bookshelf",
        "quantity": 2,
        "unitPrice": 22000,
        "taxRate": 18,
        "subtotal": 44000,
        "taxAmount": 7920,
        "total": 51920
      }
    ],
    "subtotal": 52500,
    "taxTotal": 9450,
    "grandTotal": 61950,
    "amountPaid": 61950,
    "balanceDue": 0,
    "journalEntryId": "je-inv-9",
    "soId": "so-9",
    "soNumber": "SO-2026-009",
    "notes": "Tax invoice ref #0009"
  },
  {
    "id": "inv-10",
    "invoiceNumber": "INV-2026-010",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-10",
    "dueDate": "2026-01-25",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-10-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 2,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 9000,
        "taxAmount": 1620,
        "total": 10620
      },
      {
        "id": "invl-10-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 1,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 8500,
        "taxAmount": 1530,
        "total": 10030
      }
    ],
    "subtotal": 17500,
    "taxTotal": 3150,
    "grandTotal": 20650,
    "amountPaid": 20650,
    "balanceDue": 0,
    "journalEntryId": "je-inv-10",
    "soId": "so-10",
    "soNumber": "SO-2026-010",
    "notes": "Tax invoice ref #0010"
  },
  {
    "id": "inv-11",
    "invoiceNumber": "INV-2026-011",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-10",
    "dueDate": "2026-01-25",
    "status": "OVERDUE",
    "lines": [
      {
        "id": "invl-11-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 3,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 96000,
        "taxAmount": 17280,
        "total": 113280
      },
      {
        "id": "invl-11-2",
        "productId": "prd-5",
        "productName": "Custom Furniture Assembly & Polishing",
        "quantity": 2,
        "unitPrice": 1500,
        "taxRate": 18,
        "subtotal": 3000,
        "taxAmount": 540,
        "total": 3540
      }
    ],
    "subtotal": 99000,
    "taxTotal": 17820,
    "grandTotal": 116820,
    "amountPaid": 0,
    "balanceDue": 116820,
    "journalEntryId": "je-inv-11",
    "soId": "so-11",
    "soNumber": "SO-2026-011",
    "notes": "Tax invoice ref #0011"
  },
  {
    "id": "inv-12",
    "invoiceNumber": "INV-2026-012",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-11",
    "dueDate": "2026-01-26",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-12-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      },
      {
        "id": "invl-12-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 1,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 2500,
        "taxAmount": 450,
        "total": 2950
      }
    ],
    "subtotal": 31000,
    "taxTotal": 5580,
    "grandTotal": 36580,
    "amountPaid": 36580,
    "balanceDue": 0,
    "journalEntryId": "je-inv-12",
    "soId": "so-12",
    "soNumber": "SO-2026-012",
    "notes": "Tax invoice ref #0012"
  },
  {
    "id": "inv-13",
    "invoiceNumber": "INV-2026-013",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-11",
    "dueDate": "2026-01-26",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-13-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 2,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 84000,
        "taxAmount": 15120,
        "total": 99120
      },
      {
        "id": "invl-13-2",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 2,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 64000,
        "taxAmount": 11520,
        "total": 75520
      }
    ],
    "subtotal": 148000,
    "taxTotal": 26640,
    "grandTotal": 174640,
    "amountPaid": 174640,
    "balanceDue": 0,
    "journalEntryId": "je-inv-13",
    "soId": "so-13",
    "soNumber": "SO-2026-013",
    "notes": "Tax invoice ref #0013"
  },
  {
    "id": "inv-14",
    "invoiceNumber": "INV-2026-014",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-12",
    "dueDate": "2026-01-27",
    "status": "PARTIALLY_PAID",
    "lines": [
      {
        "id": "invl-14-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 3,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 25500,
        "taxAmount": 4590,
        "total": 30090
      },
      {
        "id": "invl-14-2",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 1,
        "unitPrice": 15000,
        "taxRate": 18,
        "subtotal": 15000,
        "taxAmount": 2700,
        "total": 17700
      }
    ],
    "subtotal": 40500,
    "taxTotal": 7290,
    "grandTotal": 47790,
    "amountPaid": 19116,
    "balanceDue": 28674,
    "journalEntryId": "je-inv-14",
    "soId": "so-14",
    "soNumber": "SO-2026-014",
    "notes": "Tax invoice ref #0014"
  },
  {
    "id": "inv-15",
    "invoiceNumber": "INV-2026-015",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-12",
    "dueDate": "2026-01-27",
    "status": "POSTED",
    "lines": [
      {
        "id": "invl-15-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 1,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 4500,
        "taxAmount": 810,
        "total": 5310
      },
      {
        "id": "invl-15-2",
        "productId": "prd-3",
        "productName": "Executive Walnut Desk",
        "quantity": 2,
        "unitPrice": 12500,
        "taxRate": 18,
        "subtotal": 25000,
        "taxAmount": 4500,
        "total": 29500
      }
    ],
    "subtotal": 29500,
    "taxTotal": 5310,
    "grandTotal": 34810,
    "amountPaid": 0,
    "balanceDue": 34810,
    "journalEntryId": "je-inv-15",
    "soId": "so-15",
    "soNumber": "SO-2026-015",
    "notes": "Tax invoice ref #0015"
  },
  {
    "id": "inv-16",
    "invoiceNumber": "INV-2026-016",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-13",
    "dueDate": "2026-01-28",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-16-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 2,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 64000,
        "taxAmount": 11520,
        "total": 75520
      },
      {
        "id": "invl-16-2",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 1,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 42000,
        "taxAmount": 7560,
        "total": 49560
      }
    ],
    "subtotal": 106000,
    "taxTotal": 19080,
    "grandTotal": 125080,
    "amountPaid": 125080,
    "balanceDue": 0,
    "journalEntryId": "je-inv-16",
    "soId": "so-16",
    "soNumber": "SO-2026-016",
    "notes": "Tax invoice ref #0016"
  },
  {
    "id": "inv-17",
    "invoiceNumber": "INV-2026-017",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-13",
    "dueDate": "2026-01-28",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-17-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 3,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 85500,
        "taxAmount": 15390,
        "total": 100890
      },
      {
        "id": "invl-17-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 2,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 36000,
        "taxAmount": 6480,
        "total": 42480
      }
    ],
    "subtotal": 121500,
    "taxTotal": 21870,
    "grandTotal": 143370,
    "amountPaid": 143370,
    "balanceDue": 0,
    "journalEntryId": "je-inv-17",
    "soId": "so-17",
    "soNumber": "SO-2026-017",
    "notes": "Tax invoice ref #0017"
  },
  {
    "id": "inv-18",
    "invoiceNumber": "INV-2026-018",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-14",
    "dueDate": "2026-01-29",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-18-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 1,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 42000,
        "taxAmount": 7560,
        "total": 49560
      },
      {
        "id": "invl-18-2",
        "productId": "prd-9",
        "productName": "Minimalist Coffee Table",
        "quantity": 1,
        "unitPrice": 6200,
        "taxRate": 18,
        "subtotal": 6200,
        "taxAmount": 1116,
        "total": 7316
      }
    ],
    "subtotal": 48200,
    "taxTotal": 8676,
    "grandTotal": 56876,
    "amountPaid": 56876,
    "balanceDue": 0,
    "journalEntryId": "je-inv-18",
    "soId": "so-18",
    "soNumber": "SO-2026-018",
    "notes": "Tax invoice ref #0018"
  },
  {
    "id": "inv-19",
    "invoiceNumber": "INV-2026-019",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-14",
    "dueDate": "2026-01-29",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-19-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 17000,
        "taxAmount": 3060,
        "total": 20060
      },
      {
        "id": "invl-19-2",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 2,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 9000,
        "taxAmount": 1620,
        "total": 10620
      }
    ],
    "subtotal": 26000,
    "taxTotal": 4680,
    "grandTotal": 30680,
    "amountPaid": 30680,
    "balanceDue": 0,
    "journalEntryId": "je-inv-19",
    "soId": "so-19",
    "soNumber": "SO-2026-019",
    "notes": "Tax invoice ref #0019"
  },
  {
    "id": "inv-20",
    "invoiceNumber": "INV-2026-020",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-15",
    "dueDate": "2026-01-30",
    "status": "OVERDUE",
    "lines": [
      {
        "id": "invl-20-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 3,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 13500,
        "taxAmount": 2430,
        "total": 15930
      },
      {
        "id": "invl-20-2",
        "productId": "prd-8",
        "productName": "Acoustic Lounge Armchair",
        "quantity": 1,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 9500,
        "taxAmount": 1710,
        "total": 11210
      }
    ],
    "subtotal": 23000,
    "taxTotal": 4140,
    "grandTotal": 27140,
    "amountPaid": 0,
    "balanceDue": 27140,
    "journalEntryId": "je-inv-20",
    "soId": "so-20",
    "soNumber": "SO-2026-020",
    "notes": "Tax invoice ref #0020"
  },
  {
    "id": "inv-21",
    "invoiceNumber": "INV-2026-021",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-15",
    "dueDate": "2026-01-30",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-21-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 1,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 32000,
        "taxAmount": 5760,
        "total": 37760
      },
      {
        "id": "invl-21-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 2,
        "unitPrice": 3800,
        "taxRate": 18,
        "subtotal": 7600,
        "taxAmount": 1368,
        "total": 8968
      }
    ],
    "subtotal": 39600,
    "taxTotal": 7128,
    "grandTotal": 46728,
    "amountPaid": 46728,
    "balanceDue": 0,
    "journalEntryId": "je-inv-21",
    "soId": "so-21",
    "soNumber": "SO-2026-021",
    "notes": "Tax invoice ref #0021"
  },
  {
    "id": "inv-22",
    "invoiceNumber": "INV-2026-022",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-16",
    "dueDate": "2026-01-31",
    "status": "POSTED",
    "lines": [
      {
        "id": "invl-22-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      },
      {
        "id": "invl-22-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      }
    ],
    "subtotal": 85500,
    "taxTotal": 15390,
    "grandTotal": 100890,
    "amountPaid": 0,
    "balanceDue": 100890,
    "journalEntryId": "je-inv-22",
    "soId": "so-22",
    "soNumber": "SO-2026-022",
    "notes": "Tax invoice ref #0022"
  },
  {
    "id": "inv-23",
    "invoiceNumber": "INV-2026-023",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-16",
    "dueDate": "2026-01-31",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-23-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 3,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 126000,
        "taxAmount": 22680,
        "total": 148680
      },
      {
        "id": "invl-23-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 2,
        "unitPrice": 4800,
        "taxRate": 18,
        "subtotal": 9600,
        "taxAmount": 1728,
        "total": 11328
      }
    ],
    "subtotal": 135600,
    "taxTotal": 24408,
    "grandTotal": 160008,
    "amountPaid": 160008,
    "balanceDue": 0,
    "journalEntryId": "je-inv-23",
    "soId": "so-23",
    "soNumber": "SO-2026-023",
    "notes": "Tax invoice ref #0023"
  },
  {
    "id": "inv-24",
    "invoiceNumber": "INV-2026-024",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-17",
    "dueDate": "2026-02-01",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-24-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 1,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 8500,
        "taxAmount": 1530,
        "total": 10030
      },
      {
        "id": "invl-24-2",
        "productId": "prd-6",
        "productName": "Solid Oak Credenza Bookshelf",
        "quantity": 1,
        "unitPrice": 22000,
        "taxRate": 18,
        "subtotal": 22000,
        "taxAmount": 3960,
        "total": 25960
      }
    ],
    "subtotal": 30500,
    "taxTotal": 5490,
    "grandTotal": 35990,
    "amountPaid": 35990,
    "balanceDue": 0,
    "journalEntryId": "je-inv-24",
    "soId": "so-24",
    "soNumber": "SO-2026-024",
    "notes": "Tax invoice ref #0024"
  },
  {
    "id": "inv-25",
    "invoiceNumber": "INV-2026-025",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-17",
    "dueDate": "2026-02-01",
    "status": "PARTIALLY_PAID",
    "lines": [
      {
        "id": "invl-25-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 2,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 9000,
        "taxAmount": 1620,
        "total": 10620
      },
      {
        "id": "invl-25-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 17000,
        "taxAmount": 3060,
        "total": 20060
      }
    ],
    "subtotal": 26000,
    "taxTotal": 4680,
    "grandTotal": 30680,
    "amountPaid": 12272,
    "balanceDue": 18408,
    "journalEntryId": "je-inv-25",
    "soId": "so-25",
    "soNumber": "SO-2026-025",
    "notes": "Tax invoice ref #0025"
  },
  {
    "id": "inv-26",
    "invoiceNumber": "INV-2026-026",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-18",
    "dueDate": "2026-02-02",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-26-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 3,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 96000,
        "taxAmount": 17280,
        "total": 113280
      },
      {
        "id": "invl-26-2",
        "productId": "prd-5",
        "productName": "Custom Furniture Assembly & Polishing",
        "quantity": 1,
        "unitPrice": 1500,
        "taxRate": 18,
        "subtotal": 1500,
        "taxAmount": 270,
        "total": 1770
      }
    ],
    "subtotal": 97500,
    "taxTotal": 17550,
    "grandTotal": 115050,
    "amountPaid": 115050,
    "balanceDue": 0,
    "journalEntryId": "je-inv-26",
    "soId": "so-26",
    "soNumber": "SO-2026-026",
    "notes": "Tax invoice ref #0026"
  },
  {
    "id": "inv-27",
    "invoiceNumber": "INV-2026-027",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-18",
    "dueDate": "2026-02-02",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-27-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      },
      {
        "id": "invl-27-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 2,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 5000,
        "taxAmount": 900,
        "total": 5900
      }
    ],
    "subtotal": 33500,
    "taxTotal": 6030,
    "grandTotal": 39530,
    "amountPaid": 39530,
    "balanceDue": 0,
    "journalEntryId": "je-inv-27",
    "soId": "so-27",
    "soNumber": "SO-2026-027",
    "notes": "Tax invoice ref #0027"
  },
  {
    "id": "inv-28",
    "invoiceNumber": "INV-2026-028",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-19",
    "dueDate": "2026-02-03",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-28-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 2,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 84000,
        "taxAmount": 15120,
        "total": 99120
      },
      {
        "id": "invl-28-2",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 1,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 32000,
        "taxAmount": 5760,
        "total": 37760
      }
    ],
    "subtotal": 116000,
    "taxTotal": 20880,
    "grandTotal": 136880,
    "amountPaid": 136880,
    "balanceDue": 0,
    "journalEntryId": "je-inv-28",
    "soId": "so-28",
    "soNumber": "SO-2026-028",
    "notes": "Tax invoice ref #0028"
  },
  {
    "id": "inv-29",
    "invoiceNumber": "INV-2026-029",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-19",
    "dueDate": "2026-02-03",
    "status": "POSTED",
    "lines": [
      {
        "id": "invl-29-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 3,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 25500,
        "taxAmount": 4590,
        "total": 30090
      },
      {
        "id": "invl-29-2",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 2,
        "unitPrice": 15000,
        "taxRate": 18,
        "subtotal": 30000,
        "taxAmount": 5400,
        "total": 35400
      }
    ],
    "subtotal": 55500,
    "taxTotal": 9990,
    "grandTotal": 65490,
    "amountPaid": 0,
    "balanceDue": 65490,
    "journalEntryId": "je-inv-29",
    "soId": "so-29",
    "soNumber": "SO-2026-029",
    "notes": "Tax invoice ref #0029"
  },
  {
    "id": "inv-30",
    "invoiceNumber": "INV-2026-030",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-20",
    "dueDate": "2026-02-04",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-30-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 1,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 4500,
        "taxAmount": 810,
        "total": 5310
      },
      {
        "id": "invl-30-2",
        "productId": "prd-3",
        "productName": "Executive Walnut Desk",
        "quantity": 1,
        "unitPrice": 12500,
        "taxRate": 18,
        "subtotal": 12500,
        "taxAmount": 2250,
        "total": 14750
      }
    ],
    "subtotal": 17000,
    "taxTotal": 3060,
    "grandTotal": 20060,
    "amountPaid": 20060,
    "balanceDue": 0,
    "journalEntryId": "je-inv-30",
    "soId": "so-30",
    "soNumber": "SO-2026-030",
    "notes": "Tax invoice ref #0030"
  },
  {
    "id": "inv-31",
    "invoiceNumber": "INV-2026-031",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-20",
    "dueDate": "2026-02-04",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-31-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 2,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 64000,
        "taxAmount": 11520,
        "total": 75520
      },
      {
        "id": "invl-31-2",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 2,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 84000,
        "taxAmount": 15120,
        "total": 99120
      }
    ],
    "subtotal": 148000,
    "taxTotal": 26640,
    "grandTotal": 174640,
    "amountPaid": 174640,
    "balanceDue": 0,
    "journalEntryId": "je-inv-31",
    "soId": "so-31",
    "soNumber": "SO-2026-031",
    "notes": "Tax invoice ref #0031"
  },
  {
    "id": "inv-32",
    "invoiceNumber": "INV-2026-032",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-21",
    "dueDate": "2026-02-05",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-32-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 3,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 85500,
        "taxAmount": 15390,
        "total": 100890
      },
      {
        "id": "invl-32-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 1,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 18000,
        "taxAmount": 3240,
        "total": 21240
      }
    ],
    "subtotal": 103500,
    "taxTotal": 18630,
    "grandTotal": 122130,
    "amountPaid": 122130,
    "balanceDue": 0,
    "journalEntryId": "je-inv-32",
    "soId": "so-32",
    "soNumber": "SO-2026-032",
    "notes": "Tax invoice ref #0032"
  },
  {
    "id": "inv-33",
    "invoiceNumber": "INV-2026-033",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-21",
    "dueDate": "2026-02-05",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-33-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 1,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 42000,
        "taxAmount": 7560,
        "total": 49560
      },
      {
        "id": "invl-33-2",
        "productId": "prd-9",
        "productName": "Minimalist Coffee Table",
        "quantity": 2,
        "unitPrice": 6200,
        "taxRate": 18,
        "subtotal": 12400,
        "taxAmount": 2232,
        "total": 14632
      }
    ],
    "subtotal": 54400,
    "taxTotal": 9792,
    "grandTotal": 64192,
    "amountPaid": 64192,
    "balanceDue": 0,
    "journalEntryId": "je-inv-33",
    "soId": "so-33",
    "soNumber": "SO-2026-033",
    "notes": "Tax invoice ref #0033"
  },
  {
    "id": "inv-34",
    "invoiceNumber": "INV-2026-034",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-22",
    "dueDate": "2026-02-06",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-34-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 17000,
        "taxAmount": 3060,
        "total": 20060
      },
      {
        "id": "invl-34-2",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 1,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 4500,
        "taxAmount": 810,
        "total": 5310
      }
    ],
    "subtotal": 21500,
    "taxTotal": 3870,
    "grandTotal": 25370,
    "amountPaid": 25370,
    "balanceDue": 0,
    "journalEntryId": "je-inv-34",
    "soId": "so-34",
    "soNumber": "SO-2026-034",
    "notes": "Tax invoice ref #0034"
  },
  {
    "id": "inv-35",
    "invoiceNumber": "INV-2026-035",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-22",
    "dueDate": "2026-02-06",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-35-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 3,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 13500,
        "taxAmount": 2430,
        "total": 15930
      },
      {
        "id": "invl-35-2",
        "productId": "prd-8",
        "productName": "Acoustic Lounge Armchair",
        "quantity": 2,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 19000,
        "taxAmount": 3420,
        "total": 22420
      }
    ],
    "subtotal": 32500,
    "taxTotal": 5850,
    "grandTotal": 38350,
    "amountPaid": 38350,
    "balanceDue": 0,
    "journalEntryId": "je-inv-35",
    "soId": "so-35",
    "soNumber": "SO-2026-035",
    "notes": "Tax invoice ref #0035"
  },
  {
    "id": "inv-36",
    "invoiceNumber": "INV-2026-036",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-23",
    "dueDate": "2026-02-07",
    "status": "POSTED",
    "lines": [
      {
        "id": "invl-36-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 1,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 32000,
        "taxAmount": 5760,
        "total": 37760
      },
      {
        "id": "invl-36-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 1,
        "unitPrice": 3800,
        "taxRate": 18,
        "subtotal": 3800,
        "taxAmount": 684,
        "total": 4484
      }
    ],
    "subtotal": 35800,
    "taxTotal": 6444,
    "grandTotal": 42244,
    "amountPaid": 0,
    "balanceDue": 42244,
    "journalEntryId": "je-inv-36",
    "soId": "so-36",
    "soNumber": "SO-2026-036",
    "notes": "Tax invoice ref #0036"
  },
  {
    "id": "inv-37",
    "invoiceNumber": "INV-2026-037",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-23",
    "dueDate": "2026-02-07",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-37-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      },
      {
        "id": "invl-37-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      }
    ],
    "subtotal": 114000,
    "taxTotal": 20520,
    "grandTotal": 134520,
    "amountPaid": 134520,
    "balanceDue": 0,
    "journalEntryId": "je-inv-37",
    "soId": "so-37",
    "soNumber": "SO-2026-037",
    "notes": "Tax invoice ref #0037"
  },
  {
    "id": "inv-38",
    "invoiceNumber": "INV-2026-038",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-24",
    "dueDate": "2026-02-08",
    "status": "OVERDUE",
    "lines": [
      {
        "id": "invl-38-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 3,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 126000,
        "taxAmount": 22680,
        "total": 148680
      },
      {
        "id": "invl-38-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 1,
        "unitPrice": 4800,
        "taxRate": 18,
        "subtotal": 4800,
        "taxAmount": 864,
        "total": 5664
      }
    ],
    "subtotal": 130800,
    "taxTotal": 23544,
    "grandTotal": 154344,
    "amountPaid": 0,
    "balanceDue": 154344,
    "journalEntryId": "je-inv-38",
    "soId": "so-38",
    "soNumber": "SO-2026-038",
    "notes": "Tax invoice ref #0038"
  },
  {
    "id": "inv-39",
    "invoiceNumber": "INV-2026-039",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-24",
    "dueDate": "2026-02-08",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-39-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 1,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 8500,
        "taxAmount": 1530,
        "total": 10030
      },
      {
        "id": "invl-39-2",
        "productId": "prd-6",
        "productName": "Solid Oak Credenza Bookshelf",
        "quantity": 2,
        "unitPrice": 22000,
        "taxRate": 18,
        "subtotal": 44000,
        "taxAmount": 7920,
        "total": 51920
      }
    ],
    "subtotal": 52500,
    "taxTotal": 9450,
    "grandTotal": 61950,
    "amountPaid": 61950,
    "balanceDue": 0,
    "journalEntryId": "je-inv-39",
    "soId": "so-39",
    "soNumber": "SO-2026-039",
    "notes": "Tax invoice ref #0039"
  },
  {
    "id": "inv-40",
    "invoiceNumber": "INV-2026-040",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-25",
    "dueDate": "2026-02-09",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-40-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 2,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 9000,
        "taxAmount": 1620,
        "total": 10620
      },
      {
        "id": "invl-40-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 1,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 8500,
        "taxAmount": 1530,
        "total": 10030
      }
    ],
    "subtotal": 17500,
    "taxTotal": 3150,
    "grandTotal": 20650,
    "amountPaid": 20650,
    "balanceDue": 0,
    "journalEntryId": "je-inv-40",
    "soId": "so-40",
    "soNumber": "SO-2026-040",
    "notes": "Tax invoice ref #0040"
  },
  {
    "id": "inv-41",
    "invoiceNumber": "INV-2026-041",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-25",
    "dueDate": "2026-02-09",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-41-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 3,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 96000,
        "taxAmount": 17280,
        "total": 113280
      },
      {
        "id": "invl-41-2",
        "productId": "prd-5",
        "productName": "Custom Furniture Assembly & Polishing",
        "quantity": 2,
        "unitPrice": 1500,
        "taxRate": 18,
        "subtotal": 3000,
        "taxAmount": 540,
        "total": 3540
      }
    ],
    "subtotal": 99000,
    "taxTotal": 17820,
    "grandTotal": 116820,
    "amountPaid": 116820,
    "balanceDue": 0,
    "journalEntryId": "je-inv-41",
    "soId": "so-41",
    "soNumber": "SO-2026-041",
    "notes": "Tax invoice ref #0041"
  },
  {
    "id": "inv-42",
    "invoiceNumber": "INV-2026-042",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-26",
    "dueDate": "2026-02-10",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-42-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      },
      {
        "id": "invl-42-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 1,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 2500,
        "taxAmount": 450,
        "total": 2950
      }
    ],
    "subtotal": 31000,
    "taxTotal": 5580,
    "grandTotal": 36580,
    "amountPaid": 36580,
    "balanceDue": 0,
    "journalEntryId": "je-inv-42",
    "soId": "so-42",
    "soNumber": "SO-2026-042",
    "notes": "Tax invoice ref #0042"
  },
  {
    "id": "inv-43",
    "invoiceNumber": "INV-2026-043",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-26",
    "dueDate": "2026-02-10",
    "status": "POSTED",
    "lines": [
      {
        "id": "invl-43-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 2,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 84000,
        "taxAmount": 15120,
        "total": 99120
      },
      {
        "id": "invl-43-2",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 2,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 64000,
        "taxAmount": 11520,
        "total": 75520
      }
    ],
    "subtotal": 148000,
    "taxTotal": 26640,
    "grandTotal": 174640,
    "amountPaid": 0,
    "balanceDue": 174640,
    "journalEntryId": "je-inv-43",
    "soId": "so-43",
    "soNumber": "SO-2026-043",
    "notes": "Tax invoice ref #0043"
  },
  {
    "id": "inv-44",
    "invoiceNumber": "INV-2026-044",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-27",
    "dueDate": "2026-02-11",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-44-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 3,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 25500,
        "taxAmount": 4590,
        "total": 30090
      },
      {
        "id": "invl-44-2",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 1,
        "unitPrice": 15000,
        "taxRate": 18,
        "subtotal": 15000,
        "taxAmount": 2700,
        "total": 17700
      }
    ],
    "subtotal": 40500,
    "taxTotal": 7290,
    "grandTotal": 47790,
    "amountPaid": 47790,
    "balanceDue": 0,
    "journalEntryId": "je-inv-44",
    "soId": "so-44",
    "soNumber": "SO-2026-044",
    "notes": "Tax invoice ref #0044"
  },
  {
    "id": "inv-45",
    "invoiceNumber": "INV-2026-045",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-27",
    "dueDate": "2026-02-11",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-45-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 1,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 4500,
        "taxAmount": 810,
        "total": 5310
      },
      {
        "id": "invl-45-2",
        "productId": "prd-3",
        "productName": "Executive Walnut Desk",
        "quantity": 2,
        "unitPrice": 12500,
        "taxRate": 18,
        "subtotal": 25000,
        "taxAmount": 4500,
        "total": 29500
      }
    ],
    "subtotal": 29500,
    "taxTotal": 5310,
    "grandTotal": 34810,
    "amountPaid": 34810,
    "balanceDue": 0,
    "journalEntryId": "je-inv-45",
    "soId": "so-45",
    "soNumber": "SO-2026-045",
    "notes": "Tax invoice ref #0045"
  },
  {
    "id": "inv-46",
    "invoiceNumber": "INV-2026-046",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-28",
    "dueDate": "2026-02-12",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-46-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 2,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 64000,
        "taxAmount": 11520,
        "total": 75520
      },
      {
        "id": "invl-46-2",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 1,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 42000,
        "taxAmount": 7560,
        "total": 49560
      }
    ],
    "subtotal": 106000,
    "taxTotal": 19080,
    "grandTotal": 125080,
    "amountPaid": 125080,
    "balanceDue": 0,
    "journalEntryId": "je-inv-46",
    "soId": "so-46",
    "soNumber": "SO-2026-046",
    "notes": "Tax invoice ref #0046"
  },
  {
    "id": "inv-47",
    "invoiceNumber": "INV-2026-047",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-28",
    "dueDate": "2026-02-12",
    "status": "OVERDUE",
    "lines": [
      {
        "id": "invl-47-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 3,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 85500,
        "taxAmount": 15390,
        "total": 100890
      },
      {
        "id": "invl-47-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 2,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 36000,
        "taxAmount": 6480,
        "total": 42480
      }
    ],
    "subtotal": 121500,
    "taxTotal": 21870,
    "grandTotal": 143370,
    "amountPaid": 0,
    "balanceDue": 143370,
    "journalEntryId": "je-inv-47",
    "soId": "so-47",
    "soNumber": "SO-2026-047",
    "notes": "Tax invoice ref #0047"
  },
  {
    "id": "inv-48",
    "invoiceNumber": "INV-2026-048",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-29",
    "dueDate": "2026-02-13",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-48-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 1,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 42000,
        "taxAmount": 7560,
        "total": 49560
      },
      {
        "id": "invl-48-2",
        "productId": "prd-9",
        "productName": "Minimalist Coffee Table",
        "quantity": 1,
        "unitPrice": 6200,
        "taxRate": 18,
        "subtotal": 6200,
        "taxAmount": 1116,
        "total": 7316
      }
    ],
    "subtotal": 48200,
    "taxTotal": 8676,
    "grandTotal": 56876,
    "amountPaid": 56876,
    "balanceDue": 0,
    "journalEntryId": "je-inv-48",
    "soId": "so-48",
    "soNumber": "SO-2026-048",
    "notes": "Tax invoice ref #0048"
  },
  {
    "id": "inv-49",
    "invoiceNumber": "INV-2026-049",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-29",
    "dueDate": "2026-02-13",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-49-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 17000,
        "taxAmount": 3060,
        "total": 20060
      },
      {
        "id": "invl-49-2",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 2,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 9000,
        "taxAmount": 1620,
        "total": 10620
      }
    ],
    "subtotal": 26000,
    "taxTotal": 4680,
    "grandTotal": 30680,
    "amountPaid": 30680,
    "balanceDue": 0,
    "journalEntryId": "je-inv-49",
    "soId": "so-49",
    "soNumber": "SO-2026-049",
    "notes": "Tax invoice ref #0049"
  },
  {
    "id": "inv-50",
    "invoiceNumber": "INV-2026-050",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-30",
    "dueDate": "2026-02-14",
    "status": "POSTED",
    "lines": [
      {
        "id": "invl-50-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 3,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 13500,
        "taxAmount": 2430,
        "total": 15930
      },
      {
        "id": "invl-50-2",
        "productId": "prd-8",
        "productName": "Acoustic Lounge Armchair",
        "quantity": 1,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 9500,
        "taxAmount": 1710,
        "total": 11210
      }
    ],
    "subtotal": 23000,
    "taxTotal": 4140,
    "grandTotal": 27140,
    "amountPaid": 0,
    "balanceDue": 27140,
    "journalEntryId": "je-inv-50",
    "soId": "so-50",
    "soNumber": "SO-2026-050",
    "notes": "Tax invoice ref #0050"
  },
  {
    "id": "inv-51",
    "invoiceNumber": "INV-2026-051",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-30",
    "dueDate": "2026-02-14",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-51-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 1,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 32000,
        "taxAmount": 5760,
        "total": 37760
      },
      {
        "id": "invl-51-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 2,
        "unitPrice": 3800,
        "taxRate": 18,
        "subtotal": 7600,
        "taxAmount": 1368,
        "total": 8968
      }
    ],
    "subtotal": 39600,
    "taxTotal": 7128,
    "grandTotal": 46728,
    "amountPaid": 46728,
    "balanceDue": 0,
    "journalEntryId": "je-inv-51",
    "soId": "so-51",
    "soNumber": "SO-2026-051",
    "notes": "Tax invoice ref #0051"
  },
  {
    "id": "inv-52",
    "invoiceNumber": "INV-2026-052",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-31",
    "dueDate": "2026-02-15",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-52-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      },
      {
        "id": "invl-52-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      }
    ],
    "subtotal": 85500,
    "taxTotal": 15390,
    "grandTotal": 100890,
    "amountPaid": 100890,
    "balanceDue": 0,
    "journalEntryId": "je-inv-52",
    "soId": "so-52",
    "soNumber": "SO-2026-052",
    "notes": "Tax invoice ref #0052"
  },
  {
    "id": "inv-53",
    "invoiceNumber": "INV-2026-053",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-01-31",
    "dueDate": "2026-02-15",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-53-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 3,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 126000,
        "taxAmount": 22680,
        "total": 148680
      },
      {
        "id": "invl-53-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 2,
        "unitPrice": 4800,
        "taxRate": 18,
        "subtotal": 9600,
        "taxAmount": 1728,
        "total": 11328
      }
    ],
    "subtotal": 135600,
    "taxTotal": 24408,
    "grandTotal": 160008,
    "amountPaid": 160008,
    "balanceDue": 0,
    "journalEntryId": "je-inv-53",
    "soId": "so-53",
    "soNumber": "SO-2026-053",
    "notes": "Tax invoice ref #0053"
  },
  {
    "id": "inv-54",
    "invoiceNumber": "INV-2026-054",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-01",
    "dueDate": "2026-02-16",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-54-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 1,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 8500,
        "taxAmount": 1530,
        "total": 10030
      },
      {
        "id": "invl-54-2",
        "productId": "prd-6",
        "productName": "Solid Oak Credenza Bookshelf",
        "quantity": 1,
        "unitPrice": 22000,
        "taxRate": 18,
        "subtotal": 22000,
        "taxAmount": 3960,
        "total": 25960
      }
    ],
    "subtotal": 30500,
    "taxTotal": 5490,
    "grandTotal": 35990,
    "amountPaid": 35990,
    "balanceDue": 0,
    "journalEntryId": "je-inv-54",
    "soId": "so-54",
    "soNumber": "SO-2026-054",
    "notes": "Tax invoice ref #0054"
  },
  {
    "id": "inv-55",
    "invoiceNumber": "INV-2026-055",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-01",
    "dueDate": "2026-02-16",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-55-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 2,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 9000,
        "taxAmount": 1620,
        "total": 10620
      },
      {
        "id": "invl-55-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 17000,
        "taxAmount": 3060,
        "total": 20060
      }
    ],
    "subtotal": 26000,
    "taxTotal": 4680,
    "grandTotal": 30680,
    "amountPaid": 30680,
    "balanceDue": 0,
    "journalEntryId": "je-inv-55",
    "soId": "so-55",
    "soNumber": "SO-2026-055",
    "notes": "Tax invoice ref #0055"
  },
  {
    "id": "inv-56",
    "invoiceNumber": "INV-2026-056",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-02",
    "dueDate": "2026-02-17",
    "status": "OVERDUE",
    "lines": [
      {
        "id": "invl-56-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 3,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 96000,
        "taxAmount": 17280,
        "total": 113280
      },
      {
        "id": "invl-56-2",
        "productId": "prd-5",
        "productName": "Custom Furniture Assembly & Polishing",
        "quantity": 1,
        "unitPrice": 1500,
        "taxRate": 18,
        "subtotal": 1500,
        "taxAmount": 270,
        "total": 1770
      }
    ],
    "subtotal": 97500,
    "taxTotal": 17550,
    "grandTotal": 115050,
    "amountPaid": 0,
    "balanceDue": 115050,
    "journalEntryId": "je-inv-56",
    "soId": "so-56",
    "soNumber": "SO-2026-056",
    "notes": "Tax invoice ref #0056"
  },
  {
    "id": "inv-57",
    "invoiceNumber": "INV-2026-057",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-02",
    "dueDate": "2026-02-17",
    "status": "POSTED",
    "lines": [
      {
        "id": "invl-57-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      },
      {
        "id": "invl-57-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 2,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 5000,
        "taxAmount": 900,
        "total": 5900
      }
    ],
    "subtotal": 33500,
    "taxTotal": 6030,
    "grandTotal": 39530,
    "amountPaid": 0,
    "balanceDue": 39530,
    "journalEntryId": "je-inv-57",
    "soId": "so-57",
    "soNumber": "SO-2026-057",
    "notes": "Tax invoice ref #0057"
  },
  {
    "id": "inv-58",
    "invoiceNumber": "INV-2026-058",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-03",
    "dueDate": "2026-02-18",
    "status": "PARTIALLY_PAID",
    "lines": [
      {
        "id": "invl-58-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 2,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 84000,
        "taxAmount": 15120,
        "total": 99120
      },
      {
        "id": "invl-58-2",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 1,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 32000,
        "taxAmount": 5760,
        "total": 37760
      }
    ],
    "subtotal": 116000,
    "taxTotal": 20880,
    "grandTotal": 136880,
    "amountPaid": 54752,
    "balanceDue": 82128,
    "journalEntryId": "je-inv-58",
    "soId": "so-58",
    "soNumber": "SO-2026-058",
    "notes": "Tax invoice ref #0058"
  },
  {
    "id": "inv-59",
    "invoiceNumber": "INV-2026-059",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-03",
    "dueDate": "2026-02-18",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-59-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 3,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 25500,
        "taxAmount": 4590,
        "total": 30090
      },
      {
        "id": "invl-59-2",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 2,
        "unitPrice": 15000,
        "taxRate": 18,
        "subtotal": 30000,
        "taxAmount": 5400,
        "total": 35400
      }
    ],
    "subtotal": 55500,
    "taxTotal": 9990,
    "grandTotal": 65490,
    "amountPaid": 65490,
    "balanceDue": 0,
    "journalEntryId": "je-inv-59",
    "soId": "so-59",
    "soNumber": "SO-2026-059",
    "notes": "Tax invoice ref #0059"
  },
  {
    "id": "inv-60",
    "invoiceNumber": "INV-2026-060",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-04",
    "dueDate": "2026-02-19",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-60-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 1,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 4500,
        "taxAmount": 810,
        "total": 5310
      },
      {
        "id": "invl-60-2",
        "productId": "prd-3",
        "productName": "Executive Walnut Desk",
        "quantity": 1,
        "unitPrice": 12500,
        "taxRate": 18,
        "subtotal": 12500,
        "taxAmount": 2250,
        "total": 14750
      }
    ],
    "subtotal": 17000,
    "taxTotal": 3060,
    "grandTotal": 20060,
    "amountPaid": 20060,
    "balanceDue": 0,
    "journalEntryId": "je-inv-60",
    "soId": "so-60",
    "soNumber": "SO-2026-060",
    "notes": "Tax invoice ref #0060"
  },
  {
    "id": "inv-61",
    "invoiceNumber": "INV-2026-061",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-04",
    "dueDate": "2026-02-19",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-61-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 2,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 64000,
        "taxAmount": 11520,
        "total": 75520
      },
      {
        "id": "invl-61-2",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 2,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 84000,
        "taxAmount": 15120,
        "total": 99120
      }
    ],
    "subtotal": 148000,
    "taxTotal": 26640,
    "grandTotal": 174640,
    "amountPaid": 174640,
    "balanceDue": 0,
    "journalEntryId": "je-inv-61",
    "soId": "so-61",
    "soNumber": "SO-2026-061",
    "notes": "Tax invoice ref #0061"
  },
  {
    "id": "inv-62",
    "invoiceNumber": "INV-2026-062",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-05",
    "dueDate": "2026-02-20",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-62-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 3,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 85500,
        "taxAmount": 15390,
        "total": 100890
      },
      {
        "id": "invl-62-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 1,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 18000,
        "taxAmount": 3240,
        "total": 21240
      }
    ],
    "subtotal": 103500,
    "taxTotal": 18630,
    "grandTotal": 122130,
    "amountPaid": 122130,
    "balanceDue": 0,
    "journalEntryId": "je-inv-62",
    "soId": "so-62",
    "soNumber": "SO-2026-062",
    "notes": "Tax invoice ref #0062"
  },
  {
    "id": "inv-63",
    "invoiceNumber": "INV-2026-063",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-05",
    "dueDate": "2026-02-20",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-63-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 1,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 42000,
        "taxAmount": 7560,
        "total": 49560
      },
      {
        "id": "invl-63-2",
        "productId": "prd-9",
        "productName": "Minimalist Coffee Table",
        "quantity": 2,
        "unitPrice": 6200,
        "taxRate": 18,
        "subtotal": 12400,
        "taxAmount": 2232,
        "total": 14632
      }
    ],
    "subtotal": 54400,
    "taxTotal": 9792,
    "grandTotal": 64192,
    "amountPaid": 64192,
    "balanceDue": 0,
    "journalEntryId": "je-inv-63",
    "soId": "so-63",
    "soNumber": "SO-2026-063",
    "notes": "Tax invoice ref #0063"
  },
  {
    "id": "inv-64",
    "invoiceNumber": "INV-2026-064",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-06",
    "dueDate": "2026-02-21",
    "status": "POSTED",
    "lines": [
      {
        "id": "invl-64-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 17000,
        "taxAmount": 3060,
        "total": 20060
      },
      {
        "id": "invl-64-2",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 1,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 4500,
        "taxAmount": 810,
        "total": 5310
      }
    ],
    "subtotal": 21500,
    "taxTotal": 3870,
    "grandTotal": 25370,
    "amountPaid": 0,
    "balanceDue": 25370,
    "journalEntryId": "je-inv-64",
    "soId": "so-64",
    "soNumber": "SO-2026-064",
    "notes": "Tax invoice ref #0064"
  },
  {
    "id": "inv-65",
    "invoiceNumber": "INV-2026-065",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-06",
    "dueDate": "2026-02-21",
    "status": "OVERDUE",
    "lines": [
      {
        "id": "invl-65-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 3,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 13500,
        "taxAmount": 2430,
        "total": 15930
      },
      {
        "id": "invl-65-2",
        "productId": "prd-8",
        "productName": "Acoustic Lounge Armchair",
        "quantity": 2,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 19000,
        "taxAmount": 3420,
        "total": 22420
      }
    ],
    "subtotal": 32500,
    "taxTotal": 5850,
    "grandTotal": 38350,
    "amountPaid": 0,
    "balanceDue": 38350,
    "journalEntryId": "je-inv-65",
    "soId": "so-65",
    "soNumber": "SO-2026-065",
    "notes": "Tax invoice ref #0065"
  },
  {
    "id": "inv-66",
    "invoiceNumber": "INV-2026-066",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-07",
    "dueDate": "2026-02-22",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-66-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 1,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 32000,
        "taxAmount": 5760,
        "total": 37760
      },
      {
        "id": "invl-66-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 1,
        "unitPrice": 3800,
        "taxRate": 18,
        "subtotal": 3800,
        "taxAmount": 684,
        "total": 4484
      }
    ],
    "subtotal": 35800,
    "taxTotal": 6444,
    "grandTotal": 42244,
    "amountPaid": 42244,
    "balanceDue": 0,
    "journalEntryId": "je-inv-66",
    "soId": "so-66",
    "soNumber": "SO-2026-066",
    "notes": "Tax invoice ref #0066"
  },
  {
    "id": "inv-67",
    "invoiceNumber": "INV-2026-067",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-07",
    "dueDate": "2026-02-22",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-67-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      },
      {
        "id": "invl-67-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      }
    ],
    "subtotal": 114000,
    "taxTotal": 20520,
    "grandTotal": 134520,
    "amountPaid": 134520,
    "balanceDue": 0,
    "journalEntryId": "je-inv-67",
    "soId": "so-67",
    "soNumber": "SO-2026-067",
    "notes": "Tax invoice ref #0067"
  },
  {
    "id": "inv-68",
    "invoiceNumber": "INV-2026-068",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-08",
    "dueDate": "2026-02-23",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-68-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 3,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 126000,
        "taxAmount": 22680,
        "total": 148680
      },
      {
        "id": "invl-68-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 1,
        "unitPrice": 4800,
        "taxRate": 18,
        "subtotal": 4800,
        "taxAmount": 864,
        "total": 5664
      }
    ],
    "subtotal": 130800,
    "taxTotal": 23544,
    "grandTotal": 154344,
    "amountPaid": 154344,
    "balanceDue": 0,
    "journalEntryId": "je-inv-68",
    "soId": "so-68",
    "soNumber": "SO-2026-068",
    "notes": "Tax invoice ref #0068"
  },
  {
    "id": "inv-69",
    "invoiceNumber": "INV-2026-069",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-08",
    "dueDate": "2026-02-23",
    "status": "PARTIALLY_PAID",
    "lines": [
      {
        "id": "invl-69-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 1,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 8500,
        "taxAmount": 1530,
        "total": 10030
      },
      {
        "id": "invl-69-2",
        "productId": "prd-6",
        "productName": "Solid Oak Credenza Bookshelf",
        "quantity": 2,
        "unitPrice": 22000,
        "taxRate": 18,
        "subtotal": 44000,
        "taxAmount": 7920,
        "total": 51920
      }
    ],
    "subtotal": 52500,
    "taxTotal": 9450,
    "grandTotal": 61950,
    "amountPaid": 24780,
    "balanceDue": 37170,
    "journalEntryId": "je-inv-69",
    "soId": "so-69",
    "soNumber": "SO-2026-069",
    "notes": "Tax invoice ref #0069"
  },
  {
    "id": "inv-70",
    "invoiceNumber": "INV-2026-070",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-09",
    "dueDate": "2026-02-24",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-70-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 2,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 9000,
        "taxAmount": 1620,
        "total": 10620
      },
      {
        "id": "invl-70-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 1,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 8500,
        "taxAmount": 1530,
        "total": 10030
      }
    ],
    "subtotal": 17500,
    "taxTotal": 3150,
    "grandTotal": 20650,
    "amountPaid": 20650,
    "balanceDue": 0,
    "journalEntryId": "je-inv-70",
    "soId": "so-70",
    "soNumber": "SO-2026-070",
    "notes": "Tax invoice ref #0070"
  },
  {
    "id": "inv-71",
    "invoiceNumber": "INV-2026-071",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-09",
    "dueDate": "2026-02-24",
    "status": "POSTED",
    "lines": [
      {
        "id": "invl-71-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 3,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 96000,
        "taxAmount": 17280,
        "total": 113280
      },
      {
        "id": "invl-71-2",
        "productId": "prd-5",
        "productName": "Custom Furniture Assembly & Polishing",
        "quantity": 2,
        "unitPrice": 1500,
        "taxRate": 18,
        "subtotal": 3000,
        "taxAmount": 540,
        "total": 3540
      }
    ],
    "subtotal": 99000,
    "taxTotal": 17820,
    "grandTotal": 116820,
    "amountPaid": 0,
    "balanceDue": 116820,
    "journalEntryId": "je-inv-71",
    "soId": "so-71",
    "soNumber": "SO-2026-071",
    "notes": "Tax invoice ref #0071"
  },
  {
    "id": "inv-72",
    "invoiceNumber": "INV-2026-072",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-10",
    "dueDate": "2026-02-25",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-72-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      },
      {
        "id": "invl-72-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 1,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 2500,
        "taxAmount": 450,
        "total": 2950
      }
    ],
    "subtotal": 31000,
    "taxTotal": 5580,
    "grandTotal": 36580,
    "amountPaid": 36580,
    "balanceDue": 0,
    "journalEntryId": "je-inv-72",
    "soId": "so-72",
    "soNumber": "SO-2026-072",
    "notes": "Tax invoice ref #0072"
  },
  {
    "id": "inv-73",
    "invoiceNumber": "INV-2026-073",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-10",
    "dueDate": "2026-02-25",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-73-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 2,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 84000,
        "taxAmount": 15120,
        "total": 99120
      },
      {
        "id": "invl-73-2",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 2,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 64000,
        "taxAmount": 11520,
        "total": 75520
      }
    ],
    "subtotal": 148000,
    "taxTotal": 26640,
    "grandTotal": 174640,
    "amountPaid": 174640,
    "balanceDue": 0,
    "journalEntryId": "je-inv-73",
    "soId": "so-73",
    "soNumber": "SO-2026-073",
    "notes": "Tax invoice ref #0073"
  },
  {
    "id": "inv-74",
    "invoiceNumber": "INV-2026-074",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-11",
    "dueDate": "2026-02-26",
    "status": "OVERDUE",
    "lines": [
      {
        "id": "invl-74-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 3,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 25500,
        "taxAmount": 4590,
        "total": 30090
      },
      {
        "id": "invl-74-2",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 1,
        "unitPrice": 15000,
        "taxRate": 18,
        "subtotal": 15000,
        "taxAmount": 2700,
        "total": 17700
      }
    ],
    "subtotal": 40500,
    "taxTotal": 7290,
    "grandTotal": 47790,
    "amountPaid": 0,
    "balanceDue": 47790,
    "journalEntryId": "je-inv-74",
    "soId": "so-74",
    "soNumber": "SO-2026-074",
    "notes": "Tax invoice ref #0074"
  },
  {
    "id": "inv-75",
    "invoiceNumber": "INV-2026-075",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-11",
    "dueDate": "2026-02-26",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-75-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 1,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 4500,
        "taxAmount": 810,
        "total": 5310
      },
      {
        "id": "invl-75-2",
        "productId": "prd-3",
        "productName": "Executive Walnut Desk",
        "quantity": 2,
        "unitPrice": 12500,
        "taxRate": 18,
        "subtotal": 25000,
        "taxAmount": 4500,
        "total": 29500
      }
    ],
    "subtotal": 29500,
    "taxTotal": 5310,
    "grandTotal": 34810,
    "amountPaid": 34810,
    "balanceDue": 0,
    "journalEntryId": "je-inv-75",
    "soId": "so-75",
    "soNumber": "SO-2026-075",
    "notes": "Tax invoice ref #0075"
  },
  {
    "id": "inv-76",
    "invoiceNumber": "INV-2026-076",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-12",
    "dueDate": "2026-02-27",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-76-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 2,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 64000,
        "taxAmount": 11520,
        "total": 75520
      },
      {
        "id": "invl-76-2",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 1,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 42000,
        "taxAmount": 7560,
        "total": 49560
      }
    ],
    "subtotal": 106000,
    "taxTotal": 19080,
    "grandTotal": 125080,
    "amountPaid": 125080,
    "balanceDue": 0,
    "journalEntryId": "je-inv-76",
    "soId": "so-76",
    "soNumber": "SO-2026-076",
    "notes": "Tax invoice ref #0076"
  },
  {
    "id": "inv-77",
    "invoiceNumber": "INV-2026-077",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-12",
    "dueDate": "2026-02-27",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-77-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 3,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 85500,
        "taxAmount": 15390,
        "total": 100890
      },
      {
        "id": "invl-77-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 2,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 36000,
        "taxAmount": 6480,
        "total": 42480
      }
    ],
    "subtotal": 121500,
    "taxTotal": 21870,
    "grandTotal": 143370,
    "amountPaid": 143370,
    "balanceDue": 0,
    "journalEntryId": "je-inv-77",
    "soId": "so-77",
    "soNumber": "SO-2026-077",
    "notes": "Tax invoice ref #0077"
  },
  {
    "id": "inv-78",
    "invoiceNumber": "INV-2026-078",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-13",
    "dueDate": "2026-02-28",
    "status": "POSTED",
    "lines": [
      {
        "id": "invl-78-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 1,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 42000,
        "taxAmount": 7560,
        "total": 49560
      },
      {
        "id": "invl-78-2",
        "productId": "prd-9",
        "productName": "Minimalist Coffee Table",
        "quantity": 1,
        "unitPrice": 6200,
        "taxRate": 18,
        "subtotal": 6200,
        "taxAmount": 1116,
        "total": 7316
      }
    ],
    "subtotal": 48200,
    "taxTotal": 8676,
    "grandTotal": 56876,
    "amountPaid": 0,
    "balanceDue": 56876,
    "journalEntryId": "je-inv-78",
    "soId": "so-78",
    "soNumber": "SO-2026-078",
    "notes": "Tax invoice ref #0078"
  },
  {
    "id": "inv-79",
    "invoiceNumber": "INV-2026-079",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-13",
    "dueDate": "2026-02-28",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-79-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 17000,
        "taxAmount": 3060,
        "total": 20060
      },
      {
        "id": "invl-79-2",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 2,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 9000,
        "taxAmount": 1620,
        "total": 10620
      }
    ],
    "subtotal": 26000,
    "taxTotal": 4680,
    "grandTotal": 30680,
    "amountPaid": 30680,
    "balanceDue": 0,
    "journalEntryId": "je-inv-79",
    "soId": "so-79",
    "soNumber": "SO-2026-079",
    "notes": "Tax invoice ref #0079"
  },
  {
    "id": "inv-80",
    "invoiceNumber": "INV-2026-080",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-14",
    "dueDate": "2026-03-01",
    "status": "PARTIALLY_PAID",
    "lines": [
      {
        "id": "invl-80-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 3,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 13500,
        "taxAmount": 2430,
        "total": 15930
      },
      {
        "id": "invl-80-2",
        "productId": "prd-8",
        "productName": "Acoustic Lounge Armchair",
        "quantity": 1,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 9500,
        "taxAmount": 1710,
        "total": 11210
      }
    ],
    "subtotal": 23000,
    "taxTotal": 4140,
    "grandTotal": 27140,
    "amountPaid": 10856,
    "balanceDue": 16284,
    "journalEntryId": "je-inv-80",
    "soId": "so-80",
    "soNumber": "SO-2026-080",
    "notes": "Tax invoice ref #0080"
  },
  {
    "id": "inv-81",
    "invoiceNumber": "INV-2026-081",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-14",
    "dueDate": "2026-03-01",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-81-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 1,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 32000,
        "taxAmount": 5760,
        "total": 37760
      },
      {
        "id": "invl-81-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 2,
        "unitPrice": 3800,
        "taxRate": 18,
        "subtotal": 7600,
        "taxAmount": 1368,
        "total": 8968
      }
    ],
    "subtotal": 39600,
    "taxTotal": 7128,
    "grandTotal": 46728,
    "amountPaid": 46728,
    "balanceDue": 0,
    "journalEntryId": "je-inv-81",
    "soId": "so-81",
    "soNumber": "SO-2026-081",
    "notes": "Tax invoice ref #0081"
  },
  {
    "id": "inv-82",
    "invoiceNumber": "INV-2026-082",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-15",
    "dueDate": "2026-03-02",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-82-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      },
      {
        "id": "invl-82-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      }
    ],
    "subtotal": 85500,
    "taxTotal": 15390,
    "grandTotal": 100890,
    "amountPaid": 100890,
    "balanceDue": 0,
    "journalEntryId": "je-inv-82",
    "soId": "so-82",
    "soNumber": "SO-2026-082",
    "notes": "Tax invoice ref #0082"
  },
  {
    "id": "inv-83",
    "invoiceNumber": "INV-2026-083",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-15",
    "dueDate": "2026-03-02",
    "status": "OVERDUE",
    "lines": [
      {
        "id": "invl-83-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 3,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 126000,
        "taxAmount": 22680,
        "total": 148680
      },
      {
        "id": "invl-83-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 2,
        "unitPrice": 4800,
        "taxRate": 18,
        "subtotal": 9600,
        "taxAmount": 1728,
        "total": 11328
      }
    ],
    "subtotal": 135600,
    "taxTotal": 24408,
    "grandTotal": 160008,
    "amountPaid": 0,
    "balanceDue": 160008,
    "journalEntryId": "je-inv-83",
    "soId": "so-83",
    "soNumber": "SO-2026-083",
    "notes": "Tax invoice ref #0083"
  },
  {
    "id": "inv-84",
    "invoiceNumber": "INV-2026-084",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-16",
    "dueDate": "2026-03-03",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-84-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 1,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 8500,
        "taxAmount": 1530,
        "total": 10030
      },
      {
        "id": "invl-84-2",
        "productId": "prd-6",
        "productName": "Solid Oak Credenza Bookshelf",
        "quantity": 1,
        "unitPrice": 22000,
        "taxRate": 18,
        "subtotal": 22000,
        "taxAmount": 3960,
        "total": 25960
      }
    ],
    "subtotal": 30500,
    "taxTotal": 5490,
    "grandTotal": 35990,
    "amountPaid": 35990,
    "balanceDue": 0,
    "journalEntryId": "je-inv-84",
    "soId": "so-84",
    "soNumber": "SO-2026-084",
    "notes": "Tax invoice ref #0084"
  },
  {
    "id": "inv-85",
    "invoiceNumber": "INV-2026-085",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-16",
    "dueDate": "2026-03-03",
    "status": "POSTED",
    "lines": [
      {
        "id": "invl-85-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 2,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 9000,
        "taxAmount": 1620,
        "total": 10620
      },
      {
        "id": "invl-85-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 17000,
        "taxAmount": 3060,
        "total": 20060
      }
    ],
    "subtotal": 26000,
    "taxTotal": 4680,
    "grandTotal": 30680,
    "amountPaid": 0,
    "balanceDue": 30680,
    "journalEntryId": "je-inv-85",
    "soId": "so-85",
    "soNumber": "SO-2026-085",
    "notes": "Tax invoice ref #0085"
  },
  {
    "id": "inv-86",
    "invoiceNumber": "INV-2026-086",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-17",
    "dueDate": "2026-03-04",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-86-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 3,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 96000,
        "taxAmount": 17280,
        "total": 113280
      },
      {
        "id": "invl-86-2",
        "productId": "prd-5",
        "productName": "Custom Furniture Assembly & Polishing",
        "quantity": 1,
        "unitPrice": 1500,
        "taxRate": 18,
        "subtotal": 1500,
        "taxAmount": 270,
        "total": 1770
      }
    ],
    "subtotal": 97500,
    "taxTotal": 17550,
    "grandTotal": 115050,
    "amountPaid": 115050,
    "balanceDue": 0,
    "journalEntryId": "je-inv-86",
    "soId": "so-86",
    "soNumber": "SO-2026-086",
    "notes": "Tax invoice ref #0086"
  },
  {
    "id": "inv-87",
    "invoiceNumber": "INV-2026-087",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-17",
    "dueDate": "2026-03-04",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-87-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      },
      {
        "id": "invl-87-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 2,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 5000,
        "taxAmount": 900,
        "total": 5900
      }
    ],
    "subtotal": 33500,
    "taxTotal": 6030,
    "grandTotal": 39530,
    "amountPaid": 39530,
    "balanceDue": 0,
    "journalEntryId": "je-inv-87",
    "soId": "so-87",
    "soNumber": "SO-2026-087",
    "notes": "Tax invoice ref #0087"
  },
  {
    "id": "inv-88",
    "invoiceNumber": "INV-2026-088",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-18",
    "dueDate": "2026-03-05",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-88-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 2,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 84000,
        "taxAmount": 15120,
        "total": 99120
      },
      {
        "id": "invl-88-2",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 1,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 32000,
        "taxAmount": 5760,
        "total": 37760
      }
    ],
    "subtotal": 116000,
    "taxTotal": 20880,
    "grandTotal": 136880,
    "amountPaid": 136880,
    "balanceDue": 0,
    "journalEntryId": "je-inv-88",
    "soId": "so-88",
    "soNumber": "SO-2026-088",
    "notes": "Tax invoice ref #0088"
  },
  {
    "id": "inv-89",
    "invoiceNumber": "INV-2026-089",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-18",
    "dueDate": "2026-03-05",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-89-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 3,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 25500,
        "taxAmount": 4590,
        "total": 30090
      },
      {
        "id": "invl-89-2",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 2,
        "unitPrice": 15000,
        "taxRate": 18,
        "subtotal": 30000,
        "taxAmount": 5400,
        "total": 35400
      }
    ],
    "subtotal": 55500,
    "taxTotal": 9990,
    "grandTotal": 65490,
    "amountPaid": 65490,
    "balanceDue": 0,
    "journalEntryId": "je-inv-89",
    "soId": "so-89",
    "soNumber": "SO-2026-089",
    "notes": "Tax invoice ref #0089"
  },
  {
    "id": "inv-90",
    "invoiceNumber": "INV-2026-090",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-19",
    "dueDate": "2026-03-06",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-90-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 1,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 4500,
        "taxAmount": 810,
        "total": 5310
      },
      {
        "id": "invl-90-2",
        "productId": "prd-3",
        "productName": "Executive Walnut Desk",
        "quantity": 1,
        "unitPrice": 12500,
        "taxRate": 18,
        "subtotal": 12500,
        "taxAmount": 2250,
        "total": 14750
      }
    ],
    "subtotal": 17000,
    "taxTotal": 3060,
    "grandTotal": 20060,
    "amountPaid": 20060,
    "balanceDue": 0,
    "journalEntryId": "je-inv-90",
    "soId": "so-90",
    "soNumber": "SO-2026-090",
    "notes": "Tax invoice ref #0090"
  },
  {
    "id": "inv-91",
    "invoiceNumber": "INV-2026-091",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-19",
    "dueDate": "2026-03-06",
    "status": "PARTIALLY_PAID",
    "lines": [
      {
        "id": "invl-91-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 2,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 64000,
        "taxAmount": 11520,
        "total": 75520
      },
      {
        "id": "invl-91-2",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 2,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 84000,
        "taxAmount": 15120,
        "total": 99120
      }
    ],
    "subtotal": 148000,
    "taxTotal": 26640,
    "grandTotal": 174640,
    "amountPaid": 69856,
    "balanceDue": 104784,
    "journalEntryId": "je-inv-91",
    "soId": "so-91",
    "soNumber": "SO-2026-091",
    "notes": "Tax invoice ref #0091"
  },
  {
    "id": "inv-92",
    "invoiceNumber": "INV-2026-092",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-20",
    "dueDate": "2026-03-07",
    "status": "POSTED",
    "lines": [
      {
        "id": "invl-92-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 3,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 85500,
        "taxAmount": 15390,
        "total": 100890
      },
      {
        "id": "invl-92-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 1,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 18000,
        "taxAmount": 3240,
        "total": 21240
      }
    ],
    "subtotal": 103500,
    "taxTotal": 18630,
    "grandTotal": 122130,
    "amountPaid": 0,
    "balanceDue": 122130,
    "journalEntryId": "je-inv-92",
    "soId": "so-92",
    "soNumber": "SO-2026-092",
    "notes": "Tax invoice ref #0092"
  },
  {
    "id": "inv-93",
    "invoiceNumber": "INV-2026-093",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-20",
    "dueDate": "2026-03-07",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-93-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 1,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 42000,
        "taxAmount": 7560,
        "total": 49560
      },
      {
        "id": "invl-93-2",
        "productId": "prd-9",
        "productName": "Minimalist Coffee Table",
        "quantity": 2,
        "unitPrice": 6200,
        "taxRate": 18,
        "subtotal": 12400,
        "taxAmount": 2232,
        "total": 14632
      }
    ],
    "subtotal": 54400,
    "taxTotal": 9792,
    "grandTotal": 64192,
    "amountPaid": 64192,
    "balanceDue": 0,
    "journalEntryId": "je-inv-93",
    "soId": "so-93",
    "soNumber": "SO-2026-093",
    "notes": "Tax invoice ref #0093"
  },
  {
    "id": "inv-94",
    "invoiceNumber": "INV-2026-094",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-21",
    "dueDate": "2026-03-08",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-94-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 17000,
        "taxAmount": 3060,
        "total": 20060
      },
      {
        "id": "invl-94-2",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 1,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 4500,
        "taxAmount": 810,
        "total": 5310
      }
    ],
    "subtotal": 21500,
    "taxTotal": 3870,
    "grandTotal": 25370,
    "amountPaid": 25370,
    "balanceDue": 0,
    "journalEntryId": "je-inv-94",
    "soId": "so-94",
    "soNumber": "SO-2026-094",
    "notes": "Tax invoice ref #0094"
  },
  {
    "id": "inv-95",
    "invoiceNumber": "INV-2026-095",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-21",
    "dueDate": "2026-03-08",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-95-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 3,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 13500,
        "taxAmount": 2430,
        "total": 15930
      },
      {
        "id": "invl-95-2",
        "productId": "prd-8",
        "productName": "Acoustic Lounge Armchair",
        "quantity": 2,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 19000,
        "taxAmount": 3420,
        "total": 22420
      }
    ],
    "subtotal": 32500,
    "taxTotal": 5850,
    "grandTotal": 38350,
    "amountPaid": 38350,
    "balanceDue": 0,
    "journalEntryId": "je-inv-95",
    "soId": "so-95",
    "soNumber": "SO-2026-095",
    "notes": "Tax invoice ref #0095"
  },
  {
    "id": "inv-96",
    "invoiceNumber": "INV-2026-096",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-22",
    "dueDate": "2026-03-09",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-96-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 1,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 32000,
        "taxAmount": 5760,
        "total": 37760
      },
      {
        "id": "invl-96-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 1,
        "unitPrice": 3800,
        "taxRate": 18,
        "subtotal": 3800,
        "taxAmount": 684,
        "total": 4484
      }
    ],
    "subtotal": 35800,
    "taxTotal": 6444,
    "grandTotal": 42244,
    "amountPaid": 42244,
    "balanceDue": 0,
    "journalEntryId": "je-inv-96",
    "soId": "so-96",
    "soNumber": "SO-2026-096",
    "notes": "Tax invoice ref #0096"
  },
  {
    "id": "inv-97",
    "invoiceNumber": "INV-2026-097",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-22",
    "dueDate": "2026-03-09",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-97-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      },
      {
        "id": "invl-97-2",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 2,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 57000,
        "taxAmount": 10260,
        "total": 67260
      }
    ],
    "subtotal": 114000,
    "taxTotal": 20520,
    "grandTotal": 134520,
    "amountPaid": 134520,
    "balanceDue": 0,
    "journalEntryId": "je-inv-97",
    "soId": "so-97",
    "soNumber": "SO-2026-097",
    "notes": "Tax invoice ref #0097"
  },
  {
    "id": "inv-98",
    "invoiceNumber": "INV-2026-098",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-23",
    "dueDate": "2026-03-10",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-98-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 3,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 126000,
        "taxAmount": 22680,
        "total": 148680
      },
      {
        "id": "invl-98-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 1,
        "unitPrice": 4800,
        "taxRate": 18,
        "subtotal": 4800,
        "taxAmount": 864,
        "total": 5664
      }
    ],
    "subtotal": 130800,
    "taxTotal": 23544,
    "grandTotal": 154344,
    "amountPaid": 154344,
    "balanceDue": 0,
    "journalEntryId": "je-inv-98",
    "soId": "so-98",
    "soNumber": "SO-2026-098",
    "notes": "Tax invoice ref #0098"
  },
  {
    "id": "inv-99",
    "invoiceNumber": "INV-2026-099",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-23",
    "dueDate": "2026-03-10",
    "status": "POSTED",
    "lines": [
      {
        "id": "invl-99-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 1,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 8500,
        "taxAmount": 1530,
        "total": 10030
      },
      {
        "id": "invl-99-2",
        "productId": "prd-6",
        "productName": "Solid Oak Credenza Bookshelf",
        "quantity": 2,
        "unitPrice": 22000,
        "taxRate": 18,
        "subtotal": 44000,
        "taxAmount": 7920,
        "total": 51920
      }
    ],
    "subtotal": 52500,
    "taxTotal": 9450,
    "grandTotal": 61950,
    "amountPaid": 0,
    "balanceDue": 61950,
    "journalEntryId": "je-inv-99",
    "soId": "so-99",
    "soNumber": "SO-2026-099",
    "notes": "Tax invoice ref #0099"
  },
  {
    "id": "inv-100",
    "invoiceNumber": "INV-2026-100",
    "customerId": "cnt_rohith_customer",
    "customerName": "Rohith",
    "customerEmail": "rohith@gmail.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-24",
    "dueDate": "2026-03-11",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-100-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 2,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 9000,
        "taxAmount": 1620,
        "total": 10620
      },
      {
        "id": "invl-100-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 1,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 8500,
        "taxAmount": 1530,
        "total": 10030
      }
    ],
    "subtotal": 17500,
    "taxTotal": 3150,
    "grandTotal": 20650,
    "amountPaid": 20650,
    "balanceDue": 0,
    "journalEntryId": "je-inv-100",
    "soId": "so-100",
    "soNumber": "SO-2026-100",
    "notes": "Tax invoice ref #0100"
  },
  {
    "id": "inv-101",
    "invoiceNumber": "INV-2026-101",
    "customerId": "cnt-3",
    "customerName": "Metro Spaces Interiors",
    "customerEmail": "metrospacesinteriors@example.com",
    "customerAddress": "Mumbai, Maharashtra - 400001",
    "issueDate": "2026-02-24",
    "dueDate": "2026-03-11",
    "status": "OVERDUE",
    "lines": [
      {
        "id": "invl-101-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 3,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 96000,
        "taxAmount": 17280,
        "total": 113280
      },
      {
        "id": "invl-101-2",
        "productId": "prd-5",
        "productName": "Custom Furniture Assembly & Polishing",
        "quantity": 2,
        "unitPrice": 1500,
        "taxRate": 18,
        "subtotal": 3000,
        "taxAmount": 540,
        "total": 3540
      }
    ],
    "subtotal": 99000,
    "taxTotal": 17820,
    "grandTotal": 116820,
    "amountPaid": 0,
    "balanceDue": 116820,
    "journalEntryId": "je-inv-101",
    "soId": "so-101",
    "soNumber": "SO-2026-101",
    "notes": "Tax invoice ref #0101"
  },
  {
    "id": "inv-102",
    "invoiceNumber": "INV-2026-102",
    "customerId": "cnt-1",
    "customerName": "Nimesh Pathak",
    "customerEmail": "nimesh@gmail.com",
    "customerAddress": "Mumbai, Maharashtra - 400001",
    "issueDate": "2026-02-25",
    "dueDate": "2026-03-12",
    "status": "PARTIALLY_PAID",
    "lines": [
      {
        "id": "invl-102-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 1,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 28500,
        "taxAmount": 5130,
        "total": 33630
      },
      {
        "id": "invl-102-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 1,
        "unitPrice": 2500,
        "taxRate": 18,
        "subtotal": 2500,
        "taxAmount": 450,
        "total": 2950
      }
    ],
    "subtotal": 31000,
    "taxTotal": 5580,
    "grandTotal": 36580,
    "amountPaid": 14632,
    "balanceDue": 21948,
    "journalEntryId": "je-inv-102",
    "soId": "so-102",
    "soNumber": "SO-2026-102",
    "notes": "Tax invoice ref #0102"
  },
  {
    "id": "inv-103",
    "invoiceNumber": "INV-2026-103",
    "customerId": "cnt-2",
    "customerName": "Azure Furniture Supplies",
    "customerEmail": "azure@furniture.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-25",
    "dueDate": "2026-03-12",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-103-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 2,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 84000,
        "taxAmount": 15120,
        "total": 99120
      },
      {
        "id": "invl-103-2",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 2,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 64000,
        "taxAmount": 11520,
        "total": 75520
      }
    ],
    "subtotal": 148000,
    "taxTotal": 26640,
    "grandTotal": 174640,
    "amountPaid": 174640,
    "balanceDue": 0,
    "journalEntryId": "je-inv-103",
    "soId": "so-103",
    "soNumber": "SO-2026-103",
    "notes": "Tax invoice ref #0103"
  },
  {
    "id": "inv-104",
    "invoiceNumber": "INV-2026-104",
    "customerId": "cnt-3",
    "customerName": "Metro Spaces Interiors",
    "customerEmail": "metrospacesinteriors@example.com",
    "customerAddress": "Mumbai, Maharashtra - 400001",
    "issueDate": "2026-02-26",
    "dueDate": "2026-03-13",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-104-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 3,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 25500,
        "taxAmount": 4590,
        "total": 30090
      },
      {
        "id": "invl-104-2",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 1,
        "unitPrice": 15000,
        "taxRate": 18,
        "subtotal": 15000,
        "taxAmount": 2700,
        "total": 17700
      }
    ],
    "subtotal": 40500,
    "taxTotal": 7290,
    "grandTotal": 47790,
    "amountPaid": 47790,
    "balanceDue": 0,
    "journalEntryId": "je-inv-104",
    "soId": "so-104",
    "soNumber": "SO-2026-104",
    "notes": "Tax invoice ref #0104"
  },
  {
    "id": "inv-105",
    "invoiceNumber": "INV-2026-105",
    "customerId": "cnt-1",
    "customerName": "Nimesh Pathak",
    "customerEmail": "nimesh@gmail.com",
    "customerAddress": "Mumbai, Maharashtra - 400001",
    "issueDate": "2026-02-26",
    "dueDate": "2026-03-13",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-105-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 1,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 4500,
        "taxAmount": 810,
        "total": 5310
      },
      {
        "id": "invl-105-2",
        "productId": "prd-3",
        "productName": "Executive Walnut Desk",
        "quantity": 2,
        "unitPrice": 12500,
        "taxRate": 18,
        "subtotal": 25000,
        "taxAmount": 4500,
        "total": 29500
      }
    ],
    "subtotal": 29500,
    "taxTotal": 5310,
    "grandTotal": 34810,
    "amountPaid": 34810,
    "balanceDue": 0,
    "journalEntryId": "je-inv-105",
    "soId": "so-105",
    "soNumber": "SO-2026-105",
    "notes": "Tax invoice ref #0105"
  },
  {
    "id": "inv-106",
    "invoiceNumber": "INV-2026-106",
    "customerId": "cnt-2",
    "customerName": "Azure Furniture Supplies",
    "customerEmail": "azure@furniture.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-27",
    "dueDate": "2026-03-14",
    "status": "POSTED",
    "lines": [
      {
        "id": "invl-106-1",
        "productId": "prd-4",
        "productName": "Velvet Sofa (3-Seater)",
        "quantity": 2,
        "unitPrice": 32000,
        "taxRate": 18,
        "subtotal": 64000,
        "taxAmount": 11520,
        "total": 75520
      },
      {
        "id": "invl-106-2",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 1,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 42000,
        "taxAmount": 7560,
        "total": 49560
      }
    ],
    "subtotal": 106000,
    "taxTotal": 19080,
    "grandTotal": 125080,
    "amountPaid": 0,
    "balanceDue": 125080,
    "journalEntryId": "je-inv-106",
    "soId": "so-106",
    "soNumber": "SO-2026-106",
    "notes": "Tax invoice ref #0106"
  },
  {
    "id": "inv-107",
    "invoiceNumber": "INV-2026-107",
    "customerId": "cnt-3",
    "customerName": "Metro Spaces Interiors",
    "customerEmail": "metrospacesinteriors@example.com",
    "customerAddress": "Mumbai, Maharashtra - 400001",
    "issueDate": "2026-02-27",
    "dueDate": "2026-03-14",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-107-1",
        "productId": "prd-7",
        "productName": "King Size Sheesham Bed Frame",
        "quantity": 3,
        "unitPrice": 28500,
        "taxRate": 18,
        "subtotal": 85500,
        "taxAmount": 15390,
        "total": 100890
      },
      {
        "id": "invl-107-2",
        "productId": "prd-2",
        "productName": "Teak Wood Dining Table (6-Seater)",
        "quantity": 2,
        "unitPrice": 18000,
        "taxRate": 18,
        "subtotal": 36000,
        "taxAmount": 6480,
        "total": 42480
      }
    ],
    "subtotal": 121500,
    "taxTotal": 21870,
    "grandTotal": 143370,
    "amountPaid": 143370,
    "balanceDue": 0,
    "journalEntryId": "je-inv-107",
    "soId": "so-107",
    "soNumber": "SO-2026-107",
    "notes": "Tax invoice ref #0107"
  },
  {
    "id": "inv-108",
    "invoiceNumber": "INV-2026-108",
    "customerId": "cnt-1",
    "customerName": "Nimesh Pathak",
    "customerEmail": "nimesh@gmail.com",
    "customerAddress": "Mumbai, Maharashtra - 400001",
    "issueDate": "2026-02-28",
    "dueDate": "2026-03-15",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-108-1",
        "productId": "prd-10",
        "productName": "Modular Workstation Unit (4-Pod)",
        "quantity": 1,
        "unitPrice": 42000,
        "taxRate": 18,
        "subtotal": 42000,
        "taxAmount": 7560,
        "total": 49560
      },
      {
        "id": "invl-108-2",
        "productId": "prd-9",
        "productName": "Minimalist Coffee Table",
        "quantity": 1,
        "unitPrice": 6200,
        "taxRate": 18,
        "subtotal": 6200,
        "taxAmount": 1116,
        "total": 7316
      }
    ],
    "subtotal": 48200,
    "taxTotal": 8676,
    "grandTotal": 56876,
    "amountPaid": 56876,
    "balanceDue": 0,
    "journalEntryId": "je-inv-108",
    "soId": "so-108",
    "soNumber": "SO-2026-108",
    "notes": "Tax invoice ref #0108"
  },
  {
    "id": "inv-109",
    "invoiceNumber": "INV-2026-109",
    "customerId": "cnt-2",
    "customerName": "Azure Furniture Supplies",
    "customerEmail": "azure@furniture.com",
    "customerAddress": "Bangalore, Karnataka - 560001",
    "issueDate": "2026-02-28",
    "dueDate": "2026-03-15",
    "status": "PAID",
    "lines": [
      {
        "id": "invl-109-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 8500,
        "taxRate": 18,
        "subtotal": 17000,
        "taxAmount": 3060,
        "total": 20060
      },
      {
        "id": "invl-109-2",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 2,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 9000,
        "taxAmount": 1620,
        "total": 10620
      }
    ],
    "subtotal": 26000,
    "taxTotal": 4680,
    "grandTotal": 30680,
    "amountPaid": 30680,
    "balanceDue": 0,
    "journalEntryId": "je-inv-109",
    "soId": "so-109",
    "soNumber": "SO-2026-109",
    "notes": "Tax invoice ref #0109"
  },
  {
    "id": "inv-110",
    "invoiceNumber": "INV-2026-110",
    "customerId": "cnt-3",
    "customerName": "Metro Spaces Interiors",
    "customerEmail": "metrospacesinteriors@example.com",
    "customerAddress": "Mumbai, Maharashtra - 400001",
    "issueDate": "2026-03-01",
    "dueDate": "2026-03-16",
    "status": "OVERDUE",
    "lines": [
      {
        "id": "invl-110-1",
        "productId": "prd-1",
        "productName": "Ergonomic Office Chair",
        "quantity": 3,
        "unitPrice": 4500,
        "taxRate": 18,
        "subtotal": 13500,
        "taxAmount": 2430,
        "total": 15930
      },
      {
        "id": "invl-110-2",
        "productId": "prd-8",
        "productName": "Acoustic Lounge Armchair",
        "quantity": 1,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 9500,
        "taxAmount": 1710,
        "total": 11210
      }
    ],
    "subtotal": 23000,
    "taxTotal": 4140,
    "grandTotal": 27140,
    "amountPaid": 0,
    "balanceDue": 27140,
    "journalEntryId": "je-inv-110",
    "soId": "so-110",
    "soNumber": "SO-2026-110",
    "notes": "Tax invoice ref #0110"
  }
];

// ==========================================
// TRANSACTIONS: BILLS
// ==========================================
export const INITIAL_BILLS: Bill[] = [
  {
    "id": "bill-1",
    "billNumber": "BILL-2026-001",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-05",
    "dueDate": "2026-01-20",
    "status": "POSTED",
    "lines": [
      {
        "id": "billl-1-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "billl-1-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 17700,
    "taxTotal": 3186,
    "grandTotal": 20886,
    "amountPaid": 0,
    "balanceDue": 20886,
    "journalEntryId": "je-bill-1",
    "poId": "po-1",
    "poNumber": "PO-2026-001",
    "billReference": "SUP-REF-0001",
    "notes": "Supplier timber bill #1"
  },
  {
    "id": "bill-2",
    "billNumber": "BILL-2026-002",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-06",
    "dueDate": "2026-01-21",
    "status": "OVERDUE",
    "lines": [
      {
        "id": "billl-2-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "billl-2-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 45600,
    "taxTotal": 8208,
    "grandTotal": 53808,
    "amountPaid": 0,
    "balanceDue": 53808,
    "journalEntryId": "je-bill-2",
    "poId": "po-2",
    "poNumber": "PO-2026-002",
    "billReference": "SUP-REF-0002",
    "notes": "Supplier timber bill #2"
  },
  {
    "id": "bill-3",
    "billNumber": "BILL-2026-003",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-06",
    "dueDate": "2026-01-21",
    "status": "PARTIALLY_PAID",
    "lines": [
      {
        "id": "billl-3-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "billl-3-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 31800,
    "taxTotal": 5724,
    "grandTotal": 37524,
    "amountPaid": 18762,
    "balanceDue": 18762,
    "journalEntryId": "je-bill-3",
    "poId": "po-3",
    "poNumber": "PO-2026-003",
    "billReference": "SUP-REF-0003",
    "notes": "Supplier timber bill #3"
  },
  {
    "id": "bill-4",
    "billNumber": "BILL-2026-004",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-07",
    "dueDate": "2026-01-22",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-4-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "billl-4-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 31100,
    "taxTotal": 5598,
    "grandTotal": 36698,
    "amountPaid": 36698,
    "balanceDue": 0,
    "journalEntryId": "je-bill-4",
    "poId": "po-4",
    "poNumber": "PO-2026-004",
    "billReference": "SUP-REF-0004",
    "notes": "Supplier timber bill #4"
  },
  {
    "id": "bill-5",
    "billNumber": "BILL-2026-005",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-07",
    "dueDate": "2026-01-22",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-5-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "billl-5-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 56800,
    "taxTotal": 10224,
    "grandTotal": 67024,
    "amountPaid": 67024,
    "balanceDue": 0,
    "journalEntryId": "je-bill-5",
    "poId": "po-5",
    "poNumber": "PO-2026-005",
    "billReference": "SUP-REF-0005",
    "notes": "Supplier timber bill #5"
  },
  {
    "id": "bill-6",
    "billNumber": "BILL-2026-006",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-08",
    "dueDate": "2026-01-23",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-6-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "billl-6-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 17600,
    "taxTotal": 3168,
    "grandTotal": 20768,
    "amountPaid": 20768,
    "balanceDue": 0,
    "journalEntryId": "je-bill-6",
    "poId": "po-6",
    "poNumber": "PO-2026-006",
    "billReference": "SUP-REF-0006",
    "notes": "Supplier timber bill #6"
  },
  {
    "id": "bill-7",
    "billNumber": "BILL-2026-007",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-08",
    "dueDate": "2026-01-23",
    "status": "POSTED",
    "lines": [
      {
        "id": "billl-7-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "billl-7-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 43400,
    "taxTotal": 7812,
    "grandTotal": 51212,
    "amountPaid": 0,
    "balanceDue": 51212,
    "journalEntryId": "je-bill-7",
    "poId": "po-7",
    "poNumber": "PO-2026-007",
    "billReference": "SUP-REF-0007",
    "notes": "Supplier timber bill #7"
  },
  {
    "id": "bill-8",
    "billNumber": "BILL-2026-008",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-09",
    "dueDate": "2026-01-24",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-8-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "billl-8-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 35200,
    "taxTotal": 6336,
    "grandTotal": 41536,
    "amountPaid": 41536,
    "balanceDue": 0,
    "journalEntryId": "je-bill-8",
    "poId": "po-8",
    "poNumber": "PO-2026-008",
    "billReference": "SUP-REF-0008",
    "notes": "Supplier timber bill #8"
  },
  {
    "id": "bill-9",
    "billNumber": "BILL-2026-009",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-09",
    "dueDate": "2026-01-24",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-9-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "billl-9-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 30000,
    "taxTotal": 5400,
    "grandTotal": 35400,
    "amountPaid": 35400,
    "balanceDue": 0,
    "journalEntryId": "je-bill-9",
    "poId": "po-9",
    "poNumber": "PO-2026-009",
    "billReference": "SUP-REF-0009",
    "notes": "Supplier timber bill #9"
  },
  {
    "id": "bill-10",
    "billNumber": "BILL-2026-010",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-10",
    "dueDate": "2026-01-25",
    "status": "OVERDUE",
    "lines": [
      {
        "id": "billl-10-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "billl-10-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 56700,
    "taxTotal": 10206,
    "grandTotal": 66906,
    "amountPaid": 0,
    "balanceDue": 66906,
    "journalEntryId": "je-bill-10",
    "poId": "po-10",
    "poNumber": "PO-2026-010",
    "billReference": "SUP-REF-0010",
    "notes": "Supplier timber bill #10"
  },
  {
    "id": "bill-11",
    "billNumber": "BILL-2026-011",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-10",
    "dueDate": "2026-01-25",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-11-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "billl-11-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 15400,
    "taxTotal": 2772,
    "grandTotal": 18172,
    "amountPaid": 18172,
    "balanceDue": 0,
    "journalEntryId": "je-bill-11",
    "poId": "po-11",
    "poNumber": "PO-2026-011",
    "billReference": "SUP-REF-0011",
    "notes": "Supplier timber bill #11"
  },
  {
    "id": "bill-12",
    "billNumber": "BILL-2026-012",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-11",
    "dueDate": "2026-01-26",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-12-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "billl-12-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 46800,
    "taxTotal": 8424,
    "grandTotal": 55224,
    "amountPaid": 55224,
    "balanceDue": 0,
    "journalEntryId": "je-bill-12",
    "poId": "po-12",
    "poNumber": "PO-2026-012",
    "billReference": "SUP-REF-0012",
    "notes": "Supplier timber bill #12"
  },
  {
    "id": "bill-13",
    "billNumber": "BILL-2026-013",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-11",
    "dueDate": "2026-01-26",
    "status": "POSTED",
    "lines": [
      {
        "id": "billl-13-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "billl-13-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 34100,
    "taxTotal": 6138,
    "grandTotal": 40238,
    "amountPaid": 0,
    "balanceDue": 40238,
    "journalEntryId": "je-bill-13",
    "poId": "po-13",
    "poNumber": "PO-2026-013",
    "billReference": "SUP-REF-0013",
    "notes": "Supplier timber bill #13"
  },
  {
    "id": "bill-14",
    "billNumber": "BILL-2026-014",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-12",
    "dueDate": "2026-01-27",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-14-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "billl-14-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 29900,
    "taxTotal": 5382,
    "grandTotal": 35282,
    "amountPaid": 35282,
    "balanceDue": 0,
    "journalEntryId": "je-bill-14",
    "poId": "po-14",
    "poNumber": "PO-2026-014",
    "billReference": "SUP-REF-0014",
    "notes": "Supplier timber bill #14"
  },
  {
    "id": "bill-15",
    "billNumber": "BILL-2026-015",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-12",
    "dueDate": "2026-01-27",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-15-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "billl-15-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 54500,
    "taxTotal": 9810,
    "grandTotal": 64310,
    "amountPaid": 64310,
    "balanceDue": 0,
    "journalEntryId": "je-bill-15",
    "poId": "po-15",
    "poNumber": "PO-2026-015",
    "billReference": "SUP-REF-0015",
    "notes": "Supplier timber bill #15"
  },
  {
    "id": "bill-16",
    "billNumber": "BILL-2026-016",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-13",
    "dueDate": "2026-01-28",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-16-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "billl-16-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 18800,
    "taxTotal": 3384,
    "grandTotal": 22184,
    "amountPaid": 22184,
    "balanceDue": 0,
    "journalEntryId": "je-bill-16",
    "poId": "po-16",
    "poNumber": "PO-2026-016",
    "billReference": "SUP-REF-0016",
    "notes": "Supplier timber bill #16"
  },
  {
    "id": "bill-17",
    "billNumber": "BILL-2026-017",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-13",
    "dueDate": "2026-01-28",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-17-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "billl-17-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 45700,
    "taxTotal": 8226,
    "grandTotal": 53926,
    "amountPaid": 53926,
    "balanceDue": 0,
    "journalEntryId": "je-bill-17",
    "poId": "po-17",
    "poNumber": "PO-2026-017",
    "billReference": "SUP-REF-0017",
    "notes": "Supplier timber bill #17"
  },
  {
    "id": "bill-18",
    "billNumber": "BILL-2026-018",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-14",
    "dueDate": "2026-01-29",
    "status": "OVERDUE",
    "lines": [
      {
        "id": "billl-18-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "billl-18-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 34000,
    "taxTotal": 6120,
    "grandTotal": 40120,
    "amountPaid": 0,
    "balanceDue": 40120,
    "journalEntryId": "je-bill-18",
    "poId": "po-18",
    "poNumber": "PO-2026-018",
    "billReference": "SUP-REF-0018",
    "notes": "Supplier timber bill #18"
  },
  {
    "id": "bill-19",
    "billNumber": "BILL-2026-019",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-14",
    "dueDate": "2026-01-29",
    "status": "POSTED",
    "lines": [
      {
        "id": "billl-19-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "billl-19-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 27700,
    "taxTotal": 4986,
    "grandTotal": 32686,
    "amountPaid": 0,
    "balanceDue": 32686,
    "journalEntryId": "je-bill-19",
    "poId": "po-19",
    "poNumber": "PO-2026-019",
    "billReference": "SUP-REF-0019",
    "notes": "Supplier timber bill #19"
  },
  {
    "id": "bill-20",
    "billNumber": "BILL-2026-020",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-15",
    "dueDate": "2026-01-30",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-20-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "billl-20-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 57900,
    "taxTotal": 10422,
    "grandTotal": 68322,
    "amountPaid": 68322,
    "balanceDue": 0,
    "journalEntryId": "je-bill-20",
    "poId": "po-20",
    "poNumber": "PO-2026-020",
    "billReference": "SUP-REF-0020",
    "notes": "Supplier timber bill #20"
  },
  {
    "id": "bill-21",
    "billNumber": "BILL-2026-021",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-15",
    "dueDate": "2026-01-30",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-21-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "billl-21-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 17700,
    "taxTotal": 3186,
    "grandTotal": 20886,
    "amountPaid": 20886,
    "balanceDue": 0,
    "journalEntryId": "je-bill-21",
    "poId": "po-21",
    "poNumber": "PO-2026-021",
    "billReference": "SUP-REF-0021",
    "notes": "Supplier timber bill #21"
  },
  {
    "id": "bill-22",
    "billNumber": "BILL-2026-022",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-16",
    "dueDate": "2026-01-31",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-22-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "billl-22-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 45600,
    "taxTotal": 8208,
    "grandTotal": 53808,
    "amountPaid": 53808,
    "balanceDue": 0,
    "journalEntryId": "je-bill-22",
    "poId": "po-22",
    "poNumber": "PO-2026-022",
    "billReference": "SUP-REF-0022",
    "notes": "Supplier timber bill #22"
  },
  {
    "id": "bill-23",
    "billNumber": "BILL-2026-023",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-16",
    "dueDate": "2026-01-31",
    "status": "PARTIALLY_PAID",
    "lines": [
      {
        "id": "billl-23-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "billl-23-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 31800,
    "taxTotal": 5724,
    "grandTotal": 37524,
    "amountPaid": 18762,
    "balanceDue": 18762,
    "journalEntryId": "je-bill-23",
    "poId": "po-23",
    "poNumber": "PO-2026-023",
    "billReference": "SUP-REF-0023",
    "notes": "Supplier timber bill #23"
  },
  {
    "id": "bill-24",
    "billNumber": "BILL-2026-024",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-17",
    "dueDate": "2026-02-01",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-24-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "billl-24-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 31100,
    "taxTotal": 5598,
    "grandTotal": 36698,
    "amountPaid": 36698,
    "balanceDue": 0,
    "journalEntryId": "je-bill-24",
    "poId": "po-24",
    "poNumber": "PO-2026-024",
    "billReference": "SUP-REF-0024",
    "notes": "Supplier timber bill #24"
  },
  {
    "id": "bill-25",
    "billNumber": "BILL-2026-025",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-17",
    "dueDate": "2026-02-01",
    "status": "POSTED",
    "lines": [
      {
        "id": "billl-25-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "billl-25-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 56800,
    "taxTotal": 10224,
    "grandTotal": 67024,
    "amountPaid": 0,
    "balanceDue": 67024,
    "journalEntryId": "je-bill-25",
    "poId": "po-25",
    "poNumber": "PO-2026-025",
    "billReference": "SUP-REF-0025",
    "notes": "Supplier timber bill #25"
  },
  {
    "id": "bill-26",
    "billNumber": "BILL-2026-026",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-18",
    "dueDate": "2026-02-02",
    "status": "OVERDUE",
    "lines": [
      {
        "id": "billl-26-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "billl-26-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 17600,
    "taxTotal": 3168,
    "grandTotal": 20768,
    "amountPaid": 0,
    "balanceDue": 20768,
    "journalEntryId": "je-bill-26",
    "poId": "po-26",
    "poNumber": "PO-2026-026",
    "billReference": "SUP-REF-0026",
    "notes": "Supplier timber bill #26"
  },
  {
    "id": "bill-27",
    "billNumber": "BILL-2026-027",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-18",
    "dueDate": "2026-02-02",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-27-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "billl-27-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 43400,
    "taxTotal": 7812,
    "grandTotal": 51212,
    "amountPaid": 51212,
    "balanceDue": 0,
    "journalEntryId": "je-bill-27",
    "poId": "po-27",
    "poNumber": "PO-2026-027",
    "billReference": "SUP-REF-0027",
    "notes": "Supplier timber bill #27"
  },
  {
    "id": "bill-28",
    "billNumber": "BILL-2026-028",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-19",
    "dueDate": "2026-02-03",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-28-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "billl-28-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 35200,
    "taxTotal": 6336,
    "grandTotal": 41536,
    "amountPaid": 41536,
    "balanceDue": 0,
    "journalEntryId": "je-bill-28",
    "poId": "po-28",
    "poNumber": "PO-2026-028",
    "billReference": "SUP-REF-0028",
    "notes": "Supplier timber bill #28"
  },
  {
    "id": "bill-29",
    "billNumber": "BILL-2026-029",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-19",
    "dueDate": "2026-02-03",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-29-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "billl-29-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 30000,
    "taxTotal": 5400,
    "grandTotal": 35400,
    "amountPaid": 35400,
    "balanceDue": 0,
    "journalEntryId": "je-bill-29",
    "poId": "po-29",
    "poNumber": "PO-2026-029",
    "billReference": "SUP-REF-0029",
    "notes": "Supplier timber bill #29"
  },
  {
    "id": "bill-30",
    "billNumber": "BILL-2026-030",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-20",
    "dueDate": "2026-02-04",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-30-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "billl-30-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 56700,
    "taxTotal": 10206,
    "grandTotal": 66906,
    "amountPaid": 66906,
    "balanceDue": 0,
    "journalEntryId": "je-bill-30",
    "poId": "po-30",
    "poNumber": "PO-2026-030",
    "billReference": "SUP-REF-0030",
    "notes": "Supplier timber bill #30"
  },
  {
    "id": "bill-31",
    "billNumber": "BILL-2026-031",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-20",
    "dueDate": "2026-02-04",
    "status": "POSTED",
    "lines": [
      {
        "id": "billl-31-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "billl-31-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 15400,
    "taxTotal": 2772,
    "grandTotal": 18172,
    "amountPaid": 0,
    "balanceDue": 18172,
    "journalEntryId": "je-bill-31",
    "poId": "po-31",
    "poNumber": "PO-2026-031",
    "billReference": "SUP-REF-0031",
    "notes": "Supplier timber bill #31"
  },
  {
    "id": "bill-32",
    "billNumber": "BILL-2026-032",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-21",
    "dueDate": "2026-02-05",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-32-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "billl-32-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 46800,
    "taxTotal": 8424,
    "grandTotal": 55224,
    "amountPaid": 55224,
    "balanceDue": 0,
    "journalEntryId": "je-bill-32",
    "poId": "po-32",
    "poNumber": "PO-2026-032",
    "billReference": "SUP-REF-0032",
    "notes": "Supplier timber bill #32"
  },
  {
    "id": "bill-33",
    "billNumber": "BILL-2026-033",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-21",
    "dueDate": "2026-02-05",
    "status": "PARTIALLY_PAID",
    "lines": [
      {
        "id": "billl-33-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "billl-33-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 34100,
    "taxTotal": 6138,
    "grandTotal": 40238,
    "amountPaid": 20119,
    "balanceDue": 20119,
    "journalEntryId": "je-bill-33",
    "poId": "po-33",
    "poNumber": "PO-2026-033",
    "billReference": "SUP-REF-0033",
    "notes": "Supplier timber bill #33"
  },
  {
    "id": "bill-34",
    "billNumber": "BILL-2026-034",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-22",
    "dueDate": "2026-02-06",
    "status": "OVERDUE",
    "lines": [
      {
        "id": "billl-34-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "billl-34-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 29900,
    "taxTotal": 5382,
    "grandTotal": 35282,
    "amountPaid": 0,
    "balanceDue": 35282,
    "journalEntryId": "je-bill-34",
    "poId": "po-34",
    "poNumber": "PO-2026-034",
    "billReference": "SUP-REF-0034",
    "notes": "Supplier timber bill #34"
  },
  {
    "id": "bill-35",
    "billNumber": "BILL-2026-035",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-22",
    "dueDate": "2026-02-06",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-35-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "billl-35-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 54500,
    "taxTotal": 9810,
    "grandTotal": 64310,
    "amountPaid": 64310,
    "balanceDue": 0,
    "journalEntryId": "je-bill-35",
    "poId": "po-35",
    "poNumber": "PO-2026-035",
    "billReference": "SUP-REF-0035",
    "notes": "Supplier timber bill #35"
  },
  {
    "id": "bill-36",
    "billNumber": "BILL-2026-036",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-23",
    "dueDate": "2026-02-07",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-36-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "billl-36-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 18800,
    "taxTotal": 3384,
    "grandTotal": 22184,
    "amountPaid": 22184,
    "balanceDue": 0,
    "journalEntryId": "je-bill-36",
    "poId": "po-36",
    "poNumber": "PO-2026-036",
    "billReference": "SUP-REF-0036",
    "notes": "Supplier timber bill #36"
  },
  {
    "id": "bill-37",
    "billNumber": "BILL-2026-037",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-23",
    "dueDate": "2026-02-07",
    "status": "POSTED",
    "lines": [
      {
        "id": "billl-37-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "billl-37-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 45700,
    "taxTotal": 8226,
    "grandTotal": 53926,
    "amountPaid": 0,
    "balanceDue": 53926,
    "journalEntryId": "je-bill-37",
    "poId": "po-37",
    "poNumber": "PO-2026-037",
    "billReference": "SUP-REF-0037",
    "notes": "Supplier timber bill #37"
  },
  {
    "id": "bill-38",
    "billNumber": "BILL-2026-038",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-24",
    "dueDate": "2026-02-08",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-38-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "billl-38-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 34000,
    "taxTotal": 6120,
    "grandTotal": 40120,
    "amountPaid": 40120,
    "balanceDue": 0,
    "journalEntryId": "je-bill-38",
    "poId": "po-38",
    "poNumber": "PO-2026-038",
    "billReference": "SUP-REF-0038",
    "notes": "Supplier timber bill #38"
  },
  {
    "id": "bill-39",
    "billNumber": "BILL-2026-039",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-24",
    "dueDate": "2026-02-08",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-39-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "billl-39-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 27700,
    "taxTotal": 4986,
    "grandTotal": 32686,
    "amountPaid": 32686,
    "balanceDue": 0,
    "journalEntryId": "je-bill-39",
    "poId": "po-39",
    "poNumber": "PO-2026-039",
    "billReference": "SUP-REF-0039",
    "notes": "Supplier timber bill #39"
  },
  {
    "id": "bill-40",
    "billNumber": "BILL-2026-040",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-25",
    "dueDate": "2026-02-09",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-40-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "billl-40-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 57900,
    "taxTotal": 10422,
    "grandTotal": 68322,
    "amountPaid": 68322,
    "balanceDue": 0,
    "journalEntryId": "je-bill-40",
    "poId": "po-40",
    "poNumber": "PO-2026-040",
    "billReference": "SUP-REF-0040",
    "notes": "Supplier timber bill #40"
  },
  {
    "id": "bill-41",
    "billNumber": "BILL-2026-041",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-25",
    "dueDate": "2026-02-09",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-41-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "billl-41-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 17700,
    "taxTotal": 3186,
    "grandTotal": 20886,
    "amountPaid": 20886,
    "balanceDue": 0,
    "journalEntryId": "je-bill-41",
    "poId": "po-41",
    "poNumber": "PO-2026-041",
    "billReference": "SUP-REF-0041",
    "notes": "Supplier timber bill #41"
  },
  {
    "id": "bill-42",
    "billNumber": "BILL-2026-042",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-26",
    "dueDate": "2026-02-10",
    "status": "OVERDUE",
    "lines": [
      {
        "id": "billl-42-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "billl-42-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 45600,
    "taxTotal": 8208,
    "grandTotal": 53808,
    "amountPaid": 0,
    "balanceDue": 53808,
    "journalEntryId": "je-bill-42",
    "poId": "po-42",
    "poNumber": "PO-2026-042",
    "billReference": "SUP-REF-0042",
    "notes": "Supplier timber bill #42"
  },
  {
    "id": "bill-43",
    "billNumber": "BILL-2026-043",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-26",
    "dueDate": "2026-02-10",
    "status": "POSTED",
    "lines": [
      {
        "id": "billl-43-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "billl-43-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 31800,
    "taxTotal": 5724,
    "grandTotal": 37524,
    "amountPaid": 0,
    "balanceDue": 37524,
    "journalEntryId": "je-bill-43",
    "poId": "po-43",
    "poNumber": "PO-2026-043",
    "billReference": "SUP-REF-0043",
    "notes": "Supplier timber bill #43"
  },
  {
    "id": "bill-44",
    "billNumber": "BILL-2026-044",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-27",
    "dueDate": "2026-02-11",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-44-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "billl-44-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 31100,
    "taxTotal": 5598,
    "grandTotal": 36698,
    "amountPaid": 36698,
    "balanceDue": 0,
    "journalEntryId": "je-bill-44",
    "poId": "po-44",
    "poNumber": "PO-2026-044",
    "billReference": "SUP-REF-0044",
    "notes": "Supplier timber bill #44"
  },
  {
    "id": "bill-45",
    "billNumber": "BILL-2026-045",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-27",
    "dueDate": "2026-02-11",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-45-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "billl-45-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 56800,
    "taxTotal": 10224,
    "grandTotal": 67024,
    "amountPaid": 67024,
    "balanceDue": 0,
    "journalEntryId": "je-bill-45",
    "poId": "po-45",
    "poNumber": "PO-2026-045",
    "billReference": "SUP-REF-0045",
    "notes": "Supplier timber bill #45"
  },
  {
    "id": "bill-46",
    "billNumber": "BILL-2026-046",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-28",
    "dueDate": "2026-02-12",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-46-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "billl-46-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 17600,
    "taxTotal": 3168,
    "grandTotal": 20768,
    "amountPaid": 20768,
    "balanceDue": 0,
    "journalEntryId": "je-bill-46",
    "poId": "po-46",
    "poNumber": "PO-2026-046",
    "billReference": "SUP-REF-0046",
    "notes": "Supplier timber bill #46"
  },
  {
    "id": "bill-47",
    "billNumber": "BILL-2026-047",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-28",
    "dueDate": "2026-02-12",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-47-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "billl-47-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 43400,
    "taxTotal": 7812,
    "grandTotal": 51212,
    "amountPaid": 51212,
    "balanceDue": 0,
    "journalEntryId": "je-bill-47",
    "poId": "po-47",
    "poNumber": "PO-2026-047",
    "billReference": "SUP-REF-0047",
    "notes": "Supplier timber bill #47"
  },
  {
    "id": "bill-48",
    "billNumber": "BILL-2026-048",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-29",
    "dueDate": "2026-02-13",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-48-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "billl-48-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 35200,
    "taxTotal": 6336,
    "grandTotal": 41536,
    "amountPaid": 41536,
    "balanceDue": 0,
    "journalEntryId": "je-bill-48",
    "poId": "po-48",
    "poNumber": "PO-2026-048",
    "billReference": "SUP-REF-0048",
    "notes": "Supplier timber bill #48"
  },
  {
    "id": "bill-49",
    "billNumber": "BILL-2026-049",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-29",
    "dueDate": "2026-02-13",
    "status": "POSTED",
    "lines": [
      {
        "id": "billl-49-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "billl-49-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 30000,
    "taxTotal": 5400,
    "grandTotal": 35400,
    "amountPaid": 0,
    "balanceDue": 35400,
    "journalEntryId": "je-bill-49",
    "poId": "po-49",
    "poNumber": "PO-2026-049",
    "billReference": "SUP-REF-0049",
    "notes": "Supplier timber bill #49"
  },
  {
    "id": "bill-50",
    "billNumber": "BILL-2026-050",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-30",
    "dueDate": "2026-02-14",
    "status": "OVERDUE",
    "lines": [
      {
        "id": "billl-50-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "billl-50-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 56700,
    "taxTotal": 10206,
    "grandTotal": 66906,
    "amountPaid": 0,
    "balanceDue": 66906,
    "journalEntryId": "je-bill-50",
    "poId": "po-50",
    "poNumber": "PO-2026-050",
    "billReference": "SUP-REF-0050",
    "notes": "Supplier timber bill #50"
  },
  {
    "id": "bill-51",
    "billNumber": "BILL-2026-051",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-30",
    "dueDate": "2026-02-14",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-51-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "billl-51-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 15400,
    "taxTotal": 2772,
    "grandTotal": 18172,
    "amountPaid": 18172,
    "balanceDue": 0,
    "journalEntryId": "je-bill-51",
    "poId": "po-51",
    "poNumber": "PO-2026-051",
    "billReference": "SUP-REF-0051",
    "notes": "Supplier timber bill #51"
  },
  {
    "id": "bill-52",
    "billNumber": "BILL-2026-052",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-31",
    "dueDate": "2026-02-15",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-52-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "billl-52-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 46800,
    "taxTotal": 8424,
    "grandTotal": 55224,
    "amountPaid": 55224,
    "balanceDue": 0,
    "journalEntryId": "je-bill-52",
    "poId": "po-52",
    "poNumber": "PO-2026-052",
    "billReference": "SUP-REF-0052",
    "notes": "Supplier timber bill #52"
  },
  {
    "id": "bill-53",
    "billNumber": "BILL-2026-053",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-01-31",
    "dueDate": "2026-02-15",
    "status": "PARTIALLY_PAID",
    "lines": [
      {
        "id": "billl-53-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "billl-53-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 34100,
    "taxTotal": 6138,
    "grandTotal": 40238,
    "amountPaid": 20119,
    "balanceDue": 20119,
    "journalEntryId": "je-bill-53",
    "poId": "po-53",
    "poNumber": "PO-2026-053",
    "billReference": "SUP-REF-0053",
    "notes": "Supplier timber bill #53"
  },
  {
    "id": "bill-54",
    "billNumber": "BILL-2026-054",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-01",
    "dueDate": "2026-02-16",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-54-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "billl-54-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 29900,
    "taxTotal": 5382,
    "grandTotal": 35282,
    "amountPaid": 35282,
    "balanceDue": 0,
    "journalEntryId": "je-bill-54",
    "poId": "po-54",
    "poNumber": "PO-2026-054",
    "billReference": "SUP-REF-0054",
    "notes": "Supplier timber bill #54"
  },
  {
    "id": "bill-55",
    "billNumber": "BILL-2026-055",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-01",
    "dueDate": "2026-02-16",
    "status": "POSTED",
    "lines": [
      {
        "id": "billl-55-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "billl-55-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 54500,
    "taxTotal": 9810,
    "grandTotal": 64310,
    "amountPaid": 0,
    "balanceDue": 64310,
    "journalEntryId": "je-bill-55",
    "poId": "po-55",
    "poNumber": "PO-2026-055",
    "billReference": "SUP-REF-0055",
    "notes": "Supplier timber bill #55"
  },
  {
    "id": "bill-56",
    "billNumber": "BILL-2026-056",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-02",
    "dueDate": "2026-02-17",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-56-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "billl-56-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 18800,
    "taxTotal": 3384,
    "grandTotal": 22184,
    "amountPaid": 22184,
    "balanceDue": 0,
    "journalEntryId": "je-bill-56",
    "poId": "po-56",
    "poNumber": "PO-2026-056",
    "billReference": "SUP-REF-0056",
    "notes": "Supplier timber bill #56"
  },
  {
    "id": "bill-57",
    "billNumber": "BILL-2026-057",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-02",
    "dueDate": "2026-02-17",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-57-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "billl-57-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 45700,
    "taxTotal": 8226,
    "grandTotal": 53926,
    "amountPaid": 53926,
    "balanceDue": 0,
    "journalEntryId": "je-bill-57",
    "poId": "po-57",
    "poNumber": "PO-2026-057",
    "billReference": "SUP-REF-0057",
    "notes": "Supplier timber bill #57"
  },
  {
    "id": "bill-58",
    "billNumber": "BILL-2026-058",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-03",
    "dueDate": "2026-02-18",
    "status": "OVERDUE",
    "lines": [
      {
        "id": "billl-58-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "billl-58-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 34000,
    "taxTotal": 6120,
    "grandTotal": 40120,
    "amountPaid": 0,
    "balanceDue": 40120,
    "journalEntryId": "je-bill-58",
    "poId": "po-58",
    "poNumber": "PO-2026-058",
    "billReference": "SUP-REF-0058",
    "notes": "Supplier timber bill #58"
  },
  {
    "id": "bill-59",
    "billNumber": "BILL-2026-059",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-03",
    "dueDate": "2026-02-18",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-59-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "billl-59-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 27700,
    "taxTotal": 4986,
    "grandTotal": 32686,
    "amountPaid": 32686,
    "balanceDue": 0,
    "journalEntryId": "je-bill-59",
    "poId": "po-59",
    "poNumber": "PO-2026-059",
    "billReference": "SUP-REF-0059",
    "notes": "Supplier timber bill #59"
  },
  {
    "id": "bill-60",
    "billNumber": "BILL-2026-060",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-04",
    "dueDate": "2026-02-19",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-60-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "billl-60-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 57900,
    "taxTotal": 10422,
    "grandTotal": 68322,
    "amountPaid": 68322,
    "balanceDue": 0,
    "journalEntryId": "je-bill-60",
    "poId": "po-60",
    "poNumber": "PO-2026-060",
    "billReference": "SUP-REF-0060",
    "notes": "Supplier timber bill #60"
  },
  {
    "id": "bill-61",
    "billNumber": "BILL-2026-061",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-04",
    "dueDate": "2026-02-19",
    "status": "POSTED",
    "lines": [
      {
        "id": "billl-61-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "billl-61-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 17700,
    "taxTotal": 3186,
    "grandTotal": 20886,
    "amountPaid": 0,
    "balanceDue": 20886,
    "journalEntryId": "je-bill-61",
    "poId": "po-61",
    "poNumber": "PO-2026-061",
    "billReference": "SUP-REF-0061",
    "notes": "Supplier timber bill #61"
  },
  {
    "id": "bill-62",
    "billNumber": "BILL-2026-062",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-05",
    "dueDate": "2026-02-20",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-62-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "billl-62-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 45600,
    "taxTotal": 8208,
    "grandTotal": 53808,
    "amountPaid": 53808,
    "balanceDue": 0,
    "journalEntryId": "je-bill-62",
    "poId": "po-62",
    "poNumber": "PO-2026-062",
    "billReference": "SUP-REF-0062",
    "notes": "Supplier timber bill #62"
  },
  {
    "id": "bill-63",
    "billNumber": "BILL-2026-063",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-05",
    "dueDate": "2026-02-20",
    "status": "PARTIALLY_PAID",
    "lines": [
      {
        "id": "billl-63-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "billl-63-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 31800,
    "taxTotal": 5724,
    "grandTotal": 37524,
    "amountPaid": 18762,
    "balanceDue": 18762,
    "journalEntryId": "je-bill-63",
    "poId": "po-63",
    "poNumber": "PO-2026-063",
    "billReference": "SUP-REF-0063",
    "notes": "Supplier timber bill #63"
  },
  {
    "id": "bill-64",
    "billNumber": "BILL-2026-064",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-06",
    "dueDate": "2026-02-21",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-64-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "billl-64-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 31100,
    "taxTotal": 5598,
    "grandTotal": 36698,
    "amountPaid": 36698,
    "balanceDue": 0,
    "journalEntryId": "je-bill-64",
    "poId": "po-64",
    "poNumber": "PO-2026-064",
    "billReference": "SUP-REF-0064",
    "notes": "Supplier timber bill #64"
  },
  {
    "id": "bill-65",
    "billNumber": "BILL-2026-065",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-06",
    "dueDate": "2026-02-21",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-65-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "billl-65-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 56800,
    "taxTotal": 10224,
    "grandTotal": 67024,
    "amountPaid": 67024,
    "balanceDue": 0,
    "journalEntryId": "je-bill-65",
    "poId": "po-65",
    "poNumber": "PO-2026-065",
    "billReference": "SUP-REF-0065",
    "notes": "Supplier timber bill #65"
  },
  {
    "id": "bill-66",
    "billNumber": "BILL-2026-066",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-07",
    "dueDate": "2026-02-22",
    "status": "OVERDUE",
    "lines": [
      {
        "id": "billl-66-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "billl-66-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 17600,
    "taxTotal": 3168,
    "grandTotal": 20768,
    "amountPaid": 0,
    "balanceDue": 20768,
    "journalEntryId": "je-bill-66",
    "poId": "po-66",
    "poNumber": "PO-2026-066",
    "billReference": "SUP-REF-0066",
    "notes": "Supplier timber bill #66"
  },
  {
    "id": "bill-67",
    "billNumber": "BILL-2026-067",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-07",
    "dueDate": "2026-02-22",
    "status": "POSTED",
    "lines": [
      {
        "id": "billl-67-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "billl-67-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 43400,
    "taxTotal": 7812,
    "grandTotal": 51212,
    "amountPaid": 0,
    "balanceDue": 51212,
    "journalEntryId": "je-bill-67",
    "poId": "po-67",
    "poNumber": "PO-2026-067",
    "billReference": "SUP-REF-0067",
    "notes": "Supplier timber bill #67"
  },
  {
    "id": "bill-68",
    "billNumber": "BILL-2026-068",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-08",
    "dueDate": "2026-02-23",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-68-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "billl-68-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 35200,
    "taxTotal": 6336,
    "grandTotal": 41536,
    "amountPaid": 41536,
    "balanceDue": 0,
    "journalEntryId": "je-bill-68",
    "poId": "po-68",
    "poNumber": "PO-2026-068",
    "billReference": "SUP-REF-0068",
    "notes": "Supplier timber bill #68"
  },
  {
    "id": "bill-69",
    "billNumber": "BILL-2026-069",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-08",
    "dueDate": "2026-02-23",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-69-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "billl-69-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 30000,
    "taxTotal": 5400,
    "grandTotal": 35400,
    "amountPaid": 35400,
    "balanceDue": 0,
    "journalEntryId": "je-bill-69",
    "poId": "po-69",
    "poNumber": "PO-2026-069",
    "billReference": "SUP-REF-0069",
    "notes": "Supplier timber bill #69"
  },
  {
    "id": "bill-70",
    "billNumber": "BILL-2026-070",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-09",
    "dueDate": "2026-02-24",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-70-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "billl-70-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 56700,
    "taxTotal": 10206,
    "grandTotal": 66906,
    "amountPaid": 66906,
    "balanceDue": 0,
    "journalEntryId": "je-bill-70",
    "poId": "po-70",
    "poNumber": "PO-2026-070",
    "billReference": "SUP-REF-0070",
    "notes": "Supplier timber bill #70"
  },
  {
    "id": "bill-71",
    "billNumber": "BILL-2026-071",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-09",
    "dueDate": "2026-02-24",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-71-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "billl-71-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 15400,
    "taxTotal": 2772,
    "grandTotal": 18172,
    "amountPaid": 18172,
    "balanceDue": 0,
    "journalEntryId": "je-bill-71",
    "poId": "po-71",
    "poNumber": "PO-2026-071",
    "billReference": "SUP-REF-0071",
    "notes": "Supplier timber bill #71"
  },
  {
    "id": "bill-72",
    "billNumber": "BILL-2026-072",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-10",
    "dueDate": "2026-02-25",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-72-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "billl-72-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 46800,
    "taxTotal": 8424,
    "grandTotal": 55224,
    "amountPaid": 55224,
    "balanceDue": 0,
    "journalEntryId": "je-bill-72",
    "poId": "po-72",
    "poNumber": "PO-2026-072",
    "billReference": "SUP-REF-0072",
    "notes": "Supplier timber bill #72"
  },
  {
    "id": "bill-73",
    "billNumber": "BILL-2026-073",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-10",
    "dueDate": "2026-02-25",
    "status": "POSTED",
    "lines": [
      {
        "id": "billl-73-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "billl-73-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 34100,
    "taxTotal": 6138,
    "grandTotal": 40238,
    "amountPaid": 0,
    "balanceDue": 40238,
    "journalEntryId": "je-bill-73",
    "poId": "po-73",
    "poNumber": "PO-2026-073",
    "billReference": "SUP-REF-0073",
    "notes": "Supplier timber bill #73"
  },
  {
    "id": "bill-74",
    "billNumber": "BILL-2026-074",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-11",
    "dueDate": "2026-02-26",
    "status": "OVERDUE",
    "lines": [
      {
        "id": "billl-74-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "billl-74-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 29900,
    "taxTotal": 5382,
    "grandTotal": 35282,
    "amountPaid": 0,
    "balanceDue": 35282,
    "journalEntryId": "je-bill-74",
    "poId": "po-74",
    "poNumber": "PO-2026-074",
    "billReference": "SUP-REF-0074",
    "notes": "Supplier timber bill #74"
  },
  {
    "id": "bill-75",
    "billNumber": "BILL-2026-075",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-11",
    "dueDate": "2026-02-26",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-75-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "billl-75-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 54500,
    "taxTotal": 9810,
    "grandTotal": 64310,
    "amountPaid": 64310,
    "balanceDue": 0,
    "journalEntryId": "je-bill-75",
    "poId": "po-75",
    "poNumber": "PO-2026-075",
    "billReference": "SUP-REF-0075",
    "notes": "Supplier timber bill #75"
  },
  {
    "id": "bill-76",
    "billNumber": "BILL-2026-076",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-12",
    "dueDate": "2026-02-27",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-76-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "billl-76-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 18800,
    "taxTotal": 3384,
    "grandTotal": 22184,
    "amountPaid": 22184,
    "balanceDue": 0,
    "journalEntryId": "je-bill-76",
    "poId": "po-76",
    "poNumber": "PO-2026-076",
    "billReference": "SUP-REF-0076",
    "notes": "Supplier timber bill #76"
  },
  {
    "id": "bill-77",
    "billNumber": "BILL-2026-077",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-12",
    "dueDate": "2026-02-27",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-77-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "billl-77-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 45700,
    "taxTotal": 8226,
    "grandTotal": 53926,
    "amountPaid": 53926,
    "balanceDue": 0,
    "journalEntryId": "je-bill-77",
    "poId": "po-77",
    "poNumber": "PO-2026-077",
    "billReference": "SUP-REF-0077",
    "notes": "Supplier timber bill #77"
  },
  {
    "id": "bill-78",
    "billNumber": "BILL-2026-078",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-13",
    "dueDate": "2026-02-28",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-78-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "billl-78-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 34000,
    "taxTotal": 6120,
    "grandTotal": 40120,
    "amountPaid": 40120,
    "balanceDue": 0,
    "journalEntryId": "je-bill-78",
    "poId": "po-78",
    "poNumber": "PO-2026-078",
    "billReference": "SUP-REF-0078",
    "notes": "Supplier timber bill #78"
  },
  {
    "id": "bill-79",
    "billNumber": "BILL-2026-079",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-13",
    "dueDate": "2026-02-28",
    "status": "POSTED",
    "lines": [
      {
        "id": "billl-79-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "billl-79-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 27700,
    "taxTotal": 4986,
    "grandTotal": 32686,
    "amountPaid": 0,
    "balanceDue": 32686,
    "journalEntryId": "je-bill-79",
    "poId": "po-79",
    "poNumber": "PO-2026-079",
    "billReference": "SUP-REF-0079",
    "notes": "Supplier timber bill #79"
  },
  {
    "id": "bill-80",
    "billNumber": "BILL-2026-080",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-14",
    "dueDate": "2026-03-01",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-80-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "billl-80-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 57900,
    "taxTotal": 10422,
    "grandTotal": 68322,
    "amountPaid": 68322,
    "balanceDue": 0,
    "journalEntryId": "je-bill-80",
    "poId": "po-80",
    "poNumber": "PO-2026-080",
    "billReference": "SUP-REF-0080",
    "notes": "Supplier timber bill #80"
  },
  {
    "id": "bill-81",
    "billNumber": "BILL-2026-081",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-14",
    "dueDate": "2026-03-01",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-81-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "billl-81-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 17700,
    "taxTotal": 3186,
    "grandTotal": 20886,
    "amountPaid": 20886,
    "balanceDue": 0,
    "journalEntryId": "je-bill-81",
    "poId": "po-81",
    "poNumber": "PO-2026-081",
    "billReference": "SUP-REF-0081",
    "notes": "Supplier timber bill #81"
  },
  {
    "id": "bill-82",
    "billNumber": "BILL-2026-082",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-15",
    "dueDate": "2026-03-02",
    "status": "OVERDUE",
    "lines": [
      {
        "id": "billl-82-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "billl-82-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 45600,
    "taxTotal": 8208,
    "grandTotal": 53808,
    "amountPaid": 0,
    "balanceDue": 53808,
    "journalEntryId": "je-bill-82",
    "poId": "po-82",
    "poNumber": "PO-2026-082",
    "billReference": "SUP-REF-0082",
    "notes": "Supplier timber bill #82"
  },
  {
    "id": "bill-83",
    "billNumber": "BILL-2026-083",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-15",
    "dueDate": "2026-03-02",
    "status": "PARTIALLY_PAID",
    "lines": [
      {
        "id": "billl-83-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "billl-83-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 31800,
    "taxTotal": 5724,
    "grandTotal": 37524,
    "amountPaid": 18762,
    "balanceDue": 18762,
    "journalEntryId": "je-bill-83",
    "poId": "po-83",
    "poNumber": "PO-2026-083",
    "billReference": "SUP-REF-0083",
    "notes": "Supplier timber bill #83"
  },
  {
    "id": "bill-84",
    "billNumber": "BILL-2026-084",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-16",
    "dueDate": "2026-03-03",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-84-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "billl-84-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 31100,
    "taxTotal": 5598,
    "grandTotal": 36698,
    "amountPaid": 36698,
    "balanceDue": 0,
    "journalEntryId": "je-bill-84",
    "poId": "po-84",
    "poNumber": "PO-2026-084",
    "billReference": "SUP-REF-0084",
    "notes": "Supplier timber bill #84"
  },
  {
    "id": "bill-85",
    "billNumber": "BILL-2026-085",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-16",
    "dueDate": "2026-03-03",
    "status": "POSTED",
    "lines": [
      {
        "id": "billl-85-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "billl-85-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 56800,
    "taxTotal": 10224,
    "grandTotal": 67024,
    "amountPaid": 0,
    "balanceDue": 67024,
    "journalEntryId": "je-bill-85",
    "poId": "po-85",
    "poNumber": "PO-2026-085",
    "billReference": "SUP-REF-0085",
    "notes": "Supplier timber bill #85"
  },
  {
    "id": "bill-86",
    "billNumber": "BILL-2026-086",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-17",
    "dueDate": "2026-03-04",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-86-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "billl-86-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 17600,
    "taxTotal": 3168,
    "grandTotal": 20768,
    "amountPaid": 20768,
    "balanceDue": 0,
    "journalEntryId": "je-bill-86",
    "poId": "po-86",
    "poNumber": "PO-2026-086",
    "billReference": "SUP-REF-0086",
    "notes": "Supplier timber bill #86"
  },
  {
    "id": "bill-87",
    "billNumber": "BILL-2026-087",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-17",
    "dueDate": "2026-03-04",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-87-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "billl-87-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 43400,
    "taxTotal": 7812,
    "grandTotal": 51212,
    "amountPaid": 51212,
    "balanceDue": 0,
    "journalEntryId": "je-bill-87",
    "poId": "po-87",
    "poNumber": "PO-2026-087",
    "billReference": "SUP-REF-0087",
    "notes": "Supplier timber bill #87"
  },
  {
    "id": "bill-88",
    "billNumber": "BILL-2026-088",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-18",
    "dueDate": "2026-03-05",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-88-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "billl-88-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 35200,
    "taxTotal": 6336,
    "grandTotal": 41536,
    "amountPaid": 41536,
    "balanceDue": 0,
    "journalEntryId": "je-bill-88",
    "poId": "po-88",
    "poNumber": "PO-2026-088",
    "billReference": "SUP-REF-0088",
    "notes": "Supplier timber bill #88"
  },
  {
    "id": "bill-89",
    "billNumber": "BILL-2026-089",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-18",
    "dueDate": "2026-03-05",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-89-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "billl-89-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 30000,
    "taxTotal": 5400,
    "grandTotal": 35400,
    "amountPaid": 35400,
    "balanceDue": 0,
    "journalEntryId": "je-bill-89",
    "poId": "po-89",
    "poNumber": "PO-2026-089",
    "billReference": "SUP-REF-0089",
    "notes": "Supplier timber bill #89"
  },
  {
    "id": "bill-90",
    "billNumber": "BILL-2026-090",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-19",
    "dueDate": "2026-03-06",
    "status": "OVERDUE",
    "lines": [
      {
        "id": "billl-90-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "billl-90-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 56700,
    "taxTotal": 10206,
    "grandTotal": 66906,
    "amountPaid": 0,
    "balanceDue": 66906,
    "journalEntryId": "je-bill-90",
    "poId": "po-90",
    "poNumber": "PO-2026-090",
    "billReference": "SUP-REF-0090",
    "notes": "Supplier timber bill #90"
  },
  {
    "id": "bill-91",
    "billNumber": "BILL-2026-091",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-19",
    "dueDate": "2026-03-06",
    "status": "POSTED",
    "lines": [
      {
        "id": "billl-91-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "billl-91-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 15400,
    "taxTotal": 2772,
    "grandTotal": 18172,
    "amountPaid": 0,
    "balanceDue": 18172,
    "journalEntryId": "je-bill-91",
    "poId": "po-91",
    "poNumber": "PO-2026-091",
    "billReference": "SUP-REF-0091",
    "notes": "Supplier timber bill #91"
  },
  {
    "id": "bill-92",
    "billNumber": "BILL-2026-092",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-20",
    "dueDate": "2026-03-07",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-92-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "billl-92-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 46800,
    "taxTotal": 8424,
    "grandTotal": 55224,
    "amountPaid": 55224,
    "balanceDue": 0,
    "journalEntryId": "je-bill-92",
    "poId": "po-92",
    "poNumber": "PO-2026-092",
    "billReference": "SUP-REF-0092",
    "notes": "Supplier timber bill #92"
  },
  {
    "id": "bill-93",
    "billNumber": "BILL-2026-093",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-20",
    "dueDate": "2026-03-07",
    "status": "PARTIALLY_PAID",
    "lines": [
      {
        "id": "billl-93-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "billl-93-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 34100,
    "taxTotal": 6138,
    "grandTotal": 40238,
    "amountPaid": 20119,
    "balanceDue": 20119,
    "journalEntryId": "je-bill-93",
    "poId": "po-93",
    "poNumber": "PO-2026-093",
    "billReference": "SUP-REF-0093",
    "notes": "Supplier timber bill #93"
  },
  {
    "id": "bill-94",
    "billNumber": "BILL-2026-094",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-21",
    "dueDate": "2026-03-08",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-94-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "billl-94-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 29900,
    "taxTotal": 5382,
    "grandTotal": 35282,
    "amountPaid": 35282,
    "balanceDue": 0,
    "journalEntryId": "je-bill-94",
    "poId": "po-94",
    "poNumber": "PO-2026-094",
    "billReference": "SUP-REF-0094",
    "notes": "Supplier timber bill #94"
  },
  {
    "id": "bill-95",
    "billNumber": "BILL-2026-095",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-21",
    "dueDate": "2026-03-08",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-95-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "billl-95-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 54500,
    "taxTotal": 9810,
    "grandTotal": 64310,
    "amountPaid": 64310,
    "balanceDue": 0,
    "journalEntryId": "je-bill-95",
    "poId": "po-95",
    "poNumber": "PO-2026-095",
    "billReference": "SUP-REF-0095",
    "notes": "Supplier timber bill #95"
  },
  {
    "id": "bill-96",
    "billNumber": "BILL-2026-096",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-22",
    "dueDate": "2026-03-09",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-96-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "billl-96-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 18800,
    "taxTotal": 3384,
    "grandTotal": 22184,
    "amountPaid": 22184,
    "balanceDue": 0,
    "journalEntryId": "je-bill-96",
    "poId": "po-96",
    "poNumber": "PO-2026-096",
    "billReference": "SUP-REF-0096",
    "notes": "Supplier timber bill #96"
  },
  {
    "id": "bill-97",
    "billNumber": "BILL-2026-097",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-22",
    "dueDate": "2026-03-09",
    "status": "POSTED",
    "lines": [
      {
        "id": "billl-97-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "billl-97-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 45700,
    "taxTotal": 8226,
    "grandTotal": 53926,
    "amountPaid": 0,
    "balanceDue": 53926,
    "journalEntryId": "je-bill-97",
    "poId": "po-97",
    "poNumber": "PO-2026-097",
    "billReference": "SUP-REF-0097",
    "notes": "Supplier timber bill #97"
  },
  {
    "id": "bill-98",
    "billNumber": "BILL-2026-098",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-23",
    "dueDate": "2026-03-10",
    "status": "OVERDUE",
    "lines": [
      {
        "id": "billl-98-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "billl-98-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 34000,
    "taxTotal": 6120,
    "grandTotal": 40120,
    "amountPaid": 0,
    "balanceDue": 40120,
    "journalEntryId": "je-bill-98",
    "poId": "po-98",
    "poNumber": "PO-2026-098",
    "billReference": "SUP-REF-0098",
    "notes": "Supplier timber bill #98"
  },
  {
    "id": "bill-99",
    "billNumber": "BILL-2026-099",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-23",
    "dueDate": "2026-03-10",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-99-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "billl-99-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 27700,
    "taxTotal": 4986,
    "grandTotal": 32686,
    "amountPaid": 32686,
    "balanceDue": 0,
    "journalEntryId": "je-bill-99",
    "poId": "po-99",
    "poNumber": "PO-2026-099",
    "billReference": "SUP-REF-0099",
    "notes": "Supplier timber bill #99"
  },
  {
    "id": "bill-100",
    "billNumber": "BILL-2026-100",
    "vendorId": "cnt_mohit_vendor",
    "vendorName": "Mohit Timber & Hardware",
    "vendorEmail": "mohit@gmail.com",
    "billDate": "2026-02-24",
    "dueDate": "2026-03-11",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-100-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "billl-100-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 57900,
    "taxTotal": 10422,
    "grandTotal": 68322,
    "amountPaid": 68322,
    "balanceDue": 0,
    "journalEntryId": "je-bill-100",
    "poId": "po-100",
    "poNumber": "PO-2026-100",
    "billReference": "SUP-REF-0100",
    "notes": "Supplier timber bill #100"
  },
  {
    "id": "bill-101",
    "billNumber": "BILL-2026-101",
    "vendorId": "cnt-2",
    "vendorName": "Azure Furniture Supplies",
    "vendorEmail": "azure@furniture.com",
    "billDate": "2026-02-24",
    "dueDate": "2026-03-11",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-101-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "billl-101-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 17700,
    "taxTotal": 3186,
    "grandTotal": 20886,
    "amountPaid": 20886,
    "balanceDue": 0,
    "journalEntryId": "je-bill-101",
    "poId": "po-101",
    "poNumber": "PO-2026-101",
    "billReference": "SUP-REF-0101",
    "notes": "Supplier timber bill #101"
  },
  {
    "id": "bill-102",
    "billNumber": "BILL-2026-102",
    "vendorId": "cnt-2",
    "vendorName": "Azure Furniture Supplies",
    "vendorEmail": "azure@furniture.com",
    "billDate": "2026-02-25",
    "dueDate": "2026-03-12",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-102-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "billl-102-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 45600,
    "taxTotal": 8208,
    "grandTotal": 53808,
    "amountPaid": 53808,
    "balanceDue": 0,
    "journalEntryId": "je-bill-102",
    "poId": "po-102",
    "poNumber": "PO-2026-102",
    "billReference": "SUP-REF-0102",
    "notes": "Supplier timber bill #102"
  },
  {
    "id": "bill-103",
    "billNumber": "BILL-2026-103",
    "vendorId": "cnt-2",
    "vendorName": "Azure Furniture Supplies",
    "vendorEmail": "azure@furniture.com",
    "billDate": "2026-02-25",
    "dueDate": "2026-03-12",
    "status": "POSTED",
    "lines": [
      {
        "id": "billl-103-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "billl-103-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 31800,
    "taxTotal": 5724,
    "grandTotal": 37524,
    "amountPaid": 0,
    "balanceDue": 37524,
    "journalEntryId": "je-bill-103",
    "poId": "po-103",
    "poNumber": "PO-2026-103",
    "billReference": "SUP-REF-0103",
    "notes": "Supplier timber bill #103"
  },
  {
    "id": "bill-104",
    "billNumber": "BILL-2026-104",
    "vendorId": "cnt-2",
    "vendorName": "Azure Furniture Supplies",
    "vendorEmail": "azure@furniture.com",
    "billDate": "2026-02-26",
    "dueDate": "2026-03-13",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-104-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "billl-104-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 31100,
    "taxTotal": 5598,
    "grandTotal": 36698,
    "amountPaid": 36698,
    "balanceDue": 0,
    "journalEntryId": "je-bill-104",
    "poId": "po-104",
    "poNumber": "PO-2026-104",
    "billReference": "SUP-REF-0104",
    "notes": "Supplier timber bill #104"
  },
  {
    "id": "bill-105",
    "billNumber": "BILL-2026-105",
    "vendorId": "cnt-2",
    "vendorName": "Azure Furniture Supplies",
    "vendorEmail": "azure@furniture.com",
    "billDate": "2026-02-26",
    "dueDate": "2026-03-13",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-105-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "billl-105-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 56800,
    "taxTotal": 10224,
    "grandTotal": 67024,
    "amountPaid": 67024,
    "balanceDue": 0,
    "journalEntryId": "je-bill-105",
    "poId": "po-105",
    "poNumber": "PO-2026-105",
    "billReference": "SUP-REF-0105",
    "notes": "Supplier timber bill #105"
  },
  {
    "id": "bill-106",
    "billNumber": "BILL-2026-106",
    "vendorId": "cnt-2",
    "vendorName": "Azure Furniture Supplies",
    "vendorEmail": "azure@furniture.com",
    "billDate": "2026-02-27",
    "dueDate": "2026-03-14",
    "status": "OVERDUE",
    "lines": [
      {
        "id": "billl-106-1",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 6,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 8400,
        "taxAmount": 1512,
        "total": 9912
      },
      {
        "id": "billl-106-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 17600,
    "taxTotal": 3168,
    "grandTotal": 20768,
    "amountPaid": 0,
    "balanceDue": 20768,
    "journalEntryId": "je-bill-106",
    "poId": "po-106",
    "poNumber": "PO-2026-106",
    "billReference": "SUP-REF-0106",
    "notes": "Supplier timber bill #106"
  },
  {
    "id": "bill-107",
    "billNumber": "BILL-2026-107",
    "vendorId": "cnt-2",
    "vendorName": "Azure Furniture Supplies",
    "vendorEmail": "azure@furniture.com",
    "billDate": "2026-02-27",
    "dueDate": "2026-03-14",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-107-1",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 7,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 36400,
        "taxAmount": 6552,
        "total": 42952
      },
      {
        "id": "billl-107-2",
        "productId": "prd-12",
        "productName": "Stainless Steel Joint Brackets & Fasteners",
        "quantity": 5,
        "unitPrice": 1400,
        "taxRate": 18,
        "subtotal": 7000,
        "taxAmount": 1260,
        "total": 8260
      }
    ],
    "subtotal": 43400,
    "taxTotal": 7812,
    "grandTotal": 51212,
    "amountPaid": 51212,
    "balanceDue": 0,
    "journalEntryId": "je-bill-107",
    "poId": "po-107",
    "poNumber": "PO-2026-107",
    "billReference": "SUP-REF-0107",
    "notes": "Supplier timber bill #107"
  },
  {
    "id": "bill-108",
    "billNumber": "BILL-2026-108",
    "vendorId": "cnt-2",
    "vendorName": "Azure Furniture Supplies",
    "vendorEmail": "azure@furniture.com",
    "billDate": "2026-02-28",
    "dueDate": "2026-03-15",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-108-1",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 8,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 24800,
        "taxAmount": 4464,
        "total": 29264
      },
      {
        "id": "billl-108-2",
        "productId": "prd-13",
        "productName": "Architectural Hardwood Veneer Sheets",
        "quantity": 2,
        "unitPrice": 5200,
        "taxRate": 18,
        "subtotal": 10400,
        "taxAmount": 1872,
        "total": 12272
      }
    ],
    "subtotal": 35200,
    "taxTotal": 6336,
    "grandTotal": 41536,
    "amountPaid": 41536,
    "balanceDue": 0,
    "journalEntryId": "je-bill-108",
    "poId": "po-108",
    "poNumber": "PO-2026-108",
    "billReference": "SUP-REF-0108",
    "notes": "Supplier timber bill #108"
  },
  {
    "id": "bill-109",
    "billNumber": "BILL-2026-109",
    "vendorId": "cnt-2",
    "vendorName": "Azure Furniture Supplies",
    "vendorEmail": "azure@furniture.com",
    "billDate": "2026-02-28",
    "dueDate": "2026-03-15",
    "status": "POSTED",
    "lines": [
      {
        "id": "billl-109-1",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 9,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 20700,
        "taxAmount": 3726,
        "total": 24426
      },
      {
        "id": "billl-109-2",
        "productId": "prd-14",
        "productName": "High-Density Upholstery Foam (Grade A)",
        "quantity": 3,
        "unitPrice": 3100,
        "taxRate": 18,
        "subtotal": 9300,
        "taxAmount": 1674,
        "total": 10974
      }
    ],
    "subtotal": 30000,
    "taxTotal": 5400,
    "grandTotal": 35400,
    "amountPaid": 0,
    "balanceDue": 35400,
    "journalEntryId": "je-bill-109",
    "poId": "po-109",
    "poNumber": "PO-2026-109",
    "billReference": "SUP-REF-0109",
    "notes": "Supplier timber bill #109"
  },
  {
    "id": "bill-110",
    "billNumber": "BILL-2026-110",
    "vendorId": "cnt-2",
    "vendorName": "Azure Furniture Supplies",
    "vendorEmail": "azure@furniture.com",
    "billDate": "2026-03-01",
    "dueDate": "2026-03-16",
    "status": "PAID",
    "lines": [
      {
        "id": "billl-110-1",
        "productId": "prd-11",
        "productName": "Reclaimed Teak Timber Planks (Batch 50pc)",
        "quantity": 5,
        "unitPrice": 9500,
        "taxRate": 18,
        "subtotal": 47500,
        "taxAmount": 8550,
        "total": 56050
      },
      {
        "id": "billl-110-2",
        "productId": "prd-15",
        "productName": "Italian Brass Cabinet Handles & Hinges",
        "quantity": 4,
        "unitPrice": 2300,
        "taxRate": 18,
        "subtotal": 9200,
        "taxAmount": 1656,
        "total": 10856
      }
    ],
    "subtotal": 56700,
    "taxTotal": 10206,
    "grandTotal": 66906,
    "amountPaid": 66906,
    "balanceDue": 0,
    "journalEntryId": "je-bill-110",
    "poId": "po-110",
    "poNumber": "PO-2026-110",
    "billReference": "SUP-REF-0110",
    "notes": "Supplier timber bill #110"
  }
];

// ==========================================
// TRANSACTIONS: PAYMENTS
// ==========================================
export const INITIAL_PAYMENTS: PaymentItem[] = [
  {
    "id": "pay-rcpt-1",
    "paymentNumber": "PAY-2026-001",
    "paymentDate": "2026-01-05",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-001",
    "amount": 12000,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-1"
  },
  {
    "id": "pay-disb-1",
    "paymentNumber": "PAY-2026-071",
    "paymentDate": "2026-01-05",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-001",
    "amount": 15000,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-1"
  },
  {
    "id": "pay-rcpt-2",
    "paymentNumber": "PAY-2026-002",
    "paymentDate": "2026-01-06",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-002",
    "amount": 12000,
    "journal": "BANK",
    "paymentMethod": "UPI",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-2"
  },
  {
    "id": "pay-disb-2",
    "paymentNumber": "PAY-2026-072",
    "paymentDate": "2026-01-06",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-002",
    "amount": 15000,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-2"
  },
  {
    "id": "pay-rcpt-3",
    "paymentNumber": "PAY-2026-003",
    "paymentDate": "2026-01-06",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-003",
    "amount": 25677,
    "journal": "CASH",
    "paymentMethod": "Cash Register",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-3"
  },
  {
    "id": "pay-disb-3",
    "paymentNumber": "PAY-2026-073",
    "paymentDate": "2026-01-06",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-003",
    "amount": 18762,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-3"
  },
  {
    "id": "pay-rcpt-4",
    "paymentNumber": "PAY-2026-004",
    "paymentDate": "2026-01-07",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-004",
    "amount": 25370,
    "journal": "BANK",
    "paymentMethod": "UPI",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-4"
  },
  {
    "id": "pay-disb-4",
    "paymentNumber": "PAY-2026-074",
    "paymentDate": "2026-01-07",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-004",
    "amount": 36698,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-4"
  },
  {
    "id": "pay-rcpt-5",
    "paymentNumber": "PAY-2026-005",
    "paymentDate": "2026-01-07",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-005",
    "amount": 38350,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-5"
  },
  {
    "id": "pay-disb-5",
    "paymentNumber": "PAY-2026-075",
    "paymentDate": "2026-01-07",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-005",
    "amount": 67024,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-5"
  },
  {
    "id": "pay-rcpt-6",
    "paymentNumber": "PAY-2026-006",
    "paymentDate": "2026-01-08",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-006",
    "amount": 42244,
    "journal": "CASH",
    "paymentMethod": "Cash Register",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-6"
  },
  {
    "id": "pay-disb-6",
    "paymentNumber": "PAY-2026-076",
    "paymentDate": "2026-01-08",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-006",
    "amount": 20768,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-6"
  },
  {
    "id": "pay-rcpt-7",
    "paymentNumber": "PAY-2026-007",
    "paymentDate": "2026-01-08",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-007",
    "amount": 134520,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-7"
  },
  {
    "id": "pay-disb-7",
    "paymentNumber": "PAY-2026-077",
    "paymentDate": "2026-01-08",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-007",
    "amount": 15000,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-7"
  },
  {
    "id": "pay-rcpt-8",
    "paymentNumber": "PAY-2026-008",
    "paymentDate": "2026-01-09",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-008",
    "amount": 12000,
    "journal": "BANK",
    "paymentMethod": "UPI",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-8"
  },
  {
    "id": "pay-disb-8",
    "paymentNumber": "PAY-2026-078",
    "paymentDate": "2026-01-09",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-008",
    "amount": 41536,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-8"
  },
  {
    "id": "pay-rcpt-9",
    "paymentNumber": "PAY-2026-009",
    "paymentDate": "2026-01-09",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-009",
    "amount": 61950,
    "journal": "CASH",
    "paymentMethod": "Cash Register",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-9"
  },
  {
    "id": "pay-disb-9",
    "paymentNumber": "PAY-2026-079",
    "paymentDate": "2026-01-09",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-009",
    "amount": 35400,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-9"
  },
  {
    "id": "pay-rcpt-10",
    "paymentNumber": "PAY-2026-010",
    "paymentDate": "2026-01-10",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-010",
    "amount": 20650,
    "journal": "BANK",
    "paymentMethod": "UPI",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-10"
  },
  {
    "id": "pay-disb-10",
    "paymentNumber": "PAY-2026-080",
    "paymentDate": "2026-01-10",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-010",
    "amount": 15000,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-10"
  },
  {
    "id": "pay-rcpt-11",
    "paymentNumber": "PAY-2026-011",
    "paymentDate": "2026-01-10",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-011",
    "amount": 12000,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-11"
  },
  {
    "id": "pay-disb-11",
    "paymentNumber": "PAY-2026-081",
    "paymentDate": "2026-01-10",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-011",
    "amount": 18172,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-11"
  },
  {
    "id": "pay-rcpt-12",
    "paymentNumber": "PAY-2026-012",
    "paymentDate": "2026-01-11",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-012",
    "amount": 36580,
    "journal": "CASH",
    "paymentMethod": "Cash Register",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-12"
  },
  {
    "id": "pay-disb-12",
    "paymentNumber": "PAY-2026-082",
    "paymentDate": "2026-01-11",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-012",
    "amount": 55224,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-12"
  },
  {
    "id": "pay-rcpt-13",
    "paymentNumber": "PAY-2026-013",
    "paymentDate": "2026-01-11",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-013",
    "amount": 174640,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-13"
  },
  {
    "id": "pay-disb-13",
    "paymentNumber": "PAY-2026-083",
    "paymentDate": "2026-01-11",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-013",
    "amount": 15000,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-13"
  },
  {
    "id": "pay-rcpt-14",
    "paymentNumber": "PAY-2026-014",
    "paymentDate": "2026-01-12",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-014",
    "amount": 19116,
    "journal": "BANK",
    "paymentMethod": "UPI",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-14"
  },
  {
    "id": "pay-disb-14",
    "paymentNumber": "PAY-2026-084",
    "paymentDate": "2026-01-12",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-014",
    "amount": 35282,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-14"
  },
  {
    "id": "pay-rcpt-15",
    "paymentNumber": "PAY-2026-015",
    "paymentDate": "2026-01-12",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-015",
    "amount": 12000,
    "journal": "CASH",
    "paymentMethod": "Cash Register",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-15"
  },
  {
    "id": "pay-disb-15",
    "paymentNumber": "PAY-2026-085",
    "paymentDate": "2026-01-12",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-015",
    "amount": 64310,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-15"
  },
  {
    "id": "pay-rcpt-16",
    "paymentNumber": "PAY-2026-016",
    "paymentDate": "2026-01-13",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-016",
    "amount": 125080,
    "journal": "BANK",
    "paymentMethod": "UPI",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-16"
  },
  {
    "id": "pay-disb-16",
    "paymentNumber": "PAY-2026-086",
    "paymentDate": "2026-01-13",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-016",
    "amount": 22184,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-16"
  },
  {
    "id": "pay-rcpt-17",
    "paymentNumber": "PAY-2026-017",
    "paymentDate": "2026-01-13",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-017",
    "amount": 143370,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-17"
  },
  {
    "id": "pay-disb-17",
    "paymentNumber": "PAY-2026-087",
    "paymentDate": "2026-01-13",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-017",
    "amount": 53926,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-17"
  },
  {
    "id": "pay-rcpt-18",
    "paymentNumber": "PAY-2026-018",
    "paymentDate": "2026-01-14",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-018",
    "amount": 56876,
    "journal": "CASH",
    "paymentMethod": "Cash Register",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-18"
  },
  {
    "id": "pay-disb-18",
    "paymentNumber": "PAY-2026-088",
    "paymentDate": "2026-01-14",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-018",
    "amount": 15000,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-18"
  },
  {
    "id": "pay-rcpt-19",
    "paymentNumber": "PAY-2026-019",
    "paymentDate": "2026-01-14",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-019",
    "amount": 30680,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-19"
  },
  {
    "id": "pay-disb-19",
    "paymentNumber": "PAY-2026-089",
    "paymentDate": "2026-01-14",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-019",
    "amount": 15000,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-19"
  },
  {
    "id": "pay-rcpt-20",
    "paymentNumber": "PAY-2026-020",
    "paymentDate": "2026-01-15",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-020",
    "amount": 12000,
    "journal": "BANK",
    "paymentMethod": "UPI",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-20"
  },
  {
    "id": "pay-disb-20",
    "paymentNumber": "PAY-2026-090",
    "paymentDate": "2026-01-15",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-020",
    "amount": 68322,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-20"
  },
  {
    "id": "pay-rcpt-21",
    "paymentNumber": "PAY-2026-021",
    "paymentDate": "2026-01-15",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-021",
    "amount": 46728,
    "journal": "CASH",
    "paymentMethod": "Cash Register",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-21"
  },
  {
    "id": "pay-disb-21",
    "paymentNumber": "PAY-2026-091",
    "paymentDate": "2026-01-15",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-021",
    "amount": 20886,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-21"
  },
  {
    "id": "pay-rcpt-22",
    "paymentNumber": "PAY-2026-022",
    "paymentDate": "2026-01-16",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-022",
    "amount": 12000,
    "journal": "BANK",
    "paymentMethod": "UPI",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-22"
  },
  {
    "id": "pay-disb-22",
    "paymentNumber": "PAY-2026-092",
    "paymentDate": "2026-01-16",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-022",
    "amount": 53808,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-22"
  },
  {
    "id": "pay-rcpt-23",
    "paymentNumber": "PAY-2026-023",
    "paymentDate": "2026-01-16",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-023",
    "amount": 160008,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-23"
  },
  {
    "id": "pay-disb-23",
    "paymentNumber": "PAY-2026-093",
    "paymentDate": "2026-01-16",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-023",
    "amount": 18762,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-23"
  },
  {
    "id": "pay-rcpt-24",
    "paymentNumber": "PAY-2026-024",
    "paymentDate": "2026-01-17",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-024",
    "amount": 35990,
    "journal": "CASH",
    "paymentMethod": "Cash Register",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-24"
  },
  {
    "id": "pay-disb-24",
    "paymentNumber": "PAY-2026-094",
    "paymentDate": "2026-01-17",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-024",
    "amount": 36698,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-24"
  },
  {
    "id": "pay-rcpt-25",
    "paymentNumber": "PAY-2026-025",
    "paymentDate": "2026-01-17",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-025",
    "amount": 12272,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-25"
  },
  {
    "id": "pay-disb-25",
    "paymentNumber": "PAY-2026-095",
    "paymentDate": "2026-01-17",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-025",
    "amount": 15000,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-25"
  },
  {
    "id": "pay-rcpt-26",
    "paymentNumber": "PAY-2026-026",
    "paymentDate": "2026-01-18",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-026",
    "amount": 115050,
    "journal": "BANK",
    "paymentMethod": "UPI",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-26"
  },
  {
    "id": "pay-disb-26",
    "paymentNumber": "PAY-2026-096",
    "paymentDate": "2026-01-18",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-026",
    "amount": 15000,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-26"
  },
  {
    "id": "pay-rcpt-27",
    "paymentNumber": "PAY-2026-027",
    "paymentDate": "2026-01-18",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-027",
    "amount": 39530,
    "journal": "CASH",
    "paymentMethod": "Cash Register",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-27"
  },
  {
    "id": "pay-disb-27",
    "paymentNumber": "PAY-2026-097",
    "paymentDate": "2026-01-18",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-027",
    "amount": 51212,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-27"
  },
  {
    "id": "pay-rcpt-28",
    "paymentNumber": "PAY-2026-028",
    "paymentDate": "2026-01-19",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-028",
    "amount": 136880,
    "journal": "BANK",
    "paymentMethod": "UPI",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-28"
  },
  {
    "id": "pay-disb-28",
    "paymentNumber": "PAY-2026-098",
    "paymentDate": "2026-01-19",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-028",
    "amount": 41536,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-28"
  },
  {
    "id": "pay-rcpt-29",
    "paymentNumber": "PAY-2026-029",
    "paymentDate": "2026-01-19",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-029",
    "amount": 12000,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-29"
  },
  {
    "id": "pay-disb-29",
    "paymentNumber": "PAY-2026-099",
    "paymentDate": "2026-01-19",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-029",
    "amount": 35400,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-29"
  },
  {
    "id": "pay-rcpt-30",
    "paymentNumber": "PAY-2026-030",
    "paymentDate": "2026-01-20",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-030",
    "amount": 20060,
    "journal": "CASH",
    "paymentMethod": "Cash Register",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-30"
  },
  {
    "id": "pay-disb-30",
    "paymentNumber": "PAY-2026-100",
    "paymentDate": "2026-01-20",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-030",
    "amount": 66906,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-30"
  },
  {
    "id": "pay-rcpt-31",
    "paymentNumber": "PAY-2026-031",
    "paymentDate": "2026-01-20",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-031",
    "amount": 174640,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-31"
  },
  {
    "id": "pay-disb-31",
    "paymentNumber": "PAY-2026-101",
    "paymentDate": "2026-01-20",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-031",
    "amount": 15000,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-31"
  },
  {
    "id": "pay-rcpt-32",
    "paymentNumber": "PAY-2026-032",
    "paymentDate": "2026-01-21",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-032",
    "amount": 122130,
    "journal": "BANK",
    "paymentMethod": "UPI",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-32"
  },
  {
    "id": "pay-disb-32",
    "paymentNumber": "PAY-2026-102",
    "paymentDate": "2026-01-21",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-032",
    "amount": 55224,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-32"
  },
  {
    "id": "pay-rcpt-33",
    "paymentNumber": "PAY-2026-033",
    "paymentDate": "2026-01-21",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-033",
    "amount": 64192,
    "journal": "CASH",
    "paymentMethod": "Cash Register",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-33"
  },
  {
    "id": "pay-disb-33",
    "paymentNumber": "PAY-2026-103",
    "paymentDate": "2026-01-21",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-033",
    "amount": 20119,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-33"
  },
  {
    "id": "pay-rcpt-34",
    "paymentNumber": "PAY-2026-034",
    "paymentDate": "2026-01-22",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-034",
    "amount": 25370,
    "journal": "BANK",
    "paymentMethod": "UPI",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-34"
  },
  {
    "id": "pay-disb-34",
    "paymentNumber": "PAY-2026-104",
    "paymentDate": "2026-01-22",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-034",
    "amount": 15000,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-34"
  },
  {
    "id": "pay-rcpt-35",
    "paymentNumber": "PAY-2026-035",
    "paymentDate": "2026-01-22",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-035",
    "amount": 38350,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-35"
  },
  {
    "id": "pay-disb-35",
    "paymentNumber": "PAY-2026-105",
    "paymentDate": "2026-01-22",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-035",
    "amount": 64310,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-35"
  },
  {
    "id": "pay-rcpt-36",
    "paymentNumber": "PAY-2026-036",
    "paymentDate": "2026-01-23",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-036",
    "amount": 12000,
    "journal": "CASH",
    "paymentMethod": "Cash Register",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-36"
  },
  {
    "id": "pay-disb-36",
    "paymentNumber": "PAY-2026-106",
    "paymentDate": "2026-01-23",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-036",
    "amount": 22184,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-36"
  },
  {
    "id": "pay-rcpt-37",
    "paymentNumber": "PAY-2026-037",
    "paymentDate": "2026-01-23",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-037",
    "amount": 134520,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-37"
  },
  {
    "id": "pay-disb-37",
    "paymentNumber": "PAY-2026-107",
    "paymentDate": "2026-01-23",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-037",
    "amount": 15000,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-37"
  },
  {
    "id": "pay-rcpt-38",
    "paymentNumber": "PAY-2026-038",
    "paymentDate": "2026-01-24",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-038",
    "amount": 12000,
    "journal": "BANK",
    "paymentMethod": "UPI",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-38"
  },
  {
    "id": "pay-disb-38",
    "paymentNumber": "PAY-2026-108",
    "paymentDate": "2026-01-24",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-038",
    "amount": 40120,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-38"
  },
  {
    "id": "pay-rcpt-39",
    "paymentNumber": "PAY-2026-039",
    "paymentDate": "2026-01-24",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-039",
    "amount": 61950,
    "journal": "CASH",
    "paymentMethod": "Cash Register",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-39"
  },
  {
    "id": "pay-disb-39",
    "paymentNumber": "PAY-2026-109",
    "paymentDate": "2026-01-24",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-039",
    "amount": 32686,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-39"
  },
  {
    "id": "pay-rcpt-40",
    "paymentNumber": "PAY-2026-040",
    "paymentDate": "2026-01-25",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-040",
    "amount": 20650,
    "journal": "BANK",
    "paymentMethod": "UPI",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-40"
  },
  {
    "id": "pay-disb-40",
    "paymentNumber": "PAY-2026-110",
    "paymentDate": "2026-01-25",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-040",
    "amount": 68322,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-40"
  },
  {
    "id": "pay-rcpt-41",
    "paymentNumber": "PAY-2026-041",
    "paymentDate": "2026-01-25",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-041",
    "amount": 116820,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-41"
  },
  {
    "id": "pay-disb-41",
    "paymentNumber": "PAY-2026-111",
    "paymentDate": "2026-01-25",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-041",
    "amount": 20886,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-41"
  },
  {
    "id": "pay-rcpt-42",
    "paymentNumber": "PAY-2026-042",
    "paymentDate": "2026-01-26",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-042",
    "amount": 36580,
    "journal": "CASH",
    "paymentMethod": "Cash Register",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-42"
  },
  {
    "id": "pay-disb-42",
    "paymentNumber": "PAY-2026-112",
    "paymentDate": "2026-01-26",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-042",
    "amount": 15000,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-42"
  },
  {
    "id": "pay-rcpt-43",
    "paymentNumber": "PAY-2026-043",
    "paymentDate": "2026-01-26",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-043",
    "amount": 12000,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-43"
  },
  {
    "id": "pay-disb-43",
    "paymentNumber": "PAY-2026-113",
    "paymentDate": "2026-01-26",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-043",
    "amount": 15000,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-43"
  },
  {
    "id": "pay-rcpt-44",
    "paymentNumber": "PAY-2026-044",
    "paymentDate": "2026-01-27",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-044",
    "amount": 47790,
    "journal": "BANK",
    "paymentMethod": "UPI",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-44"
  },
  {
    "id": "pay-disb-44",
    "paymentNumber": "PAY-2026-114",
    "paymentDate": "2026-01-27",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-044",
    "amount": 36698,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-44"
  },
  {
    "id": "pay-rcpt-45",
    "paymentNumber": "PAY-2026-045",
    "paymentDate": "2026-01-27",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-045",
    "amount": 34810,
    "journal": "CASH",
    "paymentMethod": "Cash Register",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-45"
  },
  {
    "id": "pay-disb-45",
    "paymentNumber": "PAY-2026-115",
    "paymentDate": "2026-01-27",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-045",
    "amount": 67024,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-45"
  },
  {
    "id": "pay-rcpt-46",
    "paymentNumber": "PAY-2026-046",
    "paymentDate": "2026-01-28",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-046",
    "amount": 125080,
    "journal": "BANK",
    "paymentMethod": "UPI",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-46"
  },
  {
    "id": "pay-disb-46",
    "paymentNumber": "PAY-2026-116",
    "paymentDate": "2026-01-28",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-046",
    "amount": 20768,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-46"
  },
  {
    "id": "pay-rcpt-47",
    "paymentNumber": "PAY-2026-047",
    "paymentDate": "2026-01-28",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-047",
    "amount": 12000,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-47"
  },
  {
    "id": "pay-disb-47",
    "paymentNumber": "PAY-2026-117",
    "paymentDate": "2026-01-28",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-047",
    "amount": 51212,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-47"
  },
  {
    "id": "pay-rcpt-48",
    "paymentNumber": "PAY-2026-048",
    "paymentDate": "2026-01-29",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-048",
    "amount": 56876,
    "journal": "CASH",
    "paymentMethod": "Cash Register",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-48"
  },
  {
    "id": "pay-disb-48",
    "paymentNumber": "PAY-2026-118",
    "paymentDate": "2026-01-29",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-048",
    "amount": 41536,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-48"
  },
  {
    "id": "pay-rcpt-49",
    "paymentNumber": "PAY-2026-049",
    "paymentDate": "2026-01-29",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-049",
    "amount": 30680,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-49"
  },
  {
    "id": "pay-disb-49",
    "paymentNumber": "PAY-2026-119",
    "paymentDate": "2026-01-29",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-049",
    "amount": 15000,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-49"
  },
  {
    "id": "pay-rcpt-50",
    "paymentNumber": "PAY-2026-050",
    "paymentDate": "2026-01-30",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-050",
    "amount": 12000,
    "journal": "BANK",
    "paymentMethod": "UPI",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-50"
  },
  {
    "id": "pay-disb-50",
    "paymentNumber": "PAY-2026-120",
    "paymentDate": "2026-01-30",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-050",
    "amount": 15000,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-50"
  },
  {
    "id": "pay-rcpt-51",
    "paymentNumber": "PAY-2026-051",
    "paymentDate": "2026-01-30",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-051",
    "amount": 46728,
    "journal": "CASH",
    "paymentMethod": "Cash Register",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-51"
  },
  {
    "id": "pay-disb-51",
    "paymentNumber": "PAY-2026-121",
    "paymentDate": "2026-01-30",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-051",
    "amount": 18172,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-51"
  },
  {
    "id": "pay-rcpt-52",
    "paymentNumber": "PAY-2026-052",
    "paymentDate": "2026-01-31",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-052",
    "amount": 100890,
    "journal": "BANK",
    "paymentMethod": "UPI",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-52"
  },
  {
    "id": "pay-disb-52",
    "paymentNumber": "PAY-2026-122",
    "paymentDate": "2026-01-31",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-052",
    "amount": 55224,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-52"
  },
  {
    "id": "pay-rcpt-53",
    "paymentNumber": "PAY-2026-053",
    "paymentDate": "2026-01-31",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-053",
    "amount": 160008,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-53"
  },
  {
    "id": "pay-disb-53",
    "paymentNumber": "PAY-2026-123",
    "paymentDate": "2026-01-31",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-053",
    "amount": 20119,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-53"
  },
  {
    "id": "pay-rcpt-54",
    "paymentNumber": "PAY-2026-054",
    "paymentDate": "2026-02-01",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-054",
    "amount": 35990,
    "journal": "CASH",
    "paymentMethod": "Cash Register",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-54"
  },
  {
    "id": "pay-disb-54",
    "paymentNumber": "PAY-2026-124",
    "paymentDate": "2026-02-01",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-054",
    "amount": 35282,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-54"
  },
  {
    "id": "pay-rcpt-55",
    "paymentNumber": "PAY-2026-055",
    "paymentDate": "2026-02-01",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-055",
    "amount": 30680,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-55"
  },
  {
    "id": "pay-disb-55",
    "paymentNumber": "PAY-2026-125",
    "paymentDate": "2026-02-01",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-055",
    "amount": 15000,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-55"
  },
  {
    "id": "pay-rcpt-56",
    "paymentNumber": "PAY-2026-056",
    "paymentDate": "2026-02-02",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-056",
    "amount": 12000,
    "journal": "BANK",
    "paymentMethod": "UPI",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-56"
  },
  {
    "id": "pay-disb-56",
    "paymentNumber": "PAY-2026-126",
    "paymentDate": "2026-02-02",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-056",
    "amount": 22184,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-56"
  },
  {
    "id": "pay-rcpt-57",
    "paymentNumber": "PAY-2026-057",
    "paymentDate": "2026-02-02",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-057",
    "amount": 12000,
    "journal": "CASH",
    "paymentMethod": "Cash Register",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-57"
  },
  {
    "id": "pay-disb-57",
    "paymentNumber": "PAY-2026-127",
    "paymentDate": "2026-02-02",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-057",
    "amount": 53926,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-57"
  },
  {
    "id": "pay-rcpt-58",
    "paymentNumber": "PAY-2026-058",
    "paymentDate": "2026-02-03",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-058",
    "amount": 54752,
    "journal": "BANK",
    "paymentMethod": "UPI",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-58"
  },
  {
    "id": "pay-disb-58",
    "paymentNumber": "PAY-2026-128",
    "paymentDate": "2026-02-03",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-058",
    "amount": 15000,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-58"
  },
  {
    "id": "pay-rcpt-59",
    "paymentNumber": "PAY-2026-059",
    "paymentDate": "2026-02-03",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-059",
    "amount": 65490,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-59"
  },
  {
    "id": "pay-disb-59",
    "paymentNumber": "PAY-2026-129",
    "paymentDate": "2026-02-03",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-059",
    "amount": 32686,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-59"
  },
  {
    "id": "pay-rcpt-60",
    "paymentNumber": "PAY-2026-060",
    "paymentDate": "2026-02-04",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-060",
    "amount": 20060,
    "journal": "CASH",
    "paymentMethod": "Cash Register",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-60"
  },
  {
    "id": "pay-disb-60",
    "paymentNumber": "PAY-2026-130",
    "paymentDate": "2026-02-04",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-060",
    "amount": 68322,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-60"
  },
  {
    "id": "pay-rcpt-61",
    "paymentNumber": "PAY-2026-061",
    "paymentDate": "2026-02-04",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-061",
    "amount": 174640,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-61"
  },
  {
    "id": "pay-disb-61",
    "paymentNumber": "PAY-2026-131",
    "paymentDate": "2026-02-04",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-061",
    "amount": 15000,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-61"
  },
  {
    "id": "pay-rcpt-62",
    "paymentNumber": "PAY-2026-062",
    "paymentDate": "2026-02-05",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-062",
    "amount": 122130,
    "journal": "BANK",
    "paymentMethod": "UPI",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-62"
  },
  {
    "id": "pay-disb-62",
    "paymentNumber": "PAY-2026-132",
    "paymentDate": "2026-02-05",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-062",
    "amount": 53808,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-62"
  },
  {
    "id": "pay-rcpt-63",
    "paymentNumber": "PAY-2026-063",
    "paymentDate": "2026-02-05",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-063",
    "amount": 64192,
    "journal": "CASH",
    "paymentMethod": "Cash Register",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-63"
  },
  {
    "id": "pay-disb-63",
    "paymentNumber": "PAY-2026-133",
    "paymentDate": "2026-02-05",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-063",
    "amount": 18762,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-63"
  },
  {
    "id": "pay-rcpt-64",
    "paymentNumber": "PAY-2026-064",
    "paymentDate": "2026-02-06",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-064",
    "amount": 12000,
    "journal": "BANK",
    "paymentMethod": "UPI",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-64"
  },
  {
    "id": "pay-disb-64",
    "paymentNumber": "PAY-2026-134",
    "paymentDate": "2026-02-06",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-064",
    "amount": 36698,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-64"
  },
  {
    "id": "pay-rcpt-65",
    "paymentNumber": "PAY-2026-065",
    "paymentDate": "2026-02-06",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-065",
    "amount": 12000,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-65"
  },
  {
    "id": "pay-disb-65",
    "paymentNumber": "PAY-2026-135",
    "paymentDate": "2026-02-06",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-065",
    "amount": 67024,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-65"
  },
  {
    "id": "pay-rcpt-66",
    "paymentNumber": "PAY-2026-066",
    "paymentDate": "2026-02-07",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-066",
    "amount": 42244,
    "journal": "CASH",
    "paymentMethod": "Cash Register",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-66"
  },
  {
    "id": "pay-disb-66",
    "paymentNumber": "PAY-2026-136",
    "paymentDate": "2026-02-07",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-066",
    "amount": 15000,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-66"
  },
  {
    "id": "pay-rcpt-67",
    "paymentNumber": "PAY-2026-067",
    "paymentDate": "2026-02-07",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-067",
    "amount": 134520,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-67"
  },
  {
    "id": "pay-disb-67",
    "paymentNumber": "PAY-2026-137",
    "paymentDate": "2026-02-07",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-067",
    "amount": 15000,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-67"
  },
  {
    "id": "pay-rcpt-68",
    "paymentNumber": "PAY-2026-068",
    "paymentDate": "2026-02-08",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-068",
    "amount": 154344,
    "journal": "BANK",
    "paymentMethod": "UPI",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-68"
  },
  {
    "id": "pay-disb-68",
    "paymentNumber": "PAY-2026-138",
    "paymentDate": "2026-02-08",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-068",
    "amount": 41536,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-68"
  },
  {
    "id": "pay-rcpt-69",
    "paymentNumber": "PAY-2026-069",
    "paymentDate": "2026-02-08",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-069",
    "amount": 24780,
    "journal": "CASH",
    "paymentMethod": "Cash Register",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-69"
  },
  {
    "id": "pay-disb-69",
    "paymentNumber": "PAY-2026-139",
    "paymentDate": "2026-02-08",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-069",
    "amount": 35400,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-69"
  },
  {
    "id": "pay-rcpt-70",
    "paymentNumber": "PAY-2026-070",
    "paymentDate": "2026-02-09",
    "type": "CUSTOMER_PAYMENT",
    "contactId": "cnt_rohith_customer",
    "contactName": "Rohith",
    "documentRef": "INV-2026-070",
    "amount": 20650,
    "journal": "BANK",
    "paymentMethod": "UPI",
    "status": "POSTED",
    "journalEntryId": "je-pay-c-70"
  },
  {
    "id": "pay-disb-70",
    "paymentNumber": "PAY-2026-140",
    "paymentDate": "2026-02-09",
    "type": "VENDOR_PAYMENT",
    "contactId": "cnt_mohit_vendor",
    "contactName": "Mohit Timber & Hardware",
    "documentRef": "BILL-2026-070",
    "amount": 66906,
    "journal": "BANK",
    "paymentMethod": "HDFC Bank Transfer",
    "status": "POSTED",
    "journalEntryId": "je-pay-v-70"
  }
];

// ==========================================
// ACCOUNTING: CHART OF ACCOUNTS
// ==========================================
export const INITIAL_ACCOUNTS: AccountItem[] = [
  { id: 'acc-1002', code: '1002', name: 'Bank A/c (HDFC Current)', type: 'ASSET', balance: 2855000, currency: 'INR' },
  { id: 'acc-1001', code: '1001', name: 'Cash in Hand A/c', type: 'ASSET', balance: 450000, currency: 'INR' },
  { id: 'acc-1003', code: '1003', name: 'Debtors A/c (Receivable)', type: 'ASSET', balance: 342480, currency: 'INR' },
  { id: 'acc-1004', code: '1004', name: 'Finished Furniture Inventory', type: 'ASSET', balance: 1450000, currency: 'INR' },
  { id: 'acc-1005', code: '1005', name: 'Building & Workshop Property', type: 'ASSET', balance: 2500000, currency: 'INR' },
  { id: 'acc-3001', code: '3001', name: 'Capital A/c (Owner Contribution)', type: 'CAPITAL', balance: 6500000, currency: 'INR' },
  { id: 'acc-3002', code: '3002', name: 'Retained Earnings & Reserves', type: 'EQUITY', balance: 812180, currency: 'INR' },
  { id: 'acc-2001', code: '2001', name: 'Creditors A/c (Payable)', type: 'LIABILITY', balance: 180000, currency: 'INR' },
  { id: 'acc-2002', code: '2002', name: 'GST Output Tax Liability (18%)', type: 'LIABILITY', balance: 105300, currency: 'INR' },
  { id: 'acc-4001', code: '4001', name: 'Sales Income A/c', type: 'INCOME', balance: 585000, currency: 'INR' },
  { id: 'acc-5001', code: '5001', name: 'Purchase Expense A/c', type: 'EXPENSE', balance: 280000, currency: 'INR' },
  { id: 'acc-5004', code: '5004', name: 'Other Operating Expense A/c', type: 'EXPENSE', balance: 45000, currency: 'INR' },
];

// ==========================================
// ACCOUNTING: JOURNALS
// ==========================================
export const INITIAL_JOURNALS: JournalItem[] = [
  { id: 'jrn-sales', code: 'SALES', name: 'Sales', type: 'SALES', defaultAccountId: 'acc-4001', defaultAccountName: 'Sales Income A/c', entriesCount: 2 },
  { id: 'jrn-purch', code: 'PURCH', name: 'Purchase', type: 'PURCHASE', defaultAccountId: 'acc-5001', defaultAccountName: 'Purchase Expense A/c', entriesCount: 2 },
  { id: 'jrn-bank', code: 'BANK', name: 'Bank', type: 'BANK', defaultAccountId: 'acc-1002', defaultAccountName: 'Bank A/c', entriesCount: 2 },
  { id: 'jrn-cash', code: 'CASH', name: 'Cash', type: 'CASH', defaultAccountId: 'acc-1001', defaultAccountName: 'Cash A/c', entriesCount: 0 },
];

// ==========================================
// ACCOUNTING: JOURNAL ENTRIES (DOUBLE-ENTRY)
// ==========================================
export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    "id": "je-0",
    "entryNumber": "Bill/2026/0001",
    "date": "2026-09-01",
    "reference": "PO-2026-001 (Timber & Hardware)",
    "partnerName": "Mohit Timber & Hardware",
    "journalCode": "PURCH",
    "journalName": "Purchase",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-5001",
        "accountCode": "5001",
        "accountName": "Purchase Expense A/c",
        "debit": 32000,
        "credit": 0
      },
      {
        "accountId": "acc-2001",
        "accountCode": "2001",
        "accountName": "Creditors A/c",
        "debit": 0,
        "credit": 32000
      }
    ],
    "totalDebit": 32000,
    "totalCredit": 32000,
    "isBalanced": true
  },
  {
    "id": "je-inv-1",
    "entryNumber": "JE-2026-001",
    "date": "2026-01-05",
    "reference": "INV-2026-001 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 174640,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 148000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 26640
      }
    ],
    "totalDebit": 174640,
    "totalCredit": 174640,
    "isBalanced": true
  },
  {
    "id": "je-inv-2",
    "entryNumber": "JE-2026-002",
    "date": "2026-01-06",
    "reference": "INV-2026-002 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 122130,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 103500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 18630
      }
    ],
    "totalDebit": 122130,
    "totalCredit": 122130,
    "isBalanced": true
  },
  {
    "id": "je-inv-3",
    "entryNumber": "JE-2026-003",
    "date": "2026-01-06",
    "reference": "INV-2026-003 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 64192,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 54400
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 9792
      }
    ],
    "totalDebit": 64192,
    "totalCredit": 64192,
    "isBalanced": true
  },
  {
    "id": "je-inv-4",
    "entryNumber": "JE-2026-004",
    "date": "2026-01-07",
    "reference": "INV-2026-004 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 25370,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 21500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 3870
      }
    ],
    "totalDebit": 25370,
    "totalCredit": 25370,
    "isBalanced": true
  },
  {
    "id": "je-inv-5",
    "entryNumber": "JE-2026-005",
    "date": "2026-01-07",
    "reference": "INV-2026-005 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 38350,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 32500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 5850
      }
    ],
    "totalDebit": 38350,
    "totalCredit": 38350,
    "isBalanced": true
  },
  {
    "id": "je-inv-6",
    "entryNumber": "JE-2026-006",
    "date": "2026-01-08",
    "reference": "INV-2026-006 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 42244,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 35800
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 6444
      }
    ],
    "totalDebit": 42244,
    "totalCredit": 42244,
    "isBalanced": true
  },
  {
    "id": "je-inv-7",
    "entryNumber": "JE-2026-007",
    "date": "2026-01-08",
    "reference": "INV-2026-007 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 134520,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 114000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 20520
      }
    ],
    "totalDebit": 134520,
    "totalCredit": 134520,
    "isBalanced": true
  },
  {
    "id": "je-inv-8",
    "entryNumber": "JE-2026-008",
    "date": "2026-01-09",
    "reference": "INV-2026-008 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 154344,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 130800
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 23544
      }
    ],
    "totalDebit": 154344,
    "totalCredit": 154344,
    "isBalanced": true
  },
  {
    "id": "je-inv-9",
    "entryNumber": "JE-2026-009",
    "date": "2026-01-09",
    "reference": "INV-2026-009 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 61950,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 52500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 9450
      }
    ],
    "totalDebit": 61950,
    "totalCredit": 61950,
    "isBalanced": true
  },
  {
    "id": "je-inv-10",
    "entryNumber": "JE-2026-010",
    "date": "2026-01-10",
    "reference": "INV-2026-010 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 20650,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 17500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 3150
      }
    ],
    "totalDebit": 20650,
    "totalCredit": 20650,
    "isBalanced": true
  },
  {
    "id": "je-inv-11",
    "entryNumber": "JE-2026-011",
    "date": "2026-01-10",
    "reference": "INV-2026-011 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 116820,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 99000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 17820
      }
    ],
    "totalDebit": 116820,
    "totalCredit": 116820,
    "isBalanced": true
  },
  {
    "id": "je-inv-12",
    "entryNumber": "JE-2026-012",
    "date": "2026-01-11",
    "reference": "INV-2026-012 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 36580,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 31000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 5580
      }
    ],
    "totalDebit": 36580,
    "totalCredit": 36580,
    "isBalanced": true
  },
  {
    "id": "je-inv-13",
    "entryNumber": "JE-2026-013",
    "date": "2026-01-11",
    "reference": "INV-2026-013 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 174640,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 148000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 26640
      }
    ],
    "totalDebit": 174640,
    "totalCredit": 174640,
    "isBalanced": true
  },
  {
    "id": "je-inv-14",
    "entryNumber": "JE-2026-014",
    "date": "2026-01-12",
    "reference": "INV-2026-014 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 47790,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 40500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 7290
      }
    ],
    "totalDebit": 47790,
    "totalCredit": 47790,
    "isBalanced": true
  },
  {
    "id": "je-inv-15",
    "entryNumber": "JE-2026-015",
    "date": "2026-01-12",
    "reference": "INV-2026-015 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 34810,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 29500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 5310
      }
    ],
    "totalDebit": 34810,
    "totalCredit": 34810,
    "isBalanced": true
  },
  {
    "id": "je-inv-16",
    "entryNumber": "JE-2026-016",
    "date": "2026-01-13",
    "reference": "INV-2026-016 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 125080,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 106000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 19080
      }
    ],
    "totalDebit": 125080,
    "totalCredit": 125080,
    "isBalanced": true
  },
  {
    "id": "je-inv-17",
    "entryNumber": "JE-2026-017",
    "date": "2026-01-13",
    "reference": "INV-2026-017 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 143370,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 121500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 21870
      }
    ],
    "totalDebit": 143370,
    "totalCredit": 143370,
    "isBalanced": true
  },
  {
    "id": "je-inv-18",
    "entryNumber": "JE-2026-018",
    "date": "2026-01-14",
    "reference": "INV-2026-018 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 56876,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 48200
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 8676
      }
    ],
    "totalDebit": 56876,
    "totalCredit": 56876,
    "isBalanced": true
  },
  {
    "id": "je-inv-19",
    "entryNumber": "JE-2026-019",
    "date": "2026-01-14",
    "reference": "INV-2026-019 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 30680,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 26000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 4680
      }
    ],
    "totalDebit": 30680,
    "totalCredit": 30680,
    "isBalanced": true
  },
  {
    "id": "je-inv-20",
    "entryNumber": "JE-2026-020",
    "date": "2026-01-15",
    "reference": "INV-2026-020 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 27140,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 23000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 4140
      }
    ],
    "totalDebit": 27140,
    "totalCredit": 27140,
    "isBalanced": true
  },
  {
    "id": "je-inv-21",
    "entryNumber": "JE-2026-021",
    "date": "2026-01-15",
    "reference": "INV-2026-021 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 46728,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 39600
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 7128
      }
    ],
    "totalDebit": 46728,
    "totalCredit": 46728,
    "isBalanced": true
  },
  {
    "id": "je-inv-22",
    "entryNumber": "JE-2026-022",
    "date": "2026-01-16",
    "reference": "INV-2026-022 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 100890,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 85500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 15390
      }
    ],
    "totalDebit": 100890,
    "totalCredit": 100890,
    "isBalanced": true
  },
  {
    "id": "je-inv-23",
    "entryNumber": "JE-2026-023",
    "date": "2026-01-16",
    "reference": "INV-2026-023 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 160008,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 135600
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 24408
      }
    ],
    "totalDebit": 160008,
    "totalCredit": 160008,
    "isBalanced": true
  },
  {
    "id": "je-inv-24",
    "entryNumber": "JE-2026-024",
    "date": "2026-01-17",
    "reference": "INV-2026-024 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 35990,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 30500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 5490
      }
    ],
    "totalDebit": 35990,
    "totalCredit": 35990,
    "isBalanced": true
  },
  {
    "id": "je-inv-25",
    "entryNumber": "JE-2026-025",
    "date": "2026-01-17",
    "reference": "INV-2026-025 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 30680,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 26000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 4680
      }
    ],
    "totalDebit": 30680,
    "totalCredit": 30680,
    "isBalanced": true
  },
  {
    "id": "je-inv-26",
    "entryNumber": "JE-2026-026",
    "date": "2026-01-18",
    "reference": "INV-2026-026 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 115050,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 97500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 17550
      }
    ],
    "totalDebit": 115050,
    "totalCredit": 115050,
    "isBalanced": true
  },
  {
    "id": "je-inv-27",
    "entryNumber": "JE-2026-027",
    "date": "2026-01-18",
    "reference": "INV-2026-027 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 39530,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 33500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 6030
      }
    ],
    "totalDebit": 39530,
    "totalCredit": 39530,
    "isBalanced": true
  },
  {
    "id": "je-inv-28",
    "entryNumber": "JE-2026-028",
    "date": "2026-01-19",
    "reference": "INV-2026-028 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 136880,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 116000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 20880
      }
    ],
    "totalDebit": 136880,
    "totalCredit": 136880,
    "isBalanced": true
  },
  {
    "id": "je-inv-29",
    "entryNumber": "JE-2026-029",
    "date": "2026-01-19",
    "reference": "INV-2026-029 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 65490,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 55500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 9990
      }
    ],
    "totalDebit": 65490,
    "totalCredit": 65490,
    "isBalanced": true
  },
  {
    "id": "je-inv-30",
    "entryNumber": "JE-2026-030",
    "date": "2026-01-20",
    "reference": "INV-2026-030 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 20060,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 17000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 3060
      }
    ],
    "totalDebit": 20060,
    "totalCredit": 20060,
    "isBalanced": true
  },
  {
    "id": "je-inv-31",
    "entryNumber": "JE-2026-031",
    "date": "2026-01-20",
    "reference": "INV-2026-031 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 174640,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 148000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 26640
      }
    ],
    "totalDebit": 174640,
    "totalCredit": 174640,
    "isBalanced": true
  },
  {
    "id": "je-inv-32",
    "entryNumber": "JE-2026-032",
    "date": "2026-01-21",
    "reference": "INV-2026-032 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 122130,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 103500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 18630
      }
    ],
    "totalDebit": 122130,
    "totalCredit": 122130,
    "isBalanced": true
  },
  {
    "id": "je-inv-33",
    "entryNumber": "JE-2026-033",
    "date": "2026-01-21",
    "reference": "INV-2026-033 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 64192,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 54400
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 9792
      }
    ],
    "totalDebit": 64192,
    "totalCredit": 64192,
    "isBalanced": true
  },
  {
    "id": "je-inv-34",
    "entryNumber": "JE-2026-034",
    "date": "2026-01-22",
    "reference": "INV-2026-034 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 25370,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 21500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 3870
      }
    ],
    "totalDebit": 25370,
    "totalCredit": 25370,
    "isBalanced": true
  },
  {
    "id": "je-inv-35",
    "entryNumber": "JE-2026-035",
    "date": "2026-01-22",
    "reference": "INV-2026-035 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 38350,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 32500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 5850
      }
    ],
    "totalDebit": 38350,
    "totalCredit": 38350,
    "isBalanced": true
  },
  {
    "id": "je-inv-36",
    "entryNumber": "JE-2026-036",
    "date": "2026-01-23",
    "reference": "INV-2026-036 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 42244,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 35800
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 6444
      }
    ],
    "totalDebit": 42244,
    "totalCredit": 42244,
    "isBalanced": true
  },
  {
    "id": "je-inv-37",
    "entryNumber": "JE-2026-037",
    "date": "2026-01-23",
    "reference": "INV-2026-037 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 134520,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 114000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 20520
      }
    ],
    "totalDebit": 134520,
    "totalCredit": 134520,
    "isBalanced": true
  },
  {
    "id": "je-inv-38",
    "entryNumber": "JE-2026-038",
    "date": "2026-01-24",
    "reference": "INV-2026-038 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 154344,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 130800
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 23544
      }
    ],
    "totalDebit": 154344,
    "totalCredit": 154344,
    "isBalanced": true
  },
  {
    "id": "je-inv-39",
    "entryNumber": "JE-2026-039",
    "date": "2026-01-24",
    "reference": "INV-2026-039 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 61950,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 52500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 9450
      }
    ],
    "totalDebit": 61950,
    "totalCredit": 61950,
    "isBalanced": true
  },
  {
    "id": "je-inv-40",
    "entryNumber": "JE-2026-040",
    "date": "2026-01-25",
    "reference": "INV-2026-040 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 20650,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 17500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 3150
      }
    ],
    "totalDebit": 20650,
    "totalCredit": 20650,
    "isBalanced": true
  },
  {
    "id": "je-inv-41",
    "entryNumber": "JE-2026-041",
    "date": "2026-01-25",
    "reference": "INV-2026-041 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 116820,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 99000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 17820
      }
    ],
    "totalDebit": 116820,
    "totalCredit": 116820,
    "isBalanced": true
  },
  {
    "id": "je-inv-42",
    "entryNumber": "JE-2026-042",
    "date": "2026-01-26",
    "reference": "INV-2026-042 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 36580,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 31000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 5580
      }
    ],
    "totalDebit": 36580,
    "totalCredit": 36580,
    "isBalanced": true
  },
  {
    "id": "je-inv-43",
    "entryNumber": "JE-2026-043",
    "date": "2026-01-26",
    "reference": "INV-2026-043 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 174640,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 148000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 26640
      }
    ],
    "totalDebit": 174640,
    "totalCredit": 174640,
    "isBalanced": true
  },
  {
    "id": "je-inv-44",
    "entryNumber": "JE-2026-044",
    "date": "2026-01-27",
    "reference": "INV-2026-044 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 47790,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 40500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 7290
      }
    ],
    "totalDebit": 47790,
    "totalCredit": 47790,
    "isBalanced": true
  },
  {
    "id": "je-inv-45",
    "entryNumber": "JE-2026-045",
    "date": "2026-01-27",
    "reference": "INV-2026-045 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 34810,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 29500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 5310
      }
    ],
    "totalDebit": 34810,
    "totalCredit": 34810,
    "isBalanced": true
  },
  {
    "id": "je-inv-46",
    "entryNumber": "JE-2026-046",
    "date": "2026-01-28",
    "reference": "INV-2026-046 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 125080,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 106000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 19080
      }
    ],
    "totalDebit": 125080,
    "totalCredit": 125080,
    "isBalanced": true
  },
  {
    "id": "je-inv-47",
    "entryNumber": "JE-2026-047",
    "date": "2026-01-28",
    "reference": "INV-2026-047 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 143370,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 121500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 21870
      }
    ],
    "totalDebit": 143370,
    "totalCredit": 143370,
    "isBalanced": true
  },
  {
    "id": "je-inv-48",
    "entryNumber": "JE-2026-048",
    "date": "2026-01-29",
    "reference": "INV-2026-048 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 56876,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 48200
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 8676
      }
    ],
    "totalDebit": 56876,
    "totalCredit": 56876,
    "isBalanced": true
  },
  {
    "id": "je-inv-49",
    "entryNumber": "JE-2026-049",
    "date": "2026-01-29",
    "reference": "INV-2026-049 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 30680,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 26000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 4680
      }
    ],
    "totalDebit": 30680,
    "totalCredit": 30680,
    "isBalanced": true
  },
  {
    "id": "je-inv-50",
    "entryNumber": "JE-2026-050",
    "date": "2026-01-30",
    "reference": "INV-2026-050 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 27140,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 23000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 4140
      }
    ],
    "totalDebit": 27140,
    "totalCredit": 27140,
    "isBalanced": true
  },
  {
    "id": "je-inv-51",
    "entryNumber": "JE-2026-051",
    "date": "2026-01-30",
    "reference": "INV-2026-051 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 46728,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 39600
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 7128
      }
    ],
    "totalDebit": 46728,
    "totalCredit": 46728,
    "isBalanced": true
  },
  {
    "id": "je-inv-52",
    "entryNumber": "JE-2026-052",
    "date": "2026-01-31",
    "reference": "INV-2026-052 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 100890,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 85500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 15390
      }
    ],
    "totalDebit": 100890,
    "totalCredit": 100890,
    "isBalanced": true
  },
  {
    "id": "je-inv-53",
    "entryNumber": "JE-2026-053",
    "date": "2026-01-31",
    "reference": "INV-2026-053 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 160008,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 135600
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 24408
      }
    ],
    "totalDebit": 160008,
    "totalCredit": 160008,
    "isBalanced": true
  },
  {
    "id": "je-inv-54",
    "entryNumber": "JE-2026-054",
    "date": "2026-02-01",
    "reference": "INV-2026-054 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 35990,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 30500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 5490
      }
    ],
    "totalDebit": 35990,
    "totalCredit": 35990,
    "isBalanced": true
  },
  {
    "id": "je-inv-55",
    "entryNumber": "JE-2026-055",
    "date": "2026-02-01",
    "reference": "INV-2026-055 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 30680,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 26000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 4680
      }
    ],
    "totalDebit": 30680,
    "totalCredit": 30680,
    "isBalanced": true
  },
  {
    "id": "je-inv-56",
    "entryNumber": "JE-2026-056",
    "date": "2026-02-02",
    "reference": "INV-2026-056 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 115050,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 97500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 17550
      }
    ],
    "totalDebit": 115050,
    "totalCredit": 115050,
    "isBalanced": true
  },
  {
    "id": "je-inv-57",
    "entryNumber": "JE-2026-057",
    "date": "2026-02-02",
    "reference": "INV-2026-057 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 39530,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 33500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 6030
      }
    ],
    "totalDebit": 39530,
    "totalCredit": 39530,
    "isBalanced": true
  },
  {
    "id": "je-inv-58",
    "entryNumber": "JE-2026-058",
    "date": "2026-02-03",
    "reference": "INV-2026-058 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 136880,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 116000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 20880
      }
    ],
    "totalDebit": 136880,
    "totalCredit": 136880,
    "isBalanced": true
  },
  {
    "id": "je-inv-59",
    "entryNumber": "JE-2026-059",
    "date": "2026-02-03",
    "reference": "INV-2026-059 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 65490,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 55500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 9990
      }
    ],
    "totalDebit": 65490,
    "totalCredit": 65490,
    "isBalanced": true
  },
  {
    "id": "je-inv-60",
    "entryNumber": "JE-2026-060",
    "date": "2026-02-04",
    "reference": "INV-2026-060 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 20060,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 17000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 3060
      }
    ],
    "totalDebit": 20060,
    "totalCredit": 20060,
    "isBalanced": true
  },
  {
    "id": "je-inv-61",
    "entryNumber": "JE-2026-061",
    "date": "2026-02-04",
    "reference": "INV-2026-061 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 174640,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 148000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 26640
      }
    ],
    "totalDebit": 174640,
    "totalCredit": 174640,
    "isBalanced": true
  },
  {
    "id": "je-inv-62",
    "entryNumber": "JE-2026-062",
    "date": "2026-02-05",
    "reference": "INV-2026-062 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 122130,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 103500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 18630
      }
    ],
    "totalDebit": 122130,
    "totalCredit": 122130,
    "isBalanced": true
  },
  {
    "id": "je-inv-63",
    "entryNumber": "JE-2026-063",
    "date": "2026-02-05",
    "reference": "INV-2026-063 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 64192,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 54400
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 9792
      }
    ],
    "totalDebit": 64192,
    "totalCredit": 64192,
    "isBalanced": true
  },
  {
    "id": "je-inv-64",
    "entryNumber": "JE-2026-064",
    "date": "2026-02-06",
    "reference": "INV-2026-064 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 25370,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 21500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 3870
      }
    ],
    "totalDebit": 25370,
    "totalCredit": 25370,
    "isBalanced": true
  },
  {
    "id": "je-inv-65",
    "entryNumber": "JE-2026-065",
    "date": "2026-02-06",
    "reference": "INV-2026-065 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 38350,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 32500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 5850
      }
    ],
    "totalDebit": 38350,
    "totalCredit": 38350,
    "isBalanced": true
  },
  {
    "id": "je-inv-66",
    "entryNumber": "JE-2026-066",
    "date": "2026-02-07",
    "reference": "INV-2026-066 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 42244,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 35800
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 6444
      }
    ],
    "totalDebit": 42244,
    "totalCredit": 42244,
    "isBalanced": true
  },
  {
    "id": "je-inv-67",
    "entryNumber": "JE-2026-067",
    "date": "2026-02-07",
    "reference": "INV-2026-067 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 134520,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 114000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 20520
      }
    ],
    "totalDebit": 134520,
    "totalCredit": 134520,
    "isBalanced": true
  },
  {
    "id": "je-inv-68",
    "entryNumber": "JE-2026-068",
    "date": "2026-02-08",
    "reference": "INV-2026-068 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 154344,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 130800
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 23544
      }
    ],
    "totalDebit": 154344,
    "totalCredit": 154344,
    "isBalanced": true
  },
  {
    "id": "je-inv-69",
    "entryNumber": "JE-2026-069",
    "date": "2026-02-08",
    "reference": "INV-2026-069 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 61950,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 52500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 9450
      }
    ],
    "totalDebit": 61950,
    "totalCredit": 61950,
    "isBalanced": true
  },
  {
    "id": "je-inv-70",
    "entryNumber": "JE-2026-070",
    "date": "2026-02-09",
    "reference": "INV-2026-070 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 20650,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 17500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 3150
      }
    ],
    "totalDebit": 20650,
    "totalCredit": 20650,
    "isBalanced": true
  },
  {
    "id": "je-inv-71",
    "entryNumber": "JE-2026-071",
    "date": "2026-02-09",
    "reference": "INV-2026-071 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 116820,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 99000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 17820
      }
    ],
    "totalDebit": 116820,
    "totalCredit": 116820,
    "isBalanced": true
  },
  {
    "id": "je-inv-72",
    "entryNumber": "JE-2026-072",
    "date": "2026-02-10",
    "reference": "INV-2026-072 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 36580,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 31000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 5580
      }
    ],
    "totalDebit": 36580,
    "totalCredit": 36580,
    "isBalanced": true
  },
  {
    "id": "je-inv-73",
    "entryNumber": "JE-2026-073",
    "date": "2026-02-10",
    "reference": "INV-2026-073 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 174640,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 148000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 26640
      }
    ],
    "totalDebit": 174640,
    "totalCredit": 174640,
    "isBalanced": true
  },
  {
    "id": "je-inv-74",
    "entryNumber": "JE-2026-074",
    "date": "2026-02-11",
    "reference": "INV-2026-074 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 47790,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 40500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 7290
      }
    ],
    "totalDebit": 47790,
    "totalCredit": 47790,
    "isBalanced": true
  },
  {
    "id": "je-inv-75",
    "entryNumber": "JE-2026-075",
    "date": "2026-02-11",
    "reference": "INV-2026-075 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 34810,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 29500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 5310
      }
    ],
    "totalDebit": 34810,
    "totalCredit": 34810,
    "isBalanced": true
  },
  {
    "id": "je-inv-76",
    "entryNumber": "JE-2026-076",
    "date": "2026-02-12",
    "reference": "INV-2026-076 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 125080,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 106000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 19080
      }
    ],
    "totalDebit": 125080,
    "totalCredit": 125080,
    "isBalanced": true
  },
  {
    "id": "je-inv-77",
    "entryNumber": "JE-2026-077",
    "date": "2026-02-12",
    "reference": "INV-2026-077 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 143370,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 121500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 21870
      }
    ],
    "totalDebit": 143370,
    "totalCredit": 143370,
    "isBalanced": true
  },
  {
    "id": "je-inv-78",
    "entryNumber": "JE-2026-078",
    "date": "2026-02-13",
    "reference": "INV-2026-078 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 56876,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 48200
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 8676
      }
    ],
    "totalDebit": 56876,
    "totalCredit": 56876,
    "isBalanced": true
  },
  {
    "id": "je-inv-79",
    "entryNumber": "JE-2026-079",
    "date": "2026-02-13",
    "reference": "INV-2026-079 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 30680,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 26000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 4680
      }
    ],
    "totalDebit": 30680,
    "totalCredit": 30680,
    "isBalanced": true
  },
  {
    "id": "je-inv-80",
    "entryNumber": "JE-2026-080",
    "date": "2026-02-14",
    "reference": "INV-2026-080 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 27140,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 23000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 4140
      }
    ],
    "totalDebit": 27140,
    "totalCredit": 27140,
    "isBalanced": true
  },
  {
    "id": "je-inv-81",
    "entryNumber": "JE-2026-081",
    "date": "2026-02-14",
    "reference": "INV-2026-081 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 46728,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 39600
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 7128
      }
    ],
    "totalDebit": 46728,
    "totalCredit": 46728,
    "isBalanced": true
  },
  {
    "id": "je-inv-82",
    "entryNumber": "JE-2026-082",
    "date": "2026-02-15",
    "reference": "INV-2026-082 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 100890,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 85500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 15390
      }
    ],
    "totalDebit": 100890,
    "totalCredit": 100890,
    "isBalanced": true
  },
  {
    "id": "je-inv-83",
    "entryNumber": "JE-2026-083",
    "date": "2026-02-15",
    "reference": "INV-2026-083 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 160008,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 135600
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 24408
      }
    ],
    "totalDebit": 160008,
    "totalCredit": 160008,
    "isBalanced": true
  },
  {
    "id": "je-inv-84",
    "entryNumber": "JE-2026-084",
    "date": "2026-02-16",
    "reference": "INV-2026-084 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 35990,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 30500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 5490
      }
    ],
    "totalDebit": 35990,
    "totalCredit": 35990,
    "isBalanced": true
  },
  {
    "id": "je-inv-85",
    "entryNumber": "JE-2026-085",
    "date": "2026-02-16",
    "reference": "INV-2026-085 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 30680,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 26000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 4680
      }
    ],
    "totalDebit": 30680,
    "totalCredit": 30680,
    "isBalanced": true
  },
  {
    "id": "je-inv-86",
    "entryNumber": "JE-2026-086",
    "date": "2026-02-17",
    "reference": "INV-2026-086 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 115050,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 97500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 17550
      }
    ],
    "totalDebit": 115050,
    "totalCredit": 115050,
    "isBalanced": true
  },
  {
    "id": "je-inv-87",
    "entryNumber": "JE-2026-087",
    "date": "2026-02-17",
    "reference": "INV-2026-087 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 39530,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 33500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 6030
      }
    ],
    "totalDebit": 39530,
    "totalCredit": 39530,
    "isBalanced": true
  },
  {
    "id": "je-inv-88",
    "entryNumber": "JE-2026-088",
    "date": "2026-02-18",
    "reference": "INV-2026-088 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 136880,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 116000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 20880
      }
    ],
    "totalDebit": 136880,
    "totalCredit": 136880,
    "isBalanced": true
  },
  {
    "id": "je-inv-89",
    "entryNumber": "JE-2026-089",
    "date": "2026-02-18",
    "reference": "INV-2026-089 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 65490,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 55500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 9990
      }
    ],
    "totalDebit": 65490,
    "totalCredit": 65490,
    "isBalanced": true
  },
  {
    "id": "je-inv-90",
    "entryNumber": "JE-2026-090",
    "date": "2026-02-19",
    "reference": "INV-2026-090 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 20060,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 17000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 3060
      }
    ],
    "totalDebit": 20060,
    "totalCredit": 20060,
    "isBalanced": true
  },
  {
    "id": "je-inv-91",
    "entryNumber": "JE-2026-091",
    "date": "2026-02-19",
    "reference": "INV-2026-091 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 174640,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 148000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 26640
      }
    ],
    "totalDebit": 174640,
    "totalCredit": 174640,
    "isBalanced": true
  },
  {
    "id": "je-inv-92",
    "entryNumber": "JE-2026-092",
    "date": "2026-02-20",
    "reference": "INV-2026-092 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 122130,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 103500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 18630
      }
    ],
    "totalDebit": 122130,
    "totalCredit": 122130,
    "isBalanced": true
  },
  {
    "id": "je-inv-93",
    "entryNumber": "JE-2026-093",
    "date": "2026-02-20",
    "reference": "INV-2026-093 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 64192,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 54400
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 9792
      }
    ],
    "totalDebit": 64192,
    "totalCredit": 64192,
    "isBalanced": true
  },
  {
    "id": "je-inv-94",
    "entryNumber": "JE-2026-094",
    "date": "2026-02-21",
    "reference": "INV-2026-094 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 25370,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 21500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 3870
      }
    ],
    "totalDebit": 25370,
    "totalCredit": 25370,
    "isBalanced": true
  },
  {
    "id": "je-inv-95",
    "entryNumber": "JE-2026-095",
    "date": "2026-02-21",
    "reference": "INV-2026-095 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 38350,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 32500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 5850
      }
    ],
    "totalDebit": 38350,
    "totalCredit": 38350,
    "isBalanced": true
  },
  {
    "id": "je-inv-96",
    "entryNumber": "JE-2026-096",
    "date": "2026-02-22",
    "reference": "INV-2026-096 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 42244,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 35800
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 6444
      }
    ],
    "totalDebit": 42244,
    "totalCredit": 42244,
    "isBalanced": true
  },
  {
    "id": "je-inv-97",
    "entryNumber": "JE-2026-097",
    "date": "2026-02-22",
    "reference": "INV-2026-097 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 134520,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 114000
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 20520
      }
    ],
    "totalDebit": 134520,
    "totalCredit": 134520,
    "isBalanced": true
  },
  {
    "id": "je-inv-98",
    "entryNumber": "JE-2026-098",
    "date": "2026-02-23",
    "reference": "INV-2026-098 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 154344,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 130800
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 23544
      }
    ],
    "totalDebit": 154344,
    "totalCredit": 154344,
    "isBalanced": true
  },
  {
    "id": "je-inv-99",
    "entryNumber": "JE-2026-099",
    "date": "2026-02-23",
    "reference": "INV-2026-099 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 61950,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 52500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 9450
      }
    ],
    "totalDebit": 61950,
    "totalCredit": 61950,
    "isBalanced": true
  },
  {
    "id": "je-inv-100",
    "entryNumber": "JE-2026-100",
    "date": "2026-02-24",
    "reference": "INV-2026-100 (Rohith)",
    "partnerName": "Rohith",
    "journalCode": "SALES",
    "journalName": "Customer Sales Journal",
    "status": "POSTED",
    "lines": [
      {
        "accountId": "acc-1003",
        "accountCode": "1003",
        "accountName": "Debtors A/c (Receivable)",
        "partnerName": "Rohith",
        "debit": 20650,
        "credit": 0
      },
      {
        "accountId": "acc-4001",
        "accountCode": "4001",
        "accountName": "Sales Income A/c",
        "debit": 0,
        "credit": 17500
      },
      {
        "accountId": "acc-2002",
        "accountCode": "2002",
        "accountName": "GST Output Tax Liability (18%)",
        "debit": 0,
        "credit": 3150
      }
    ],
    "totalDebit": 20650,
    "totalCredit": 20650,
    "isBalanced": true
  }
];

// ==========================================
// FINANCE: BUDGET HEALTH
// ==========================================
export const INITIAL_BUDGETS: BudgetHealthItem[] = [
  {
    id: 'bdg-jan-2026',
    name: 'January 2026',
    period: 'January 2026',
    startDate: '2026-01-01',
    endDate: '2026-01-31',
    responsible: 'Mohith (Production Lead)',
    stage: 'CONFIRM',
    analyticAccount: 'Furniture Procurement',
    plannedAmount: 200000,
    actualAmount: 10000,
    remainingAmount: 190000,
    utilization: 5,
    status: 'HEALTHY',
    lines: [
      {
        id: 'bl-jan-1',
        analyticAccountId: 'ana-0',
        analyticAccountName: 'Furniture Procurement',
        type: 'EXPENSE',
        committedAmount: 200000,
        achievedAmount: 10000,
        achievedPercent: 5,
        amountToAchieve: 190000,
      },
    ],
  },
  {
    id: 'bdg-1',
    name: 'Timber & Raw Materials Procurement',
    period: 'FY 2025-26 Q4',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    responsible: 'Rohith (Inventory Head)',
    stage: 'CONFIRM',
    analyticAccount: 'Wood Procurement (Expenses)',
    plannedAmount: 150000,
    actualAmount: 85500,
    remainingAmount: 64500,
    utilization: 57,
    status: 'HEALTHY',
    lines: [
      {
        id: 'bl-1-1',
        analyticAccountId: 'ana-1',
        analyticAccountName: 'Wood Procurement (Expenses)',
        type: 'EXPENSE',
        committedAmount: 150000,
        achievedAmount: 85500,
        achievedPercent: 57,
        amountToAchieve: 64500,
      },
    ],
  },
  {
    id: 'bdg-2',
    name: 'Workshop Tools, Machinery & Power',
    period: 'FY 2025-26 Q4',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    responsible: 'Mohith (Production Lead)',
    stage: 'CONFIRM',
    analyticAccount: 'Operations & Utilities (Expenses)',
    plannedAmount: 40000,
    actualAmount: 34800,
    remainingAmount: 5200,
    utilization: 87,
    status: 'WARNING',
    lines: [
      {
        id: 'bl-2-1',
        analyticAccountId: 'ana-2',
        analyticAccountName: 'Operations & Utilities (Expenses)',
        type: 'EXPENSE',
        committedAmount: 40000,
        achievedAmount: 34800,
        achievedPercent: 87,
        amountToAchieve: 5200,
      },
    ],
  },
  {
    id: 'bdg-3',
    name: 'Showroom Marketing & Online Promotion',
    period: 'FY 2025-26 Q4',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    responsible: 'Rugenthra (Sales Manager)',
    stage: 'CONFIRM',
    analyticAccount: 'Showroom Marketing (Expenses)',
    plannedAmount: 25000,
    actualAmount: 14200,
    remainingAmount: 10800,
    utilization: 56.8,
    status: 'HEALTHY',
    lines: [
      {
        id: 'bl-3-1',
        analyticAccountId: 'ana-3',
        analyticAccountName: 'Showroom Marketing (Expenses)',
        type: 'EXPENSE',
        committedAmount: 25000,
        achievedAmount: 14200,
        achievedPercent: 56.8,
        amountToAchieve: 10800,
      },
    ],
  },
];

// ==========================================
// FINANCE: ANALYTIC ACCOUNTS (PS Page 4)
// ==========================================
export const INITIAL_ANALYTIC_ACCOUNTS: AnalyticAccountItem[] = [
  { id: 'ana-rev-1', name: 'Commercial Furniture Sales (Income)', type: 'INCOME', description: 'Institutional and commercial project contracts' },
  { id: 'ana-rev-2', name: 'Retail & Showroom Distribution (Income)', type: 'INCOME', description: 'Walk-in showroom and retail store sales' },
  { id: 'ana-4', name: 'Custom Design Studio (Income)', type: 'INCOME', description: 'Architectural custom consulting' },
  { id: 'ana-0', name: 'Furniture Procurement (Expenses)', type: 'EXPENSES', description: 'Raw timber, teak logs and veneers' },
  { id: 'ana-1', name: 'Wood Procurement (Expenses)', type: 'EXPENSES', description: 'Raw timber, teak logs and veneers' },
  { id: 'ana-2', name: 'Operations & Utilities (Expenses)', type: 'EXPENSES', description: 'Workshop power, tooling and machinery' },
  { id: 'ana-3', name: 'Showroom Marketing (Expenses)', type: 'EXPENSES', description: 'Catalogues, expo stalls, and digital ads' },
];
