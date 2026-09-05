import { useState } from 'react';
import { Receipt, Search, Filter, CreditCard, CheckCircle2, ArrowRight, X } from 'lucide-react';
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
  INITIAL_BILLS,
  type Bill,
} from '@/data/erpData';

export function BillsPage() {
  const [bills, setBills] = useState<Bill[]>(INITIAL_BILLS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [activePaymentBill, setActivePaymentBill] = useState<Bill | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentJournal, setPaymentJournal] = useState<'BANK' | 'CASH'>('BANK');
  const [notice, setNotice] = useState<string | null>(null);

  const filteredBills = bills.filter((b) => {
    const matchesSearch =
      b.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.vendorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: Bill['status']) => {
    switch (status) {
      case 'PAID':
        return 'success';
      case 'POSTED':
        return 'info';
      case 'PARTIALLY_PAID':
        return 'warning';
      case 'OVERDUE':
        return 'danger';
      case 'DRAFT':
        return 'default';
    }
  };

  const handleOpenPayment = (b: Bill) => {
    setActivePaymentBill(b);
    setPaymentAmount(b.balanceDue);
    setPaymentModalOpen(true);
  };

  const handleRegisterPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePaymentBill) return;

    const newAmountPaid = activePaymentBill.amountPaid + paymentAmount;
    const newBalanceDue = Math.max(0, activePaymentBill.grandTotal - newAmountPaid);
    const newStatus: Bill['status'] = newBalanceDue === 0 ? 'PAID' : 'PARTIALLY_PAID';

    setBills(
      bills.map((b) =>
        b.id === activePaymentBill.id
          ? {
              ...b,
              amountPaid: newAmountPaid,
              balanceDue: newBalanceDue,
              status: newStatus,
            }
          : b
      )
    );

    setPaymentModalOpen(false);
    setNotice(
      `Vendor payment of ₹${paymentAmount.toLocaleString('en-IN')} recorded for ${activePaymentBill.billNumber} to ${activePaymentBill.vendorName}. Double Entry: Dr Accounts Payable, Cr ${paymentJournal} Account.`
    );
    setTimeout(() => setNotice(null), 7000);
  };

  return (
    <div className="mx-auto max-w-dashboard space-y-5 p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-50 text-brand-700">
              <Receipt size={18} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-navy-900">Vendor Bills</h1>
          </div>
          <p className="mt-1 text-xs text-navy-400">
            Accounts Payable ledger, supplier invoices for raw wood & hardware, and vendor disbursements.
          </p>
        </div>
      </div>

      {notice && (
        <div className="flex items-center justify-between rounded-md border border-brand-200 bg-brand-50/80 p-3 text-xs text-brand-900">
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
            placeholder="Search bill #, vendor..."
            className="w-full rounded-md border border-surface-border bg-white py-1.5 pl-8 pr-3 text-xs text-navy-800 placeholder-navy-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-navy-400" />
          <span className="text-xs text-navy-400">Status:</span>
          {['ALL', 'POSTED', 'PARTIALLY_PAID', 'PAID', 'OVERDUE'].map((st) => (
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

      {/* Bills Table */}
      <div className="rounded-lg border border-surface-border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bill #</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Bill Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Total Cost</TableHead>
              <TableHead className="text-right">Paid</TableHead>
              <TableHead className="text-right">Balance Due</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="py-8 text-center text-xs text-navy-400">
                  No vendor bills found matching criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredBills.map((b) => (
                <TableRow key={b.id} className="hover:bg-surface-secondary/60">
                  <TableCell className="font-mono text-xs font-semibold text-brand-700">
                    {b.billNumber}
                  </TableCell>
                  <TableCell className="font-medium text-navy-900">{b.vendorName}</TableCell>
                  <TableCell className="text-xs text-navy-500">{b.billDate}</TableCell>
                  <TableCell className="text-xs text-navy-500">{b.dueDate}</TableCell>
                  <TableCell className="text-right font-mono text-xs font-bold text-navy-900">
                    ₹{b.grandTotal.toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-status-success">
                    ₹{b.amountPaid.toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs font-semibold text-status-danger">
                    ₹{b.balanceDue.toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getStatusBadgeVariant(b.status)}>{b.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedBill(b)}
                        className="h-7 text-[11px] px-2"
                      >
                        View
                      </Button>
                      {b.balanceDue > 0 && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleOpenPayment(b)}
                          className="h-7 text-[11px] px-2 bg-brand-700 hover:bg-brand-800"
                        >
                          <CreditCard size={12} className="mr-1" />
                          Pay Vendor
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

      {/* Pay Vendor Modal */}
      {paymentModalOpen && activePaymentBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/50 p-4">
          <div className="w-full max-w-md rounded-lg border border-surface-border bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div>
                <h3 className="text-base font-bold text-navy-900">Register Vendor Payment</h3>
                <p className="text-xs text-navy-400">
                  Bill: {activePaymentBill.billNumber} &bull; {activePaymentBill.vendorName}
                </p>
              </div>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="rounded p-1 text-navy-400 hover:bg-surface-secondary"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRegisterPayment} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">
                  Payment Amount (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  max={activePaymentBill.balanceDue}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs font-mono font-bold text-navy-900 focus:border-brand-500 focus:outline-none"
                  required
                />
                <span className="text-[11px] text-navy-400">
                  Outstanding balance: ₹{activePaymentBill.balanceDue.toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">
                  Disbursement Journal
                </label>
                <select
                  value={paymentJournal}
                  onChange={(e) => setPaymentJournal(e.target.value as 'BANK' | 'CASH')}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-800 focus:border-brand-500 focus:outline-none"
                >
                  <option value="BANK">HDFC Bank Current Account (Bank Journal)</option>
                  <option value="CASH">Cash Register Journal</option>
                </select>
              </div>

              <div className="rounded-md border border-brand-200 bg-brand-50/50 p-3 text-xs space-y-1">
                <span className="font-semibold text-brand-900 flex items-center gap-1">
                  <ArrowRight size={12} /> Double-Entry Accounting Impact:
                </span>
                <div className="flex justify-between text-navy-600 font-mono text-[11px] pt-1">
                  <span>Debit: 2001 Accounts Payable (Creditors)</span>
                  <span>-₹{paymentAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-navy-600 font-mono text-[11px]">
                  <span>Credit: {paymentJournal === 'BANK' ? '1002 HDFC Bank' : '1001 Cash'}</span>
                  <span>-₹{paymentAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setPaymentModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="bg-brand-700 hover:bg-brand-800">
                  Confirm Vendor Payment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bill Detail Modal */}
      {selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/50 p-4">
          <div className="w-full max-w-lg rounded-lg border border-surface-border bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="text-brand-600" size={20} />
                <div>
                  <h3 className="font-bold text-navy-900">{selectedBill.billNumber}</h3>
                  <span className="text-[11px] text-navy-400">Vendor Bill &bull; {selectedBill.vendorName}</span>
                </div>
              </div>
              <button onClick={() => setSelectedBill(null)} className="text-navy-400 hover:text-navy-600">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-navy-400">Vendor:</span>
                <p className="font-semibold text-navy-900 mt-0.5">{selectedBill.vendorName}</p>
              </div>
              <div className="text-right">
                <span className="text-navy-400">Status:</span>
                <div className="mt-0.5">
                  <Badge variant={getStatusBadgeVariant(selectedBill.status)}>{selectedBill.status}</Badge>
                </div>
              </div>
              <div>
                <span className="text-navy-400">Bill Date:</span>
                <p className="text-navy-700 mt-0.5">{selectedBill.billDate}</p>
              </div>
              <div className="text-right">
                <span className="text-navy-400">Payment Due:</span>
                <p className="text-navy-700 mt-0.5">{selectedBill.dueDate}</p>
              </div>
            </div>

            <div className="border-t border-surface-border pt-3">
              <span className="text-xs font-semibold text-navy-800 block mb-1.5">Materials & Components:</span>
              {selectedBill.lines.map((l) => (
                <div key={l.id} className="flex justify-between py-1 text-xs border-b border-surface-secondary">
                  <span>{l.productName} &times; {l.quantity}</span>
                  <span className="font-mono">₹{l.total.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="rounded-md bg-surface-secondary p-3 text-xs space-y-1">
              <div className="flex justify-between text-navy-500">
                <span>Subtotal Cost:</span>
                <span className="font-mono">₹{selectedBill.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-navy-500">
                <span>Input GST (18%):</span>
                <span className="font-mono">₹{selectedBill.taxTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-bold text-navy-900 border-t border-surface-border pt-1">
                <span>Total Amount:</span>
                <span className="font-mono text-brand-700">₹{selectedBill.grandTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-status-success font-semibold">
                <span>Disbursed to Date:</span>
                <span className="font-mono">₹{selectedBill.amountPaid.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-status-danger font-semibold">
                <span>Remaining Payable:</span>
                <span className="font-mono">₹{selectedBill.balanceDue.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedBill(null)}>
                Close
              </Button>
              {selectedBill.balanceDue > 0 && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedBill(null);
                    handleOpenPayment(selectedBill);
                  }}
                  className="bg-brand-700 hover:bg-brand-800"
                >
                  <CreditCard size={13} className="mr-1.5" />
                  Pay Vendor
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
