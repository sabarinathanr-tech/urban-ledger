import { useState } from 'react';
import { CreditCard, Plus, Search, Filter, CheckCircle2, ArrowDownLeft, ArrowUpRight, X } from 'lucide-react';
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
  INITIAL_PAYMENTS,
  INITIAL_CONTACTS,
  type PaymentItem,
} from '@/data/erpData';

export function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentItem[]>(INITIAL_PAYMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Payment Form
  const [paymentType, setPaymentType] = useState<'CUSTOMER_PAYMENT' | 'VENDOR_PAYMENT'>('CUSTOMER_PAYMENT');
  const [contactId, setContactId] = useState('cnt-1');
  const [amount, setAmount] = useState<number>(15000);
  const [journal, setJournal] = useState<'BANK' | 'CASH'>('BANK');
  const [method, setMethod] = useState<'HDFC Bank Transfer' | 'Cash Register' | 'UPI'>('HDFC Bank Transfer');
  const [docRef, setDocRef] = useState('INV-2026-002');
  const [notice, setNotice] = useState<string | null>(null);

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.documentRef.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const contact = INITIAL_CONTACTS.find((c) => c.id === contactId);
    if (!contact || amount <= 0) return;

    const newPayment: PaymentItem = {
      id: `pay-${Date.now()}`,
      paymentNumber: `PAY-2026-00${payments.length + 1}`,
      paymentDate: new Date().toISOString().split('T')[0],
      type: paymentType,
      contactId: contact.id,
      contactName: contact.name,
      documentRef: docRef,
      amount,
      journal,
      paymentMethod: method,
      status: 'POSTED',
      journalEntryId: `je-${Date.now()}`,
    };

    setPayments([newPayment, ...payments]);
    setIsModalOpen(false);
    setNotice(
      `Payment ${newPayment.paymentNumber} of ₹${amount.toLocaleString('en-IN')} posted to ${journal} Journal. Balanced double-entry recorded.`
    );
    setTimeout(() => setNotice(null), 6000);
  };

  return (
    <div className="mx-auto max-w-dashboard space-y-5 p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-50 text-brand-700">
              <CreditCard size={18} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-navy-900">Payments & Cash Movements</h1>
          </div>
          <p className="mt-1 text-xs text-navy-400">
            Real-time cash & bank receipts, vendor settlements, and reconciled journal postings.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5"
        >
          <Plus size={16} />
          <span>Record Payment</span>
        </Button>
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
            placeholder="Search payment #, contact, ref..."
            className="w-full rounded-md border border-surface-border bg-white py-1.5 pl-8 pr-3 text-xs text-navy-800 placeholder-navy-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-navy-400" />
          <span className="text-xs text-navy-400">Filter:</span>
          {[
            { label: 'ALL', value: 'ALL' },
            { label: 'Inbound (Receipts)', value: 'CUSTOMER_PAYMENT' },
            { label: 'Outbound (Disbursements)', value: 'VENDOR_PAYMENT' },
          ].map((st) => (
            <button
              key={st.value}
              onClick={() => setTypeFilter(st.value)}
              className={`rounded px-2.5 py-1 text-xs font-medium transition ${
                typeFilter === st.value
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'bg-white border border-surface-border text-navy-600 hover:bg-surface-secondary'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-surface-border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Contact Party</TableHead>
              <TableHead>Matched Document</TableHead>
              <TableHead>Journal & Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center">Accounting Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-xs text-navy-400">
                  No payment records found.
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((p) => {
                const isCustomer = p.type === 'CUSTOMER_PAYMENT';
                return (
                  <TableRow key={p.id} className="hover:bg-surface-secondary/60">
                    <TableCell className="font-mono text-xs font-semibold text-brand-700">
                      {p.paymentNumber}
                    </TableCell>
                    <TableCell className="text-xs text-navy-500">{p.paymentDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {isCustomer ? (
                          <div className="flex items-center gap-1 text-xs text-status-success font-medium">
                            <ArrowDownLeft size={14} />
                            <span>Inbound (Receipt)</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs text-status-danger font-medium">
                            <ArrowUpRight size={14} />
                            <span>Outbound (Payout)</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-navy-900">{p.contactName}</TableCell>
                    <TableCell className="font-mono text-xs text-navy-600">
                      {p.documentRef}
                    </TableCell>
                    <TableCell className="text-xs text-navy-600">
                      <span className="font-semibold">{p.journal}</span> &bull; {p.paymentMethod}
                    </TableCell>
                    <TableCell className={`text-right font-mono text-xs font-bold ${isCustomer ? 'text-status-success' : 'text-navy-900'}`}>
                      {isCustomer ? '+' : '-'}₹{p.amount.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="success">POSTED &bull; BALANCED</Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Record Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/50 p-4">
          <div className="w-full max-w-md rounded-lg border border-surface-border bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h2 className="text-base font-bold text-navy-900">Record Payment Transaction</h2>
              <button onClick={() => setIsModalOpen(false)} className="rounded p-1 text-navy-400 hover:bg-surface-secondary">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePayment} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">Payment Direction</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentType('CUSTOMER_PAYMENT');
                      setDocRef('INV-2026-002');
                    }}
                    className={`rounded border p-2 text-xs font-medium transition ${
                      paymentType === 'CUSTOMER_PAYMENT'
                        ? 'border-brand-600 bg-brand-50 text-brand-800'
                        : 'border-surface-border bg-white text-navy-600'
                    }`}
                  >
                    Customer Receipt (+)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentType('VENDOR_PAYMENT');
                      setDocRef('BILL-2026-001');
                    }}
                    className={`rounded border p-2 text-xs font-medium transition ${
                      paymentType === 'VENDOR_PAYMENT'
                        ? 'border-brand-600 bg-brand-50 text-brand-800'
                        : 'border-surface-border bg-white text-navy-600'
                    }`}
                  >
                    Vendor Disbursement (-)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">
                  Contact Account
                </label>
                <select
                  value={contactId}
                  onChange={(e) => setContactId(e.target.value)}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-800 focus:border-brand-500 focus:outline-none"
                >
                  {INITIAL_CONTACTS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">
                  Document Reference
                </label>
                <input
                  type="text"
                  value={docRef}
                  onChange={(e) => setDocRef(e.target.value)}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs font-mono text-navy-800 focus:border-brand-500 focus:outline-none"
                  placeholder="e.g. INV-2026-002 or BILL-2026-001"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">
                  Payment Amount (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs font-mono font-bold text-navy-900 focus:border-brand-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Journal</label>
                  <select
                    value={journal}
                    onChange={(e) => setJournal(e.target.value as 'BANK' | 'CASH')}
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-800 focus:border-brand-500 focus:outline-none"
                  >
                    <option value="BANK">HDFC Bank</option>
                    <option value="CASH">Cash in Hand</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Method</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as 'HDFC Bank Transfer' | 'Cash Register' | 'UPI')}
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-800 focus:border-brand-500 focus:outline-none"
                  >
                    <option value="HDFC Bank Transfer">Bank Transfer</option>
                    <option value="UPI">UPI / Digital</option>
                    <option value="Cash Register">Cash</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="bg-brand-700 hover:bg-brand-800">
                  Post Payment to Ledger
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
