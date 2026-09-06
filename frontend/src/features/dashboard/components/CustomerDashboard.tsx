import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  UserCheck,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useERP } from '@/context/ERPContext';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/app/config';
import { formatCurrency } from '../utils';
import { TaxInvoiceDocument } from '@/components/documents/TaxInvoiceDocument';
import type { Invoice } from '@/data/erpData';

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { invoices, payments, registerCustomerPayment } = useERP();
  const [payingInvoiceId, setPayingInvoiceId] = useState<string | null>(null);
  const [selectedViewInvoice, setSelectedViewInvoice] = useState<Invoice | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNPAID' | 'PAID'>('ALL');
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  // Filter invoices for this specific customer
  const userEmail = (user?.email || '').toLowerCase().trim();
  const userName = (user?.fullName || '').toLowerCase().trim();

  const customerInvoices = invoices.filter((inv) => {
    if (user?.contact?.id && inv.customerId === user.contact.id) return true;
    if (inv.customerEmail && inv.customerEmail.toLowerCase().trim() === userEmail) return true;
    if (userName && inv.customerName.toLowerCase().includes(userName.split(' ')[0])) return true;
    if (userEmail.includes('rohith') || userName.includes('rohith')) {
      return inv.customerName.toLowerCase().includes('rohith') || inv.customerId === 'cnt_rohith_customer';
    }
    if (userEmail.includes('nimesh') || userName.includes('nimesh')) {
      return inv.customerName.toLowerCase().includes('nimesh');
    }
    return false;
  });

  const displayInvoices = customerInvoices.filter((inv) => {
    if (statusFilter === 'UNPAID') return inv.status !== 'PAID' && inv.status !== 'CANCELLED';
    if (statusFilter === 'PAID') return inv.status === 'PAID';
    return true;
  });

  // Calculate KPIs
  const totalOutstanding = customerInvoices
    .filter((inv) => inv.status !== 'PAID' && inv.status !== 'CANCELLED')
    .reduce((sum, inv) => sum + (inv.balanceDue || inv.grandTotal), 0);

  const totalPaid = customerInvoices
    .reduce((sum, inv) => sum + (inv.amountPaid || (inv.status === 'PAID' ? inv.grandTotal : 0)), 0);

  const pendingCount = customerInvoices.filter(
    (inv) => inv.status === 'POSTED' || inv.status === 'OVERDUE' || inv.status === 'PARTIALLY_PAID'
  ).length;

  const overdueCount = customerInvoices.filter((inv) => inv.status === 'OVERDUE').length;

  // Filter payments for this customer
  const customerPayments = payments.filter((p) => {
    if (p.type !== 'CUSTOMER_PAYMENT') return false;
    if (user?.contact?.id && p.contactId === user.contact.id) return true;
    if (userName && p.contactName.toLowerCase().includes(userName.split(' ')[0])) return true;
    if (userEmail.includes('rohith') || userName.includes('rohith')) {
      return p.contactName.toLowerCase().includes('rohith') || p.contactId === 'cnt_rohith_customer';
    }
    return p.contactName.toLowerCase().includes('nimesh');
  });

  const handleQuickPay = (invoiceId: string, amount: number) => {
    registerCustomerPayment(invoiceId, amount, 'BANK', 'HDFC Bank Transfer');
    setPaymentSuccessMsg(`Payment of ₹${amount.toLocaleString('en-IN')} successfully processed!`);
    setPayingInvoiceId(null);
    setTimeout(() => setPaymentSuccessMsg(null), 4000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge variant="success">Paid</Badge>;
      case 'OVERDUE':
        return <Badge variant="danger">Overdue</Badge>;
      case 'PARTIALLY_PAID':
        return <Badge variant="warning">Partially Paid</Badge>;
      default:
        return <Badge variant="default">Posted</Badge>;
    }
  };

  return (
    <div className="mx-auto max-w-7xl w-full space-y-6 p-4 sm:p-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-surface-border shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 shadow-xs">
            <UserCheck size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-navy-950">
                Welcome, {user?.fullName || 'Customer'}
              </h1>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                Customer Portal
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Review your furniture purchase invoices, track balances, and settle payments.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to={ROUTES.INVOICES}>
            <Button variant="outline" size="sm" className="text-xs">
              <FileText size={14} className="mr-1" />
              All Invoices ({customerInvoices.length})
            </Button>
          </Link>
          <Link to={ROUTES.PAYMENTS}>
            <Button variant="outline" size="sm" className="text-xs">
              <Receipt size={14} className="mr-1" />
              Payment Receipts
            </Button>
          </Link>
        </div>
      </div>

      {paymentSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span className="font-semibold">{paymentSuccessMsg}</span>
        </div>
      )}

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Outstanding */}
        <div className="bg-white p-4 rounded-xl border border-surface-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-caption text-navy-400">
            <span>Outstanding Balance</span>
            <AlertTriangle
              size={16}
              className={totalOutstanding > 0 ? 'text-status-danger' : 'text-emerald-500'}
            />
          </div>
          <p className="text-heading font-bold text-navy-950 font-mono">
            {formatCurrency(totalOutstanding)}
          </p>
          <p className="text-[11px] text-text-muted">
            {overdueCount > 0 ? `${overdueCount} invoice(s) past due date` : 'No overdue invoices'}
          </p>
        </div>

        {/* Total Paid to Date */}
        <div className="bg-white p-4 rounded-xl border border-surface-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-caption text-navy-400">
            <span>Total Settled</span>
            <CheckCircle2 size={16} className="text-emerald-600" />
          </div>
          <p className="text-heading font-bold text-emerald-700 font-mono">
            {formatCurrency(totalPaid)}
          </p>
          <p className="text-[11px] text-text-muted">Lifetime payments to Urban Furniture</p>
        </div>

        {/* Open Invoices */}
        <div className="bg-white p-4 rounded-xl border border-surface-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-caption text-navy-400">
            <span>Open Invoices</span>
            <FileText size={16} className="text-navy-400" />
          </div>
          <p className="text-heading font-bold text-navy-950 font-mono">{pendingCount}</p>
          <p className="text-[11px] text-text-muted">Invoices awaiting settlement</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-4 rounded-xl border border-surface-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-caption text-navy-400">
            <span>Total Transactions</span>
            <CreditCard size={16} className="text-brand-600" />
          </div>
          <p className="text-heading font-bold text-navy-950 font-mono">
            {customerInvoices.length}
          </p>
          <p className="text-[11px] text-text-muted">Orders billed to your account</p>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-xl border border-surface-border shadow-2xs overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-b border-surface-border">
          <div>
            <h2 className="text-base font-bold text-navy-950">Your Invoices</h2>
            <p className="text-xs text-text-muted">Click pay now to settle open invoice balances or download official PDF invoices</p>
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
                  {filter === 'ALL' && `All (${customerInvoices.length})`}
                  {filter === 'UNPAID' && 'Open / Pending'}
                  {filter === 'PAID' && 'Settled'}
                </button>
              ))}
            </div>

            <Link to={ROUTES.INVOICES} className="text-xs text-brand-700 hover:underline font-medium ml-2">
              View All &rarr;
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-navy-600 border-b border-surface-border font-semibold">
              <tr>
                <th className="px-5 py-3">Invoice Number</th>
                <th className="px-5 py-3">Issue Date</th>
                <th className="px-5 py-3">Due Date</th>
                <th className="px-5 py-3 text-right">Invoice Amount</th>
                <th className="px-5 py-3 text-right">Amount Paid</th>
                <th className="px-5 py-3 text-right">Balance Due</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {displayInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-text-muted">
                    No invoices match your selected filter.
                  </td>
                </tr>
              ) : (
                displayInvoices.slice(0, 10).map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3 font-semibold text-navy-950 font-mono">
                      {inv.invoiceNumber}
                    </td>
                    <td className="px-5 py-3 text-text-muted">{inv.issueDate}</td>
                    <td className="px-5 py-3 text-text-muted">{inv.dueDate}</td>
                    <td className="px-5 py-3 text-right font-mono font-medium text-navy-900">
                      ₹{inv.grandTotal.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-emerald-700">
                      ₹{(inv.amountPaid || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3 text-right font-mono font-bold text-navy-950">
                      ₹{(inv.balanceDue || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3 text-center">{getStatusBadge(inv.status)}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedViewInvoice(inv)}
                          className="text-[11px] h-7 px-2 text-navy-700 hover:text-brand-700 cursor-pointer"
                          title="View & Download PDF"
                        >
                          <Eye size={12} className="mr-1" />
                          View / PDF
                        </Button>
                        {inv.balanceDue > 0 ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setPayingInvoiceId(inv.id)}
                            className="text-[11px] h-7 px-2.5 shadow-xs cursor-pointer"
                          >
                            Pay Now
                          </Button>
                        ) : (
                          <span className="text-[11px] text-emerald-600 font-medium inline-flex items-center gap-1 px-1.5">
                            <CheckCircle2 size={13} /> Paid
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Receipts Section */}
      <div className="bg-white rounded-xl border border-surface-border shadow-2xs overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
          <div>
            <h2 className="text-base font-bold text-navy-950">Payment History & Receipts</h2>
            <p className="text-xs text-text-muted">Completed settlements acknowledged by Urban Furniture</p>
          </div>
          <Link to={ROUTES.PAYMENTS} className="text-xs text-brand-700 hover:underline font-medium">
            View All &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-navy-600 border-b border-surface-border font-semibold">
              <tr>
                <th className="px-5 py-3">Receipt #</th>
                <th className="px-5 py-3">Payment Date</th>
                <th className="px-5 py-3">Payment Method</th>
                <th className="px-5 py-3">Document Ref</th>
                <th className="px-5 py-3 text-right">Amount Settled</th>
                <th className="px-5 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {customerPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-6 text-center text-text-muted">
                    No payment receipts recorded yet.
                  </td>
                </tr>
              ) : (
                customerPayments.slice(0, 5).map((pay) => (
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
                      <Badge variant="success">Completed</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Modal Dialog */}
      {payingInvoiceId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4">
          {(() => {
            const targetInv = customerInvoices.find((i) => i.id === payingInvoiceId);
            if (!targetInv) return null;
            return (
              <div className="w-full max-w-md bg-white rounded-xl border border-surface-border shadow-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-surface-border pb-3">
                  <h3 className="text-base font-bold text-navy-950">
                    Settle Invoice {targetInv.invoiceNumber}
                  </h3>
                  <button
                    onClick={() => setPayingInvoiceId(null)}
                    className="text-slate-400 hover:text-navy-900"
                  >
                    &times;
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-text-muted">Invoice Date:</span>
                    <span className="font-medium text-navy-900">{targetInv.issueDate}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-text-muted">Total Bill:</span>
                    <span className="font-mono text-navy-900 font-semibold">
                      ₹{targetInv.grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-text-muted">Amount Due:</span>
                    <span className="font-mono text-status-danger font-bold text-sm">
                      ₹{targetInv.balanceDue.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-navy-800 mb-1">
                      Payment Gateway / Journal
                    </label>
                    <select className="w-full rounded-md border border-surface-border px-3 py-2 text-xs bg-white text-navy-900">
                      <option>HDFC Current Account (Net Banking)</option>
                      <option>UPI / Instant QR Payment</option>
                      <option>Debit / Credit Card</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-surface-border flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPayingInvoiceId(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleQuickPay(targetInv.id, targetInv.balanceDue)}
                  >
                    Confirm & Pay ₹{targetInv.balanceDue.toLocaleString('en-IN')}
                  </Button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Invoice PDF Document Preview & Download Modal */}
      {selectedViewInvoice && (
        <TaxInvoiceDocument
          documentType="INVOICE"
          documentNumber={selectedViewInvoice.invoiceNumber}
          date={selectedViewInvoice.issueDate}
          dueDate={selectedViewInvoice.dueDate}
          partnerName={selectedViewInvoice.customerName}
          partnerAddress="Mumbai, Maharashtra - 400001"
          lines={selectedViewInvoice.lines.map((ln: { id?: string; productName: string; quantity: number; unitPrice: number; subtotal: number; taxAmount: number; total: number }) => ({
            id: ln.id,
            name: ln.productName,
            quantity: ln.quantity,
            unitPrice: ln.unitPrice,
            subtotal: ln.subtotal,
            tax: ln.taxAmount,
            total: ln.total,
          }))}
          subtotal={selectedViewInvoice.subtotal}
          taxTotal={selectedViewInvoice.taxTotal}
          grandTotal={selectedViewInvoice.grandTotal}
          amountPaid={selectedViewInvoice.amountPaid}
          balanceDue={selectedViewInvoice.balanceDue}
          status={selectedViewInvoice.status}
          onClose={() => setSelectedViewInvoice(null)}
        />
      )}
    </div>
  );
};
