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
    analyticAccounts,
    addContact,
    addProduct,
    addAnalyticAccount,
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
  const [selectedAnalyticId, setSelectedAnalyticId] = useState(analyticAccounts[0]?.id || '');
  const [orderNotice, setOrderNotice] = useState<string | null>(null);

  // "Other" / Custom Entry States
  const [customCustomerName, setCustomCustomerName] = useState('');
  const [customCustomerCity, setCustomCustomerCity] = useState('');
  const [customProductName, setCustomProductName] = useState('');
  const [customProductPrice, setCustomProductPrice] = useState(15000);
  const [customProductCategory, setCustomProductCategory] = useState('Custom Furniture');
  const [customAnalyticName, setCustomAnalyticName] = useState('');

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
      case 'QUOTATION':
        return 'warning';
      case 'DRAFT':
        return 'default';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'default';
    }
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();

    let customer = contacts.find((c) => c.id === customerId);
    if (customerId === '__OTHER__') {
      if (!customCustomerName.trim()) return;
      customer = addContact({
        name: customCustomerName.trim(),
        type: 'CUSTOMER',
        email: `${customCustomerName.trim().toLowerCase().replace(/\s+/g, '')}@client.com`,
        mobile: '+91 98765 43210',
        city: customCustomerCity.trim() || 'Coimbatore',
        state: 'Tamil Nadu',
        pincode: '641001',
      });
    }

    let product = products.find((p) => p.id === productId);
    if (productId === '__OTHER__') {
      if (!customProductName.trim()) return;
      const salesP = Number(customProductPrice) || 5000;
      product = addProduct({
        name: customProductName.trim(),
        salesPrice: salesP,
        purchasePrice: Math.round(salesP * 0.65),
        category: customProductCategory.trim() || 'Custom Orders',
        type: 'GOODS',
        stock: 25,
      });
    }

    if (!customer || !product) return;

    let chosenAnalytic = analyticAccounts.find((a) => a.id === selectedAnalyticId);
    if (selectedAnalyticId === '__OTHER__') {
      if (customAnalyticName.trim()) {
        chosenAnalytic = addAnalyticAccount({
          name: customAnalyticName.trim(),
          type: 'INCOME',
          description: 'Custom revenue stream created via sales order',
        });
      } else {
        chosenAnalytic = analyticAccounts[0];
      }
    } else if (!chosenAnalytic) {
      chosenAnalytic = analyticAccounts[0];
    }

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
      analyticAccountId: chosenAnalytic?.id,
      analyticAccountName: chosenAnalytic ? (chosenAnalytic.code ? `${chosenAnalytic.code} - ${chosenAnalytic.name}` : chosenAnalytic.name) : 'General Commercial Operations',
      chartOfAccount: 'Sales Account (Revenue)',
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
    setSelectedOrder(newOrder);
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
      navigate(`/invoices/${invoice.id}`);
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
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-surface-secondary">
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
      <div className="flex-1 px-4 sm:px-6 pt-4 pb-8 space-y-4 w-full max-w-7xl mx-auto">
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
                          className="h-7 text-[11px] px-2.5 bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white font-medium cursor-pointer"
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
                  <option value="__OTHER__">➕ Other (Enter New Customer Details...)</option>
                  {contacts
                    .filter((c) => c.type === 'CUSTOMER' || c.type === 'BOTH')
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.city})
                      </option>
                    ))}
                </select>
                {customerId === '__OTHER__' && (
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
                <label className="block text-xs font-semibold text-navy-800 mb-1">Product Item *</label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none cursor-pointer"
                >
                  <option value="__OTHER__">➕ Other (Enter Custom Product Details...)</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ₹{p.salesPrice.toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
                {productId === '__OTHER__' && (
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
                  value={selectedAnalyticId}
                  onChange={(e) => setSelectedAnalyticId(e.target.value)}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none cursor-pointer"
                >
                  <option value="__OTHER__">➕ Other (Enter Custom Analytic Account...)</option>
                  <optgroup label="Revenue & Income Analytics (Recommended for Sales)">
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
                {selectedAnalyticId === '__OTHER__' && (
                  <div className="mt-2 p-2.5 rounded-md bg-brand-50/60 border border-brand-200">
                    <label className="block text-[11px] font-semibold text-brand-900 mb-0.5">Analytic Stream Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Commercial Studio Expansion"
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
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs font-mono text-navy-900 focus:border-navy-600 focus:outline-none"
                />
              </div>

              {(() => {
                const activePrice = productId === '__OTHER__'
                  ? (Number(customProductPrice) || 0)
                  : (products.find((p) => p.id === productId)?.salesPrice || 0);
                const calcSubtotal = activePrice * quantity;
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
                      <span>Estimated Total</span>
                      <span className="font-mono">₹{calcTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                );
              })()}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white cursor-pointer font-semibold">
                  Create Sales Order
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SALES ORDER DETAIL DRAWER / FULL VIEW                        */}
      {/* ============================================================ */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-3xl rounded-xl border border-surface-border bg-white p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Top Row Action Buttons matching Diagram: New, Confirm, Create Invoice, Cancel, Back */}
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
                    onClick={() => handleConfirmOrder(selectedOrder.id)}
                    className="h-8 text-xs font-semibold bg-brand-700 hover:bg-brand-800 text-white cursor-pointer shadow-2xs"
                  >
                    Confirm
                  </Button>
                )}

                {selectedOrder.status === 'CONFIRMED' && (
                  <Button
                    size="sm"
                    onClick={() => handleGenerateInvoice(selectedOrder.id)}
                    className="h-8 text-xs font-semibold bg-brand-700 hover:bg-brand-800 text-white cursor-pointer shadow-2xs"
                  >
                    <FileText size={13} className="mr-1.5" />
                    Create Invoice
                  </Button>
                )}

                {selectedOrder.status === 'INVOICED' && selectedOrder.invoiceId && (
                  <Button
                    size="sm"
                    onClick={() => navigate(`/invoices/${selectedOrder.invoiceId}`)}
                    className="h-8 text-xs font-semibold bg-brand-700 hover:bg-brand-800 text-white cursor-pointer shadow-2xs"
                  >
                    <FileText size={13} className="mr-1.5" />
                    Open Invoice ({selectedOrder.invoiceId})
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setOrderNotice(`Sales Order ${selectedOrder.orderNumber} marked as cancelled.`);
                    setSelectedOrder({ ...selectedOrder, status: 'DRAFT' });
                    setTimeout(() => setOrderNotice(null), 3000);
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

            {/* Master Fields: SO No., Customer Name, SO Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50/80 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">SO No.</span>
                <p className="font-mono font-bold text-sm text-navy-900 mt-1">{selectedOrder.orderNumber}</p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Customer Name</span>
                <p className="font-semibold text-sm text-navy-900 mt-1">{selectedOrder.customerName}</p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">SO Date</span>
                <p className="font-medium text-sm text-navy-900 mt-1">{selectedOrder.orderDate}</p>
              </div>
            </div>

            {/* Line Items Table: Sr. No., Product, Budget Analytics, Qty, Unit Price, Subtotal */}
            <div>
              <span className="text-xs font-bold text-navy-900 uppercase tracking-wider block mb-2">
                Order Line Items
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
                      <th className="p-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {selectedOrder.lines.map((ln, idx) => {
                      const lineSubtotal = ln.subtotal || (ln.quantity * ln.unitPrice);
                      const cleanAnalyticName = ln.analyticAccountName && !ln.analyticAccountName.includes('Expense')
                        ? ln.analyticAccountName
                        : 'Commercial Furniture Sales (Income)';
                      return (
                        <tr key={ln.id} className="hover:bg-slate-50/60">
                          <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                          <td className="p-3 font-semibold text-navy-900">{ln.productName}</td>
                          <td className="p-3 text-xs text-navy-700">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {cleanAnalyticName}
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

            {/* Totals Summary */}
            <div className="p-4 bg-slate-50/90 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-navy-600">
                <span>Subtotal</span>
                <span className="font-mono">₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-navy-600">
                <span>GST (18%)</span>
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

export default SalesPage;
