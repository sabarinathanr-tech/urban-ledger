import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ShoppingCart,
  CheckCircle2,
  FileText,
  X,
  Calendar,
  User,
  ArrowRight,
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
import type { SalesOrder } from '@/data/erpData';
import { OdooControlPanel, type ViewMode } from '@/components/layout/OdooControlPanel';

export function SalesPage() {
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    salesOrders,
    createSalesOrder,
    confirmSalesOrder,
    generateInvoiceFromSO,
    contacts,
    products,
    refreshERPData,
  } = useERP();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);

  // Eligible customers (CUSTOMER or BOTH)
  const eligibleCustomers = contacts.filter((c) => c.type === 'CUSTOMER' || c.type === 'BOTH');
  const [customerId, setCustomerId] = useState(eligibleCustomers[0]?.id || contacts[0]?.id || '');
  const [productId, setProductId] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState(2);
  const [orderNotice, setOrderNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId && (eligibleCustomers[0]?.id || contacts[0]?.id)) {
      setCustomerId(eligibleCustomers[0]?.id || contacts[0]?.id);
    }
  }, [customerId, eligibleCustomers, contacts]);

  useEffect(() => {
    if (!productId && products[0]?.id) {
      setProductId(products[0]?.id);
    }
  }, [productId, products]);

  // Check route triggers (/sales/new or /sales/:id)
  useEffect(() => {
    if (location.pathname === ROUTES.SALES_NEW) {
      setIsModalOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (id) {
      const found = salesOrders.find(
        (o) => o.id === id || o.orderNumber.toLowerCase() === id.toLowerCase()
      );
      if (found) {
        setSelectedOrder(found);
      }
    }
  }, [id, salesOrders]);

  const filteredOrders = salesOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: SalesOrder['status']): 'default' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'outline' => {
    switch (status) {
      case 'INVOICED':
        return 'success';
      case 'CONFIRMED':
        return 'info';
      case 'DRAFT':
        return 'default';
      case 'CANCELLED':
        return 'danger';
    }
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = contacts.find((c) => c.id === customerId);
    const product = products.find((p) => p.id === productId);

    if (!customer || !product) return;

    const subtotal = product.salesPrice * quantity;
    const taxAmount = Math.round(subtotal * 0.18);
    const grandTotal = subtotal + taxAmount;

    const line = {
      id: `sol-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      quantity,
      unitPrice: product.salesPrice,
      taxRate: 18,
      subtotal,
      taxAmount,
      total: grandTotal,
    };

    const newOrder = createSalesOrder({
      customerId: customer.id,
      customerName: customer.name,
      orderDate: new Date().toISOString().split('T')[0],
      lines: [line],
      subtotal,
      taxTotal: taxAmount,
      grandTotal,
      status: 'DRAFT',
    });

    setIsModalOpen(false);
    if (location.pathname === ROUTES.SALES_NEW) {
      navigate(ROUTES.SALES);
    }
    setOrderNotice(`Sales Order ${newOrder.orderNumber} created successfully in DRAFT state.`);
    setTimeout(() => setOrderNotice(null), 5000);
  };

  const handleConfirmOrder = (orderId: string) => {
    confirmSalesOrder(orderId);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: 'CONFIRMED' });
    }
    setOrderNotice(`Sales Order confirmed. Ready for Customer Tax Invoice generation.`);
    setTimeout(() => setOrderNotice(null), 4000);
  };

  const handleGenerateInvoice = (orderId: string) => {
    const invoice = generateInvoiceFromSO(orderId);
    if (invoice) {
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: 'INVOICED', invoiceId: invoice.id });
      }
      setOrderNotice(
        `Invoice ${invoice.invoiceNumber} created and posted with double-entry journal entry to General Ledger.`
      );
      setTimeout(() => setOrderNotice(null), 5000);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (location.pathname === ROUTES.SALES_NEW) {
      navigate(ROUTES.SALES);
    }
  };

  const closeDetail = () => {
    setSelectedOrder(null);
    if (id) {
      navigate(ROUTES.SALES);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-surface-secondary">
      {/* Odoo Control Panel */}
      <OdooControlPanel
        title="Sales Orders"
        subtitle="Customer quotations, confirmed sales orders, and tax invoice generation"
        itemCount={filteredOrders.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search order #, customer..."
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewClick={() => {
          navigate(ROUTES.SALES_NEW);
          setIsModalOpen(true);
        }}
        newButtonLabel="New Quotation"
        filterOptions={[
          { label: 'All', value: 'ALL' },
          { label: 'Draft', value: 'DRAFT' },
          { label: 'Confirmed', value: 'CONFIRMED' },
          { label: 'Invoiced', value: 'INVOICED' },
        ]}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
        onRefresh={refreshERPData}
      />

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 max-w-7xl w-full mx-auto">
        {orderNotice && (
          <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 shadow-2xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
              <span className="font-medium">{orderNotice}</span>
            </div>
            <button onClick={() => setOrderNotice(null)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">
              <X size={14} />
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/* KANBAN VIEW (Odoo-Style Sales Order Cards)                   */}
        {/* ============================================================ */}
        {viewMode === 'kanban' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredOrders.length === 0 ? (
              <div className="col-span-full py-12 text-center text-xs text-text-muted bg-white rounded-lg border border-surface-border">
                No sales orders found matching filter criteria.
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="group bg-white rounded-lg border border-surface-border hover:border-navy-400 hover:shadow-md transition-all p-4 flex flex-col justify-between cursor-pointer relative overflow-hidden"
                >
                  <div className="space-y-2.5">
                    {/* Top Row: Order Number & Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <ShoppingCart size={15} className="text-navy-600" />
                        <span className="font-mono font-bold text-sm text-navy-950 group-hover:text-brand-700 transition-colors">
                          {order.orderNumber}
                        </span>
                      </div>
                      <Badge variant={getStatusBadgeVariant(order.status)} className="text-[10px] px-1.5 py-0 font-semibold">
                        {order.status}
                      </Badge>
                    </div>

                    {/* Customer */}
                    <div className="flex items-center gap-1.5 text-xs text-navy-800 font-semibold truncate pt-1">
                      <User size={13} className="text-text-muted shrink-0" />
                      <span className="truncate">{order.customerName}</span>
                    </div>

                    {/* Date and Line Items Count */}
                    <div className="flex items-center justify-between text-[11px] text-text-muted pt-1 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} /> {order.orderDate}
                      </span>
                      <span>{order.lines.length} {order.lines.length === 1 ? 'item' : 'items'}</span>
                    </div>
                  </div>

                  {/* Footer: Amount & Action Button */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between">
                    <div>
                      <span className="text-[10px] text-text-muted block uppercase tracking-wider font-semibold">Grand Total</span>
                      <span className="font-mono font-bold text-sm text-navy-900">
                        ₹{order.grandTotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div onClick={(e) => e.stopPropagation()}>
                      {order.status === 'DRAFT' && (
                        <Button
                          size="sm"
                          onClick={() => handleConfirmOrder(order.id)}
                          className="h-7 text-[11px] px-2.5 bg-navy-900 hover:bg-navy-800 text-white font-medium cursor-pointer"
                        >
                          Confirm
                        </Button>
                      )}
                      {order.status === 'CONFIRMED' && (
                        <Button
                          size="sm"
                          onClick={() => handleGenerateInvoice(order.id)}
                          className="h-7 text-[11px] px-2.5 bg-brand-700 hover:bg-brand-800 text-white font-medium cursor-pointer shadow-2xs"
                        >
                          <FileText size={11} className="mr-1" />
                          Invoice
                        </Button>
                      )}
                      {order.status === 'INVOICED' && order.invoiceId && (
                        <Link
                          to={`/invoices/${order.invoiceId}`}
                          className="text-[11px] font-semibold text-brand-700 hover:underline flex items-center gap-0.5"
                        >
                          <span>Invoice</span>
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
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
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
                      No sales orders found matching filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <TableCell className="font-mono text-xs font-semibold text-brand-700">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell className="font-medium text-navy-900 text-xs">{order.customerName}</TableCell>
                      <TableCell className="text-xs text-text-muted">{order.orderDate}</TableCell>
                      <TableCell className="text-right font-mono text-xs text-text-muted">
                        ₹{order.subtotal.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs text-text-muted">
                        ₹{order.taxTotal.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs font-bold text-navy-900">
                        ₹{order.grandTotal.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {order.status === 'DRAFT' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleConfirmOrder(order.id)}
                              className="h-7 text-[11px] px-2 cursor-pointer"
                            >
                              Confirm
                            </Button>
                          )}
                          {order.status === 'CONFIRMED' && (
                            <Button
                              size="sm"
                              onClick={() => handleGenerateInvoice(order.id)}
                              className="h-7 text-[11px] px-2 bg-brand-700 hover:bg-brand-800 text-white cursor-pointer"
                            >
                              <FileText size={11} className="mr-1" />
                              Invoice
                            </Button>
                          )}
                          {order.status === 'INVOICED' && order.invoiceId && (
                            <Link to={`/invoices/${order.invoiceId}`}>
                              <Button variant="outline" size="sm" className="h-7 text-[11px] px-2 cursor-pointer">
                                View Invoice
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
      {/* NEW ORDER CREATION MODAL                                     */}
      {/* ============================================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-xl border border-surface-border bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div>
                <h3 className="text-base font-bold text-navy-900">New Sales Quotation</h3>
                <p className="text-xs text-text-muted">Select customer and furniture product items</p>
              </div>
              <button onClick={closeModal} className="rounded p-1 text-text-muted hover:bg-slate-100 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Customer *</label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
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
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
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
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs font-mono text-navy-900 focus:border-navy-600 focus:outline-none"
                />
              </div>

              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between text-navy-600">
                  <span>Subtotal</span>
                  <span className="font-mono">
                    ₹{((products.find((p) => p.id === productId)?.salesPrice || 0) * quantity).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-navy-600">
                  <span>Output GST (18%)</span>
                  <span className="font-mono">
                    ₹{Math.round(((products.find((p) => p.id === productId)?.salesPrice || 0) * quantity) * 0.18).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-navy-900 pt-1 border-t border-slate-200">
                  <span>Estimated Total</span>
                  <span className="font-mono">
                    ₹{Math.round(((products.find((p) => p.id === productId)?.salesPrice || 0) * quantity) * 1.18).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-navy-900 hover:bg-navy-800 text-white cursor-pointer">
                  Create Sales Order
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SALES ORDER DETAIL DRAWER                                    */}
      {/* ============================================================ */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xl rounded-xl border border-surface-border bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-surface-border pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-navy-900">{selectedOrder.orderNumber}</h3>
                  <Badge variant={getStatusBadgeVariant(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </div>
                <p className="text-xs text-text-muted mt-0.5">
                  Customer: <span className="font-semibold text-navy-900">{selectedOrder.customerName}</span>
                </p>
              </div>
              <button onClick={closeDetail} className="text-text-muted hover:text-navy-900 p-1 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Dates & Reference */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-text-muted uppercase">Quotation Date</span>
                <p className="font-semibold text-navy-900 mt-0.5">{selectedOrder.orderDate}</p>
              </div>
              <div>
                <span className="text-[10px] text-text-muted uppercase">Invoice Link</span>
                <p className="font-semibold text-brand-700 mt-0.5">
                  {selectedOrder.invoiceId ? (
                    <Link to={`/invoices/${selectedOrder.invoiceId}`} className="hover:underline">
                      {selectedOrder.invoiceId}
                    </Link>
                  ) : (
                    'Pending Invoicing'
                  )}
                </p>
              </div>
            </div>

            {/* Line Items */}
            <div>
              <span className="text-xs font-bold text-navy-900 uppercase tracking-wider block mb-2">
                Order Line Items
              </span>
              <div className="rounded-lg border border-surface-border overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-surface-border text-navy-600">
                    <tr>
                      <th className="p-2.5">Product</th>
                      <th className="p-2.5 text-right">Qty</th>
                      <th className="p-2.5 text-right">Unit Price</th>
                      <th className="p-2.5 text-right">Tax (18%)</th>
                      <th className="p-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedOrder.lines.map((ln) => (
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
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between text-navy-600">
                <span>Subtotal</span>
                <span className="font-mono">₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-navy-600">
                <span>GST (18%)</span>
                <span className="font-mono">₹{selectedOrder.taxTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-navy-900 pt-1 border-t border-slate-200">
                <span>Grand Total</span>
                <span className="font-mono">₹{selectedOrder.grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-border">
              {selectedOrder.status === 'DRAFT' && (
                <Button
                  size="sm"
                  onClick={() => handleConfirmOrder(selectedOrder.id)}
                  className="bg-navy-900 hover:bg-navy-800 text-white text-xs cursor-pointer"
                >
                  Confirm Order
                </Button>
              )}
              {selectedOrder.status === 'CONFIRMED' && (
                <Button
                  size="sm"
                  onClick={() => handleGenerateInvoice(selectedOrder.id)}
                  className="bg-brand-700 hover:bg-brand-800 text-white text-xs cursor-pointer"
                >
                  <FileText size={13} className="mr-1.5" />
                  Generate Invoice
                </Button>
              )}
              {selectedOrder.status === 'INVOICED' && selectedOrder.invoiceId && (
                <Link to={`/invoices/${selectedOrder.invoiceId}`}>
                  <Button variant="outline" size="sm" className="text-xs cursor-pointer">
                    Open Tax Invoice
                  </Button>
                </Link>
              )}
              <Button variant="outline" size="sm" onClick={closeDetail} className="cursor-pointer">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SalesPage;
