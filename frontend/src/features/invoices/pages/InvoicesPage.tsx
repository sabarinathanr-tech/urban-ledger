import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  FileText,
  CreditCard,
  CheckCircle2,
  X,
  Printer,
  User,
  Calendar,
  ExternalLink,
  ShoppingCart,
  PieChart,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TaxInvoiceDocument } from '@/components/documents/TaxInvoiceDocument';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { useERP } from '@/context/ERPContext';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/app/config';
import type { Invoice } from '@/data/erpData';
import { OdooControlPanel, type ViewMode } from '@/components/layout/OdooControlPanel';

export function InvoicesPage() {
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { isContact, user } = useAuth();
  const {
    invoices,
    createInvoice,
    registerCustomerPayment,
    payments,
    contacts,
    products,
    analyticAccounts,
    addContact,
    addProduct,
    addAnalyticAccount,
    refreshERPData,
  } = useERP();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [activePaymentInvoice, setActivePaymentInvoice] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentJournal, setPaymentJournal] = useState<'BANK' | 'CASH'>('BANK');
  const [paymentMethod, setPaymentMethod] = useState<'HDFC Bank Transfer' | 'Cash Register' | 'UPI'>('HDFC Bank Transfer');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentNote, setPaymentNote] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // New Invoice Form state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const eligibleCustomers = contacts.filter((c) => c.type === 'CUSTOMER' || c.type === 'BOTH');
  const [newCustomerId, setNewCustomerId] = useState(eligibleCustomers[0]?.id || contacts[0]?.id || '');
  const [newProductId, setNewProductId] = useState(products[0]?.id || '');
  const [newQuantity, setNewQuantity] = useState(1);
  const [newInvoiceReference, setNewInvoiceReference] = useState('ABC-26-001');
  const [newAnalyticId, setNewAnalyticId] = useState(analyticAccounts[0]?.id || '');

  // Custom / Other Entry States
  const [customCustomerName, setCustomCustomerName] = useState('');
  const [customCustomerCity, setCustomCustomerCity] = useState('');
  const [customProductName, setCustomProductName] = useState('');
  const [customProductPrice, setCustomProductPrice] = useState(15000);
  const [customProductCategory, setCustomProductCategory] = useState('Custom Furniture');
  const [customAnalyticName, setCustomAnalyticName] = useState('');

  useEffect(() => {
    if (!newCustomerId && (eligibleCustomers[0]?.id || contacts[0]?.id)) {
      setNewCustomerId(eligibleCustomers[0]?.id || contacts[0]?.id);
    }
  }, [newCustomerId, eligibleCustomers, contacts]);

  useEffect(() => {
    if (!newProductId && products[0]?.id) {
      setNewProductId(products[0]?.id);
    }
  }, [newProductId, products]);

  // Route triggers
  useEffect(() => {
    if (location.pathname === ROUTES.INVOICES_NEW) {
      setIsCreateModalOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (id) {
      const found = invoices.find(
        (inv) => inv.id === id || inv.invoiceNumber.toLowerCase() === id.toLowerCase()
      );
      if (found) {
        setSelectedInvoice(found);
      }
    }
  }, [id, invoices]);

  // If Contact portal, filter strictly to customer's own invoices
  const isCustomerContact = isContact && (user?.contactType === 'CUSTOMER' || user?.contactType === 'BOTH' || !user?.contactType);
  const userContactId = (user as any)?.contact?.id || (user as any)?.contactId;
  const userEmail = user?.email?.toLowerCase();
  const userName = (user?.fullName || (user as any)?.name || '').trim().toLowerCase();

  const relevantInvoices = isContact
    ? isCustomerContact
      ? invoices.filter((inv) => {
          if (userContactId && inv.customerId === userContactId) return true;
          if (userEmail && (inv as any).customerEmail?.toLowerCase() === userEmail) return true;
          if (userName && userName.length > 2 && inv.customerName.toLowerCase().includes(userName)) return true;
          return false;
        })
      : [] // Vendor contacts see 0 customer invoices
    : invoices;

  const filteredInvoices = relevantInvoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: Invoice['status']): 'default' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'outline' => {
    switch (status) {
      case 'PAID':
        return 'success';
      case 'POSTED':
        return 'info';
      case 'PARTIALLY_PAID':
        return 'warning';
      case 'OVERDUE':
        return 'danger';
      default:
        return 'default';
    }
  };

  const handleOpenPayment = (inv: Invoice) => {
    setActivePaymentInvoice(inv);
    setPaymentAmount(inv.balanceDue);
    setPaymentNote(`Receipt for ${inv.invoiceNumber}`);
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setPaymentModalOpen(true);
  };

  const handleRegisterPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePaymentInvoice || paymentAmount <= 0) return;

    const payment = registerCustomerPayment(
      activePaymentInvoice.id,
      paymentAmount,
      paymentJournal,
      paymentMethod
    );

    if (payment) {
      setPaymentModalOpen(false);
      setNotice(`Payment of ₹${paymentAmount.toLocaleString('en-IN')} successfully settled for ${activePaymentInvoice.invoiceNumber}.`);
      setTimeout(() => setNotice(null), 5000);
      if (selectedInvoice && selectedInvoice.id === activePaymentInvoice.id) {
        setSelectedInvoice({
          ...selectedInvoice,
          amountPaid: selectedInvoice.amountPaid + paymentAmount,
          balanceDue: Math.max(0, selectedInvoice.balanceDue - paymentAmount),
          status: selectedInvoice.balanceDue - paymentAmount <= 0 ? 'PAID' : 'PARTIALLY_PAID',
        });
      }
    }
  };

  const handleCreateDirectInvoice = (e: React.FormEvent) => {
    e.preventDefault();

    let cust = contacts.find((c) => c.id === newCustomerId);
    if (newCustomerId === '__OTHER__') {
      if (!customCustomerName.trim()) return;
      cust = addContact({
        name: customCustomerName.trim(),
        type: 'CUSTOMER',
        email: `${customCustomerName.trim().toLowerCase().replace(/\s+/g, '')}@client.com`,
        mobile: '+91 98765 43210',
        city: customCustomerCity.trim() || 'Coimbatore',
        state: 'Tamil Nadu',
        pincode: '641001',
      });
    }

    let prod = products.find((p) => p.id === newProductId);
    if (newProductId === '__OTHER__') {
      if (!customProductName.trim()) return;
      const salesP = Number(customProductPrice) || 5000;
      prod = addProduct({
        name: customProductName.trim(),
        salesPrice: salesP,
        purchasePrice: Math.round(salesP * 0.65),
        category: customProductCategory.trim() || 'Custom Orders',
        type: 'GOODS',
        stock: 25,
      });
    }

    if (!cust || !prod) return;

    let chosenAnalytic = analyticAccounts.find((a) => a.id === newAnalyticId);
    if (newAnalyticId === '__OTHER__') {
      if (customAnalyticName.trim()) {
        chosenAnalytic = addAnalyticAccount({
          name: customAnalyticName.trim(),
          type: 'INCOME',
          description: 'Custom revenue stream created via direct invoice',
        });
      } else {
        chosenAnalytic = analyticAccounts[0];
      }
    } else if (!chosenAnalytic) {
      chosenAnalytic = analyticAccounts[0];
    }

    const subtotal = prod.salesPrice * newQuantity;
    const taxAmount = Math.round(subtotal * 0.18);
    const grandTotal = subtotal + taxAmount;

    const line = {
      id: `invl-${Date.now()}`,
      productId: prod.id,
      productName: prod.name,
      quantity: newQuantity,
      unitPrice: prod.salesPrice,
      taxRate: 18,
      subtotal,
      taxAmount,
      total: grandTotal,
      analyticAccountId: chosenAnalytic?.id,
      analyticAccountName: chosenAnalytic ? (chosenAnalytic.code ? `${chosenAnalytic.code} - ${chosenAnalytic.name}` : chosenAnalytic.name) : 'General Commercial Operations',
      chartOfAccount: 'Sales Account (Revenue)',
    };

    const newInv = createInvoice({
      customerId: cust.id,
      customerName: cust.name,
      invoiceReference: newInvoiceReference || 'ABC-26-001',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      status: 'POSTED',
      lines: [line],
      subtotal,
      taxTotal: taxAmount,
      grandTotal,
      amountPaid: 0,
      balanceDue: grandTotal,
    });

    setIsCreateModalOpen(false);
    if (location.pathname === ROUTES.INVOICES_NEW) {
      navigate(ROUTES.INVOICES);
    }
    setSelectedInvoice(newInv);
    setNotice(`Customer Invoice ${newInv.invoiceNumber} posted with balanced GL entry.`);
    setTimeout(() => setNotice(null), 5000);
  };

  const closeDetail = () => {
    setSelectedInvoice(null);
    if (id) {
      navigate(ROUTES.INVOICES);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-surface-secondary">
      {/* Odoo Control Panel */}
      <OdooControlPanel
        title={isContact ? 'My Invoices' : 'Customer Invoices'}
        subtitle={
          isContact
            ? 'Invoices billed to your account and settlement options'
            : 'Tax invoices, accounts receivable, and customer payment reconciliation'
        }
        itemCount={filteredInvoices.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search invoice #, customer..."
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewClick={
          !isContact
            ? () => {
                navigate(ROUTES.INVOICES_NEW);
                setIsCreateModalOpen(true);
              }
            : undefined
        }
        newButtonLabel="New Invoice"
        filterOptions={[
          { label: 'All', value: 'ALL' },
          { label: 'Unpaid / Open', value: 'POSTED' },
          { label: 'Partially Paid', value: 'PARTIALLY_PAID' },
          { label: 'Fully Paid', value: 'PAID' },
        ]}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
        onRefresh={refreshERPData}
      />

      {/* Main Content Area */}
      <div className="flex-1 px-4 sm:px-6 pt-4 pb-8 space-y-4 w-full max-w-7xl mx-auto">
        {notice && (
          <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 shadow-2xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
              <span className="font-medium">{notice}</span>
            </div>
            <button onClick={() => setNotice(null)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">
              <X size={14} />
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/* KANBAN VIEW (Odoo-Style Customer Invoice Cards)              */}
        {/* ============================================================ */}
        {viewMode === 'kanban' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredInvoices.length === 0 ? (
              <div className="col-span-full py-12 text-center text-xs text-text-muted bg-white rounded-lg border border-surface-border">
                No invoices found matching criteria.
              </div>
            ) : (
              filteredInvoices.map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className="group bg-white rounded-lg border border-surface-border hover:border-navy-400 hover:shadow-md transition-all p-4 flex flex-col justify-between cursor-pointer relative overflow-hidden"
                >
                  <div className="space-y-2.5">
                    {/* Top Row: Invoice # and Status Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <FileText size={15} className="text-navy-600" />
                        <span className="font-mono font-bold text-sm text-navy-950 group-hover:text-brand-700 transition-colors">
                          {inv.invoiceNumber}
                        </span>
                      </div>
                      <Badge variant={getStatusBadgeVariant(inv.status)} className="text-[10px] px-1.5 py-0 font-semibold">
                        {inv.status}
                      </Badge>
                    </div>

                    {/* Customer Identity */}
                    <div className="flex items-center gap-1.5 text-xs text-navy-800 font-semibold truncate pt-1">
                      <User size={13} className="text-text-muted shrink-0" />
                      <span className="truncate">{inv.customerName}</span>
                    </div>

                    {/* Dates */}
                    <div className="flex items-center justify-between text-[11px] text-text-muted pt-1 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} /> {inv.issueDate}
                      </span>
                      <span>Due: {inv.dueDate}</span>
                    </div>
                  </div>

                  {/* Financial Amounts & Action */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between">
                    <div>
                      <span className="text-[10px] text-text-muted block uppercase tracking-wider font-semibold">Total Invoice</span>
                      <span className="font-mono font-bold text-sm text-navy-900">
                        ₹{inv.grandTotal.toLocaleString('en-IN')}
                      </span>
                      {inv.balanceDue > 0 && (
                        <div className="text-[11px] font-mono text-red-600 font-medium mt-0.5">
                          Due: ₹{inv.balanceDue.toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      {inv.balanceDue > 0 && (
                        <Button
                          size="sm"
                          onClick={() => handleOpenPayment(inv)}
                          className="h-7 text-[11px] px-2.5 bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white font-medium cursor-pointer shadow-2xs"
                        >
                          <CreditCard size={11} className="mr-1" />
                          Pay
                        </Button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setIsPrintModalOpen(true);
                        }}
                        title="Print / Export Tax Invoice PDF"
                        className="p-1.5 rounded-md text-text-muted hover:text-navy-900 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <Printer size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* LIST VIEW (Table)                                           */}
        {/* ============================================================ */}
        {viewMode === 'list' && (
          <div className="rounded-lg border border-surface-border bg-white shadow-2xs overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Total (incl. GST)</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right">Balance Due</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="py-8 text-center text-xs text-text-muted">
                      No invoices found matching criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((inv) => (
                    <TableRow
                      key={inv.id}
                      onClick={() => setSelectedInvoice(inv)}
                      className="cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <TableCell className="font-mono text-xs font-semibold text-brand-700">
                        {inv.invoiceNumber}
                      </TableCell>
                      <TableCell className="font-medium text-navy-900 text-xs">{inv.customerName}</TableCell>
                      <TableCell className="text-xs text-text-muted">{inv.issueDate}</TableCell>
                      <TableCell className="text-xs text-text-muted">{inv.dueDate}</TableCell>
                      <TableCell className="text-right font-mono text-xs font-bold text-navy-900">
                        ₹{inv.grandTotal.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs text-emerald-700 font-semibold">
                        ₹{inv.amountPaid.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs font-semibold text-red-600">
                        ₹{inv.balanceDue.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={getStatusBadgeVariant(inv.status)}>{inv.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedInvoice(inv)}
                            className="h-7 text-[11px] px-2 cursor-pointer"
                          >
                            View
                          </Button>
                          {inv.balanceDue > 0 && (
                            <Button
                              size="sm"
                              onClick={() => handleOpenPayment(inv)}
                              className="h-7 text-[11px] px-2 bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white cursor-pointer"
                            >
                              <CreditCard size={11} className="mr-1" />
                              Pay
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setIsPrintModalOpen(true);
                            }}
                            className="h-7 text-[11px] px-2 text-text-muted hover:text-navy-900 cursor-pointer"
                          >
                            <Printer size={12} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* CUSTOMER INVOICE DETAIL VIEW                                 */}
      {/* ============================================================ */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-3xl rounded-xl border border-surface-border bg-white p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Top Row: Smart Buttons on top right & Close */}
            <div className="flex items-center justify-between border-b border-surface-border pb-4">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={closeDetail}
                  className="h-8 text-xs font-medium cursor-pointer border-slate-300"
                >
                  <ArrowLeft size={13} className="mr-1" />
                  Back
                </Button>
                <div>
                  <h3 className="text-lg font-bold text-navy-900 leading-tight">{selectedInvoice.invoiceNumber}</h3>
                  <p className="text-xs text-text-muted">Customer Tax Invoice</p>
                </div>
              </div>

              {/* Smart Buttons Top Right matching diagram */}
              <div className="flex items-center gap-2">
                {selectedInvoice.soId && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/sales/${selectedInvoice.soId}`)}
                    className="h-8 text-xs font-semibold text-brand-700 border-brand-300 bg-brand-50/50 hover:bg-brand-100/70 cursor-pointer shadow-2xs"
                    title={`Source Sales Order: ${selectedInvoice.soNumber || selectedInvoice.soId}`}
                  >
                    <ShoppingCart size={13} className="mr-1 text-brand-600" />
                    SO ({selectedInvoice.soNumber || 'SO'})
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(ROUTES.BUDGETS)}
                  className="h-8 text-xs font-semibold text-indigo-700 border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/70 cursor-pointer shadow-2xs"
                  title="View Budget Analytics"
                >
                  <PieChart size={13} className="mr-1 text-indigo-600" />
                  Budget
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPrintModalOpen(true)}
                  className="h-8 text-xs flex items-center gap-1 cursor-pointer border-slate-300"
                >
                  <Printer size={13} />
                  <span>Print</span>
                </Button>
                <button onClick={closeDetail} className="text-text-muted hover:text-navy-900 p-1 cursor-pointer">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Customer Invoice Master Fields:
                Customer Invoice No., Customer Name, Status (Paid, Partial, Not Paid), Invoice Reference, Invoice Date, Due Date */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-slate-50/80 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Customer Invoice No.</span>
                <p className="font-mono font-bold text-sm text-navy-950 mt-1">{selectedInvoice.invoiceNumber}</p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Customer Name</span>
                <p className="font-semibold text-sm text-navy-950 mt-1">{selectedInvoice.customerName}</p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Status</span>
                <div className="mt-1">
                  <Badge
                    className={
                      selectedInvoice.balanceDue === 0
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold'
                        : selectedInvoice.amountPaid > 0
                        ? 'bg-amber-100 text-amber-800 border-amber-300 font-semibold'
                        : 'bg-rose-100 text-rose-800 border-rose-300 font-semibold'
                    }
                  >
                    {selectedInvoice.balanceDue === 0 ? 'Paid' : selectedInvoice.amountPaid > 0 ? 'Partial' : 'Not Paid'}
                  </Badge>
                </div>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Invoice Reference</span>
                <p className="font-mono font-medium text-xs text-navy-800 mt-1">{selectedInvoice.invoiceReference || 'ABC-26-001'}</p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Invoice Date</span>
                <p className="font-medium text-xs text-navy-800 mt-1">{selectedInvoice.issueDate}</p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Due Date</span>
                <p className="font-medium text-xs text-navy-800 mt-1">{selectedInvoice.dueDate}</p>
              </div>
            </div>

            {/* Line Items Table:
                Columns: Sr. No., Product, Chart of Accounts, Budget Analytics, Qty, Unit Price, Subtotal */}
            <div>
              <span className="text-xs font-bold text-navy-900 uppercase tracking-wider block mb-2">
                Itemized Products & Revenue Allocation
              </span>
              <div className="rounded-xl border border-surface-border overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/80 border-b border-surface-border text-navy-700 font-semibold">
                    <tr>
                      <th className="p-3 text-center w-12">Sr. No.</th>
                      <th className="p-3">Product</th>
                      <th className="p-3">Chart of Accounts</th>
                      <th className="p-3">Budget Analytics</th>
                      <th className="p-3 text-right">Qty</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {selectedInvoice.lines.map((ln, idx) => {
                      const lineSubtotal = ln.subtotal || (ln.quantity * ln.unitPrice);
                      const cleanAnalytic = ln.analyticAccountName && !ln.analyticAccountName.includes('Expense')
                        ? ln.analyticAccountName
                        : 'Commercial Furniture Sales (Income)';
                      return (
                        <tr key={ln.id} className="hover:bg-slate-50/60">
                          <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                          <td className="p-3 font-semibold text-navy-900">{ln.productName}</td>
                          <td className="p-3 text-xs text-slate-600">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                              {ln.chartOfAccount || 'Sales Account (Revenue)'}
                            </span>
                          </td>
                          <td className="p-3 text-xs text-navy-700">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {cleanAnalytic}
                            </span>
                          </td>
                          <td className="p-3 text-right font-mono font-medium">{ln.quantity}</td>
                          <td className="p-3 text-right font-mono text-slate-700">₹{ln.unitPrice.toLocaleString('en-IN')}</td>
                          <td className="p-3 text-right font-mono font-bold text-navy-950">
                            ₹{lineSubtotal.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals Breakdown matching mockup:
                Total, Paid Via Cash, Paid Via Bank, Amount Due */}
            {(() => {
              const invPayments = payments.filter(
                (p) => p.documentRef === selectedInvoice.invoiceNumber || p.documentRef === selectedInvoice.id
              );
              const paidCash = invPayments.filter((p) => p.journal === 'CASH').reduce((s, p) => s + p.amount, 0);
              const paidBank =
                invPayments.filter((p) => p.journal === 'BANK').reduce((s, p) => s + p.amount, 0) ||
                Math.max(0, selectedInvoice.amountPaid - paidCash);

              return (
                <div className="flex justify-end">
                  <div className="w-full sm:w-72 p-4 bg-slate-50/90 rounded-xl border border-slate-200 text-xs space-y-2">
                    <div className="flex justify-between text-navy-700 font-semibold">
                      <span>Total Invoice</span>
                      <span className="font-mono">₹{selectedInvoice.grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Paid Via Cash</span>
                      <span className="font-mono text-emerald-700 font-medium">₹{paidCash.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Paid Via Bank</span>
                      <span className="font-mono text-emerald-700 font-medium">₹{paidBank.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-navy-950 pt-2 border-t border-slate-200">
                      <span>Amount Due</span>
                      <span className={`font-mono ${selectedInvoice.balanceDue > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        ₹{selectedInvoice.balanceDue.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-surface-border">
              <Link
                to={`${ROUTES.ACCOUNTING}/one-truth`}
                className="text-xs text-brand-700 hover:underline flex items-center gap-1"
              >
                <span>View One-Truth Double-Entry</span>
                <ExternalLink size={11} />
              </Link>
              <div className="flex items-center gap-2">
                {selectedInvoice.balanceDue > 0 && (
                  <Button
                    size="sm"
                    onClick={() => handleOpenPayment(selectedInvoice)}
                    className="bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white text-xs font-semibold cursor-pointer shadow-2xs"
                  >
                    <CreditCard size={13} className="mr-1.5" />
                    Pay
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={closeDetail} className="cursor-pointer">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* REGISTER CUSTOMER PAYMENT MODAL matching diagram             */}
      {/* ============================================================ */}
      {paymentModalOpen && activePaymentInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-xl border border-surface-border bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div>
                <h3 className="text-base font-bold text-navy-900">Payment Form</h3>
                <p className="text-xs text-text-muted">Settlement voucher for {activePaymentInvoice.invoiceNumber}</p>
              </div>
              <button onClick={() => setPaymentModalOpen(false)} className="text-text-muted hover:text-navy-900 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Stepper matching mockup: Draft -> Confirm -> Canceled */}
            <div className="flex items-center justify-center gap-2 py-1 border-b border-slate-100 text-xs">
              <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-medium">Draft</span>
              <span className="text-slate-400">&rarr;</span>
              <span className="px-2.5 py-1 rounded bg-brand-50 text-brand-700 font-bold border border-brand-200">Confirm</span>
              <span className="text-slate-400">&rarr;</span>
              <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-400 font-medium">Canceled</span>
            </div>

            <form onSubmit={handleRegisterPayment} className="space-y-3.5 text-xs">
              {/* Payment Type: Radio Send / Receive */}
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Payment Type *</label>
                <div className="flex items-center gap-4 pt-0.5">
                  <label className="flex items-center gap-2 cursor-not-allowed opacity-40">
                    <input type="radio" name="paymentTypeRadio" disabled />
                    <span>Send</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentTypeRadio"
                      checked={true}
                      readOnly
                      className="text-brand-700 focus:ring-brand-500"
                    />
                    <span className="font-semibold text-navy-900">Receive (Customer Receipt)</span>
                  </label>
                </div>
              </div>

              {/* Partner */}
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Partner *</label>
                <input
                  type="text"
                  readOnly
                  value={activePaymentInvoice.customerName}
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-navy-900"
                />
              </div>

              {/* Amount & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    min={1}
                    max={activePaymentInvoice.balanceDue}
                    required
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs font-mono font-bold text-navy-950 focus:border-brand-600 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">Max Due: ₹{activePaymentInvoice.balanceDue.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Via: Bank / Cash */}
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Payment Via *</label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    onClick={() => {
                      setPaymentJournal('BANK');
                      setPaymentMethod('HDFC Bank Transfer');
                    }}
                    className={`flex items-center justify-center p-2.5 rounded-lg border cursor-pointer font-medium text-xs transition ${
                      paymentJournal === 'BANK'
                        ? 'border-brand-600 bg-brand-50/70 text-brand-800 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    🏦 Bank
                  </label>
                  <label
                    onClick={() => {
                      setPaymentJournal('CASH');
                      setPaymentMethod('Cash Register');
                    }}
                    className={`flex items-center justify-center p-2.5 rounded-lg border cursor-pointer font-medium text-xs transition ${
                      paymentJournal === 'CASH'
                        ? 'border-brand-600 bg-brand-50/70 text-brand-800 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    💵 Cash
                  </label>
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Note (Alphanumeric)</label>
                <input
                  type="text"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  placeholder="e.g. Receipt for INV/2026/0001"
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-600 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-[11px] text-emerald-900">
                <span className="font-semibold">Double-Entry Posting:</span> Debit {paymentJournal === 'BANK' ? 'Bank' : 'Cash'} A/c &bull; Credit Debtors / Sales A/c.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setPaymentModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white font-semibold cursor-pointer">
                  Confirm
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* DIRECT INVOICE CREATION MODAL                                */}
      {/* ============================================================ */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-xl border border-surface-border bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div>
                <h3 className="text-base font-bold text-navy-900">Create Tax Invoice</h3>
                <p className="text-xs text-text-muted">Direct invoice billing with auto-journal entry</p>
              </div>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  if (location.pathname === ROUTES.INVOICES_NEW) navigate(ROUTES.INVOICES);
                }}
                className="text-text-muted hover:text-navy-900 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateDirectInvoice} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Customer *</label>
                <select
                  value={newCustomerId}
                  onChange={(e) => setNewCustomerId(e.target.value)}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none cursor-pointer"
                >
                  <option value="__OTHER__">➕ Other (Enter New Customer Details...)</option>
                  {contacts
                    .filter((c) => c.type === 'CUSTOMER' || c.type === 'BOTH')
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.city})
                      </option>
                    ))}
                </select>
                {newCustomerId === '__OTHER__' && (
                  <div className="mt-2 grid grid-cols-2 gap-2 p-2.5 rounded-md bg-brand-50/60 border border-brand-200">
                    <div className="col-span-2">
                      <label className="block text-[11px] font-semibold text-brand-900 mb-0.5">Customer Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Apex Corporation Pvt Ltd"
                        value={customCustomerName}
                        onChange={(e) => setCustomCustomerName(e.target.value)}
                        className="w-full rounded border border-brand-300 bg-white px-2 py-1 text-xs text-navy-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-brand-900 mb-0.5">City</label>
                      <input
                        type="text"
                        placeholder="e.g. Coimbatore"
                        value={customCustomerCity}
                        onChange={(e) => setCustomCustomerCity(e.target.value)}
                        className="w-full rounded border border-brand-300 bg-white px-2 py-1 text-xs text-navy-900 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Invoice Reference *</label>
                <input
                  type="text"
                  required
                  value={newInvoiceReference}
                  onChange={(e) => setNewInvoiceReference(e.target.value)}
                  placeholder="e.g. ABC-26-001"
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs font-mono text-navy-900 focus:border-navy-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Product Item *</label>
                <select
                  value={newProductId}
                  onChange={(e) => setNewProductId(e.target.value)}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none cursor-pointer"
                >
                  <option value="__OTHER__">➕ Other (Enter Custom Product Details...)</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ₹{p.salesPrice.toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
                {newProductId === '__OTHER__' && (
                  <div className="mt-2 grid grid-cols-2 gap-2 p-2.5 rounded-md bg-brand-50/60 border border-brand-200">
                    <div className="col-span-2">
                      <label className="block text-[11px] font-semibold text-brand-900 mb-0.5">Product Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ergonomic Walnut Standing Desk"
                        value={customProductName}
                        onChange={(e) => setCustomProductName(e.target.value)}
                        className="w-full rounded border border-brand-300 bg-white px-2 py-1 text-xs text-navy-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-brand-900 mb-0.5">Unit Price (₹) *</label>
                      <input
                        type="number"
                        min={100}
                        required
                        value={customProductPrice}
                        onChange={(e) => setCustomProductPrice(Number(e.target.value))}
                        className="w-full rounded border border-brand-300 bg-white px-2 py-1 text-xs font-mono text-navy-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-brand-900 mb-0.5">Category</label>
                      <input
                        type="text"
                        placeholder="e.g. Desks & Workstations"
                        value={customProductCategory}
                        onChange={(e) => setCustomProductCategory(e.target.value)}
                        className="w-full rounded border border-brand-300 bg-white px-2 py-1 text-xs text-navy-900 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Budget Analytics Account *</label>
                <select
                  value={newAnalyticId}
                  onChange={(e) => setNewAnalyticId(e.target.value)}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none cursor-pointer"
                >
                  <option value="__OTHER__">➕ Other (Enter Custom Analytic Account...)</option>
                  <optgroup label="Revenue & Income Analytics (Recommended for Invoices)">
                    {analyticAccounts
                      .filter((a) => a.type === 'INCOME')
                      .map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Other Project Analytics">
                    {analyticAccounts
                      .filter((a) => a.type !== 'INCOME')
                      .map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name} ({a.type})
                        </option>
                      ))}
                  </optgroup>
                </select>
                {newAnalyticId === '__OTHER__' && (
                  <div className="mt-2 p-2.5 rounded-md bg-brand-50/60 border border-brand-200">
                    <label className="block text-[11px] font-semibold text-brand-900 mb-0.5">Analytic Stream Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Luxury Showroom Direct Revenue"
                      value={customAnalyticName}
                      onChange={(e) => setCustomAnalyticName(e.target.value)}
                      className="w-full rounded border border-brand-300 bg-white px-2 py-1 text-xs text-navy-900 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Quantity (Max 1,000 units)</label>
                <input
                  type="number"
                  min={1}
                  max={1000}
                  required
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(Math.min(1000, Math.max(1, Number(e.target.value))))}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs font-mono text-navy-900 focus:border-navy-600 focus:outline-none"
                />
              </div>

              {(() => {
                const activePrice = newProductId === '__OTHER__'
                  ? (Number(customProductPrice) || 0)
                  : (products.find((p) => p.id === newProductId)?.salesPrice || 0);
                const calcSubtotal = activePrice * newQuantity;
                const calcTax = Math.round(calcSubtotal * 0.18);
                const calcTotal = calcSubtotal + calcTax;
                return (
                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between text-navy-600">
                      <span>Subtotal</span>
                      <span className="font-mono">₹{calcSubtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-navy-600">
                      <span>Output GST (18%)</span>
                      <span className="font-mono">₹{calcTax.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between font-bold text-navy-900 pt-1 border-t border-slate-200">
                      <span>Estimated Grand Total</span>
                      <span className="font-mono">₹{calcTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                );
              })()}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    if (location.pathname === ROUTES.INVOICES_NEW) navigate(ROUTES.INVOICES);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white cursor-pointer font-semibold">
                  Generate & Post Invoice
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAX INVOICE PRINT & PDF DOCUMENT MODAL                       */}
      {/* ============================================================ */}
      {isPrintModalOpen && selectedInvoice && (
        <TaxInvoiceDocument
          documentType="INVOICE"
          documentNumber={selectedInvoice.invoiceNumber}
          date={selectedInvoice.issueDate}
          dueDate={selectedInvoice.dueDate}
          partnerName={selectedInvoice.customerName}
          partnerAddress="Mumbai, Maharashtra - 400001"
          lines={selectedInvoice.lines.map((ln) => ({
            id: ln.id,
            name: ln.productName,
            quantity: ln.quantity,
            unitPrice: ln.unitPrice,
            subtotal: ln.subtotal,
            tax: ln.taxAmount,
            total: ln.total,
          }))}
          subtotal={selectedInvoice.subtotal}
          taxTotal={selectedInvoice.taxTotal}
          grandTotal={selectedInvoice.grandTotal}
          amountPaid={selectedInvoice.amountPaid}
          balanceDue={selectedInvoice.balanceDue}
          status={selectedInvoice.status}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}
    </div>
  );
}

export default InvoicesPage;
