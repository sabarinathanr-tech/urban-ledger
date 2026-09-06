import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  CreditCard,
  CheckCircle2,
  ArrowDownLeft,
  ArrowUpRight,
  X,
  BookOpen,
  Printer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OdooControlPanel } from '@/components/layout/OdooControlPanel';
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
import type { PaymentItem } from '@/data/erpData';

export function PaymentsPage() {
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { isContact, user } = useAuth();
  const {
    payments,
    createDirectPayment,
    contacts,
    refreshERPData,
  } = useERP();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentItem | null>(null);

  // New Payment Form
  const [paymentType, setPaymentType] = useState<'CUSTOMER_PAYMENT' | 'VENDOR_PAYMENT'>('VENDOR_PAYMENT');
  const eligibleContacts = contacts.filter((c) =>
    paymentType === 'CUSTOMER_PAYMENT'
      ? c.type === 'CUSTOMER' || c.type === 'BOTH'
      : c.type === 'VENDOR' || c.type === 'BOTH'
  );
  const [contactId, setContactId] = useState(eligibleContacts[0]?.id || contacts[0]?.id || '');
  const [amount, setAmount] = useState<number>(15000);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [journal, setJournal] = useState<'BANK' | 'CASH'>('BANK');
  const [method, setMethod] = useState<'HDFC Bank Transfer' | 'Cash Register' | 'UPI'>('HDFC Bank Transfer');
  const [note, setNote] = useState('Settlement payment');
  const [docRef, setDocRef] = useState('BILL-2026-001');
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!eligibleContacts.some((c) => c.id === contactId)) {
      if (eligibleContacts[0]?.id || contacts[0]?.id) {
        setContactId(eligibleContacts[0]?.id || contacts[0]?.id);
      }
    }
  }, [paymentType, eligibleContacts, contactId, contacts]);

  useEffect(() => {
    if (location.pathname === ROUTES.PAYMENTS_NEW) {
      setIsModalOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (id) {
      const found = payments.find(
        (p) => p.id === id || p.paymentNumber.toLowerCase() === id.toLowerCase()
      );
      if (found) {
        setSelectedPayment(found);
      }
    }
  }, [id, payments]);

  // If Contact portal, filter strictly to user's own payments
  const userContactId = (user as any)?.contact?.id || (user as any)?.contactId;
  const userName = (user?.fullName || (user as any)?.name || '').trim().toLowerCase();

  const relevantPayments = isContact
    ? payments.filter((p) => {
        if (userContactId && p.contactId === userContactId) return true;
        if (userName && userName.length > 2 && p.contactName.toLowerCase().includes(userName)) return true;
        return false;
      })
    : payments;

  const filteredPayments = relevantPayments.filter((p) => {
    const matchesSearch =
      p.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.documentRef.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    const newPayment = createDirectPayment(
      paymentType,
      contactId,
      amount,
      docRef,
      journal,
      method
    );

    setIsModalOpen(false);
    if (location.pathname === ROUTES.PAYMENTS_NEW) {
      navigate(ROUTES.PAYMENTS);
    }
    setNotice(
      `Payment voucher ${newPayment.paymentNumber} of ₹${amount.toLocaleString(
        'en-IN'
      )} posted to ${journal} Journal with balanced General Ledger entries.`
    );
    setTimeout(() => setNotice(null), 7000);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (location.pathname === ROUTES.PAYMENTS_NEW) {
      navigate(ROUTES.PAYMENTS);
    }
  };

  const closeDetail = () => {
    setSelectedPayment(null);
    if (id) {
      navigate(ROUTES.PAYMENTS);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-surface-secondary">
      {/* Odoo Control Panel */}
      <OdooControlPanel
        title={isContact ? 'My Payment Records' : 'Payments & Cash Movements'}
        subtitle={
          isContact
            ? 'Complete history of payments processed against your account vouchers'
            : 'Real-time cash & bank receipts, vendor settlements, and reconciled journal postings'
        }
        itemCount={filteredPayments.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search payment #, contact, ref..."
        newButtonLabel="Record Payment"
        onNewClick={
          !isContact
            ? () => {
                navigate(ROUTES.PAYMENTS_NEW);
                setIsModalOpen(true);
              }
            : undefined
        }
        filterOptions={[
          { label: 'All', value: 'ALL' },
          { label: 'Inbound Receipts', value: 'CUSTOMER_PAYMENT' },
          { label: 'Outbound Payouts', value: 'VENDOR_PAYMENT' },
        ]}
        activeFilter={typeFilter}
        onFilterChange={setTypeFilter}
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

        {/* Table */}
        <div className="rounded-lg border border-surface-border bg-white shadow-2xs overflow-hidden">
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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="py-8 text-center text-xs text-navy-400">
                  No payment records found.
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((p) => {
                const isCustomer = p.type === 'CUSTOMER_PAYMENT';
                return (
                  <TableRow
                    key={p.id}
                    onClick={() => setSelectedPayment(p)}
                    className="cursor-pointer hover:bg-surface-secondary/60"
                  >
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
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPayment(p)}
                        className="h-7 text-[11px] px-2"
                      >
                        Voucher
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      </div>

      {/* Record Payment Modal matching Diagram */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-xl border border-surface-border bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div>
                <h3 className="text-base font-bold text-navy-900">Payment Form</h3>
                <p className="text-xs text-text-muted">Post payment voucher with balanced double-entry GL</p>
              </div>
              <button onClick={closeModal} className="rounded p-1 text-slate-400 hover:text-navy-900 cursor-pointer">
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

            <form onSubmit={handleCreatePayment} className="space-y-3.5 text-xs">
              {/* Payment Type Radio: Send / Receive */}
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Payment Type *</label>
                <div className="flex items-center gap-4 pt-0.5">
                  <label
                    onClick={() => {
                      setPaymentType('VENDOR_PAYMENT');
                      setDocRef('BILL-2026-001');
                    }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="payDirection"
                      checked={paymentType === 'VENDOR_PAYMENT'}
                      onChange={() => {}}
                      className="text-brand-700 focus:ring-brand-500"
                    />
                    <span className="font-semibold text-navy-900">Send (Disbursement)</span>
                  </label>
                  <label
                    onClick={() => {
                      setPaymentType('CUSTOMER_PAYMENT');
                      setDocRef('INV-2026-002');
                    }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="payDirection"
                      checked={paymentType === 'CUSTOMER_PAYMENT'}
                      onChange={() => {}}
                      className="text-brand-700 focus:ring-brand-500"
                    />
                    <span className="font-semibold text-navy-900">Receive (Customer Receipt)</span>
                  </label>
                </div>
              </div>

              {/* Partner */}
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Partner *</label>
                <select
                  value={contactId}
                  onChange={(e) => setContactId(e.target.value)}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-600 focus:outline-none cursor-pointer"
                >
                  {eligibleContacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.type})
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs font-mono font-bold text-navy-950 focus:border-brand-600 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
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
                      setJournal('BANK');
                      setMethod('HDFC Bank Transfer');
                    }}
                    className={`flex items-center justify-center p-2.5 rounded-lg border cursor-pointer font-medium text-xs transition ${
                      journal === 'BANK'
                        ? 'border-brand-600 bg-brand-50/70 text-brand-800 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    🏦 Bank
                  </label>
                  <label
                    onClick={() => {
                      setJournal('CASH');
                      setMethod('Cash Register');
                    }}
                    className={`flex items-center justify-center p-2.5 rounded-lg border cursor-pointer font-medium text-xs transition ${
                      journal === 'CASH'
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
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Disbursement or settlement note"
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Matched Document Reference</label>
                <input
                  type="text"
                  value={docRef}
                  onChange={(e) => setDocRef(e.target.value)}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs font-mono text-navy-800 focus:border-brand-600 focus:outline-none"
                  placeholder="e.g. INV/2026/0001 or Bill/2026/0001"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={closeModal}>
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

      {/* Payment Voucher Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-xl border border-surface-border bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="text-brand-700" size={18} />
                <h3 className="font-bold text-navy-900 text-base">Payment Voucher: {selectedPayment.paymentNumber}</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => window.print()}
                  className="p-1.5 rounded-md text-slate-400 hover:text-navy-900 hover:bg-slate-100 cursor-pointer"
                  title="Print Voucher"
                >
                  <Printer size={16} />
                </button>
                <button onClick={closeDetail} className="text-slate-400 hover:text-navy-900 p-1 cursor-pointer">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction Date:</span>
                <span className="font-medium text-navy-900">{selectedPayment.paymentDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Counterparty:</span>
                <span className="font-semibold text-navy-900">{selectedPayment.contactName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Matched Document:</span>
                <span className="font-mono font-medium text-brand-700">{selectedPayment.documentRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Channel:</span>
                <span className="text-navy-800 font-medium">{selectedPayment.journal} Journal &bull; {selectedPayment.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Direction:</span>
                <span className={selectedPayment.type === 'CUSTOMER_PAYMENT' ? 'text-emerald-700 font-semibold' : 'text-rose-600 font-semibold'}>
                  {selectedPayment.type === 'CUSTOMER_PAYMENT' ? 'Customer Receipt (Receive)' : 'Vendor Disbursement (Send)'}
                </span>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 text-center border border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Total Amount Posted</span>
                <p className="text-xl font-bold font-mono text-brand-700 mt-1">
                  ₹{selectedPayment.amount.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-brand-50/70 p-2.5 border border-brand-200/60 text-[11px]">
                <div className="flex items-center gap-1.5 text-brand-900 font-medium">
                  <BookOpen size={13} className="text-brand-700" />
                  <span>Journal Entry: {selectedPayment.journalEntryId}</span>
                </div>
                <Link to="/accounting" className="text-brand-700 font-bold hover:underline">
                  General Ledger
                </Link>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-surface-border">
              <Button variant="outline" size="sm" onClick={closeDetail} className="cursor-pointer">
                Close Voucher
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentsPage;
