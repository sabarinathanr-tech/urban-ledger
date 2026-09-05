import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Receipt,
  CreditCard,
  CheckCircle2,
  X,
  BookOpen,
  Printer,
  Building2,
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
import type { Bill } from '@/data/erpData';
import { OdooControlPanel, type ViewMode } from '@/components/layout/OdooControlPanel';

export function BillsPage() {
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { isContact, user } = useAuth();
  const {
    bills,
    createBill,
    registerVendorPayment,
    contacts,
    products,
    refreshERPData,
  } = useERP();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [activePaymentBill, setActivePaymentBill] = useState<Bill | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentJournal, setPaymentJournal] = useState<'BANK' | 'CASH'>('BANK');
  const [paymentMethod, setPaymentMethod] = useState<'HDFC Bank Transfer' | 'Cash Register' | 'UPI'>('HDFC Bank Transfer');
  const [notice, setNotice] = useState<string | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // New Bill Form
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newVendorId, setNewVendorId] = useState('cnt-2');
  const [newProductId, setNewProductId] = useState('prd-1');
  const [newQuantity, setNewQuantity] = useState(5);

  useEffect(() => {
    if (location.pathname === ROUTES.BILLS_NEW) {
      setIsCreateModalOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (id) {
      const found = bills.find(
        (b) => b.id === id || b.billNumber.toLowerCase() === id.toLowerCase()
      );
      if (found) {
        setSelectedBill(found);
      }
    }
  }, [id, bills]);

  // If Contact portal, filter strictly to vendor's own bills
  const isVendorContact = isContact && (user?.contactType === 'VENDOR' || user?.contactType === 'BOTH');
  const userContactId = (user as any)?.contact?.id || (user as any)?.contactId;
  const userEmail = user?.email?.toLowerCase();
  const userName = (user?.fullName || (user as any)?.name || '').trim().toLowerCase();

  const relevantBills = isContact
    ? isVendorContact
      ? bills.filter((b) => {
          if (userContactId && b.vendorId === userContactId) return true;
          if (userEmail && (b as any).vendorEmail?.toLowerCase() === userEmail) return true;
          if (userName && userName.length > 2 && b.vendorName.toLowerCase().includes(userName)) return true;
          return false;
        })
      : [] // Customer contacts see 0 vendor bills
    : bills;

  const filteredBills = relevantBills.filter((b) => {
    const matchesSearch =
      b.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.vendorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: Bill['status']): 'default' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'outline' => {
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

  const handleOpenPayment = (bill: Bill) => {
    setActivePaymentBill(bill);
    setPaymentAmount(bill.balanceDue);
    setPaymentModalOpen(true);
  };

  const handleRegisterPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePaymentBill || paymentAmount <= 0) return;

    const payment = registerVendorPayment(
      activePaymentBill.id,
      paymentAmount,
      paymentJournal,
      paymentMethod
    );

    if (payment) {
      setPaymentModalOpen(false);
      setNotice(`Vendor disbursement of ₹${paymentAmount.toLocaleString('en-IN')} successfully settled for ${activePaymentBill.billNumber}.`);
      setTimeout(() => setNotice(null), 5000);
      if (selectedBill && selectedBill.id === activePaymentBill.id) {
        setSelectedBill({
          ...selectedBill,
          amountPaid: selectedBill.amountPaid + paymentAmount,
          balanceDue: Math.max(0, selectedBill.balanceDue - paymentAmount),
          status: selectedBill.balanceDue - paymentAmount <= 0 ? 'PAID' : 'PARTIALLY_PAID',
        });
      }
    }
  };

  const handleCreateDirectBill = (e: React.FormEvent) => {
    e.preventDefault();
    const vendor = contacts.find((c) => c.id === newVendorId);
    const prod = products.find((p) => p.id === newProductId);
    if (!vendor || !prod) return;

    const subtotal = prod.purchasePrice * newQuantity;
    const taxAmount = Math.round(subtotal * 0.18);
    const grandTotal = subtotal + taxAmount;

    const line = {
      id: `billl-${Date.now()}`,
      productId: prod.id,
      productName: prod.name,
      quantity: newQuantity,
      unitPrice: prod.purchasePrice,
      taxRate: 18,
      subtotal,
      taxAmount,
      total: grandTotal,
    };

    const newB = createBill({
      vendorId: vendor.id,
      vendorName: vendor.name,
      billDate: new Date().toISOString().split('T')[0],
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
    if (location.pathname === ROUTES.BILLS_NEW) {
      navigate(ROUTES.BILLS);
    }
    setNotice(`Vendor Bill ${newB.billNumber} posted with balanced double-entry GL.`);
    setTimeout(() => setNotice(null), 5000);
  };

  const closeDetail = () => {
    setSelectedBill(null);
    if (id) {
      navigate(ROUTES.BILLS);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-surface-secondary">
      {/* Odoo Control Panel */}
      <OdooControlPanel
        title={isContact ? 'My Bills' : 'Vendor Bills'}
        subtitle={
          isContact
            ? 'Bills associated with your supplier account'
            : 'Supplier bills, accounts payable, input tax credits, and payment disbursements'
        }
        itemCount={filteredBills.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search bill #, vendor name..."
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewClick={
          !isContact
            ? () => {
                navigate(ROUTES.BILLS_NEW);
                setIsCreateModalOpen(true);
              }
            : undefined
        }
        newButtonLabel="New Bill"
        filterOptions={[
          { label: 'All', value: 'ALL' },
          { label: 'Open / Unpaid', value: 'POSTED' },
          { label: 'Partially Paid', value: 'PARTIALLY_PAID' },
          { label: 'Fully Paid', value: 'PAID' },
        ]}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
        onRefresh={refreshERPData}
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
        {/* KANBAN VIEW (Odoo-Style Vendor Bill Cards)                   */}
        {/* ============================================================ */}
        {viewMode === 'kanban' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredBills.length === 0 ? (
              <div className="col-span-full py-12 text-center text-xs text-text-muted bg-white rounded-lg border border-surface-border">
                No vendor bills found matching criteria.
              </div>
            ) : (
              filteredBills.map((b) => (
                <div
                  key={b.id}
                  onClick={() => setSelectedBill(b)}
                  className="group bg-white rounded-lg border border-surface-border hover:border-navy-400 hover:shadow-md transition-all p-4 flex flex-col justify-between cursor-pointer relative overflow-hidden"
                >
                  <div className="space-y-2.5">
                    {/* Top Row: Bill # & Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Receipt size={15} className="text-navy-600" />
                        <span className="font-mono font-bold text-sm text-navy-950 group-hover:text-brand-700 transition-colors">
                          {b.billNumber}
                        </span>
                      </div>
                      <Badge variant={getStatusBadgeVariant(b.status)} className="text-[10px] px-1.5 py-0 font-semibold">
                        {b.status}
                      </Badge>
                    </div>

                    {/* Vendor Name */}
                    <div className="flex items-center gap-1.5 text-xs text-navy-800 font-semibold truncate pt-1">
                      <Building2 size={13} className="text-text-muted shrink-0" />
                      <span className="truncate">{b.vendorName}</span>
                    </div>

                    {/* Dates */}
                    <div className="flex items-center justify-between text-[11px] text-text-muted pt-1 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} /> {b.billDate}
                      </span>
                      <span>Due: {b.dueDate}</span>
                    </div>
                  </div>

                  {/* Financial Amounts & Action */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between">
                    <div>
                      <span className="text-[10px] text-text-muted block uppercase tracking-wider font-semibold">Total Bill</span>
                      <span className="font-mono font-bold text-sm text-navy-900">
                        ₹{b.grandTotal.toLocaleString('en-IN')}
                      </span>
                      {b.balanceDue > 0 && (
                        <div className="text-[11px] font-mono text-red-600 font-medium mt-0.5">
                          Payable: ₹{b.balanceDue.toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      {b.balanceDue > 0 && !isContact && (
                        <Button
                          size="sm"
                          onClick={() => handleOpenPayment(b)}
                          className="h-7 text-[11px] px-2.5 bg-navy-900 hover:bg-navy-800 text-white font-medium cursor-pointer shadow-2xs"
                        >
                          <CreditCard size={11} className="mr-1" />
                          Pay
                        </Button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBill(b);
                          setIsPrintModalOpen(true);
                        }}
                        title="Print / Export Bill PDF"
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
                  <TableHead>Bill #</TableHead>
                  <TableHead>Vendor / Supplier</TableHead>
                  <TableHead>Bill Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Total (incl. GST)</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right">Balance Due</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBills.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="py-8 text-center text-xs text-text-muted">
                      No vendor bills found matching criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBills.map((b) => (
                    <TableRow
                      key={b.id}
                      onClick={() => setSelectedBill(b)}
                      className="cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <TableCell className="font-mono text-xs font-semibold text-brand-700">
                        {b.billNumber}
                      </TableCell>
                      <TableCell className="font-medium text-navy-900 text-xs">{b.vendorName}</TableCell>
                      <TableCell className="text-xs text-text-muted">{b.billDate}</TableCell>
                      <TableCell className="text-xs text-text-muted">{b.dueDate}</TableCell>
                      <TableCell className="text-right font-mono text-xs font-bold text-navy-900">
                        ₹{b.grandTotal.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs text-emerald-700 font-semibold">
                        ₹{b.amountPaid.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs font-semibold text-red-600">
                        ₹{b.balanceDue.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={getStatusBadgeVariant(b.status)}>{b.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedBill(b)}
                            className="h-7 text-[11px] px-2 cursor-pointer"
                          >
                            View
                          </Button>
                          {b.balanceDue > 0 && !isContact && (
                            <Button
                              size="sm"
                              onClick={() => handleOpenPayment(b)}
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
                              setSelectedBill(b);
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
      {/* VENDOR BILL DETAIL DRAWER                                    */}
      {/* ============================================================ */}
      {selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-2xl rounded-xl border border-surface-border bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-surface-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-navy-900">{selectedBill.billNumber}</h3>
                  <Badge variant={getStatusBadgeVariant(selectedBill.status)}>
                    {selectedBill.status}
                  </Badge>
                </div>
                <p className="text-xs text-text-muted mt-0.5">
                  Vendor: <span className="font-semibold text-navy-900">{selectedBill.vendorName}</span>
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

            {/* Bill Dates & GL Link */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-text-muted uppercase">Bill Date</span>
                <p className="font-semibold text-navy-900 mt-0.5">{selectedBill.billDate}</p>
              </div>
              <div>
                <span className="text-[10px] text-text-muted uppercase">Due Date</span>
                <p className="font-semibold text-navy-900 mt-0.5">{selectedBill.dueDate}</p>
              </div>
              <div>
                <span className="text-[10px] text-text-muted uppercase">Accounting Entry</span>
                <p className="font-mono font-semibold text-brand-700 mt-0.5 flex items-center gap-1">
                  <BookOpen size={12} /> {selectedBill.journalEntryId || 'Posted in AP'}
                </p>
              </div>
            </div>

            {/* Line Items Table */}
            <div>
              <span className="text-xs font-bold text-navy-900 uppercase tracking-wider block mb-2">
                Purchased Materials & Input GST (18%)
              </span>
              <div className="rounded-lg border border-surface-border overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-surface-border text-navy-600">
                    <tr>
                      <th className="p-2.5">Material Description</th>
                      <th className="p-2.5 text-right">Qty</th>
                      <th className="p-2.5 text-right">Unit Rate</th>
                      <th className="p-2.5 text-right">GST (18%)</th>
                      <th className="p-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedBill.lines.map((ln) => (
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
                <span className="font-mono">₹{selectedBill.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-navy-600">
                <span>Input GST Credit (9% CGST + 9% SGST)</span>
                <span className="font-mono">₹{selectedBill.taxTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-navy-900 pt-1.5 border-t border-slate-200">
                <span>Grand Total</span>
                <span className="font-mono">₹{selectedBill.grandTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-semibold text-xs text-red-600 pt-1">
                <span>Outstanding Payable Due</span>
                <span className="font-mono">₹{selectedBill.balanceDue.toLocaleString('en-IN')}</span>
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
                {selectedBill.balanceDue > 0 && !isContact && (
                  <Button
                    size="sm"
                    onClick={() => handleOpenPayment(selectedBill)}
                    className="bg-navy-900 hover:bg-navy-800 text-white text-xs cursor-pointer"
                  >
                    <CreditCard size={13} className="mr-1.5" />
                    Pay Bill
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
      {/* REGISTER VENDOR PAYMENT MODAL                                */}
      {/* ============================================================ */}
      {paymentModalOpen && activePaymentBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-xl border border-surface-border bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div>
                <h3 className="text-base font-bold text-navy-900">Register Vendor Payment</h3>
                <p className="text-xs text-text-muted">Settlement voucher for {activePaymentBill.billNumber}</p>
              </div>
              <button onClick={() => setPaymentModalOpen(false)} className="text-text-muted hover:text-navy-900 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRegisterPayment} className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex justify-between text-navy-600 mb-1">
                  <span>Vendor:</span>
                  <span className="font-semibold text-navy-900">{activePaymentBill.vendorName}</span>
                </div>
                <div className="flex justify-between text-navy-600">
                  <span>Payable Due:</span>
                  <span className="font-mono font-bold text-red-600">
                    ₹{activePaymentBill.balanceDue.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Disbursement Amount (₹) *</label>
                <input
                  type="number"
                  min={1}
                  max={activePaymentBill.balanceDue}
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs font-mono text-navy-900 focus:border-navy-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Disbursement Account</label>
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
                <span className="font-semibold">Double-Entry Impact:</span> Will debit Accounts Payable (reducing creditor liability) and credit Bank/Cash.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setPaymentModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-navy-900 hover:bg-navy-800 text-white cursor-pointer">
                  Disburse & Post Voucher
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* DIRECT VENDOR BILL CREATION MODAL                            */}
      {/* ============================================================ */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-xl border border-surface-border bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div>
                <h3 className="text-base font-bold text-navy-900">Create Vendor Bill</h3>
                <p className="text-xs text-text-muted">Direct bill logging for raw materials</p>
              </div>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  if (location.pathname === ROUTES.BILLS_NEW) navigate(ROUTES.BILLS);
                }}
                className="text-text-muted hover:text-navy-900 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateDirectBill} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Vendor / Supplier *</label>
                <select
                  value={newVendorId}
                  onChange={(e) => setNewVendorId(e.target.value)}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none cursor-pointer"
                >
                  {contacts
                    .filter((c) => c.type === 'VENDOR' || c.type === 'BOTH')
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.city})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Purchased Item *</label>
                <select
                  value={newProductId}
                  onChange={(e) => setNewProductId(e.target.value)}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none cursor-pointer"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — Cost: ₹{p.purchasePrice.toLocaleString('en-IN')}
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
                    if (location.pathname === ROUTES.BILLS_NEW) navigate(ROUTES.BILLS);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-navy-900 hover:bg-navy-800 text-white cursor-pointer">
                  Generate & Post Bill
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VENDOR BILL PRINT & PDF PREVIEW MODAL                        */}
      {/* ============================================================ */}
      {isPrintModalOpen && selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl p-6 my-8 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3 no-print">
              <div className="flex items-center gap-2">
                <Printer size={18} className="text-navy-700" />
                <h3 className="font-bold text-navy-900 text-sm">Print / PDF Preview: {selectedBill.billNumber}</h3>
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
              documentType="BILL"
              documentNumber={selectedBill.billNumber}
              date={selectedBill.billDate}
              dueDate={selectedBill.dueDate}
              partnerName={selectedBill.vendorName}
              partnerAddress="Bangalore, Karnataka - 560001"
              lines={selectedBill.lines.map((ln) => ({
                id: ln.id,
                name: ln.productName,
                quantity: ln.quantity,
                unitPrice: ln.unitPrice,
                subtotal: ln.subtotal,
                tax: ln.taxAmount,
                total: ln.total,
              }))}
              subtotal={selectedBill.subtotal}
              taxTotal={selectedBill.taxTotal}
              grandTotal={selectedBill.grandTotal}
              amountPaid={selectedBill.amountPaid}
              balanceDue={selectedBill.balanceDue}
              status={selectedBill.status}
              onClose={() => setIsPrintModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default BillsPage;
