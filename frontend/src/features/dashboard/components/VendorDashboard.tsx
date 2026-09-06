import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Receipt,
  FileCheck2,
  Building2,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Eye,
  Plus,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useERP } from '@/context/ERPContext';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/app/config';
import { formatCurrency } from '../utils';
import { TaxInvoiceDocument } from '@/components/documents/TaxInvoiceDocument';
import type { Bill } from '@/data/erpData';

export const VendorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { bills, payments, createBill } = useERP();

  const [selectedViewBill, setSelectedViewBill] = useState<Bill | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNPAID' | 'PAID'>('ALL');
  const [isSubmitBillOpen, setIsSubmitBillOpen] = useState(false);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string | null>(null);

  // Bill creation form state
  const [billForm, setBillForm] = useState({
    itemDescription: 'High-Density Teak Wood Batch',
    quantity: 10,
    unitPrice: 3500,
    dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
  });

  const userEmail = (user?.email || '').toLowerCase().trim();
  const userName = (user?.fullName || '').toLowerCase().trim();

  // Filter bills for this specific vendor
  const vendorBills = bills.filter((b) => {
    if (user?.contact?.id && b.vendorId === user.contact.id) return true;
    if (b.vendorEmail && b.vendorEmail.toLowerCase().trim() === userEmail) return true;
    if (userName && b.vendorName.toLowerCase().includes(userName.split(' ')[0])) return true;
    if (userEmail.includes('mohit') || userName.includes('mohit')) {
      return b.vendorName.toLowerCase().includes('mohit') || b.vendorId === 'cnt_mohit_vendor';
    }
    if (userEmail.includes('azure') || userName.includes('azure')) {
      return b.vendorName.toLowerCase().includes('azure');
    }
    return false;
  });

  const displayBills = vendorBills.filter((b) => {
    if (statusFilter === 'UNPAID') return b.status !== 'PAID' && b.status !== 'CANCELLED';
    if (statusFilter === 'PAID') return b.status === 'PAID';
    return true;
  });

  // Calculate KPIs
  const totalReceivable = vendorBills
    .filter((b) => b.status !== 'PAID' && b.status !== 'CANCELLED')
    .reduce((sum, b) => sum + (b.balanceDue || b.grandTotal), 0);

  const totalCleared = vendorBills
    .reduce((sum, b) => sum + (b.amountPaid || (b.status === 'PAID' ? b.grandTotal : 0)), 0);

  const pendingBillsCount = vendorBills.filter(
    (b) => b.status === 'POSTED' || b.status === 'OVERDUE' || b.status === 'PARTIALLY_PAID'
  ).length;

  const overdueCount = vendorBills.filter((b) => b.status === 'OVERDUE').length;

  // Filter payments received by this vendor
  const vendorDisbursements = payments.filter((p) => {
    if (p.type !== 'VENDOR_PAYMENT') return false;
    if (user?.contact?.id && p.contactId === user.contact.id) return true;
    if (userName && p.contactName.toLowerCase().includes(userName.split(' ')[0])) return true;
    if (userEmail.includes('mohit') || userName.includes('mohit')) {
      return p.contactName.toLowerCase().includes('mohit') || p.contactId === 'cnt_mohit_vendor';
    }
    return p.contactName.toLowerCase().includes('azure');
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge variant="success">Cleared</Badge>;
      case 'OVERDUE':
        return <Badge variant="danger">Overdue Payment</Badge>;
      case 'PARTIALLY_PAID':
        return <Badge variant="warning">Partially Cleared</Badge>;
      default:
        return <Badge variant="default">Under Review</Badge>;
    }
  };

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(billForm.quantity) || 1;
    const price = Number(billForm.unitPrice) || 0;
    const subtotal = qty * price;
    const taxTotal = Math.round(subtotal * 0.18 * 100) / 100;
    const grandTotal = subtotal + taxTotal;

    const vendorName = user?.fullName || 'Azure Furniture';
    const vendorId = user?.contact?.id || 'cnt_azure_1';

    const newBill = createBill({
      vendorId,
      vendorName,
      billDate: new Date().toISOString().split('T')[0],
      dueDate: billForm.dueDate,
      lines: [
        {
          id: `line-${Date.now()}`,
          productId: 'prod-001',
          productName: billForm.itemDescription,
          quantity: qty,
          unitPrice: price,
          taxRate: 18,
          taxAmount: taxTotal,
          subtotal,
          total: grandTotal,
        },
      ],
      subtotal,
      taxTotal,
      grandTotal,
      amountPaid: 0,
      balanceDue: grandTotal,
      status: 'POSTED',
      notes: 'Submitted via Vendor Self-Service Portal',
    });

    setIsSubmitBillOpen(false);
    setSubmitSuccessMsg(`Procurement bill ${newBill.billNumber} submitted successfully to Urban Furniture accounts!`);
    setTimeout(() => setSubmitSuccessMsg(null), 5000);
  };

  return (
    <div className="mx-auto max-w-7xl w-full space-y-6 p-4 sm:p-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-surface-border shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-xs">
            <Building2 size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-navy-950">
                Welcome, {user?.fullName || 'Vendor Partner'}
              </h1>
              <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
                Vendor Portal
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Review material procurement bills, track clearance schedules, and submit supply vouchers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setIsSubmitBillOpen(true)}
            className="bg-blue-700 hover:bg-blue-800 text-white text-xs gap-1.5 cursor-pointer h-8 shadow-xs"
          >
            <Plus size={13} />
            <span>Submit New Bill</span>
          </Button>
          <Link to={ROUTES.BILLS}>
            <Button variant="outline" size="sm" className="text-xs h-8">
              <Receipt size={14} className="mr-1" />
              All Bills ({vendorBills.length})
            </Button>
          </Link>
          <Link to={ROUTES.PAYMENTS}>
            <Button variant="outline" size="sm" className="text-xs h-8">
              <FileCheck2 size={14} className="mr-1" />
              Disbursements
            </Button>
          </Link>
        </div>
      </div>

      {submitSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span className="font-semibold">{submitSuccessMsg}</span>
        </div>
      )}

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Receivable */}
        <div className="bg-white p-4 rounded-xl border border-surface-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-caption text-navy-400">
            <span>Outstanding Receivable</span>
            <AlertCircle
              size={16}
              className={totalReceivable > 0 ? 'text-blue-600' : 'text-emerald-500'}
            />
          </div>
          <p className="text-heading font-bold text-navy-950 font-mono">
            {formatCurrency(totalReceivable)}
          </p>
          <p className="text-[11px] text-text-muted">
            {overdueCount > 0 ? `${overdueCount} bill(s) pending clearance` : 'All cleared on schedule'}
          </p>
        </div>

        {/* Total Cleared */}
        <div className="bg-white p-4 rounded-xl border border-surface-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-caption text-navy-400">
            <span>Total Cleared Payouts</span>
            <CheckCircle2 size={16} className="text-emerald-600" />
          </div>
          <p className="text-heading font-bold text-emerald-700 font-mono">
            {formatCurrency(totalCleared)}
          </p>
          <p className="text-[11px] text-text-muted">Lifetime disbursements received</p>
        </div>

        {/* Pending Clearance */}
        <div className="bg-white p-4 rounded-xl border border-surface-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-caption text-navy-400">
            <span>Bills Awaiting Payment</span>
            <FileCheck2 size={16} className="text-blue-600" />
          </div>
          <p className="text-heading font-bold text-navy-950 font-mono">
            {pendingBillsCount}
          </p>
          <p className="text-[11px] text-text-muted">In finance processing queue</p>
        </div>

        {/* Total Bills */}
        <div className="bg-white p-4 rounded-xl border border-surface-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-caption text-navy-400">
            <span>Total Transactions</span>
            <CreditCard size={16} className="text-blue-600" />
          </div>
          <p className="text-heading font-bold text-navy-950 font-mono">
            {vendorBills.length}
          </p>
          <p className="text-[11px] text-text-muted">Total supply orders and invoices</p>
        </div>
      </div>

      {/* Submitted Bills Table */}
      <div className="bg-white rounded-xl border border-surface-border shadow-2xs overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-b border-surface-border">
          <div>
            <h2 className="text-base font-bold text-navy-950">Your Submitted Bills</h2>
            <p className="text-xs text-text-muted">Procurement bills submitted to Urban Furniture accounts department</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md text-xs">
              {(['ALL', 'UNPAID', 'PAID'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setStatusFilter(filter)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                    statusFilter === filter
                      ? 'bg-white text-navy-950 font-bold shadow-2xs'
                      : 'text-text-muted hover:text-navy-900'
                  }`}
                >
                  {filter === 'ALL' && `All (${vendorBills.length})`}
                  {filter === 'UNPAID' && 'Pending'}
                  {filter === 'PAID' && 'Cleared'}
                </button>
              ))}
            </div>

            <Link to={ROUTES.BILLS} className="text-xs text-blue-700 hover:underline font-medium ml-2">
              View All &rarr;
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-navy-600 border-b border-surface-border font-semibold">
              <tr>
                <th className="px-5 py-3">Bill Number</th>
                <th className="px-5 py-3">Bill Date</th>
                <th className="px-5 py-3">Due Date</th>
                <th className="px-5 py-3 text-right">Bill Total</th>
                <th className="px-5 py-3 text-right">Amount Cleared</th>
                <th className="px-5 py-3 text-right">Balance Due</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {displayBills.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-text-muted">
                    No vendor bills match your selected filter.
                  </td>
                </tr>
              ) : (
                displayBills.slice(0, 10).map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3 font-semibold text-navy-950 font-mono">
                      {b.billNumber}
                    </td>
                    <td className="px-5 py-3 text-text-muted">{b.billDate}</td>
                    <td className="px-5 py-3 text-text-muted">{b.dueDate}</td>
                    <td className="px-5 py-3 text-right font-mono font-medium text-navy-900">
                      ₹{b.grandTotal.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-emerald-700">
                      ₹{(b.amountPaid || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3 text-right font-mono font-bold text-navy-950">
                      ₹{(b.balanceDue || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3 text-center">{getStatusBadge(b.status)}</td>
                    <td className="px-5 py-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedViewBill(b)}
                        className="text-[11px] h-7 px-2 text-navy-700 hover:text-blue-700 cursor-pointer"
                        title="View & Download PDF"
                      >
                        <Eye size={12} className="mr-1" />
                        View / PDF
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disbursements Section */}
      <div className="bg-white rounded-xl border border-surface-border shadow-2xs overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
          <div>
            <h2 className="text-base font-bold text-navy-950">Disbursement & Settlement History</h2>
            <p className="text-xs text-text-muted">Bank transfers and payouts issued by Urban Furniture</p>
          </div>
          <Link to={ROUTES.PAYMENTS} className="text-xs text-blue-700 hover:underline font-medium">
            View All &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-navy-600 border-b border-surface-border font-semibold">
              <tr>
                <th className="px-5 py-3">Disbursement #</th>
                <th className="px-5 py-3">Payment Date</th>
                <th className="px-5 py-3">Payment Method</th>
                <th className="px-5 py-3">Bill Reference</th>
                <th className="px-5 py-3 text-right">Amount Received</th>
                <th className="px-5 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {vendorDisbursements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-6 text-center text-text-muted">
                    No disbursements recorded yet.
                  </td>
                </tr>
              ) : (
                vendorDisbursements.slice(0, 5).map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3 font-semibold text-navy-950 font-mono">
                      {pay.paymentNumber}
                    </td>
                    <td className="px-5 py-3 text-text-muted">{pay.paymentDate}</td>
                    <td className="px-5 py-3 text-navy-800">{pay.paymentMethod}</td>
                    <td className="px-5 py-3 font-mono text-text-muted">{pay.documentRef}</td>
                    <td className="px-5 py-3 text-right font-mono font-bold text-emerald-700">
                      ₹{pay.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <Badge variant="success">Cleared</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bill PDF Document Preview & Download Modal */}
      {selectedViewBill && (
        <TaxInvoiceDocument
          documentType="BILL"
          documentNumber={selectedViewBill.billNumber}
          date={selectedViewBill.billDate}
          dueDate={selectedViewBill.dueDate}
          partnerName={selectedViewBill.vendorName}
          partnerAddress="Bengaluru, Karnataka - 560058"
          lines={selectedViewBill.lines.map((ln: { id?: string; productName: string; quantity: number; unitPrice: number; subtotal: number; taxAmount: number; total: number }) => ({
            id: ln.id,
            name: ln.productName,
            quantity: ln.quantity,
            unitPrice: ln.unitPrice,
            subtotal: ln.subtotal,
            tax: ln.taxAmount,
            total: ln.total,
          }))}
          subtotal={selectedViewBill.subtotal}
          taxTotal={selectedViewBill.taxTotal}
          grandTotal={selectedViewBill.grandTotal}
          amountPaid={selectedViewBill.amountPaid}
          balanceDue={selectedViewBill.balanceDue}
          status={selectedViewBill.status}
          onClose={() => setSelectedViewBill(null)}
        />
      )}

      {/* Submit New Bill Modal */}
      {isSubmitBillOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/65 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-surface-border w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-surface-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 text-blue-700">
                  <Plus size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-navy-950">Submit Material Procurement Bill</h3>
                  <p className="text-[11px] text-text-muted">Direct submission to Urban Furniture Accounts</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSubmitBillOpen(false)}
                className="text-text-muted hover:text-navy-900 p-1 rounded-md hover:bg-slate-200 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateBill} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">Item / Material Description</label>
                <input
                  type="text"
                  value={billForm.itemDescription}
                  onChange={(e) => setBillForm({ ...billForm, itemDescription: e.target.value })}
                  placeholder="e.g. Teak Wood Timber Slabs"
                  className="w-full px-3 py-2 text-xs border border-surface-border rounded-md bg-white text-navy-950 focus:outline-none focus:ring-1 focus:ring-blue-700"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">Quantity (Units)</label>
                  <input
                    type="number"
                    min="1"
                    value={billForm.quantity}
                    onChange={(e) => setBillForm({ ...billForm, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-surface-border rounded-md bg-white text-navy-950 focus:outline-none focus:ring-1 focus:ring-blue-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">Unit Price (₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={billForm.unitPrice}
                    onChange={(e) => setBillForm({ ...billForm, unitPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-surface-border rounded-md bg-white text-navy-950 focus:outline-none focus:ring-1 focus:ring-blue-700"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1">Payment Due Date</label>
                <input
                  type="date"
                  value={billForm.dueDate}
                  onChange={(e) => setBillForm({ ...billForm, dueDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-surface-border rounded-md bg-white text-navy-950 focus:outline-none focus:ring-1 focus:ring-blue-700"
                  required
                />
              </div>

              <div className="p-3 bg-blue-50/70 rounded-md border border-blue-200 text-xs space-y-1">
                <div className="flex justify-between text-navy-700">
                  <span>Subtotal:</span>
                  <span className="font-mono">₹{(billForm.quantity * billForm.unitPrice).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-navy-700">
                  <span>GST (18%):</span>
                  <span className="font-mono">₹{(Math.round(billForm.quantity * billForm.unitPrice * 0.18)).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-blue-950 font-bold pt-1 border-t border-blue-200">
                  <span>Total Bill Amount:</span>
                  <span className="font-mono">₹{(Math.round(billForm.quantity * billForm.unitPrice * 1.18)).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-surface-border flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSubmitBillOpen(false)}
                  className="text-xs cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-blue-700 hover:bg-blue-800 text-white text-xs gap-1 px-4 cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Submit Bill</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
