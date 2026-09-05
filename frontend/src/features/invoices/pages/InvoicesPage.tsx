import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  FileText,
  CreditCard,
  CheckCircle2,
  X,
  BookOpen,
  Printer,
  User,
  Calendar,
  ExternalLink,
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
    contacts,
    products,
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
  const [notice, setNotice] = useState<string | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // New Invoice Form state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCustomerId, setNewCustomerId] = useState('cnt-1');
  const [newProductId, setNewProductId] = useState('prd-1');
  const [newQuantity, setNewQuantity] = useState(1);

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

  // If Contact portal, filter to customer's own invoices
  const relevantInvoices = isContact
    ? invoices.filter(
        (inv) =>
          inv.customerId === 'cnt-1' ||
          inv.customerName.toLowerCase().includes(user?.fullName?.toLowerCase() || '')
      )
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
    const cust = contacts.find((c) => c.id === newCustomerId);
    const prod = products.find((p) => p.id === newProductId);
    if (!cust || !prod) return;

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
    };

    const newInv = createInvoice({
      customerId: cust.id,
      customerName: cust.name,
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
    <div className="flex-1 flex flex-col min-h-0 bg-surface-secondary">
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
      />

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 max-w-7xl w-full mx-auto">
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
                          className="h-7 text-[11px] px-2.5 bg-navy-900 hover:bg-navy-800 text-white font-medium cursor-pointer shadow-2xs"
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
                              className="h-7 text-[11px] px-2 bg-navy-900 hover:bg-navy-800 text-white cursor-pointer"
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
      {/* INVOICE DETAIL DRAWER                                        */}
      {/* ============================================================ */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-2xl rounded-xl border border-surface-border bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-surface-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-navy-900">{selectedInvoice.invoiceNumber}</h3>
                  <Badge variant={getStatusBadgeVariant(selectedInvoice.status)}>
                    {selectedInvoice.status}
                  </Badge>
                </div>
                <p className="text-xs text-text-muted mt-0.5">
                  Billed to: <span className="font-semibold text-navy-900">{selectedInvoice.customerName}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPrintModalOpen(true)}
                  className="flex items-center gap-1 text-xs cursor-pointer"
                >
                  <Printer size={13} />
                  <span>Print / PDF</span>
                </Button>
                <button onClick={closeDetail} className="text-text-muted hover:text-navy-900 p-1 cursor-pointer">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Invoicing Dates & GL Link */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-text-muted uppercase">Issue Date</span>
                <p className="font-semibold text-navy-900 mt-0.5">{selectedInvoice.issueDate}</p>
              </div>
              <div>
                <span className="text-[10px] text-text-muted uppercase">Due Date</span>
                <p className="font-semibold text-navy-900 mt-0.5">{selectedInvoice.dueDate}</p>
              </div>
              <div>
                <span className="text-[10px] text-text-muted uppercase">Accounting Link</span>
                <p className="font-mono font-semibold text-brand-700 mt-0.5 flex items-center gap-1">
                  <BookOpen size={12} /> {selectedInvoice.journalEntryId || 'Posted in GL'}
                </p>
              </div>
            </div>

            {/* Line Items Table */}
            <div>
              <span className="text-xs font-bold text-navy-900 uppercase tracking-wider block mb-2">
                Itemized Products & GST (18%)
              </span>
              <div className="rounded-lg border border-surface-border overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-surface-border text-navy-600">
                    <tr>
                      <th className="p-2.5">Item Description</th>
                      <th className="p-2.5 text-right">Qty</th>
                      <th className="p-2.5 text-right">Unit Rate</th>
                      <th className="p-2.5 text-right">GST (18%)</th>
                      <th className="p-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedInvoice.lines.map((ln) => (
                      <tr key={ln.id}>
                        <td className="p-2.5 font-medium text-navy-900">{ln.productName}</td>
                        <td className="p-2.5 text-right font-mono">{ln.quantity}</td>
                        <td className="p-2.5 text-right font-mono">₹{ln.unitPrice.toLocaleString('en-IN')}</td>
                        <td className="p-2.5 text-right font-mono text-text-muted">₹{ln.taxAmount.toLocaleString('en-IN')}</td>
                        <td className="p-2.5 text-right font-mono font-semibold text-navy-900">
                          ₹{ln.total.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals Summary */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between text-navy-600">
                <span>Subtotal (Excl. Tax)</span>
                <span className="font-mono">₹{selectedInvoice.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-navy-600">
                <span>Output GST (9% CGST + 9% SGST)</span>
                <span className="font-mono">₹{selectedInvoice.taxTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-navy-900 pt-1.5 border-t border-slate-200">
                <span>Grand Total</span>
                <span className="font-mono">₹{selectedInvoice.grandTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-semibold text-xs text-red-600 pt-1">
                <span>Outstanding Balance Due</span>
                <span className="font-mono">₹{selectedInvoice.balanceDue.toLocaleString('en-IN')}</span>
              </div>
            </div>

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
                    className="bg-navy-900 hover:bg-navy-800 text-white text-xs cursor-pointer"
                  >
                    <CreditCard size={13} className="mr-1.5" />
                    Register Payment
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
      {/* REGISTER PAYMENT MODAL                                       */}
      {/* ============================================================ */}
      {paymentModalOpen && activePaymentInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-xl border border-surface-border bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div>
                <h3 className="text-base font-bold text-navy-900">Register Customer Payment</h3>
                <p className="text-xs text-text-muted">Settlement voucher for {activePaymentInvoice.invoiceNumber}</p>
              </div>
              <button onClick={() => setPaymentModalOpen(false)} className="text-text-muted hover:text-navy-900 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRegisterPayment} className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex justify-between text-navy-600 mb-1">
                  <span>Customer:</span>
                  <span className="font-semibold text-navy-900">{activePaymentInvoice.customerName}</span>
                </div>
                <div className="flex justify-between text-navy-600">
                  <span>Balance Due:</span>
                  <span className="font-mono font-bold text-red-600">
                    ₹{activePaymentInvoice.balanceDue.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Payment Amount (₹) *</label>
                <input
                  type="number"
                  min={1}
                  max={activePaymentInvoice.balanceDue}
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs font-mono text-navy-900 focus:border-navy-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Destination Journal</label>
                  <select
                    value={paymentJournal}
                    onChange={(e) => setPaymentJournal(e.target.value as 'BANK' | 'CASH')}
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none cursor-pointer"
                  >
                    <option value="BANK">HDFC Bank Account</option>
                    <option value="CASH">Cash Register</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Payment Mode</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as 'HDFC Bank Transfer' | 'Cash Register' | 'UPI')}
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none cursor-pointer"
                  >
                    <option value="HDFC Bank Transfer">NEFT / Bank Transfer</option>
                    <option value="UPI">UPI Digital Payment</option>
                    <option value="Cash Register">Cash Voucher</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-[11px] text-emerald-900">
                <span className="font-semibold">Double-Entry Impact:</span> Will debit Cash/Bank and credit Accounts Receivable (Debtors), updating the General Ledger immediately.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setPaymentModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-navy-900 hover:bg-navy-800 text-white cursor-pointer">
                  Confirm & Post Payment
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
                <p className="text-xs text-text-muted">Direct invoice billing to customer</p>
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
                  {contacts
                    .filter((c) => c.type === 'CUSTOMER' || c.type === 'BOTH')
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.city})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Product Item *</label>
                <select
                  value={newProductId}
                  onChange={(e) => setNewProductId(e.target.value)}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none cursor-pointer"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ₹{p.salesPrice.toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Quantity</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs font-mono text-navy-900 focus:border-navy-600 focus:outline-none"
                />
              </div>

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
                <Button type="submit" size="sm" className="bg-navy-900 hover:bg-navy-800 text-white cursor-pointer">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl p-6 my-8 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3 no-print">
              <div className="flex items-center gap-2">
                <Printer size={18} className="text-navy-700" />
                <h3 className="font-bold text-navy-900 text-sm">Print / PDF Preview: {selectedInvoice.invoiceNumber}</h3>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => window.print()}
                  className="bg-navy-900 hover:bg-navy-800 text-white text-xs cursor-pointer"
                >
                  <Printer size={13} className="mr-1.5" />
                  Print / Save PDF
                </Button>
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(false)}
                  className="text-text-muted hover:text-navy-900 p-1 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

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
          </div>
        </div>
      )}
    </div>
  );
}

export default InvoicesPage;
