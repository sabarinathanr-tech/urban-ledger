import { useState } from 'react';
import { Package, Plus, Search, Filter, CheckCircle2, Receipt, X } from 'lucide-react';
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
import {
  INITIAL_PURCHASE_ORDERS,
  INITIAL_CONTACTS,
  INITIAL_PRODUCTS,
  type PurchaseOrder,
} from '@/data/erpData';

export function PurchasesPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);

  // Form State
  const [vendorId, setVendorId] = useState('cnt-2');
  const [productId, setProductId] = useState('prd-1');
  const [quantity, setQuantity] = useState(10);
  const [notice, setNotice] = useState<string | null>(null);

  const filteredOrders = purchaseOrders.filter((po) => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.vendorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: PurchaseOrder['status']) => {
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
    const vendor = INITIAL_CONTACTS.find((c) => c.id === vendorId);
    const product = INITIAL_PRODUCTS.find((p) => p.id === productId);
    if (!vendor || !product) return;

    const subtotal = product.purchasePrice * quantity;
    const taxAmount = Math.round(subtotal * 0.18);
    const grandTotal = subtotal + taxAmount;

    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: `PO-2026-00${purchaseOrders.length + 1}`,
      vendorId: vendor.id,
      vendorName: vendor.name,
      orderDate: new Date().toISOString().split('T')[0],
      status: 'CONFIRMED',
      lines: [
        {
          id: `pol-${Date.now()}`,
          productId: product.id,
          productName: `${product.name} (Materials)`,
          quantity,
          unitPrice: product.purchasePrice,
          taxRate: 18,
          subtotal,
          taxAmount,
          total: grandTotal,
        },
      ],
      subtotal,
      taxTotal: taxAmount,
      grandTotal,
    };

    setPurchaseOrders([newPO, ...purchaseOrders]);
    setIsModalOpen(false);
    setNotice(`Purchase Order ${newPO.poNumber} issued to ${vendor.name}.`);
    setTimeout(() => setNotice(null), 5000);
  };

  const handleGenerateBill = (poId: string) => {
    setPurchaseOrders(
      purchaseOrders.map((po) => (po.id === poId ? { ...po, status: 'BILLED' } : po))
    );
    setNotice(`Vendor Bill generated for ${poId}. Registered under Accounts Payable.`);
    setTimeout(() => setNotice(null), 5000);
  };

  return (
    <div className="mx-auto max-w-dashboard space-y-5 p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-50 text-brand-700">
              <Package size={18} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-navy-900">Purchase Orders</h1>
          </div>
          <p className="mt-1 text-xs text-navy-400">
            Procurement workflows for raw timber, furniture components, and vendor bills.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5"
        >
          <Plus size={16} />
          <span>New Purchase Order</span>
        </Button>
      </div>

      {notice && (
        <div className="flex items-center justify-between rounded-md border border-brand-200 bg-brand-50/70 p-3 text-xs text-brand-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-brand-700" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-brand-600 hover:text-brand-900">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-navy-400" size={14} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search PO #, vendor..."
            className="w-full rounded-md border border-surface-border bg-white py-1.5 pl-8 pr-3 text-xs text-navy-800 placeholder-navy-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-navy-400" />
          <span className="text-xs text-navy-400">Status:</span>
          {['ALL', 'CONFIRMED', 'BILLED', 'DRAFT'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded px-2.5 py-1 text-xs font-medium transition ${
                statusFilter === st
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'bg-white border border-surface-border text-navy-600 hover:bg-surface-secondary'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* PO Table */}
      <div className="rounded-lg border border-surface-border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PO #</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
              <TableHead className="text-right">Input GST (18%)</TableHead>
              <TableHead className="text-right">Total Cost</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-xs text-navy-400">
                  No purchase orders found matching filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((po) => (
                <TableRow key={po.id} className="hover:bg-surface-secondary/60">
                  <TableCell className="font-mono text-xs font-semibold text-brand-700">
                    {po.poNumber}
                  </TableCell>
                  <TableCell className="font-medium text-navy-900">{po.vendorName}</TableCell>
                  <TableCell className="text-xs text-navy-500">{po.orderDate}</TableCell>
                  <TableCell className="text-right font-mono text-xs">
                    ₹{po.subtotal.toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-navy-400">
                    ₹{po.taxTotal.toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs font-bold text-navy-900">
                    ₹{po.grandTotal.toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getStatusBadgeVariant(po.status)}>{po.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(po)}
                        className="h-7 text-[11px] px-2"
                      >
                        View
                      </Button>
                      {po.status === 'CONFIRMED' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleGenerateBill(po.id)}
                          className="h-7 text-[11px] px-2 bg-brand-700 hover:bg-brand-800"
                        >
                          Bill
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/50 p-4">
          <div className="w-full max-w-lg rounded-lg border border-surface-border bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h2 className="text-base font-bold text-navy-900">Create Purchase Order</h2>
              <button onClick={() => setIsModalOpen(false)} className="rounded p-1 text-navy-400 hover:bg-surface-secondary">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePO} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">Vendor</label>
                <select
                  value={vendorId}
                  onChange={(e) => setVendorId(e.target.value)}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-800 focus:border-brand-500 focus:outline-none"
                >
                  {INITIAL_CONTACTS.filter((c) => c.type === 'VENDOR' || c.type === 'BOTH').map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">Item / Component</label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-800 focus:border-brand-500 focus:outline-none"
                >
                  {INITIAL_PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — Unit Cost: ₹{p.purchasePrice.toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">Quantity Units</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-800 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="rounded-md bg-surface-secondary p-3 text-xs space-y-1">
                <div className="flex justify-between text-navy-500">
                  <span>Subtotal:</span>
                  <span className="font-mono">
                    ₹{((INITIAL_PRODUCTS.find((p) => p.id === productId)?.purchasePrice || 0) * quantity).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-navy-500">
                  <span>Input GST (18%):</span>
                  <span className="font-mono">
                    ₹{Math.round(((INITIAL_PRODUCTS.find((p) => p.id === productId)?.purchasePrice || 0) * quantity) * 0.18).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-navy-900 border-t border-surface-border pt-1">
                  <span>Grand Total Cost:</span>
                  <span className="font-mono text-brand-700">
                    ₹{Math.round(((INITIAL_PRODUCTS.find((p) => p.id === productId)?.purchasePrice || 0) * quantity) * 1.18).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="bg-brand-700 hover:bg-brand-800">
                  Issue Purchase Order
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PO Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/50 p-4">
          <div className="w-full max-w-md rounded-lg border border-surface-border bg-white p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-surface-border pb-2">
              <div className="flex items-center gap-2">
                <Receipt className="text-brand-600" size={18} />
                <h3 className="font-bold text-navy-900">{selectedOrder.poNumber}</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-navy-400 hover:text-navy-600">
                <X size={16} />
              </button>
            </div>
            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-navy-400">Vendor:</span>
                <span className="font-semibold text-navy-900">{selectedOrder.vendorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-400">Order Date:</span>
                <span className="text-navy-700">{selectedOrder.orderDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-400">Status:</span>
                <Badge variant={getStatusBadgeVariant(selectedOrder.status)}>{selectedOrder.status}</Badge>
              </div>
              <div className="border-t border-surface-border pt-2">
                <span className="font-semibold text-navy-800">Supplied Components:</span>
                {selectedOrder.lines.map((l) => (
                  <div key={l.id} className="flex justify-between py-1 text-navy-600">
                    <span>{l.productName} &times; {l.quantity}</span>
                    <span className="font-mono">₹{l.total.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-surface-border pt-2 flex justify-between font-bold text-navy-900">
                <span>Total Payable:</span>
                <span className="font-mono text-brand-700">₹{selectedOrder.grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
