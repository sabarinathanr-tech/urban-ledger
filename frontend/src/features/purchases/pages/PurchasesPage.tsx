import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Package,
  CheckCircle2,
  Receipt,
  X,
  Calendar,
  Building2,
  ArrowRight,
  AlertTriangle,
  ArrowLeft,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { useERP } from '@/context/ERPContext';
import { ROUTES } from '@/app/config';
import type { PurchaseOrder } from '@/data/erpData';
import { OdooControlPanel, type ViewMode } from '@/components/layout/OdooControlPanel';

export function PurchasesPage() {
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    purchaseOrders,
    createPurchaseOrder,
    confirmPurchaseOrder,
    generateBillFromPO,
    contacts,
    products,
    analyticAccounts,
    refreshERPData,
  } = useERP();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);

  // Eligible vendors (VENDOR or BOTH)
  const eligibleVendors = contacts.filter((c) => c.type === 'VENDOR' || c.type === 'BOTH');
  const [vendorId, setVendorId] = useState(eligibleVendors[0]?.id || contacts[0]?.id || '');
  const [productId, setProductId] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState(10);
  const [selectedAnalyticId, setSelectedAnalyticId] = useState(analyticAccounts[0]?.id || '');
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!vendorId && (eligibleVendors[0]?.id || contacts[0]?.id)) {
      setVendorId(eligibleVendors[0]?.id || contacts[0]?.id);
    }
  }, [vendorId, eligibleVendors, contacts]);

  useEffect(() => {
    if (!productId && products[0]?.id) {
      setProductId(products[0]?.id);
    }
  }, [productId, products]);

  useEffect(() => {
    if (location.pathname === ROUTES.PURCHASES_NEW) {
      setIsModalOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (id) {
      const found = purchaseOrders.find(
        (po) => po.id === id || po.poNumber.toLowerCase() === id.toLowerCase()
      );
      if (found) {
        setSelectedOrder(found);
      }
    }
  }, [id, purchaseOrders]);

  const filteredOrders = purchaseOrders.filter((po) => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.vendorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: PurchaseOrder['status']): 'default' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'outline' => {
    switch (status) {
      case 'BILLED':
        return 'success';
      case 'CONFIRMED':
        return 'info';
      case 'RECEIVED':
        return 'warning';
      case 'DRAFT':
        return 'default';
    }
  };

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    const vendor = contacts.find((c) => c.id === vendorId);
    const product = products.find((p) => p.id === productId);
    if (!vendor || !product) return;

    const chosenAnalytic = analyticAccounts.find((a) => a.id === selectedAnalyticId) || analyticAccounts[0];
    const subtotal = product.purchasePrice * quantity;
    const taxAmount = Math.round(subtotal * 0.18);
    const grandTotal = subtotal + taxAmount;

    const newPO = createPurchaseOrder({
      vendorId: vendor.id,
      vendorName: vendor.name,
      orderDate: new Date().toISOString().split('T')[0],
      lines: [
        {
          id: `pol-${Date.now()}`,
          productId: product.id,
          productName: product.name,
          quantity,
          unitPrice: product.purchasePrice,
          taxRate: 18,
          subtotal,
          taxAmount,
          total: grandTotal,
          analyticAccountId: chosenAnalytic?.id,
          analyticAccountName: chosenAnalytic ? (chosenAnalytic.code ? `${chosenAnalytic.code} - ${chosenAnalytic.name}` : chosenAnalytic.name) : 'General Procurement',
          chartOfAccount: 'Purchase Account (COGS)',
        },
      ],
      subtotal,
      taxTotal: taxAmount,
      grandTotal,
      status: 'DRAFT',
    });

    setIsModalOpen(false);
    if (location.pathname === ROUTES.PURCHASES_NEW) {
      navigate(ROUTES.PURCHASES);
    }
    setNotice(`Purchase Order ${newPO.poNumber} created in DRAFT state.`);
    setSelectedOrder(newPO);
    setTimeout(() => setNotice(null), 5000);
  };

  const handleConfirmPO = (poId: string) => {
    confirmPurchaseOrder(poId);
    if (selectedOrder && selectedOrder.id === poId) {
      setSelectedOrder({ ...selectedOrder, status: 'CONFIRMED' });
    }
    setNotice(`Purchase Order confirmed. Ready for goods receipt and Vendor Bill generation.`);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleGenerateBill = (poId: string) => {
    const bill = generateBillFromPO(poId);
    if (bill) {
      if (selectedOrder && selectedOrder.id === poId) {
        setSelectedOrder({ ...selectedOrder, status: 'BILLED', billId: bill.id });
      }
      setNotice(`Vendor Bill ${bill.billNumber} generated and posted with double-entry to General Ledger.`);
      setTimeout(() => setNotice(null), 5000);
      navigate(`/bills/${bill.id}`);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (location.pathname === ROUTES.PURCHASES_NEW) {
      navigate(ROUTES.PURCHASES);
    }
  };

  const closeDetail = () => {
    setSelectedOrder(null);
    if (id) {
      navigate(ROUTES.PURCHASES);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-surface-secondary">
      {/* Odoo Control Panel */}
      <OdooControlPanel
        title="Purchase Orders"
        subtitle="Raw materials procurement, timber purchase contracts, and vendor bill processing"
        itemCount={filteredOrders.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search PO #, vendor..."
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewClick={() => {
          navigate(ROUTES.PURCHASES_NEW);
          setIsModalOpen(true);
        }}
        newButtonLabel="New PO"
        filterOptions={[
          { label: 'All', value: 'ALL' },
          { label: 'Draft', value: 'DRAFT' },
          { label: 'Confirmed', value: 'CONFIRMED' },
          { label: 'Billed', value: 'BILLED' },
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
        {/* KANBAN VIEW (Odoo-Style Purchase Order Cards)                */}
        {/* ============================================================ */}
        {viewMode === 'kanban' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredOrders.length === 0 ? (
              <div className="col-span-full py-12 text-center text-xs text-text-muted bg-white rounded-lg border border-surface-border">
                No purchase orders found matching filter criteria.
              </div>
            ) : (
              filteredOrders.map((po) => (
                <div
                  key={po.id}
                  onClick={() => setSelectedOrder(po)}
                  className="group bg-white rounded-lg border border-surface-border hover:border-navy-400 hover:shadow-md transition-all p-4 flex flex-col justify-between cursor-pointer relative overflow-hidden"
                >
                  <div className="space-y-2.5">
                    {/* Top Row: PO # & Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Package size={15} className="text-navy-600" />
                        <span className="font-mono font-bold text-sm text-navy-950 group-hover:text-brand-700 transition-colors">
                          {po.poNumber}
                        </span>
                      </div>
                      <Badge variant={getStatusBadgeVariant(po.status)} className="text-[10px] px-1.5 py-0 font-semibold">
                        {po.status}
                      </Badge>
                    </div>

                    {/* Vendor */}
                    <div className="flex items-center gap-1.5 text-xs text-navy-800 font-semibold truncate pt-1">
                      <Building2 size={13} className="text-text-muted shrink-0" />
                      <span className="truncate">{po.vendorName}</span>
                    </div>

                    {/* Dates & Line count */}
                    <div className="flex items-center justify-between text-[11px] text-text-muted pt-1 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} /> {po.orderDate}
                      </span>
                      <span>{po.lines.length} {po.lines.length === 1 ? 'item' : 'items'}</span>
                    </div>
                  </div>

                  {/* Footer: Amount & Action */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between">
                    <div>
                      <span className="text-[10px] text-text-muted block uppercase tracking-wider font-semibold">Grand Total</span>
                      <span className="font-mono font-bold text-sm text-navy-900">
                        ₹{po.grandTotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div onClick={(e) => e.stopPropagation()}>
                      {po.status === 'DRAFT' && (
                        <Button
                          size="sm"
                          onClick={() => handleConfirmPO(po.id)}
                          className="h-7 text-[11px] px-2.5 bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white font-medium cursor-pointer"
                        >
                          Confirm
                        </Button>
                      )}
                      {po.status === 'CONFIRMED' && (
                        <Button
                          size="sm"
                          onClick={() => handleGenerateBill(po.id)}
                          className="h-7 text-[11px] px-2.5 bg-brand-700 hover:bg-brand-800 text-white font-medium cursor-pointer shadow-2xs"
                        >
                          <Receipt size={11} className="mr-1" />
                          Bill
                        </Button>
                      )}
                      {po.status === 'BILLED' && po.billId && (
                        <Link
                          to={`/bills/${po.billId}`}
                          className="text-[11px] font-semibold text-brand-700 hover:underline flex items-center gap-0.5"
                        >
                          <span>Bill</span>
                          <ArrowRight size={11} />
                        </Link>
                      )}
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
                  <TableHead>PO #</TableHead>
                  <TableHead>Vendor / Supplier</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead className="text-right">GST (18%)</TableHead>
                  <TableHead className="text-right">Grand Total</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center text-xs text-text-muted">
                      No purchase orders found matching filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((po) => (
                    <TableRow
                      key={po.id}
                      onClick={() => setSelectedOrder(po)}
                      className="cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <TableCell className="font-mono text-xs font-semibold text-brand-700">
                        {po.poNumber}
                      </TableCell>
                      <TableCell className="font-medium text-navy-900 text-xs">{po.vendorName}</TableCell>
                      <TableCell className="text-xs text-text-muted">{po.orderDate}</TableCell>
                      <TableCell className="text-right font-mono text-xs text-text-muted">
                        ₹{po.subtotal.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs text-text-muted">
                        ₹{po.taxTotal.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs font-bold text-navy-900">
                        ₹{po.grandTotal.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={getStatusBadgeVariant(po.status)}>{po.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {po.status === 'DRAFT' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleConfirmPO(po.id)}
                              className="h-7 text-[11px] px-2 cursor-pointer"
                            >
                              Confirm
                            </Button>
                          )}
                          {po.status === 'CONFIRMED' && (
                            <Button
                              size="sm"
                              onClick={() => handleGenerateBill(po.id)}
                              className="h-7 text-[11px] px-2 bg-brand-700 hover:bg-brand-800 text-white cursor-pointer"
                            >
                              <Receipt size={11} className="mr-1" />
                              Bill
                            </Button>
                          )}
                          {po.status === 'BILLED' && po.billId && (
                            <Link to={`/bills/${po.billId}`}>
                              <Button variant="outline" size="sm" className="h-7 text-[11px] px-2 cursor-pointer">
                                View Bill
                              </Button>
                            </Link>
                          )}
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
      {/* NEW PO MODAL                                                 */}
      {/* ============================================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-xl border border-surface-border bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div>
                <h3 className="text-base font-bold text-navy-900">New Purchase Order</h3>
                <p className="text-xs text-text-muted">Procure raw materials or stock items from suppliers</p>
              </div>
              <button onClick={closeModal} className="rounded p-1 text-text-muted hover:bg-slate-100 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePO} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Supplier / Vendor *</label>
                <select
                  value={vendorId}
                  onChange={(e) => setVendorId(e.target.value)}
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
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
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
                <label className="block text-xs font-semibold text-navy-800 mb-1">Budget Analytics Account *</label>
                <select
                  value={selectedAnalyticId}
                  onChange={(e) => setSelectedAnalyticId(e.target.value)}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none cursor-pointer"
                >
                  {analyticAccounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.code ? `${a.code} - ` : ''}{a.name} ({a.type})
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
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs font-mono text-navy-900 focus:border-navy-600 focus:outline-none"
                />
              </div>

              {/* Non-blocking Exceeds Approved Budget Warning */}
              {(() => {
                const currentProd = products.find((p) => p.id === productId);
                const currentAcc = analyticAccounts.find((a) => a.id === selectedAnalyticId) || analyticAccounts[0];
                const estTotal = Math.round(((currentProd?.purchasePrice || 0) * quantity) * 1.18);
                const accBal = currentAcc?.balance ?? 50000;
                const exceeds = currentAcc && estTotal > accBal;
                if (!exceeds) return null;
                return (
                  <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 shadow-2xs space-y-1">
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-amber-900">⚠️ Exceeds Approved Budget</span>
                        <p className="text-[11px] text-amber-800 mt-0.5">
                          The entered amount (₹{estTotal.toLocaleString('en-IN')}) is higher than the remaining budget amount (₹{accBal.toLocaleString('en-IN')}) for this budget line. Consider adjusting the value or revise the budget.
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between text-navy-600">
                  <span>Subtotal</span>
                  <span className="font-mono">
                    ₹{((products.find((p) => p.id === productId)?.purchasePrice || 0) * quantity).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-navy-600">
                  <span>Input GST (18%)</span>
                  <span className="font-mono">
                    ₹{Math.round(((products.find((p) => p.id === productId)?.purchasePrice || 0) * quantity) * 0.18).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-navy-900 pt-1 border-t border-slate-200">
                  <span>Estimated Total</span>
                  <span className="font-mono">
                    ₹{Math.round(((products.find((p) => p.id === productId)?.purchasePrice || 0) * quantity) * 1.18).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white cursor-pointer">
                  Create Purchase Order
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* PO DETAIL DRAWER / FULL VIEW                                 */}
      {/* ============================================================ */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-3xl rounded-xl border border-surface-border bg-white p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Top Row Action Buttons matching Diagram */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedOrder(null);
                    setIsModalOpen(true);
                  }}
                  className="h-8 text-xs font-semibold cursor-pointer border-slate-300 hover:bg-slate-50"
                >
                  <Plus size={13} className="mr-1" />
                  New
                </Button>

                {selectedOrder.status === 'DRAFT' && (
                  <Button
                    size="sm"
                    onClick={() => handleConfirmPO(selectedOrder.id)}
                    className="h-8 text-xs font-semibold bg-brand-700 hover:bg-brand-800 text-white cursor-pointer shadow-2xs"
                  >
                    Confirm
                  </Button>
                )}

                {selectedOrder.status === 'CONFIRMED' && (
                  <Button
                    size="sm"
                    onClick={() => handleGenerateBill(selectedOrder.id)}
                    className="h-8 text-xs font-semibold bg-brand-700 hover:bg-brand-800 text-white cursor-pointer shadow-2xs"
                  >
                    <Receipt size={13} className="mr-1.5" />
                    Create Bill
                  </Button>
                )}

                {selectedOrder.status === 'BILLED' && selectedOrder.billId && (
                  <Button
                    size="sm"
                    onClick={() => navigate(`/bills/${selectedOrder.billId}`)}
                    className="h-8 text-xs font-semibold bg-brand-700 hover:bg-brand-800 text-white cursor-pointer shadow-2xs"
                  >
                    <Receipt size={13} className="mr-1.5" />
                    Open Bill ({selectedOrder.billId})
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setNotice(`PO ${selectedOrder.poNumber} marked as cancelled.`);
                    setSelectedOrder({ ...selectedOrder, status: 'DRAFT' });
                    setTimeout(() => setNotice(null), 3000);
                  }}
                  className="h-8 text-xs font-medium text-red-600 hover:bg-red-50 border-red-200 cursor-pointer"
                >
                  Cancel
                </Button>
              </div>

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
                <button onClick={closeDetail} className="text-text-muted hover:text-navy-900 p-1 cursor-pointer">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* PO Master Form Fields: PO No., Vendor Name, PO Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50/80 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">PO No.</span>
                <p className="font-mono font-bold text-sm text-navy-900 mt-1">{selectedOrder.poNumber}</p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Vendor Name</span>
                <p className="font-semibold text-sm text-navy-900 mt-1">{selectedOrder.vendorName}</p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">PO Date</span>
                <p className="font-medium text-sm text-navy-900 mt-1">{selectedOrder.orderDate}</p>
              </div>
            </div>

            {/* Non-blocking Warning Banner in PO View */}
            {(() => {
              const anyExceeded = selectedOrder.lines.some((ln) => {
                const acc = analyticAccounts.find((a) => a.id === ln.analyticAccountId) || analyticAccounts[0];
                return acc && ln.total > (acc.balance ?? 50000);
              });
              if (!anyExceeded && selectedOrder.grandTotal <= 50000) return null;
              return (
                <div className="rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-xs text-amber-900 shadow-2xs space-y-1">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-950 text-xs sm:text-sm">⚠️ Exceeds Approved Budget</span>
                      <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                        The entered amount is higher than the remaining budget amount for this budget line. Consider adjusting the value or revise the budget.
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Line Items Table with Sr. No., Product, Budget Analytics, Qty, Unit Price, Total */}
            <div>
              <span className="text-xs font-bold text-navy-900 uppercase tracking-wider block mb-2">
                Purchased Line Items
              </span>
              <div className="rounded-xl border border-surface-border overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/80 border-b border-surface-border text-navy-700 font-semibold">
                    <tr>
                      <th className="p-3 text-center w-12">Sr. No.</th>
                      <th className="p-3">Product</th>
                      <th className="p-3">Budget Analytics</th>
                      <th className="p-3 text-right">Qty</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {selectedOrder.lines.map((ln, idx) => (
                      <tr key={ln.id} className="hover:bg-slate-50/60">
                        <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                        <td className="p-3 font-semibold text-navy-900">{ln.productName}</td>
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

            {/* Totals Summary */}
            <div className="p-4 bg-slate-50/90 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-navy-600">
                <span>Subtotal</span>
                <span className="font-mono">₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-navy-600">
                <span>Input GST (18%)</span>
                <span className="font-mono">₹{selectedOrder.taxTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-navy-950 pt-2 border-t border-slate-200">
                <span>Grand Total</span>
                <span className="font-mono text-brand-700">₹{selectedOrder.grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PurchasesPage;
