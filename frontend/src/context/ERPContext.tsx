import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
  useMemo,
} from 'react';
import {
  INITIAL_CONTACTS,
  INITIAL_PRODUCTS,
  INITIAL_SALES_ORDERS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_INVOICES,
  INITIAL_BILLS,
  INITIAL_PAYMENTS,
  INITIAL_ACCOUNTS,
  INITIAL_JOURNALS,
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_BUDGETS,
  INITIAL_ANALYTIC_ACCOUNTS,
  type ContactItem,
  type ProductItem,
  type SalesOrder,
  type PurchaseOrder,
  type Invoice,
  type Bill,
  type PaymentItem,
  type AccountItem,
  type JournalItem,
  type JournalEntry,
  type BudgetHealthItem,
  type AnalyticAccountItem,
} from '@/data/erpData';

interface ERPContextType {
  // Master data
  contacts: ContactItem[];
  products: ProductItem[];
  analyticAccounts: AnalyticAccountItem[];
  // Transactions
  salesOrders: SalesOrder[];
  purchaseOrders: PurchaseOrder[];
  invoices: Invoice[];
  bills: Bill[];
  payments: PaymentItem[];
  // Accounting
  accounts: AccountItem[];
  journals: JournalItem[];
  journalEntries: JournalEntry[];
  budgets: BudgetHealthItem[];
  ledgerEquality: {
    totalDebits: number;
    totalCredits: number;
    isBalanced: boolean;
    discrepancy: number;
    status: string;
  };

  // Event Actions
  createSalesOrder: (order: Omit<SalesOrder, 'id' | 'orderNumber'> & { status?: SalesOrder['status'] }) => SalesOrder;
  confirmSalesOrder: (id: string) => void;
  generateInvoiceFromSO: (orderId: string) => Invoice | null;

  createPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'poNumber'> & { status?: PurchaseOrder['status'] }) => PurchaseOrder;
  confirmPurchaseOrder: (id: string) => void;
  generateBillFromPO: (poId: string) => Bill | null;

  createInvoice: (inv: Omit<Invoice, 'id' | 'invoiceNumber' | 'journalEntryId'>) => Invoice;
  registerCustomerPayment: (
    invoiceId: string,
    amount: number,
    journal: 'BANK' | 'CASH',
    method: 'HDFC Bank Transfer' | 'Cash Register' | 'UPI'
  ) => PaymentItem | null;

  createBill: (b: Omit<Bill, 'id' | 'billNumber' | 'journalEntryId'>) => Bill;
  registerVendorPayment: (
    billId: string,
    amount: number,
    journal: 'BANK' | 'CASH',
    method: 'HDFC Bank Transfer' | 'Cash Register' | 'UPI'
  ) => PaymentItem | null;

  createDirectPayment: (
    type: 'CUSTOMER_PAYMENT' | 'VENDOR_PAYMENT',
    contactId: string,
    amount: number,
    docRef: string,
    journal: 'BANK' | 'CASH',
    method: 'HDFC Bank Transfer' | 'Cash Register' | 'UPI'
  ) => PaymentItem;

  addContact: (contact: Omit<ContactItem, 'id' | 'isActive'>) => ContactItem;
  updateContact: (id: string, updates: Partial<ContactItem>) => void;
  toggleContactActive: (id: string) => void;
  grantPortalAccess: (contactId: string, email: string) => void;

  addProduct: (product: Omit<ProductItem, 'id' | 'isActive'>) => ProductItem;
  updateProduct: (id: string, updates: Partial<ProductItem>) => void;
  toggleProductActive: (id: string) => void;

  addAnalyticAccount: (acc: Omit<AnalyticAccountItem, 'id'>) => AnalyticAccountItem;

  addBudget: (budget: {
    name: string;
    period: string;
    responsible: string;
    analyticAccount: string;
    plannedAmount: number;
  }) => BudgetHealthItem;

  // Real-time Dashboard Summary derivation
  getDashboardMetricsData: () => {
    revenue: number;
    expenses: number;
    netProfit: number;
    cashBank: number;
    receivables: number;
    payables: number;
    unpaidInvoicesCount: number;
    unpaidBillsCount: number;
    openInvoicesAmount: number;
    openBillsAmount: number;
  };

  resetDemoData: () => void;
}

const STORAGE_KEY = 'urban_ledger_erp_v2';

const ERPContext = createContext<ERPContextType | null>(null);

export function ERPProvider({ children }: { children: ReactNode }) {
  // Load initial state from storage or defaults
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${key}`);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  };

  const [contacts, setContacts] = useState<ContactItem[]>(() => loadStored('contacts', INITIAL_CONTACTS));
  const [products, setProducts] = useState<ProductItem[]>(() => loadStored('products', INITIAL_PRODUCTS));
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(() => loadStored('salesOrders', INITIAL_SALES_ORDERS));
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => loadStored('purchaseOrders', INITIAL_PURCHASE_ORDERS));
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadStored('invoices', INITIAL_INVOICES));
  const [bills, setBills] = useState<Bill[]>(() => loadStored('bills', INITIAL_BILLS));
  const [payments, setPayments] = useState<PaymentItem[]>(() => loadStored('payments', INITIAL_PAYMENTS));
  const [accounts, setAccounts] = useState<AccountItem[]>(() => loadStored('accounts', INITIAL_ACCOUNTS));
  const [journals, setJournals] = useState<JournalItem[]>(() => loadStored('journals', INITIAL_JOURNALS));
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => loadStored('journalEntries', INITIAL_JOURNAL_ENTRIES));
  const [budgets, setBudgets] = useState<BudgetHealthItem[]>(() => loadStored('budgets', INITIAL_BUDGETS));
  const [analyticAccounts, setAnalyticAccounts] = useState<AnalyticAccountItem[]>(() => loadStored('analyticAccounts', INITIAL_ANALYTIC_ACCOUNTS));

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_contacts`, JSON.stringify(contacts));
      localStorage.setItem(`${STORAGE_KEY}_products`, JSON.stringify(products));
      localStorage.setItem(`${STORAGE_KEY}_salesOrders`, JSON.stringify(salesOrders));
      localStorage.setItem(`${STORAGE_KEY}_purchaseOrders`, JSON.stringify(purchaseOrders));
      localStorage.setItem(`${STORAGE_KEY}_invoices`, JSON.stringify(invoices));
      localStorage.setItem(`${STORAGE_KEY}_bills`, JSON.stringify(bills));
      localStorage.setItem(`${STORAGE_KEY}_payments`, JSON.stringify(payments));
      localStorage.setItem(`${STORAGE_KEY}_accounts`, JSON.stringify(accounts));
      localStorage.setItem(`${STORAGE_KEY}_journals`, JSON.stringify(journals));
      localStorage.setItem(`${STORAGE_KEY}_journalEntries`, JSON.stringify(journalEntries));
      localStorage.setItem(`${STORAGE_KEY}_budgets`, JSON.stringify(budgets));
      localStorage.setItem(`${STORAGE_KEY}_analyticAccounts`, JSON.stringify(analyticAccounts));
    } catch {
      // Storage unavailable or quota reached
    }
  }, [contacts, products, salesOrders, purchaseOrders, invoices, bills, payments, accounts, journals, journalEntries, budgets, analyticAccounts]);

  // Reset to initial baseline
  const resetDemoData = useCallback(() => {
    setContacts(INITIAL_CONTACTS);
    setProducts(INITIAL_PRODUCTS);
    setSalesOrders(INITIAL_SALES_ORDERS);
    setPurchaseOrders(INITIAL_PURCHASE_ORDERS);
    setInvoices(INITIAL_INVOICES);
    setBills(INITIAL_BILLS);
    setPayments(INITIAL_PAYMENTS);
    setAccounts(INITIAL_ACCOUNTS);
    setJournals(INITIAL_JOURNALS);
    setJournalEntries(INITIAL_JOURNAL_ENTRIES);
    setBudgets(INITIAL_BUDGETS);
    setAnalyticAccounts(INITIAL_ANALYTIC_ACCOUNTS);
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith(STORAGE_KEY)) localStorage.removeItem(k);
    });
  }, []);

  // ────────────────────────────────────────────────────────
  // SALES ACTIONS
  // ────────────────────────────────────────────────────────
  const createSalesOrder = useCallback((order: Omit<SalesOrder, 'id' | 'orderNumber'> & { status?: SalesOrder['status'] }): SalesOrder => {
    const id = `so-${Date.now()}`;
    const orderNumber = `SO-2026-00${salesOrders.length + 1}`;
    const newSO: SalesOrder = {
      ...order,
      id,
      orderNumber,
      status: order.status || 'CONFIRMED',
    };
    setSalesOrders((prev) => [newSO, ...prev]);
    return newSO;
  }, [salesOrders.length]);

  const confirmSalesOrder = useCallback((id: string) => {
    setSalesOrders((prev) =>
      prev.map((so) => (so.id === id ? { ...so, status: 'CONFIRMED' } : so))
    );
  }, []);

  const generateInvoiceFromSO = useCallback((orderId: string): Invoice | null => {
    const order = salesOrders.find((so) => so.id === orderId);
    if (!order) return null;

    const today = new Date().toISOString().split('T')[0];
    const dueDateObj = new Date();
    dueDateObj.setDate(dueDateObj.getDate() + 14);
    const dueDate = dueDateObj.toISOString().split('T')[0];

    const invId = `inv-${Date.now()}`;
    const invNumber = `INV-2026-00${invoices.length + 1}`;
    const jeId = `je-${Date.now()}`;
    const jeNumber = `JE-2026-00${journalEntries.length + 1}`;

    const newInvoice: Invoice = {
      id: invId,
      invoiceNumber: invNumber,
      customerId: order.customerId,
      customerName: order.customerName,
      issueDate: today,
      dueDate,
      status: 'POSTED',
      lines: order.lines,
      subtotal: order.subtotal,
      taxTotal: order.taxTotal,
      grandTotal: order.grandTotal,
      amountPaid: 0,
      balanceDue: order.grandTotal,
      journalEntryId: jeId,
    };

    // Double Entry:
    // Dr Accounts Receivable (1003) = grandTotal
    // Cr Furniture Sales Income (4001) = subtotal
    // Cr GST Output Tax (2002) = taxTotal
    const newJE: JournalEntry = {
      id: jeId,
      entryNumber: jeNumber,
      date: today,
      reference: `${invNumber} (${order.customerName})`,
      journalCode: 'SALES',
      journalName: 'Customer Sales Journal',
      status: 'POSTED',
      lines: [
        {
          accountId: 'acc-1003',
          accountCode: '1003',
          accountName: 'Accounts Receivable (Debtors)',
          debit: order.grandTotal,
          credit: 0,
        },
        {
          accountId: 'acc-4001',
          accountCode: '4001',
          accountName: 'Furniture Sales Income',
          debit: 0,
          credit: order.subtotal,
        },
        {
          accountId: 'acc-2002',
          accountCode: '2002',
          accountName: 'GST Output Tax Liability (18%)',
          debit: 0,
          credit: order.taxTotal,
        },
      ],
      totalDebit: order.grandTotal,
      totalCredit: order.grandTotal,
      isBalanced: true,
    };

    // Update Accounts
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === 'acc-1003') return { ...acc, balance: acc.balance + order.grandTotal };
        if (acc.id === 'acc-4001') return { ...acc, balance: acc.balance + order.subtotal };
        if (acc.id === 'acc-2002') return { ...acc, balance: acc.balance + order.taxTotal };
        return acc;
      })
    );

    // Update Customer's totalReceivable
    setContacts((prev) =>
      prev.map((c) =>
        c.id === order.customerId
          ? { ...c, totalReceivable: (c.totalReceivable || 0) + order.grandTotal }
          : c
      )
    );

    // Update Journals count
    setJournals((prev) =>
      prev.map((j) => (j.code === 'SALES' ? { ...j, entriesCount: j.entriesCount + 1 } : j))
    );

    // Update Sales Order status
    setSalesOrders((prev) =>
      prev.map((so) => (so.id === orderId ? { ...so, status: 'INVOICED', invoiceId: invId } : so))
    );

    setJournalEntries((prev) => [newJE, ...prev]);
    setInvoices((prev) => [newInvoice, ...prev]);

    return newInvoice;
  }, [salesOrders, invoices.length, journalEntries.length]);

  // ────────────────────────────────────────────────────────
  // PURCHASES ACTIONS
  // ────────────────────────────────────────────────────────
  const createPurchaseOrder = useCallback((po: Omit<PurchaseOrder, 'id' | 'poNumber'> & { status?: PurchaseOrder['status'] }): PurchaseOrder => {
    const id = `po-${Date.now()}`;
    const poNumber = `PO-2026-00${purchaseOrders.length + 1}`;
    const newPO: PurchaseOrder = {
      ...po,
      id,
      poNumber,
      status: po.status || 'CONFIRMED',
    };
    setPurchaseOrders((prev) => [newPO, ...prev]);
    return newPO;
  }, [purchaseOrders.length]);

  const confirmPurchaseOrder = useCallback((id: string) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => (po.id === id ? { ...po, status: 'CONFIRMED' } : po))
    );
  }, []);

  const generateBillFromPO = useCallback((poId: string): Bill | null => {
    const po = purchaseOrders.find((p) => p.id === poId);
    if (!po) return null;

    const today = new Date().toISOString().split('T')[0];
    const dueDateObj = new Date();
    dueDateObj.setDate(dueDateObj.getDate() + 14);
    const dueDate = dueDateObj.toISOString().split('T')[0];

    const billId = `bill-${Date.now()}`;
    const billNumber = `BILL-2026-00${bills.length + 1}`;
    const jeId = `je-${Date.now()}`;
    const jeNumber = `JE-2026-00${journalEntries.length + 1}`;

    const newBill: Bill = {
      id: billId,
      billNumber,
      vendorId: po.vendorId,
      vendorName: po.vendorName,
      billDate: today,
      dueDate,
      status: 'POSTED',
      lines: po.lines,
      subtotal: po.subtotal,
      taxTotal: po.taxTotal,
      grandTotal: po.grandTotal,
      amountPaid: 0,
      balanceDue: po.grandTotal,
      journalEntryId: jeId,
    };

    // Double Entry:
    // Dr Raw Material Purchases Expense (5001) = subtotal
    // Dr GST Input Tax Credit / Liability Offset (2002) = taxTotal
    // Cr Accounts Payable (2001) = grandTotal
    const newJE: JournalEntry = {
      id: jeId,
      entryNumber: jeNumber,
      date: today,
      reference: `${billNumber} (${po.vendorName})`,
      journalCode: 'PURCH',
      journalName: 'Vendor Purchase Journal',
      status: 'POSTED',
      lines: [
        {
          accountId: 'acc-5001',
          accountCode: '5001',
          accountName: 'Raw Material & Stock Purchases',
          debit: po.subtotal,
          credit: 0,
        },
        {
          accountId: 'acc-2002',
          accountCode: '2002',
          accountName: 'GST Input Tax Credit',
          debit: po.taxTotal,
          credit: 0,
        },
        {
          accountId: 'acc-2001',
          accountCode: '2001',
          accountName: 'Accounts Payable (Creditors)',
          debit: 0,
          credit: po.grandTotal,
        },
      ],
      totalDebit: po.grandTotal,
      totalCredit: po.grandTotal,
      isBalanced: true,
    };

    // Update Accounts
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === 'acc-5001') return { ...acc, balance: acc.balance + po.subtotal };
        if (acc.id === 'acc-2001') return { ...acc, balance: acc.balance + po.grandTotal };
        return acc;
      })
    );

    // Update Vendor's totalPayable
    setContacts((prev) =>
      prev.map((c) =>
        c.id === po.vendorId
          ? { ...c, totalPayable: (c.totalPayable || 0) + po.grandTotal }
          : c
      )
    );

    setJournals((prev) =>
      prev.map((j) => (j.code === 'PURCH' ? { ...j, entriesCount: j.entriesCount + 1 } : j))
    );

    setPurchaseOrders((prev) =>
      prev.map((p) => (p.id === poId ? { ...p, status: 'BILLED', billId } : p))
    );

    setJournalEntries((prev) => [newJE, ...prev]);
    setBills((prev) => [newBill, ...prev]);

    return newBill;
  }, [purchaseOrders, bills.length, journalEntries.length]);

  // ────────────────────────────────────────────────────────
  // INVOICE & BILL CREATION
  // ────────────────────────────────────────────────────────
  const createInvoice = useCallback((inv: Omit<Invoice, 'id' | 'invoiceNumber' | 'journalEntryId'>): Invoice => {
    const invId = `inv-${Date.now()}`;
    const invNumber = `INV-2026-00${invoices.length + 1}`;
    const jeId = `je-${Date.now()}`;
    const jeNumber = `JE-2026-00${journalEntries.length + 1}`;

    const newInvoice: Invoice = {
      ...inv,
      id: invId,
      invoiceNumber: invNumber,
      journalEntryId: jeId,
    };

    const newJE: JournalEntry = {
      id: jeId,
      entryNumber: jeNumber,
      date: inv.issueDate,
      reference: `${invNumber} (${inv.customerName})`,
      journalCode: 'SALES',
      journalName: 'Customer Sales Journal',
      status: 'POSTED',
      lines: [
        {
          accountId: 'acc-1003',
          accountCode: '1003',
          accountName: 'Accounts Receivable (Debtors)',
          debit: inv.grandTotal,
          credit: 0,
        },
        {
          accountId: 'acc-4001',
          accountCode: '4001',
          accountName: 'Furniture Sales Income',
          debit: 0,
          credit: inv.subtotal,
        },
        {
          accountId: 'acc-2002',
          accountCode: '2002',
          accountName: 'GST Output Tax Liability (18%)',
          debit: 0,
          credit: inv.taxTotal,
        },
      ],
      totalDebit: inv.grandTotal,
      totalCredit: inv.grandTotal,
      isBalanced: true,
    };

    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === 'acc-1003') return { ...acc, balance: acc.balance + inv.grandTotal };
        if (acc.id === 'acc-4001') return { ...acc, balance: acc.balance + inv.subtotal };
        if (acc.id === 'acc-2002') return { ...acc, balance: acc.balance + inv.taxTotal };
        return acc;
      })
    );

    setContacts((prev) =>
      prev.map((c) =>
        c.id === inv.customerId
          ? { ...c, totalReceivable: (c.totalReceivable || 0) + inv.grandTotal }
          : c
      )
    );

    setJournals((prev) =>
      prev.map((j) => (j.code === 'SALES' ? { ...j, entriesCount: j.entriesCount + 1 } : j))
    );

    setJournalEntries((prev) => [newJE, ...prev]);
    setInvoices((prev) => [newInvoice, ...prev]);

    return newInvoice;
  }, [invoices.length, journalEntries.length]);

  const createBill = useCallback((b: Omit<Bill, 'id' | 'billNumber' | 'journalEntryId'>): Bill => {
    const billId = `bill-${Date.now()}`;
    const billNumber = `BILL-2026-00${bills.length + 1}`;
    const jeId = `je-${Date.now()}`;
    const jeNumber = `JE-2026-00${journalEntries.length + 1}`;

    const newBill: Bill = {
      ...b,
      id: billId,
      billNumber,
      journalEntryId: jeId,
    };

    const newJE: JournalEntry = {
      id: jeId,
      entryNumber: jeNumber,
      date: b.billDate,
      reference: `${billNumber} (${b.vendorName})`,
      journalCode: 'PURCH',
      journalName: 'Vendor Purchase Journal',
      status: 'POSTED',
      lines: [
        {
          accountId: 'acc-5001',
          accountCode: '5001',
          accountName: 'Raw Material & Stock Purchases',
          debit: b.subtotal,
          credit: 0,
        },
        {
          accountId: 'acc-2002',
          accountCode: '2002',
          accountName: 'GST Input Tax Credit',
          debit: b.taxTotal,
          credit: 0,
        },
        {
          accountId: 'acc-2001',
          accountCode: '2001',
          accountName: 'Accounts Payable (Creditors)',
          debit: 0,
          credit: b.grandTotal,
        },
      ],
      totalDebit: b.grandTotal,
      totalCredit: b.grandTotal,
      isBalanced: true,
    };

    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === 'acc-5001') return { ...acc, balance: acc.balance + b.subtotal };
        if (acc.id === 'acc-2001') return { ...acc, balance: acc.balance + b.grandTotal };
        return acc;
      })
    );

    setContacts((prev) =>
      prev.map((c) =>
        c.id === b.vendorId
          ? { ...c, totalPayable: (c.totalPayable || 0) + b.grandTotal }
          : c
      )
    );

    setJournals((prev) =>
      prev.map((j) => (j.code === 'PURCH' ? { ...j, entriesCount: j.entriesCount + 1 } : j))
    );

    setJournalEntries((prev) => [newJE, ...prev]);
    setBills((prev) => [newBill, ...prev]);

    return newBill;
  }, [bills.length, journalEntries.length]);

  // ────────────────────────────────────────────────────────
  // PAYMENT REGISTRATION
  // ────────────────────────────────────────────────────────
  const registerCustomerPayment = useCallback(
    (
      invoiceId: string,
      amount: number,
      journal: 'BANK' | 'CASH',
      method: 'HDFC Bank Transfer' | 'Cash Register' | 'UPI'
    ): PaymentItem | null => {
      const inv = invoices.find((i) => i.id === invoiceId);
      if (!inv || amount <= 0) return null;

      const today = new Date().toISOString().split('T')[0];
      const payId = `pay-${Date.now()}`;
      const payNumber = `PAY-2026-00${payments.length + 1}`;
      const jeId = `je-${Date.now()}`;
      const jeNumber = `JE-2026-00${journalEntries.length + 1}`;

      const newAmountPaid = inv.amountPaid + amount;
      const newBalanceDue = Math.max(0, inv.grandTotal - newAmountPaid);
      const newStatus: Invoice['status'] = newBalanceDue === 0 ? 'PAID' : 'PARTIALLY_PAID';

      const payment: PaymentItem = {
        id: payId,
        paymentNumber: payNumber,
        paymentDate: today,
        type: 'CUSTOMER_PAYMENT',
        contactId: inv.customerId,
        contactName: inv.customerName,
        documentRef: inv.invoiceNumber,
        amount,
        journal,
        paymentMethod: method,
        status: 'POSTED',
        journalEntryId: jeId,
      };

      const targetBankCashAccount = journal === 'BANK' ? 'acc-1002' : 'acc-1001';
      const targetBankCashName = journal === 'BANK' ? 'HDFC Current Bank Account' : 'Cash in Hand';
      const targetCode = journal === 'BANK' ? '1002' : '1001';

      // Double Entry:
      // Dr Bank / Cash = amount
      // Cr Accounts Receivable (1003) = amount
      const newJE: JournalEntry = {
        id: jeId,
        entryNumber: jeNumber,
        date: today,
        reference: `${payNumber} (${inv.invoiceNumber} receipt)`,
        journalCode: journal,
        journalName: journal === 'BANK' ? 'Bank Account - HDFC' : 'Cash Register Journal',
        status: 'POSTED',
        lines: [
          {
            accountId: targetBankCashAccount,
            accountCode: targetCode,
            accountName: targetBankCashName,
            debit: amount,
            credit: 0,
          },
          {
            accountId: 'acc-1003',
            accountCode: '1003',
            accountName: 'Accounts Receivable (Debtors)',
            debit: 0,
            credit: amount,
          },
        ],
        totalDebit: amount,
        totalCredit: amount,
        isBalanced: true,
      };

      // Update Invoice
      setInvoices((prev) =>
        prev.map((i) =>
          i.id === invoiceId
            ? { ...i, amountPaid: newAmountPaid, balanceDue: newBalanceDue, status: newStatus }
            : i
        )
      );

      // Update Accounts
      setAccounts((prev) =>
        prev.map((acc) => {
          if (acc.id === targetBankCashAccount) return { ...acc, balance: acc.balance + amount };
          if (acc.id === 'acc-1003') return { ...acc, balance: Math.max(0, acc.balance - amount) };
          return acc;
        })
      );

      // Update Customer totalReceivable
      setContacts((prev) =>
        prev.map((c) =>
          c.id === inv.customerId
            ? { ...c, totalReceivable: Math.max(0, (c.totalReceivable || 0) - amount) }
            : c
        )
      );

      setJournals((prev) =>
        prev.map((j) => (j.code === journal ? { ...j, entriesCount: j.entriesCount + 1 } : j))
      );

      setJournalEntries((prev) => [newJE, ...prev]);
      setPayments((prev) => [payment, ...prev]);

      return payment;
    },
    [invoices, payments.length, journalEntries.length]
  );

  const registerVendorPayment = useCallback(
    (
      billId: string,
      amount: number,
      journal: 'BANK' | 'CASH',
      method: 'HDFC Bank Transfer' | 'Cash Register' | 'UPI'
    ): PaymentItem | null => {
      const b = bills.find((item) => item.id === billId);
      if (!b || amount <= 0) return null;

      const today = new Date().toISOString().split('T')[0];
      const payId = `pay-${Date.now()}`;
      const payNumber = `PAY-2026-00${payments.length + 1}`;
      const jeId = `je-${Date.now()}`;
      const jeNumber = `JE-2026-00${journalEntries.length + 1}`;

      const newAmountPaid = b.amountPaid + amount;
      const newBalanceDue = Math.max(0, b.grandTotal - newAmountPaid);
      const newStatus: Bill['status'] = newBalanceDue === 0 ? 'PAID' : 'PARTIALLY_PAID';

      const payment: PaymentItem = {
        id: payId,
        paymentNumber: payNumber,
        paymentDate: today,
        type: 'VENDOR_PAYMENT',
        contactId: b.vendorId,
        contactName: b.vendorName,
        documentRef: b.billNumber,
        amount,
        journal,
        paymentMethod: method,
        status: 'POSTED',
        journalEntryId: jeId,
      };

      const targetBankCashAccount = journal === 'BANK' ? 'acc-1002' : 'acc-1001';
      const targetBankCashName = journal === 'BANK' ? 'HDFC Current Bank Account' : 'Cash in Hand';
      const targetCode = journal === 'BANK' ? '1002' : '1001';

      // Double Entry:
      // Dr Accounts Payable (2001) = amount
      // Cr Bank / Cash = amount
      const newJE: JournalEntry = {
        id: jeId,
        entryNumber: jeNumber,
        date: today,
        reference: `${payNumber} (${b.billNumber} payout)`,
        journalCode: journal,
        journalName: journal === 'BANK' ? 'Bank Account - HDFC' : 'Cash Register Journal',
        status: 'POSTED',
        lines: [
          {
            accountId: 'acc-2001',
            accountCode: '2001',
            accountName: 'Accounts Payable (Creditors)',
            debit: amount,
            credit: 0,
          },
          {
            accountId: targetBankCashAccount,
            accountCode: targetCode,
            accountName: targetBankCashName,
            debit: 0,
            credit: amount,
          },
        ],
        totalDebit: amount,
        totalCredit: amount,
        isBalanced: true,
      };

      // Update Bill
      setBills((prev) =>
        prev.map((item) =>
          item.id === billId
            ? { ...item, amountPaid: newAmountPaid, balanceDue: newBalanceDue, status: newStatus }
            : item
        )
      );

      // Update Accounts
      setAccounts((prev) =>
        prev.map((acc) => {
          if (acc.id === 'acc-2001') return { ...acc, balance: Math.max(0, acc.balance - amount) };
          if (acc.id === targetBankCashAccount) return { ...acc, balance: acc.balance - amount };
          return acc;
        })
      );

      // Update Vendor totalPayable
      setContacts((prev) =>
        prev.map((c) =>
          c.id === b.vendorId
            ? { ...c, totalPayable: Math.max(0, (c.totalPayable || 0) - amount) }
            : c
        )
      );

      setJournals((prev) =>
        prev.map((j) => (j.code === journal ? { ...j, entriesCount: j.entriesCount + 1 } : j))
      );

      setJournalEntries((prev) => [newJE, ...prev]);
      setPayments((prev) => [payment, ...prev]);

      return payment;
    },
    [bills, payments.length, journalEntries.length]
  );

  const createDirectPayment = useCallback(
    (
      type: 'CUSTOMER_PAYMENT' | 'VENDOR_PAYMENT',
      contactId: string,
      amount: number,
      docRef: string,
      journal: 'BANK' | 'CASH',
      method: 'HDFC Bank Transfer' | 'Cash Register' | 'UPI'
    ): PaymentItem => {
      const contact = contacts.find((c) => c.id === contactId);
      const contactName = contact ? contact.name : 'Counterparty';
      const today = new Date().toISOString().split('T')[0];
      const payId = `pay-${Date.now()}`;
      const payNumber = `PAY-2026-00${payments.length + 1}`;
      const jeId = `je-${Date.now()}`;
      const jeNumber = `JE-2026-00${journalEntries.length + 1}`;

      const payment: PaymentItem = {
        id: payId,
        paymentNumber: payNumber,
        paymentDate: today,
        type,
        contactId,
        contactName,
        documentRef: docRef,
        amount,
        journal,
        paymentMethod: method,
        status: 'POSTED',
        journalEntryId: jeId,
      };

      const targetBankCashAccount = journal === 'BANK' ? 'acc-1002' : 'acc-1001';
      const targetBankCashName = journal === 'BANK' ? 'HDFC Current Bank Account' : 'Cash in Hand';
      const targetCode = journal === 'BANK' ? '1002' : '1001';

      const isCustomer = type === 'CUSTOMER_PAYMENT';
      const newJE: JournalEntry = {
        id: jeId,
        entryNumber: jeNumber,
        date: today,
        reference: `${payNumber} (${docRef})`,
        journalCode: journal,
        journalName: journal === 'BANK' ? 'Bank Account - HDFC' : 'Cash Register Journal',
        status: 'POSTED',
        lines: isCustomer
          ? [
              { accountId: targetBankCashAccount, accountCode: targetCode, accountName: targetBankCashName, debit: amount, credit: 0 },
              { accountId: 'acc-1003', accountCode: '1003', accountName: 'Accounts Receivable', debit: 0, credit: amount },
            ]
          : [
              { accountId: 'acc-2001', accountCode: '2001', accountName: 'Accounts Payable', debit: amount, credit: 0 },
              { accountId: targetBankCashAccount, accountCode: targetCode, accountName: targetBankCashName, debit: 0, credit: amount },
            ],
        totalDebit: amount,
        totalCredit: amount,
        isBalanced: true,
      };

      setAccounts((prev) =>
        prev.map((acc) => {
          if (isCustomer) {
            if (acc.id === targetBankCashAccount) return { ...acc, balance: acc.balance + amount };
            if (acc.id === 'acc-1003') return { ...acc, balance: Math.max(0, acc.balance - amount) };
          } else {
            if (acc.id === 'acc-2001') return { ...acc, balance: Math.max(0, acc.balance - amount) };
            if (acc.id === targetBankCashAccount) return { ...acc, balance: acc.balance - amount };
          }
          return acc;
        })
      );

      setJournalEntries((prev) => [newJE, ...prev]);
      setPayments((prev) => [payment, ...prev]);

      return payment;
    },
    [contacts, payments.length, journalEntries.length]
  );

  // ────────────────────────────────────────────────────────
  // MASTER DATA: CONTACTS & PRODUCTS
  // ────────────────────────────────────────────────────────
  const addContact = useCallback((c: Omit<ContactItem, 'id' | 'isActive'>): ContactItem => {
    const newC: ContactItem = {
      ...c,
      id: `cnt-${Date.now()}`,
      isActive: true,
      totalReceivable: 0,
      totalPayable: 0,
    };
    setContacts((prev) => [newC, ...prev]);
    return newC;
  }, []);

  const updateContact = useCallback((id: string, updates: Partial<ContactItem>) => {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const toggleContactActive = useCallback((id: string) => {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)));
  }, []);

  const grantPortalAccess = useCallback((contactId: string, email: string) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.id === contactId
          ? { ...c, portalUser: { email, active: true } }
          : c
      )
    );
  }, []);

  const addAnalyticAccount = useCallback((acc: Omit<AnalyticAccountItem, 'id'>): AnalyticAccountItem => {
    const newAcc: AnalyticAccountItem = {
      ...acc,
      id: `ana-${Date.now()}`,
    };
    setAnalyticAccounts((prev) => [newAcc, ...prev]);
    return newAcc;
  }, []);

  const addProduct = useCallback((p: Omit<ProductItem, 'id' | 'isActive'>): ProductItem => {
    const newP: ProductItem = {
      ...p,
      id: `prd-${Date.now()}`,
      isActive: true,
    };
    setProducts((prev) => [newP, ...prev]);
    return newP;
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<ProductItem>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }, []);

  const toggleProductActive = useCallback((id: string) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)));
  }, []);

  // ────────────────────────────────────────────────────────
  // BUDGETS
  // ────────────────────────────────────────────────────────
  const addBudget = useCallback((budget: {
    name: string;
    period: string;
    responsible: string;
    analyticAccount: string;
    plannedAmount: number;
  }): BudgetHealthItem => {
    const newB: BudgetHealthItem = {
      id: `bdg-${Date.now()}`,
      name: budget.name,
      period: budget.period,
      responsible: budget.responsible,
      analyticAccount: budget.analyticAccount,
      plannedAmount: budget.plannedAmount,
      actualAmount: 0,
      remainingAmount: budget.plannedAmount,
      utilization: 0,
      status: 'HEALTHY',
    };
    setBudgets((prev) => [newB, ...prev]);
    return newB;
  }, []);

  // ────────────────────────────────────────────────────────
  // DYNAMIC DASHBOARD METRICS CALCULATION
  // ────────────────────────────────────────────────────────
  const getDashboardMetricsData = useCallback(() => {
    const revenueAccounts = accounts.filter((a) => a.type === 'INCOME');
    const revenue = revenueAccounts.reduce((sum, a) => sum + a.balance, 0);

    const expenseAccounts = accounts.filter((a) => a.type === 'EXPENSE');
    const expenses = expenseAccounts.reduce((sum, a) => sum + a.balance, 0);

    const netProfit = revenue - expenses;

    const cashBankAccs = accounts.filter((a) => a.id === 'acc-1001' || a.id === 'acc-1002');
    const cashBank = cashBankAccs.reduce((sum, a) => sum + a.balance, 0);

    const recAcc = accounts.find((a) => a.id === 'acc-1003');
    const receivables = recAcc ? recAcc.balance : 0;

    const payAcc = accounts.find((a) => a.id === 'acc-2001');
    const payables = payAcc ? payAcc.balance : 0;

    const openInvoices = invoices.filter((i) => i.balanceDue > 0);
    const openBills = bills.filter((b) => b.balanceDue > 0);

    return {
      revenue,
      expenses,
      netProfit,
      cashBank,
      receivables,
      payables,
      unpaidInvoicesCount: openInvoices.length,
      unpaidBillsCount: openBills.length,
      openInvoicesAmount: openInvoices.reduce((sum, i) => sum + i.balanceDue, 0),
      openBillsAmount: openBills.reduce((sum, b) => sum + b.balanceDue, 0),
    };
  }, [accounts, invoices, bills]);

  const ledgerEquality = useMemo(() => {
    const totalDebits = journalEntries.reduce((sum, je) => sum + je.totalDebit, 0);
    const totalCredits = journalEntries.reduce((sum, je) => sum + je.totalCredit, 0);
    const diff = Math.abs(totalDebits - totalCredits);
    const isBalanced = diff < 0.01;
    return {
      totalDebits,
      totalCredits,
      isBalanced,
      discrepancy: diff,
      status: isBalanced ? 'PERFECTLY_BALANCED' : 'DISCREPANCY_DETECTED',
    };
  }, [journalEntries]);

  return (
    <ERPContext.Provider
      value={{
        contacts,
        products,
        analyticAccounts,
        salesOrders,
        purchaseOrders,
        invoices,
        bills,
        payments,
        accounts,
        journals,
        journalEntries,
        budgets,
        ledgerEquality,
        createSalesOrder,
        confirmSalesOrder,
        generateInvoiceFromSO,
        createPurchaseOrder,
        confirmPurchaseOrder,
        generateBillFromPO,
        createInvoice,
        registerCustomerPayment,
        createBill,
        registerVendorPayment,
        createDirectPayment,
        addContact,
        updateContact,
        toggleContactActive,
        grantPortalAccess,
        addProduct,
        updateProduct,
        toggleProductActive,
        addAnalyticAccount,
        addBudget,
        getDashboardMetricsData,
        resetDemoData,
      }}
    >
      {children}
    </ERPContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useERP() {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
}
