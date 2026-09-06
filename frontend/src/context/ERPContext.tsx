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
  type JournalLine,
  type JournalEntry,
  type BudgetHealthItem,
  type BudgetStage,
  type BudgetLine,
  type AnalyticAccountItem,
} from '@/data/erpData';
import apiClient from '@/lib/axios';

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
    period?: string;
    startDate?: string;
    endDate?: string;
    responsible?: string;
    analyticAccount?: string;
    plannedAmount?: number;
    stage?: BudgetStage;
    lines?: BudgetLine[];
  }) => BudgetHealthItem;
  updateBudget: (id: string, updates: Partial<BudgetHealthItem>) => BudgetHealthItem | undefined;
  confirmBudget: (id: string) => BudgetHealthItem | undefined;
  reviseBudget: (id: string, newCommitted?: number) => { oldBudget: BudgetHealthItem; newBudget: BudgetHealthItem } | undefined;
  cancelBudget: (id: string) => BudgetHealthItem | undefined;
  resetBudgetToDraft: (id: string) => BudgetHealthItem | undefined;
  deleteBudget: (id: string) => void;

  addAccount: (account: {
    name: string;
    code?: string;
    type: AccountItem['type'];
    initialBalance?: number;
  }) => AccountItem;

  addJournal: (journal: {
    name: string;
    type: JournalItem['type'];
    defaultAccountId: string;
    code?: string;
  }) => JournalItem;

  createManualJournalEntry: (entry: {
    date: string;
    journalId: string;
    reference: string;
    status?: 'POSTED' | 'DRAFT';
    partnerId?: string;
    partnerName?: string;
    lines: Array<{
      accountId: string;
      partnerId?: string;
      partnerName?: string;
      debit: number;
      credit: number;
    }>;
  }) => JournalEntry;

  postJournalEntry: (entryId: string) => void;
  resetJournalEntryToDraft: (entryId: string) => void;

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

  refreshERPData: () => Promise<void>;
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
  // LIVE POSTGRESQL MULTI-DEVICE SYNCHRONIZATION
  // ────────────────────────────────────────────────────────
  const refreshFromBackend = useCallback(async () => {
    try {
      const [
        productsRes,
        contactsRes,
        salesRes,
        purchasesRes,
        invoicesRes,
        billsRes,
        paymentsRes,
        accountsRes,
        journalsRes,
        journalEntriesRes,
        budgetsRes,
        analyticAccountsRes,
      ] = await Promise.allSettled([
        apiClient.get('/products?limit=1000'),
        apiClient.get('/contacts?limit=1000'),
        apiClient.get('/sales?limit=1000'),
        apiClient.get('/purchases?limit=1000'),
        apiClient.get('/invoices?limit=1000'),
        apiClient.get('/bills?limit=1000'),
        apiClient.get('/payments?limit=1000'),
        apiClient.get('/accounting/chart-of-accounts'),
        apiClient.get('/accounting/journals'),
        apiClient.get('/accounting/journal-entries'),
        apiClient.get('/budgets'),
        apiClient.get('/budgets/analytic-accounts'),
      ]);

      if (productsRes.status === 'fulfilled' && productsRes.value.data?.data?.items?.length) {
        setProducts(
          productsRes.value.data.data.items.map((p: any) => ({
            id: p.id,
            name: p.name,
            type: p.type || 'GOODS',
            salesPrice: Number(p.salesPrice || 0),
            purchasePrice: Number(p.purchasePrice || 0),
            category: p.category || 'General',
            stock: p.stock ?? 50,
            isActive: p.isActive !== false,
          }))
        );
      }

      if (contactsRes.status === 'fulfilled' && contactsRes.value.data?.data?.items?.length) {
        setContacts(
          contactsRes.value.data.data.items.map((c: any) => ({
            id: c.id,
            name: c.name,
            type: c.type || 'CUSTOMER',
            email: c.email || '',
            mobile: c.mobile || '',
            city: c.city || '',
            state: c.state || '',
            pincode: c.pincode || '',
            isActive: c.isActive !== false,
            totalReceivable: Number(c.totalReceivable || 0),
            totalPayable: Number(c.totalPayable || 0),
            portalUser: c.portalUser,
          }))
        );
      }

      if (salesRes.status === 'fulfilled' && salesRes.value.data?.data?.items?.length) {
        setSalesOrders(
          salesRes.value.data.data.items.map((so: any) => ({
            id: so.id,
            orderNumber: so.orderNumber || so.reference,
            customerId: so.customerId,
            customerName: so.customerName,
            orderDate: so.orderDate
              ? so.orderDate.includes('T')
                ? so.orderDate.split('T')[0]
                : so.orderDate
              : new Date().toISOString().split('T')[0],
            status: so.status,
            lines: (so.lines || []).map((l: any) => ({
              id: l.id,
              productId: l.productId,
              productName: l.productName || l.description || 'Item',
              quantity: Number(l.quantity),
              unitPrice: Number(l.unitPrice),
              taxRate: 18,
              subtotal: Number(l.subtotal),
              taxAmount: Number(l.tax || l.taxAmount || 0),
              total: Number(l.total),
            })),
            subtotal: Number(so.subtotal),
            taxTotal: Number(so.taxTotal || so.taxAmount || 0),
            grandTotal: Number(so.grandTotal || so.totalAmount || 0),
            invoiceId: so.invoiceId,
          }))
        );
      }

      if (purchasesRes.status === 'fulfilled' && purchasesRes.value.data?.data?.items?.length) {
        setPurchaseOrders(
          purchasesRes.value.data.data.items.map((po: any) => ({
            id: po.id,
            poNumber: po.poNumber || po.reference,
            vendorId: po.vendorId,
            vendorName: po.vendorName,
            orderDate: po.orderDate
              ? po.orderDate.includes('T')
                ? po.orderDate.split('T')[0]
                : po.orderDate
              : new Date().toISOString().split('T')[0],
            status: po.status,
            lines: (po.lines || []).map((l: any) => ({
              id: l.id,
              productId: l.productId,
              productName: l.productName || l.description || 'Item',
              quantity: Number(l.quantity),
              unitPrice: Number(l.unitPrice),
              taxRate: 18,
              subtotal: Number(l.subtotal),
              taxAmount: Number(l.tax || l.taxAmount || 0),
              total: Number(l.total),
            })),
            subtotal: Number(po.subtotal),
            taxTotal: Number(po.taxTotal || po.taxAmount || 0),
            grandTotal: Number(po.grandTotal || po.totalAmount || 0),
            billId: po.billId,
          }))
        );
      }

      if (invoicesRes.status === 'fulfilled' && invoicesRes.value.data?.data?.items?.length) {
        setInvoices(
          invoicesRes.value.data.data.items.map((inv: any) => ({
            id: inv.id,
            invoiceNumber: inv.invoiceNumber || inv.reference,
            customerId: inv.customerId,
            customerName: inv.customerName,
            issueDate: inv.issueDate
              ? inv.issueDate.includes('T')
                ? inv.issueDate.split('T')[0]
                : inv.issueDate
              : new Date().toISOString().split('T')[0],
            dueDate: inv.dueDate
              ? inv.dueDate.includes('T')
                ? inv.dueDate.split('T')[0]
                : inv.dueDate
              : new Date().toISOString().split('T')[0],
            status: inv.status,
            lines: (inv.lines || []).map((l: any) => ({
              id: l.id,
              productId: l.productId,
              productName: l.productName || l.description || 'Item',
              quantity: Number(l.quantity),
              unitPrice: Number(l.unitPrice),
              taxRate: 18,
              subtotal: Number(l.subtotal),
              taxAmount: Number(l.tax || l.taxAmount || 0),
              total: Number(l.total),
            })),
            subtotal: Number(inv.subtotal),
            taxTotal: Number(inv.taxTotal || inv.taxAmount || 0),
            grandTotal: Number(inv.grandTotal || inv.totalAmount || 0),
            amountPaid: Number(inv.amountPaid || 0),
            balanceDue: Number(
              inv.balanceDue !== undefined
                ? inv.balanceDue
                : inv.grandTotal - (inv.amountPaid || 0)
            ),
            journalEntryId: inv.journalEntryId,
          }))
        );
      }

      if (billsRes.status === 'fulfilled' && billsRes.value.data?.data?.items?.length) {
        setBills(
          billsRes.value.data.data.items.map((b: any) => ({
            id: b.id,
            billNumber: b.billNumber || b.reference,
            vendorId: b.vendorId,
            vendorName: b.vendorName,
            billDate: b.billDate
              ? b.billDate.includes('T')
                ? b.billDate.split('T')[0]
                : b.billDate
              : new Date().toISOString().split('T')[0],
            dueDate: b.dueDate
              ? b.dueDate.includes('T')
                ? b.dueDate.split('T')[0]
                : b.dueDate
              : new Date().toISOString().split('T')[0],
            status: b.status,
            lines: (b.lines || []).map((l: any) => ({
              id: l.id,
              productId: l.productId,
              productName: l.productName || l.description || 'Item',
              quantity: Number(l.quantity),
              unitPrice: Number(l.unitPrice),
              taxRate: 18,
              subtotal: Number(l.subtotal),
              taxAmount: Number(l.tax || l.taxAmount || 0),
              total: Number(l.total),
            })),
            subtotal: Number(b.subtotal),
            taxTotal: Number(b.taxTotal || b.taxAmount || 0),
            grandTotal: Number(b.grandTotal || b.totalAmount || 0),
            amountPaid: Number(b.amountPaid || 0),
            balanceDue: Number(
              b.balanceDue !== undefined
                ? b.balanceDue
                : b.grandTotal - (b.amountPaid || 0)
            ),
            journalEntryId: b.journalEntryId,
          }))
        );
      }

      if (paymentsRes.status === 'fulfilled' && paymentsRes.value.data?.data?.items?.length) {
        setPayments(
          paymentsRes.value.data.data.items.map((p: any) => ({
            id: p.id,
            paymentNumber: p.paymentNumber || p.reference,
            paymentDate: p.paymentDate
              ? p.paymentDate.includes('T')
                ? p.paymentDate.split('T')[0]
                : p.paymentDate
              : new Date().toISOString().split('T')[0],
            type: p.type,
            contactId: p.contactId,
            contactName: p.contactName,
            documentRef: p.documentRef || p.reference || '',
            amount: Number(p.amount),
            journal: p.journal || (p.method === 'CASH' ? 'CASH' : 'BANK'),
            paymentMethod:
              p.paymentMethod ||
              (p.method === 'CASH' ? 'Cash Register' : 'HDFC Bank Transfer'),
            status: p.status || 'POSTED',
            journalEntryId: p.journalEntryId,
          }))
        );
      }

      if (
        accountsRes.status === 'fulfilled' &&
        Array.isArray(accountsRes.value.data?.data) &&
        accountsRes.value.data.data.length > 0
      ) {
        setAccounts(
          accountsRes.value.data.data.map((a: any) => ({
            id: a.id,
            code: a.code,
            name: a.name,
            type: a.type,
            balance: Number(a.balance || 0),
            currency: a.currency || 'INR',
          }))
        );
      }

      if (
        journalsRes.status === 'fulfilled' &&
        Array.isArray(journalsRes.value.data?.data) &&
        journalsRes.value.data.data.length > 0
      ) {
        setJournals(
          journalsRes.value.data.data.map((j: any) => ({
            id: j.id,
            code: j.code || j.type,
            name: j.name,
            type: j.type,
            entriesCount: Number(j.entriesCount || 0),
          }))
        );
      }

      if (
        journalEntriesRes.status === 'fulfilled' &&
        Array.isArray(journalEntriesRes.value.data?.data) &&
        journalEntriesRes.value.data.data.length > 0
      ) {
        setJournalEntries(
          journalEntriesRes.value.data.data.map((je: any) => ({
            id: je.id,
            entryNumber: je.reference || je.entryNumber,
            date: je.date
              ? je.date.includes('T')
                ? je.date.split('T')[0]
                : je.date
              : new Date().toISOString().split('T')[0],
            reference: je.reference,
            journalCode: je.journalCode || 'GENERAL',
            journalName: je.journalName || 'General Journal',
            status: je.status || 'POSTED',
            lines: (je.lines || []).map((l: any) => ({
              accountId: l.accountId,
              accountCode: l.accountCode || '',
              accountName: l.accountName || '',
              debit: Number(l.debit || 0),
              credit: Number(l.credit || 0),
            })),
            totalDebit: Number(je.totalDebit || 0),
            totalCredit: Number(je.totalCredit || 0),
            isBalanced:
              Math.abs(Number(je.totalDebit || 0) - Number(je.totalCredit || 0)) < 0.01,
          }))
        );
      }

      if (
        budgetsRes.status === 'fulfilled' &&
        Array.isArray(budgetsRes.value.data?.data) &&
        budgetsRes.value.data.data.length > 0
      ) {
        setBudgets((prev) => {
          const backendItems: BudgetHealthItem[] = budgetsRes.value.data.data.map((b: any) => {
            const existing = prev.find((p) => p.id === b.id);
            const planned = Number(b.plannedAmount || existing?.plannedAmount || 100000);
            const actual = Number(b.actualAmount ?? existing?.actualAmount ?? 0);
            const remaining = Number(b.remainingAmount ?? (planned - actual));
            const utilization = Number(
              b.utilization ?? (planned > 0 ? Math.round((actual / planned) * 100) : 0)
            );
            const stage: BudgetStage = existing?.stage || 'CONFIRM';

            const lines: BudgetLine[] =
              existing?.lines && existing.lines.length > 0
                ? existing.lines
                : [
                    {
                      id: `bl-${b.id}-1`,
                      analyticAccountId: 'ana-0',
                      analyticAccountName: b.analyticAccount || 'Furniture Procurement',
                      type: 'EXPENSE',
                      committedAmount: planned,
                      achievedAmount: actual,
                      achievedPercent:
                        planned > 0 ? Math.round((actual / planned) * 10000) / 100 : 0,
                      amountToAchieve: Math.max(0, planned - actual),
                    },
                  ];

            return {
              id: b.id,
              name: b.name,
              period:
                b.startDate && b.endDate
                  ? `${b.startDate} to ${b.endDate}`
                  : existing?.period || 'January 2026',
              startDate: b.startDate || existing?.startDate || '2026-01-01',
              endDate: b.endDate || existing?.endDate || '2026-01-31',
              responsible:
                b.responsibleUser || existing?.responsible || 'Mohith (Production Lead)',
              analyticAccount:
                b.analyticAccount || existing?.analyticAccount || 'Furniture Procurement',
              stage,
              revisionOfId: existing?.revisionOfId,
              revisionOfName: existing?.revisionOfName,
              revisedWithId: existing?.revisedWithId,
              revisedWithName: existing?.revisedWithName,
              lines,
              plannedAmount: planned,
              actualAmount: actual,
              remainingAmount: remaining,
              utilization,
              status:
                b.status ||
                (utilization > 100
                  ? 'EXCEEDED'
                  : utilization >= 80
                  ? 'WARNING'
                  : 'HEALTHY'),
            };
          });

          const localOnly = prev.filter(
            (p) => !backendItems.some((bi) => bi.id === p.id)
          );

          return [...localOnly, ...backendItems];
        });
      }

      if (
        analyticAccountsRes.status === 'fulfilled' &&
        Array.isArray(analyticAccountsRes.value.data?.data) &&
        analyticAccountsRes.value.data.data.length > 0
      ) {
        setAnalyticAccounts((prev) => {
          const backendItems: AnalyticAccountItem[] = analyticAccountsRes.value.data.data.map(
            (a: any) => ({
              id: a.id,
              name: a.name,
              type: a.type || 'EXPENSES',
              description: a.description,
            })
          );
          const localOnly = prev.filter(
            (p) => !backendItems.some((bi) => bi.id === p.id || bi.name === p.name)
          );
          return [...localOnly, ...backendItems];
        });
      }
    } catch {
      // Retrying silently in background
    }
  }, []);

  // Initial load and periodic 5-second polling + browser tab focus listeners
  useEffect(() => {
    refreshFromBackend();

    const interval = setInterval(refreshFromBackend, 5000);

    const onVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        refreshFromBackend();
      }
    };

    window.addEventListener('focus', onVisibilityOrFocus);
    document.addEventListener('visibilitychange', onVisibilityOrFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onVisibilityOrFocus);
      document.removeEventListener('visibilitychange', onVisibilityOrFocus);
    };
  }, [refreshFromBackend]);
  const createSalesOrder = useCallback((order: Omit<SalesOrder, 'id' | 'orderNumber'> & { status?: SalesOrder['status'] }): SalesOrder => {
    const id = `so-${Date.now()}`;
    const orderNumber = `S${String(salesOrders.length + 1).padStart(5, '0')}`;
    const newSO: SalesOrder = {
      ...order,
      id,
      orderNumber,
      status: order.status || 'CONFIRMED',
    };
    setSalesOrders((prev) => [newSO, ...prev]);

    // Dispatch to live PostgreSQL backend
    apiClient.post('/sales', {
      customerId: order.customerId,
      orderDate: order.orderDate,
      lines: order.lines.map((l) => ({
        productId: l.productId,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
      })),
    }).catch((e) => console.warn('Backend SO sync error:', e)).finally(() => {
      setTimeout(refreshFromBackend, 300);
    });

    return newSO;
  }, [salesOrders.length, refreshFromBackend]);

  const confirmSalesOrder = useCallback((id: string) => {
    setSalesOrders((prev) =>
      prev.map((so) => (so.id === id ? { ...so, status: 'CONFIRMED' } : so))
    );

    apiClient.post(`/sales/${id}/confirm`).catch((e) => console.warn('Confirm SO sync error:', e)).finally(() => {
      setTimeout(refreshFromBackend, 300);
    });
  }, [refreshFromBackend]);

  const generateInvoiceFromSO = useCallback((orderId: string): Invoice | null => {
    const order = salesOrders.find((o) => o.id === orderId);
    if (!order) return null;

    const today = new Date().toISOString().split('T')[0];
    const dueDateObj = new Date();
    dueDateObj.setDate(dueDateObj.getDate() + 14);
    const dueDate = dueDateObj.toISOString().split('T')[0];

    const invId = `inv-${Date.now()}`;
    const invNumber = `INV/2026/${String(invoices.length + 1).padStart(4, '0')}`;
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
      soId: order.id,
      soNumber: order.orderNumber,
      invoiceReference: `ABC-26-${String(invoices.length + 1).padStart(3, '0')}`,
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

    apiClient.post(`/sales/${orderId}/invoice`).catch((e) => console.warn('Invoice SO sync error:', e)).finally(() => {
      setTimeout(refreshFromBackend, 300);
    });

    return newInvoice;
  }, [salesOrders, invoices.length, journalEntries.length, refreshFromBackend]);

  // ────────────────────────────────────────────────────────
  // PURCHASES ACTIONS
  // ────────────────────────────────────────────────────────
  const createPurchaseOrder = useCallback((po: Omit<PurchaseOrder, 'id' | 'poNumber'> & { status?: PurchaseOrder['status'] }): PurchaseOrder => {
    const id = `po-${Date.now()}`;
    const poNumber = `P${String(purchaseOrders.length + 1).padStart(5, '0')}`;
    const newPO: PurchaseOrder = {
      ...po,
      id,
      poNumber,
      status: po.status || 'CONFIRMED',
    };
    setPurchaseOrders((prev) => [newPO, ...prev]);

    apiClient.post('/purchases', {
      vendorId: po.vendorId,
      orderDate: po.orderDate,
      lines: po.lines.map((l) => ({
        productId: l.productId,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
      })),
    }).catch((e) => console.warn('Backend PO sync error:', e)).finally(() => {
      setTimeout(refreshFromBackend, 300);
    });

    return newPO;
  }, [purchaseOrders.length, refreshFromBackend]);

  const confirmPurchaseOrder = useCallback((id: string) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => (po.id === id ? { ...po, status: 'CONFIRMED' } : po))
    );

    apiClient.post(`/purchases/${id}/confirm`).catch((e) => console.warn('Confirm PO sync error:', e)).finally(() => {
      setTimeout(refreshFromBackend, 300);
    });
  }, [refreshFromBackend]);

  const generateBillFromPO = useCallback((poId: string): Bill | null => {
    const po = purchaseOrders.find((p) => p.id === poId);
    if (!po) return null;

    const today = new Date().toISOString().split('T')[0];
    const dueDateObj = new Date();
    dueDateObj.setDate(dueDateObj.getDate() + 14);
    const dueDate = dueDateObj.toISOString().split('T')[0];

    const billId = `bill-${Date.now()}`;
    const billNumber = `Bill/2026/${String(bills.length + 1).padStart(4, '0')}`;
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
      poId: po.id,
      poNumber: po.poNumber,
      billReference: `ABC-26-${String(bills.length + 1).padStart(3, '0')}`,
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

    apiClient.post(`/purchases/${poId}/bill`).catch((e) => console.warn('Bill PO sync error:', e)).finally(() => {
      setTimeout(refreshFromBackend, 300);
    });

    return newBill;
  }, [purchaseOrders, bills.length, journalEntries.length, refreshFromBackend]);

  // ────────────────────────────────────────────────────────
  // INVOICE & BILL CREATION
  // ────────────────────────────────────────────────────────
  const createInvoice = useCallback((inv: Omit<Invoice, 'id' | 'invoiceNumber' | 'journalEntryId'>): Invoice => {
    const invId = `inv-${Date.now()}`;
    const invNumber = `INV/2026/${String(invoices.length + 1).padStart(4, '0')}`;
    const jeId = `je-${Date.now()}`;
    const jeNumber = `JE-2026-00${journalEntries.length + 1}`;

    const newInvoice: Invoice = {
      ...inv,
      id: invId,
      invoiceNumber: invNumber,
      journalEntryId: jeId,
      invoiceReference: inv.invoiceReference || `ABC-26-${String(invoices.length + 1).padStart(3, '0')}`,
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

    apiClient.post('/invoices', {
      customerId: inv.customerId,
      issueDate: inv.issueDate,
      dueDate: inv.dueDate,
      lines: inv.lines.map((l) => ({
        productId: l.productId,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
        description: l.productName,
      })),
    }).catch((e) => console.warn('Sync invoice error:', e)).finally(() => {
      setTimeout(refreshFromBackend, 300);
    });

    return newInvoice;
  }, [invoices.length, journalEntries.length, refreshFromBackend]);

  const createBill = useCallback((b: Omit<Bill, 'id' | 'billNumber' | 'journalEntryId'>): Bill => {
    const billId = `bill-${Date.now()}`;
    const billNumber = `Bill/2026/${String(bills.length + 1).padStart(4, '0')}`;
    const jeId = `je-${Date.now()}`;
    const jeNumber = `JE-2026-00${journalEntries.length + 1}`;

    const newBill: Bill = {
      ...b,
      id: billId,
      billNumber,
      journalEntryId: jeId,
      billReference: b.billReference || `ABC-26-${String(bills.length + 1).padStart(3, '0')}`,
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

    apiClient.post('/bills', {
      vendorId: b.vendorId,
      billDate: b.billDate,
      dueDate: b.dueDate,
      lines: b.lines.map((l) => ({
        productId: l.productId,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
        description: l.productName,
      })),
    }).catch((e) => console.warn('Sync bill error:', e)).finally(() => {
      setTimeout(refreshFromBackend, 300);
    });

    return newBill;
  }, [bills.length, journalEntries.length, refreshFromBackend]);

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
      if (!inv || amount <= 0 || inv.status === 'CANCELLED') return null;
      if (amount > inv.balanceDue + 0.01) return null;

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

      apiClient
        .post('/payments', {
          type: 'CUSTOMER_PAYMENT',
          contactId: inv.customerId,
          amount,
          method: journal === 'CASH' ? 'CASH' : 'BANK',
          invoiceId,
          referenceDoc: inv.invoiceNumber,
        })
        .catch((e) => console.warn('Sync payment error:', e))
        .finally(() => {
          setTimeout(refreshFromBackend, 300);
        });

      return payment;
    },
    [invoices, payments.length, journalEntries.length, refreshFromBackend]
  );

  const registerVendorPayment = useCallback(
    (
      billId: string,
      amount: number,
      journal: 'BANK' | 'CASH',
      method: 'HDFC Bank Transfer' | 'Cash Register' | 'UPI'
    ): PaymentItem | null => {
      const b = bills.find((item) => item.id === billId);
      if (!b || amount <= 0 || b.status === 'CANCELLED') return null;
      if (amount > b.balanceDue + 0.01) return null;

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

      apiClient
        .post('/payments', {
          type: 'VENDOR_PAYMENT',
          contactId: b.vendorId,
          amount,
          method: journal === 'CASH' ? 'CASH' : 'BANK',
          billId,
          referenceDoc: b.billNumber,
        })
        .catch((e) => console.warn('Sync vendor payment error:', e))
        .finally(() => {
          setTimeout(refreshFromBackend, 300);
        });

      return payment;
    },
    [bills, payments.length, journalEntries.length, refreshFromBackend]
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
            if (acc.id === targetBankCashAccount) return { ...acc, balance: -amount };
          }
          return acc;
        })
      );

      setJournalEntries((prev) => [newJE, ...prev]);
      setPayments((prev) => [payment, ...prev]);

      apiClient
        .post('/payments', {
          type,
          contactId,
          amount,
          method: journal === 'CASH' ? 'CASH' : 'BANK',
          referenceDoc: docRef,
        })
        .catch((e) => console.warn('Sync direct payment error:', e))
        .finally(() => {
          setTimeout(refreshFromBackend, 300);
        });

      return payment;
    },
    [contacts, payments.length, journalEntries.length, refreshFromBackend]
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

    apiClient
      .post('/contacts', {
        name: c.name,
        type: c.type,
        email: c.email || undefined,
        mobile: c.mobile || undefined,
        city: c.city || undefined,
        state: c.state || undefined,
        pincode: c.pincode || undefined,
      })
      .catch((e) => console.warn('Sync contact error:', e))
      .finally(() => {
        setTimeout(refreshFromBackend, 300);
      });

    return newC;
  }, [refreshFromBackend]);

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

    apiClient
      .post('/budgets/analytic-accounts', {
        name: acc.name,
        type: acc.type,
        description: acc.description,
      })
      .catch((e) => console.warn('Sync analytic account error:', e))
      .finally(() => {
        setTimeout(refreshFromBackend, 300);
      });

    return newAcc;
  }, [refreshFromBackend]);

  const addProduct = useCallback((p: Omit<ProductItem, 'id' | 'isActive'>): ProductItem => {
    const newP: ProductItem = {
      ...p,
      id: `prd-${Date.now()}`,
      isActive: true,
    };
    setProducts((prev) => [newP, ...prev]);

    apiClient
      .post('/products', {
        name: p.name,
        type: p.type,
        salesPrice: p.salesPrice,
        purchasePrice: p.purchasePrice,
        category: p.category,
      })
      .catch((e) => console.warn('Sync product error:', e))
      .finally(() => {
        setTimeout(refreshFromBackend, 300);
      });

    return newP;
  }, [refreshFromBackend]);

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
    period?: string;
    startDate?: string;
    endDate?: string;
    responsible?: string;
    analyticAccount?: string;
    plannedAmount?: number;
    stage?: BudgetStage;
    lines?: BudgetLine[];
  }): BudgetHealthItem => {
    const lines: BudgetLine[] = budget.lines && budget.lines.length > 0 ? budget.lines : [
      {
        id: `bl-${Date.now()}-1`,
        analyticAccountId: 'ana-0',
        analyticAccountName: budget.analyticAccount || 'Furniture Procurement',
        type: 'EXPENSE',
        committedAmount: budget.plannedAmount || 100000,
        achievedAmount: 0,
        achievedPercent: 0,
        amountToAchieve: budget.plannedAmount || 100000,
      },
    ];

    const planned = lines.reduce((s, l) => s + Number(l.committedAmount || 0), 0) || (budget.plannedAmount || 0);
    const actual = lines.reduce((s, l) => s + Number(l.achievedAmount || 0), 0);
    const remaining = planned - actual;
    const utilization = planned > 0 ? Math.round((actual / planned) * 100) : 0;
    const status: 'HEALTHY' | 'WARNING' | 'EXCEEDED' =
      utilization > 100 ? 'EXCEEDED' : utilization >= 80 ? 'WARNING' : 'HEALTHY';

    const newB: BudgetHealthItem = {
      id: `bdg-${Date.now()}`,
      name: budget.name,
      period: budget.period || `${budget.startDate || '2026-01-01'} to ${budget.endDate || '2026-01-31'}`,
      startDate: budget.startDate || '2026-01-01',
      endDate: budget.endDate || '2026-01-31',
      responsible: budget.responsible || 'Mohith (Production Lead)',
      analyticAccount: budget.analyticAccount || lines[0]?.analyticAccountName || 'Furniture Procurement',
      stage: budget.stage || 'DRAFT',
      lines,
      plannedAmount: planned,
      actualAmount: actual,
      remainingAmount: remaining,
      utilization,
      status,
    };
    setBudgets((prev) => [newB, ...prev]);

    apiClient
      .post('/budgeting/budgets', {
        name: budget.name,
        analyticAccount: newB.analyticAccount,
        plannedAmount: planned,
        startDate: newB.startDate,
        endDate: newB.endDate,
        responsibleUser: newB.responsible,
      })
      .catch((e) => console.warn('Sync budget error:', e))
      .finally(() => {
        setTimeout(refreshFromBackend, 300);
      });

    return newB;
  }, [refreshFromBackend]);

  const updateBudget = useCallback((id: string, updates: Partial<BudgetHealthItem>): BudgetHealthItem | undefined => {
    let updatedItem: BudgetHealthItem | undefined;
    setBudgets((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const merged: BudgetHealthItem = { ...b, ...updates };
          if (updates.lines) {
            const planned = updates.lines.reduce((s, l) => s + Number(l.committedAmount || 0), 0);
            const actual = updates.lines.reduce((s, l) => s + Number(l.achievedAmount || 0), 0);
            merged.plannedAmount = planned;
            merged.actualAmount = actual;
            merged.remainingAmount = planned - actual;
            merged.utilization = planned > 0 ? Math.round((actual / planned) * 100) : 0;
            merged.status =
              merged.utilization > 100 ? 'EXCEEDED' : merged.utilization >= 80 ? 'WARNING' : 'HEALTHY';
          }
          updatedItem = merged;
          return merged;
        }
        return b;
      })
    );
    return updatedItem;
  }, []);

  const confirmBudget = useCallback((id: string): BudgetHealthItem | undefined => {
    return updateBudget(id, { stage: 'CONFIRM' });
  }, [updateBudget]);

  const reviseBudget = useCallback(
    (id: string, newCommitted?: number): { oldBudget: BudgetHealthItem; newBudget: BudgetHealthItem } | undefined => {
      const original = budgets.find((b) => b.id === id);
      if (!original) return undefined;

      const revisionId = `bdg-${Date.now()}`;
      const baseName = original.name.replace(/\s*\(Rev\s*\d+\)$/i, '').replace(/\s*Revised(\s*Revised)*$/i, '').trim();
      const existingRevs = budgets.filter(
        (b) => b.name.startsWith(baseName) && (b.revisionOfId === id || b.revisionOfName === original.name)
      );
      const revNum = existingRevs.length + 1;
      const revisionName = `${baseName} (Rev ${revNum})`;

      const revisedLines: BudgetLine[] = (original.lines && original.lines.length > 0
        ? original.lines
        : [
            {
              id: `bl-${Date.now()}-1`,
              analyticAccountId: 'ana-0',
              analyticAccountName: original.analyticAccount || 'Furniture Procurement',
              type: 'EXPENSE',
              committedAmount: original.plannedAmount || 200000,
              achievedAmount: original.actualAmount || 0,
              achievedPercent: original.utilization || 0,
              amountToAchieve: (original.plannedAmount || 200000) - (original.actualAmount || 0),
            },
          ]
      ).map((l, idx): BudgetLine => {
        const comm = newCommitted !== undefined && idx === 0 ? newCommitted : l.committedAmount;
        const ach = l.achievedAmount;
        return {
          id: `line-${Date.now()}-${idx + 1}`,
          analyticAccountId: l.analyticAccountId,
          analyticAccountName: l.analyticAccountName,
          type: (l.type === 'INCOME' ? 'INCOME' : 'EXPENSE') as 'INCOME' | 'EXPENSE',
          committedAmount: comm,
          achievedAmount: ach,
          achievedPercent: comm > 0 ? Math.round((ach / comm) * 10000) / 100 : 0,
          amountToAchieve: comm - ach,
        };
      });

      const planned = revisedLines.reduce((s, l) => s + Number(l.committedAmount || 0), 0);
      const actual = revisedLines.reduce((s, l) => s + Number(l.achievedAmount || 0), 0);
      const remaining = planned - actual;
      const utilization = planned > 0 ? Math.round((actual / planned) * 100) : 0;

      const newRevision: BudgetHealthItem = {
        id: revisionId,
        name: revisionName,
        period: original.period,
        startDate: original.startDate,
        endDate: original.endDate,
        responsible: original.responsible,
        stage: 'CONFIRM',
        revisionOfId: original.id,
        revisionOfName: original.name,
        lines: revisedLines,
        analyticAccount: original.analyticAccount,
        plannedAmount: planned,
        actualAmount: actual,
        remainingAmount: remaining,
        utilization,
        status: utilization > 100 ? 'EXCEEDED' : utilization >= 80 ? 'WARNING' : 'HEALTHY',
      };

      const updatedOld: BudgetHealthItem = {
        ...original,
        stage: 'REVISED',
        revisedWithId: revisionId,
        revisedWithName: revisionName,
      };

      setBudgets((prev) => [
        newRevision,
        ...prev.map((b) => (b.id === id ? updatedOld : b)),
      ]);

      return { oldBudget: updatedOld, newBudget: newRevision };
    },
    [budgets, updateBudget]
  );

  const cancelBudget = useCallback((id: string): BudgetHealthItem | undefined => {
    return updateBudget(id, { stage: 'CANCELED' });
  }, [updateBudget]);

  const resetBudgetToDraft = useCallback((id: string): BudgetHealthItem | undefined => {
    return updateBudget(id, { stage: 'DRAFT' });
  }, [updateBudget]);

  const deleteBudget = useCallback((id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  }, []);

  // ────────────────────────────────────────────────────────
  // ACCOUNTING: CHART OF ACCOUNTS, JOURNALS & MANUAL POSTING
  // ────────────────────────────────────────────────────────
  const addAccount = useCallback(
    (data: {
      name: string;
      code?: string;
      type: AccountItem['type'];
      initialBalance?: number;
    }) => {
      const newId = `acc-${Date.now()}`;
      let prefix = '1';
      if (['ASSET', 'BANK', 'CASH'].includes(data.type)) prefix = '1';
      else if (['LIABILITY', 'CAPITAL', 'EQUITY'].includes(data.type)) prefix = '2';
      else if (data.type === 'INCOME') prefix = '4';
      else prefix = '5';

      const code = data.code || `${prefix}${Math.floor(100 + Math.random() * 900)}`;
      const newAcc: AccountItem = {
        id: newId,
        code,
        name: data.name,
        type: data.type,
        balance: Number(data.initialBalance || 0),
        currency: 'INR',
      };

      setAccounts((prev) => [...prev, newAcc]);
      return newAcc;
    },
    []
  );

  const addJournal = useCallback(
    (data: {
      name: string;
      type: JournalItem['type'];
      defaultAccountId: string;
      code?: string;
    }) => {
      const newId = `jrn-${Date.now()}`;
      const defaultAccount = accounts.find((a) => a.id === data.defaultAccountId);
      const code = data.code || data.type.substring(0, 4).toUpperCase();

      const newJrn: JournalItem = {
        id: newId,
        code,
        name: data.name,
        type: data.type,
        defaultAccountId: data.defaultAccountId,
        defaultAccountName: defaultAccount?.name,
        entriesCount: 0,
      };

      setJournals((prev) => [...prev, newJrn]);
      return newJrn;
    },
    [accounts]
  );

  const createManualJournalEntry = useCallback(
    (entry: {
      date: string;
      journalId: string;
      reference: string;
      status?: 'POSTED' | 'DRAFT';
      partnerId?: string;
      partnerName?: string;
      lines: Array<{
        accountId: string;
        partnerId?: string;
        partnerName?: string;
        debit: number;
        credit: number;
      }>;
    }) => {
      const totalDebit = Number(
        entry.lines.reduce((s, l) => s + Number(l.debit || 0), 0).toFixed(2)
      );
      const totalCredit = Number(
        entry.lines.reduce((s, l) => s + Number(l.credit || 0), 0).toFixed(2)
      );
      const diff = Math.abs(totalDebit - totalCredit);
      if (diff > 0.01) {
        throw new Error(
          `Unbalanced entry! Debit (₹${totalDebit}) must equal Credit (₹${totalCredit}). Discrepancy: ₹${diff.toFixed(2)}`
        );
      }

      const journal = journals.find((j) => j.id === entry.journalId) || journals[0];
      const entrySeq = String(journalEntries.length + 1).padStart(3, '0');
      const entryNumber = `JE-2026-${entrySeq}`;

      let defaultPartnerName = entry.partnerName;
      if (!defaultPartnerName && entry.partnerId) {
        const c = contacts.find((ct) => ct.id === entry.partnerId);
        if (c) defaultPartnerName = c.name;
      }
      if (!defaultPartnerName) {
        const lineWithPartner = entry.lines.find((l) => l.partnerName || l.partnerId);
        if (lineWithPartner) {
          if (lineWithPartner.partnerName) {
            defaultPartnerName = lineWithPartner.partnerName;
          } else if (lineWithPartner.partnerId) {
            const c = contacts.find((ct) => ct.id === lineWithPartner.partnerId);
            if (c) defaultPartnerName = c.name;
          }
        }
      }

      const enrichedLines: JournalLine[] = entry.lines.map((l) => {
        const acc = accounts.find((a) => a.id === l.accountId);
        let pName = l.partnerName;
        if (!pName && l.partnerId) {
          const c = contacts.find((ct) => ct.id === l.partnerId);
          if (c) pName = c.name;
        }
        return {
          accountId: l.accountId,
          accountCode: acc?.code || '',
          accountName: acc?.name || 'Account',
          partnerId: l.partnerId,
          partnerName: pName,
          debit: Number(l.debit || 0),
          credit: Number(l.credit || 0),
        };
      });

      const entryStatus = entry.status || 'POSTED';
      const newJE: JournalEntry = {
        id: `je-${Date.now()}`,
        entryNumber,
        date: entry.date,
        reference: entry.reference,
        partnerName: defaultPartnerName,
        journalCode: journal ? journal.code : 'MISC',
        journalName: journal ? journal.name : 'Miscellaneous Operations',
        status: entryStatus,
        lines: enrichedLines,
        totalDebit,
        totalCredit,
        isBalanced: true,
      };

      if (entryStatus === 'POSTED') {
        // Update account balances according to standard accounting equation
        setAccounts((prev) =>
          prev.map((acc) => {
            const linesForAcc = enrichedLines.filter((l) => l.accountId === acc.id);
            if (linesForAcc.length === 0) return acc;
            let change = 0;
            linesForAcc.forEach((l) => {
              if (['ASSET', 'EXPENSE', 'BANK', 'CASH', 'OTHER_EXPENSE'].includes(acc.type)) {
                change += l.debit - l.credit;
              } else {
                change += l.credit - l.debit;
              }
            });
            return {
              ...acc,
              balance: Number((acc.balance + change).toFixed(2)),
            };
          })
        );

        // Increment entriesCount on the targeted journal
        setJournals((prev) =>
          prev.map((j) =>
            j.id === entry.journalId ? { ...j, entriesCount: j.entriesCount + 1 } : j
          )
        );

        // Fire and forget backend sync if online
        apiClient
          .post('/accounting/journal-entries', {
            journalId: entry.journalId,
            date: entry.date,
            reference: entry.reference,
            lines: enrichedLines.map((l) => ({
              accountId: l.accountId,
              debit: l.debit,
              credit: l.credit,
              description: entry.reference,
            })),
          })
          .catch(() => {
            // In-memory/localStorage state already recorded
          });
      }

      // Prepend new entry
      setJournalEntries((prev) => [newJE, ...prev]);

      return newJE;
    },
    [accounts, contacts, journalEntries.length, journals]
  );

  const postJournalEntry = useCallback(
    (entryId: string) => {
      setJournalEntries((prevEntries) => {
        const target = prevEntries.find((je) => je.id === entryId);
        if (!target || target.status === 'POSTED') return prevEntries;

        // Apply ledger balance updates if entry is balanced
        if (target.isBalanced && target.lines.length > 0) {
          setAccounts((prevAccounts) =>
            prevAccounts.map((acc) => {
              const linesForAcc = target.lines.filter((l) => l.accountId === acc.id);
              if (linesForAcc.length === 0) return acc;
              let change = 0;
              linesForAcc.forEach((l) => {
                if (['ASSET', 'EXPENSE', 'BANK', 'CASH', 'OTHER_EXPENSE'].includes(acc.type)) {
                  change += l.debit - l.credit;
                } else {
                  change += l.credit - l.debit;
                }
              });
              return {
                ...acc,
                balance: Number((acc.balance + change).toFixed(2)),
              };
            })
          );

          // Increment journal count
          setJournals((prevJournals) =>
            prevJournals.map((j) =>
              j.name.toLowerCase() === target.journalName.toLowerCase() || j.code === target.journalCode
                ? { ...j, entriesCount: j.entriesCount + 1 }
                : j
            )
          );
        }

        return prevEntries.map((je) =>
          je.id === entryId ? { ...je, status: 'POSTED' } : je
        );
      });
    },
    []
  );

  const resetJournalEntryToDraft = useCallback(
    (entryId: string) => {
      setJournalEntries((prevEntries) => {
        const target = prevEntries.find((je) => je.id === entryId);
        if (!target || target.status === 'DRAFT') return prevEntries;

        // Revert ledger balance updates
        if (target.isBalanced && target.lines.length > 0) {
          setAccounts((prevAccounts) =>
            prevAccounts.map((acc) => {
              const linesForAcc = target.lines.filter((l) => l.accountId === acc.id);
              if (linesForAcc.length === 0) return acc;
              let change = 0;
              linesForAcc.forEach((l) => {
                if (['ASSET', 'EXPENSE', 'BANK', 'CASH', 'OTHER_EXPENSE'].includes(acc.type)) {
                  change += l.debit - l.credit;
                } else {
                  change += l.credit - l.debit;
                }
              });
              return {
                ...acc,
                balance: Number((acc.balance - change).toFixed(2)),
              };
            })
          );

          // Decrement journal count
          setJournals((prevJournals) =>
            prevJournals.map((j) =>
              (j.name.toLowerCase() === target.journalName.toLowerCase() || j.code === target.journalCode) && j.entriesCount > 0
                ? { ...j, entriesCount: j.entriesCount - 1 }
                : j
            )
          );
        }

        return prevEntries.map((je) =>
          je.id === entryId ? { ...je, status: 'DRAFT' } : je
        );
      });
    },
    []
  );

  // ────────────────────────────────────────────────────────
  // DYNAMIC DASHBOARD METRICS CALCULATION
  // ────────────────────────────────────────────────────────
  const getDashboardMetricsData = useCallback(() => {
    const revenueAccounts = accounts.filter((a) => a.type === 'INCOME');
    const revenue = revenueAccounts.reduce((sum, a) => sum + a.balance, 0);

    const expenseAccounts = accounts.filter(
      (a) => a.type === 'EXPENSE' || a.type === 'OTHER_EXPENSE'
    );
    const expenses = expenseAccounts.reduce((sum, a) => sum + a.balance, 0);

    const netProfit = revenue - expenses;

    const cashBankAccs = accounts.filter(
      (a) => a.id === 'acc-1001' || a.id === 'acc-1002' || a.type === 'BANK' || a.type === 'CASH'
    );
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
        updateBudget,
        confirmBudget,
        reviseBudget,
        cancelBudget,
        resetBudgetToDraft,
        deleteBudget,
        addAccount,
        addJournal,
        createManualJournalEntry,
        postJournalEntry,
        resetJournalEntryToDraft,
        getDashboardMetricsData,
        refreshERPData: refreshFromBackend,
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
