import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Receipt,
  CreditCard,
  CheckCircle2,
  X,
  Printer,
  Building2,
  Calendar,
  ExternalLink,
  PieChart,
  Package,
  ArrowLeft,
  Pencil,
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
    updateBill,
    registerVendorPayment,
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
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [activePaymentBill, setActivePaymentBill] = useState<Bill | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentJournal, setPaymentJournal] = useState<'BANK' | 'CASH'>('BANK');
  const [paymentMethod, setPaymentMethod] = useState<'HDFC Bank Transfer' | 'Cash Register' | 'UPI'>('HDFC Bank Transfer');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentNote, setPaymentNote] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // New Bill Form
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const eligibleVendors = contacts.filter((c) => c.type === 'VENDOR' || c.type === 'BOTH');
  const [newVendorId, setNewVendorId] = useState(eligibleVendors[0]?.id || contacts[0]?.id || '');
  const [newProductId, setNewProductId] = useState(products[0]?.id || '');
  const [newQuantity, setNewQuantity] = useState(5);
  const [newBillReference, setNewBillReference] = useState('ABC-26-001');
  const [newAnalyticId, setNewAnalyticId] = useState(analyticAccounts[0]?.id || '');

  // Custom / Other Entry States
  const [customVendorName, setCustomVendorName] = useState('');
  const [customVendorCity, setCustomVendorCity] = useState('');
  const [customProductName, setCustomProductName] = useState('');
  const [customProductPrice, setCustomProductPrice] = useState(12000);
  const [customProductCategory, setCustomProductCategory] = useState('Raw Materials');
  const [customAnalyticName, setCustomAnalyticName] = useState('');

  // Edit Bill States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editBillId, setEditBillId] = useState('');
  const [editVendorId, setEditVendorId] = useState('');
  const [editBillDate, setEditBillDate] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editStatus, setEditStatus] = useState<Bill['status']>('POSTED');
  const [editReference, setEditReference] = useState('');
  const [editUnitPrice, setEditUnitPrice] = useState<number>(0);
  const [editQuantity, setEditQuantity] = useState<number>(1);
  const [editProductName, setEditProductName] = useState('');

  const handleOpenEditBill = (b: Bill) => {
    setEditBillId(b.id);
    setEditVendorId(b.vendorId);
    setEditBillDate(b.billDate);
    setEditDueDate(b.dueDate);
    setEditStatus(b.status);
    setEditReference(b.billReference || b.billNumber);
    const firstLine = b.lines[0];
    setEditProductName(firstLine?.productName || 'Raw Teak Wood Timber');
    setEditUnitPrice(firstLine?.unitPrice || 3200);
    setEditQuantity(firstLine?.quantity || 1);
    setIsEditModalOpen(true);
  };

  const handleSaveEditedBill = (e: React.FormEvent) => {
    e.preventDefault();
    const vendor = contacts.find((c) => c.id === editVendorId);
    const subtotal = editQuantity * editUnitPrice;
    const taxTotal = Number((subtotal * 0.18).toFixed(2));
    const grandTotal = Number((subtotal + taxTotal).toFixed(2));

    const existingBill = bills.find((b) => b.id === editBillId);
    const amountPaid = editStatus === 'PAID' ? grandTotal : (existingBill?.amountPaid || 0);
    const balanceDue = Math.max(0, grandTotal - amountPaid);

    const updated = updateBill(editBillId, {
      vendorId: editVendorId,
      vendorName: vendor?.name || existingBill?.vendorName || 'Vendor',
      billDate: editBillDate,
      dueDate: editDueDate,
      status: editStatus,
      billReference: editReference,
      subtotal,
      taxTotal,
      grandTotal,
      amountPaid,
      balanceDue,
      lines: [
        {
          id: existingBill?.lines[0]?.id || `line-${Date.now()}`,
          productId: existingBill?.lines[0]?.productId || 'prod-1',
          productName: editProductName,
          quantity: editQuantity,
          unitPrice: editUnitPrice,
          taxRate: 18,
          subtotal,
          taxAmount: taxTotal,
          total: grandTotal,
          chartOfAccount: 'Raw Material Purchases',
          analyticAccountName: existingBill?.lines[0]?.analyticAccountName || 'Raw Material Procurement (Expense)',
        },
      ],
    });

    if (updated) {
      setIsEditModalOpen(false);
      if (selectedBill && selectedBill.id === editBillId) {
        setSelectedBill(updated);
      }
      setNotice(`Vendor Bill ${updated.billNumber} updated successfully.`);
      setTimeout(() => setNotice(null), 4000);
    }
  };

  useEffect(() => {
    if (!newVendorId && (eligibleVendors[0]?.id || contacts[0]?.id)) {
      setNewVendorId(eligibleVendors[0]?.id || contacts[0]?.id);
    }
  }, [newVendorId, eligibleVendors, contacts]);

  useEffect(() => {
    if (!newProductId && products[0]?.id) {
      setNewProductId(products[0]?.id);
    }
  }, [newProductId, products]);

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
    setPaymentNote(`Payment for ${bill.billNumber}`);
    setPaymentDate(new Date().toISOString().split('T')[0]);
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

    let vendor = contacts.find((c) => c.id === newVendorId);
    if (newVendorId === '__OTHER__') {
      if (!customVendorName.trim()) return;
      vendor = addContact({
        name: customVendorName.trim(),
        type: 'VENDOR',
        email: `${customVendorName.trim().toLowerCase().replace(/\s+/g, '')}@supplier.com`,
        mobile: '+91 98765 12345',
        city: customVendorCity.trim() || 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600001',
      });
    }

    let prod = products.find((p) => p.id === newProductId);
    if (newProductId === '__OTHER__') {
      if (!customProductName.trim()) return;
      const purchP = Number(customProductPrice) || 3000;
      prod = addProduct({
        name: customProductName.trim(),
        salesPrice: Math.round(purchP * 1.5),
        purchasePrice: purchP,
        category: customProductCategory.trim() || 'Raw Materials',
        type: 'GOODS',
        stock: 50,
      });
    }

    if (!vendor || !prod) return;

    let chosenAnalytic = analyticAccounts.find((a) => a.id === newAnalyticId);
    if (newAnalyticId === '__OTHER__') {
      if (customAnalyticName.trim()) {
        chosenAnalytic = addAnalyticAccount({
          name: customAnalyticName.trim(),
          type: 'EXPENSES',
          description: 'Custom expense budget created via vendor bill',
        });
      } else {
        chosenAnalytic = analyticAccounts[0];
      }
    } else if (!chosenAnalytic) {
      chosenAnalytic = analyticAccounts[0];
    }

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
      analyticAccountId: chosenAnalytic?.id,
      analyticAccountName: chosenAnalytic ? (chosenAnalytic.code ? `${chosenAnalytic.code} - ${chosenAnalytic.name}` : chosenAnalytic.name) : 'General Procurement',
      chartOfAccount: 'Purchase Account (COGS)',
    };

    const newB = createBill({
      vendorId: vendor.id,
      vendorName: vendor.name,
      billReference: newBillReference || 'ABC-26-001',
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
    setSelectedBill(newB);
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
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-surface-secondary">
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
                      {b.balanceDue > 0 && (
                        <Button
                          size="sm"
                          onClick={() => handleOpenPayment(b)}
                          className="h-7 text-[11px] px-2.5 bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white font-medium cursor-pointer shadow-2xs"
                        >
                          <CreditCard size={11} className="mr-1" />
                          Pay
                        </Button>
                      )}
                      {!isContact && (
                        <button
                          type="button"
                          onClick={() => handleOpenEditBill(b)}
                          title="Edit Bill"
                          className="p-1.5 rounded-md text-slate-500 hover:text-brand-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Pencil size={13} />
                        </button>
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
                          {!isContact && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenEditBill(b)}
                              className="h-7 text-[11px] px-2 text-brand-700 hover:bg-brand-50 border-brand-200 cursor-pointer flex items-center gap-1"
                              title="Edit Bill"
                            >
                              <Pencil size={11} />
                              <span>Edit</span>
                            </Button>
                          )}
                          {b.balanceDue > 0 && !isContact && (
                            <Button
                              size="sm"
                              onClick={() => handleOpenPayment(b)}
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
      {/* VENDOR BILL DETAIL VIEW                                      */}
      {/* ============================================================ */}
      {selectedBill && (
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
                  <h3 className="text-lg font-bold text-navy-900 leading-tight">{selectedBill.billNumber}</h3>
                  <p className="text-xs text-text-muted">Vendor Bill Record</p>
                </div>
              </div>

              {/* Smart Buttons Top Right matching diagram */}
              <div className="flex items-center gap-2">
                {selectedBill.poId && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/purchases/${selectedBill.poId}`)}
                    className="h-8 text-xs font-semibold text-brand-700 border-brand-300 bg-brand-50/50 hover:bg-brand-100/70 cursor-pointer shadow-2xs"
                    title={`Source Purchase Order: ${selectedBill.poNumber || selectedBill.poId}`}
                  >
                    <Package size={13} className="mr-1 text-brand-600" />
                    PO ({selectedBill.poNumber || 'PO'})
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
                {!isContact && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEditBill(selectedBill)}
                    className="h-8 text-xs flex items-center gap-1 text-brand-700 hover:bg-brand-50 border-brand-200 cursor-pointer shadow-2xs"
                    title="Edit Bill Details"
                  >
                    <Pencil size={13} />
                    <span>Edit</span>
                  </Button>
                )}
                <button onClick={closeDetail} className="text-text-muted hover:text-navy-900 p-1 cursor-pointer">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Bill Header Info matching mockup:
                Vendor Bill No., Vendor Name, Status (Paid, Partial, Not Paid), Bill Reference, Bill Date, Due Date */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-slate-50/80 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Vendor Bill No.</span>
                <p className="font-mono font-bold text-sm text-navy-950 mt-1">{selectedBill.billNumber}</p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Vendor Name</span>
                <p className="font-semibold text-sm text-navy-950 mt-1">{selectedBill.vendorName}</p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Status</span>
                <div className="mt-1">
                  <Badge
                    className={
                      selectedBill.balanceDue === 0
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold'
                        : selectedBill.amountPaid > 0
                        ? 'bg-amber-100 text-amber-800 border-amber-300 font-semibold'
                        : 'bg-rose-100 text-rose-800 border-rose-300 font-semibold'
                    }
                  >
                    {selectedBill.balanceDue === 0 ? 'Paid' : selectedBill.amountPaid > 0 ? 'Partial' : 'Not Paid'}
                  </Badge>
                </div>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Bill Reference</span>
                <p className="font-mono font-medium text-xs text-navy-800 mt-1">{selectedBill.billReference || 'ABC-26-001'}</p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Bill Date</span>
                <p className="font-medium text-xs text-navy-800 mt-1">{selectedBill.billDate}</p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Due Date</span>
                <p className="font-medium text-xs text-navy-800 mt-1">{selectedBill.dueDate}</p>
              </div>
            </div>

            {/* Line Items Table:
                Columns: Sr. No., Product, Chart of Account, Budget Analytics, Qty, Unit Price, Total */}
            <div>
              <span className="text-xs font-bold text-navy-900 uppercase tracking-wider block mb-2">
                Purchased Materials & Accounts Allocation
              </span>
              <div className="rounded-xl border border-surface-border overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/80 border-b border-surface-border text-navy-700 font-semibold">
                    <tr>
                      <th className="p-3 text-center w-12">Sr. No.</th>
                      <th className="p-3">Product</th>
                      <th className="p-3">Chart of Account</th>
                      <th className="p-3">Budget Analytics</th>
                      <th className="p-3 text-right">Qty</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {selectedBill.lines.map((ln, idx) => (
                      <tr key={ln.id} className="hover:bg-slate-50/60">
                        <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                        <td className="p-3 font-semibold text-navy-900">{ln.productName}</td>
                        <td className="p-3 text-xs text-slate-600">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            {ln.chartOfAccount || 'Purchase Account (COGS)'}
                          </span>
                        </td>
                        <td className="p-3 text-xs text-navy-700">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-brand-50 text-brand-700 border border-brand-200/60">
                            {ln.analyticAccountName || 'General Procurement'}
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono font-medium">{ln.quantity}</td>
                        <td className="p-3 text-right font-mono text-slate-700">₹{ln.unitPrice.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right font-mono font-bold text-navy-950">
                          ₹{ln.total.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals Breakdown matching mockup:
                Total, Paid Via Cash, Paid Via Bank, Amount Due */}
            {(() => {
              const billPayments = payments.filter(
                (p) => p.documentRef === selectedBill.billNumber || p.documentRef === selectedBill.id
              );
              const paidCash = billPayments.filter((p) => p.journal === 'CASH').reduce((s, p) => s + p.amount, 0);
              const paidBank =
                billPayments.filter((p) => p.journal === 'BANK').reduce((s, p) => s + p.amount, 0) ||
                Math.max(0, selectedBill.amountPaid - paidCash);

              return (
                <div className="flex justify-end">
                  <div className="w-full sm:w-72 p-4 bg-slate-50/90 rounded-xl border border-slate-200 text-xs space-y-2">
                    <div className="flex justify-between text-navy-700 font-semibold">
                      <span>Total Bill</span>
                      <span className="font-mono">₹{selectedBill.grandTotal.toLocaleString('en-IN')}</span>
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
                      <span className={`font-mono ${selectedBill.balanceDue > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        ₹{selectedBill.balanceDue.toLocaleString('en-IN')}
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
                {!isContact && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEditBill(selectedBill)}
                    className="text-brand-700 hover:bg-brand-50 border-brand-200 text-xs font-semibold cursor-pointer"
                  >
                    <Pencil size={13} className="mr-1.5" />
                    Edit Bill
                  </Button>
                )}
                {selectedBill.balanceDue > 0 && !isContact && (
                  <Button
                    size="sm"
                    onClick={() => handleOpenPayment(selectedBill)}
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
      {/* EDIT VENDOR BILL MODAL                                       */}
      {/* ============================================================ */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-xl border border-surface-border bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div>
                <h3 className="text-base font-bold text-navy-900">Edit Vendor Bill</h3>
                <p className="text-xs text-text-muted">Modify bill parameters, amounts, and status</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-text-muted hover:text-navy-900 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditedBill} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Vendor / Supplier *</label>
                <select
                  value={editVendorId}
                  onChange={(e) => setEditVendorId(e.target.value)}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-600 focus:outline-none cursor-pointer"
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Bill Date *</label>
                  <input
                    type="date"
                    required
                    value={editBillDate}
                    onChange={(e) => setEditBillDate(e.target.value)}
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Bill Reference</label>
                  <input
                    type="text"
                    value={editReference}
                    onChange={(e) => setEditReference(e.target.value)}
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs font-mono text-navy-900 focus:border-brand-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Status *</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-600 focus:outline-none cursor-pointer"
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="POSTED">POSTED (Open)</option>
                    <option value="PARTIALLY_PAID">PARTIALLY_PAID</option>
                    <option value="PAID">PAID</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Purchased Item / Material *</label>
                <input
                  type="text"
                  required
                  value={editProductName}
                  onChange={(e) => setEditProductName(e.target.value)}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Quantity *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs font-mono text-navy-900 focus:border-brand-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Unit Price (₹) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={editUnitPrice}
                    onChange={(e) => setEditUnitPrice(Number(e.target.value))}
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs font-mono text-navy-900 focus:border-brand-600 focus:outline-none"
                  />
                </div>
              </div>

              {(() => {
                const subtotal = editQuantity * editUnitPrice;
                const tax = Math.round(subtotal * 0.18);
                const grand = subtotal + tax;
                return (
                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 text-xs space-y-1 font-mono">
                    <div className="flex justify-between text-navy-700">
                      <span>Subtotal:</span>
                      <span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-navy-700">
                      <span>Input GST (18%):</span>
                      <span>₹{tax.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between font-bold text-navy-950 pt-1 border-t border-slate-200">
                      <span>Grand Total:</span>
                      <span>₹{grand.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                );
              })()}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-brand-700 hover:bg-brand-800 text-white font-semibold cursor-pointer">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* REGISTER VENDOR PAYMENT MODAL matching diagram               */}
      {/* ============================================================ */}
      {paymentModalOpen && activePaymentBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-xl border border-surface-border bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div>
                <h3 className="text-base font-bold text-navy-900">Payment Form</h3>
                <p className="text-xs text-text-muted">Settlement voucher for {activePaymentBill.billNumber}</p>
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
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentTypeRadio"
                      checked={true}
                      readOnly
                      className="text-brand-700 focus:ring-brand-500"
                    />
                    <span className="font-semibold text-navy-900">Send (Vendor Disbursement)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-not-allowed opacity-40">
                    <input type="radio" name="paymentTypeRadio" disabled />
                    <span>Receive</span>
                  </label>
                </div>
              </div>

              {/* Partner */}
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Partner *</label>
                <input
                  type="text"
                  readOnly
                  value={activePaymentBill.vendorName}
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
                    max={activePaymentBill.balanceDue}
                    required
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs font-mono font-bold text-navy-950 focus:border-brand-600 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">Max Due: ₹{activePaymentBill.balanceDue.toLocaleString('en-IN')}</span>
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
                  placeholder="e.g. Disbursement for Bill/2026/0001"
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-600 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-[11px] text-emerald-900">
                <span className="font-semibold">Double-Entry Posting:</span> Debit Purchase / Creditor A/c &bull; Credit {paymentJournal === 'BANK' ? 'Bank' : 'Cash'} A/c.
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
      {/* DIRECT VENDOR BILL CREATION MODAL                            */}
      {/* ============================================================ */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-xl border border-surface-border bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div>
                <h3 className="text-base font-bold text-navy-900">Create Vendor Bill</h3>
                <p className="text-xs text-text-muted">Direct bill logging with auto-journal entry</p>
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
                  <option value="__OTHER__">➕ Other (Enter New Supplier Details...)</option>
                  {contacts
                    .filter((c) => c.type === 'VENDOR' || c.type === 'BOTH')
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.city})
                      </option>
                    ))}
                </select>
                {newVendorId === '__OTHER__' && (
                  <div className="mt-2 grid grid-cols-2 gap-2 p-2.5 rounded-md bg-brand-50/60 border border-brand-200">
                    <div className="col-span-2">
                      <label className="block text-[11px] font-semibold text-brand-900 mb-0.5">Supplier Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Apex Wood & Timbers Ltd"
                        value={customVendorName}
                        onChange={(e) => setCustomVendorName(e.target.value)}
                        className="w-full rounded border border-brand-300 bg-white px-2 py-1 text-xs text-navy-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-brand-900 mb-0.5">City</label>
                      <input
                        type="text"
                        placeholder="e.g. Chennai"
                        value={customVendorCity}
                        onChange={(e) => setCustomVendorCity(e.target.value)}
                        className="w-full rounded border border-brand-300 bg-white px-2 py-1 text-xs text-navy-900 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Bill Reference *</label>
                <input
                  type="text"
                  required
                  value={newBillReference}
                  onChange={(e) => setNewBillReference(e.target.value)}
                  placeholder="e.g. ABC-26-001"
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs font-mono text-navy-900 focus:border-navy-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Purchased Item *</label>
                <select
                  value={newProductId}
                  onChange={(e) => setNewProductId(e.target.value)}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none cursor-pointer"
                >
                  <option value="__OTHER__">➕ Other (Enter Custom Material Details...)</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — Cost: ₹{p.purchasePrice.toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
                {newProductId === '__OTHER__' && (
                  <div className="mt-2 grid grid-cols-2 gap-2 p-2.5 rounded-md bg-brand-50/60 border border-brand-200">
                    <div className="col-span-2">
                      <label className="block text-[11px] font-semibold text-brand-900 mb-0.5">Material / Item Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Polished Brass Handles & Fixtures"
                        value={customProductName}
                        onChange={(e) => setCustomProductName(e.target.value)}
                        className="w-full rounded border border-brand-300 bg-white px-2 py-1 text-xs text-navy-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-brand-900 mb-0.5">Unit Purchase Cost (₹) *</label>
                      <input
                        type="number"
                        min={10}
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
                        placeholder="e.g. Hardware & Fittings"
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
                  <option value="__OTHER__">➕ Other (Enter Custom Expense Budget...)</option>
                  {analyticAccounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.code ? `${a.code} - ` : ''}{a.name} ({a.type})
                    </option>
                  ))}
                </select>
                {newAnalyticId === '__OTHER__' && (
                  <div className="mt-2 p-2.5 rounded-md bg-brand-50/60 border border-brand-200">
                    <label className="block text-[11px] font-semibold text-brand-900 mb-0.5">Expense Budget Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Specialized Metal Hardware Procurement"
                      value={customAnalyticName}
                      onChange={(e) => setCustomAnalyticName(e.target.value)}
                      className="w-full rounded border border-brand-300 bg-white px-2 py-1 text-xs text-navy-900 focus:outline-none"
                    />
                  </div>
                )}
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

              {(() => {
                const activePrice = newProductId === '__OTHER__'
                  ? (Number(customProductPrice) || 0)
                  : (products.find((p) => p.id === newProductId)?.purchasePrice || 0);
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
                      <span>Input GST (18%)</span>
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
                    if (location.pathname === ROUTES.BILLS_NEW) navigate(ROUTES.BILLS);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white cursor-pointer font-semibold">
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
      )}
    </div>
  );
}

export default BillsPage;
