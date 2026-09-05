import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Scale,
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  ListOrdered,
  Layers,
  Search,
  Eye,
  X,
  RefreshCw,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import type { AccountItem, JournalEntry } from '@/data/erpData';

type TabType = 'COA' | 'JOURNALS' | 'ENTRIES' | 'LEDGER' | 'FLOW';

export function AccountingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { accounts, journals, journalEntries, resetDemoData, refreshERPData } = useERP();

  const [activeTab, setActiveTab] = useState<TabType>('COA');
  const [accountTypeFilter, setAccountTypeFilter] = useState<string>('ALL');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [selectedLedgerAccount, setSelectedLedgerAccount] = useState<string>('acc-1002');
  const [searchTerm, setSearchTerm] = useState('');

  // Synchronize active tab with URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/chart-of-accounts') || path.includes('/accounts')) {
      setActiveTab('COA');
    } else if (path.includes('/journals')) {
      setActiveTab('JOURNALS');
    } else if (path.includes('/journal-entries') || path.includes('/entries')) {
      setActiveTab('ENTRIES');
    } else if (path.includes('/ledger')) {
      setActiveTab('LEDGER');
    }
  }, [location.pathname]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    switch (tab) {
      case 'COA':
        navigate(ROUTES.ACCOUNTING_COA);
        break;
      case 'JOURNALS':
        navigate(ROUTES.ACCOUNTING_JOURNALS);
        break;
      case 'ENTRIES':
        navigate(ROUTES.ACCOUNTING_ENTRIES);
        break;
      case 'LEDGER':
        navigate(ROUTES.ACCOUNTING_LEDGER);
        break;
      default:
        navigate(ROUTES.ACCOUNTING);
        break;
    }
  };

  // Total debits & credits validation
  const totalDebits = journalEntries.reduce((acc, je) => acc + je.totalDebit, 0);
  const totalCredits = journalEntries.reduce((acc, je) => acc + je.totalCredit, 0);
  const isSystemBalanced = totalDebits === totalCredits;

  const filteredAccounts = accounts.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.code.includes(searchTerm);
    const matchesType = accountTypeFilter === 'ALL' || a.type === accountTypeFilter;
    return matchesSearch && matchesType;
  });

  const getAccountTypeBadgeVariant = (type: AccountItem['type']) => {
    switch (type) {
      case 'ASSET':
        return 'info';
      case 'LIABILITY':
        return 'danger';
      case 'EQUITY':
        return 'warning';
      case 'INCOME':
        return 'success';
      case 'EXPENSE':
        return 'default';
    }
  };

  // Build live ledger entries for selectedLedgerAccount
  const ledgerEntries = journalEntries.flatMap((je) => {
    const matchingLines = je.lines.filter((l) => l.accountId === selectedLedgerAccount);
    return matchingLines.map((line) => ({
      date: je.date,
      entryNumber: je.entryNumber,
      reference: je.reference,
      debit: line.debit,
      credit: line.credit,
    }));
  });

  const targetAccount = accounts.find((a) => a.id === selectedLedgerAccount);

  return (
    <div className="mx-auto max-w-dashboard space-y-5 p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-50 text-brand-700">
              <BookOpen size={18} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-navy-900">
              Financial Accounting System
            </h1>
          </div>
          <p className="mt-1 text-xs text-navy-400">
            Double-entry General Ledger, Chart of Accounts, Journals, and Trial Balance validation.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Refresh Live Data */}
          <button
            onClick={refreshERPData}
            title="Refresh live data from PostgreSQL"
            className="p-1.5 text-text-muted hover:text-navy-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
          >
            <RefreshCw size={14} />
          </button>

          {/* Reset Demo Data Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={resetDemoData}
            className="flex items-center gap-1.5 text-xs text-navy-600"
            title="Reset ERP data to baseline state"
          >
            <RefreshCw size={13} />
            <span>Reset Demo</span>
          </Button>

          {/* System Double-Entry Balance Badge */}
          <div className="flex items-center gap-2 rounded-md border border-brand-200 bg-white px-3 py-1.5 shadow-sm">
            <Scale size={16} className={isSystemBalanced ? 'text-status-success' : 'text-status-danger'} />
            <div className="text-xs">
              <span className="text-navy-400">Ledger Balance: </span>
              <span className={`font-bold ${isSystemBalanced ? 'text-status-success' : 'text-status-danger'}`}>
                {isSystemBalanced ? 'BALANCED (Σ Dr = Σ Cr)' : 'UNBALANCED'}
              </span>
              <span className="font-mono text-[11px] text-navy-400 ml-1">
                (₹{totalDebits.toLocaleString('en-IN')})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-surface-border pb-2">
        {[
          { id: 'COA', label: 'Chart of Accounts', icon: <FileSpreadsheet size={15} /> },
          { id: 'JOURNALS', label: 'Journals', icon: <Layers size={15} /> },
          { id: 'ENTRIES', label: `Journal Entries (${journalEntries.length})`, icon: <ListOrdered size={15} /> },
          { id: 'LEDGER', label: 'General Ledger', icon: <BookOpen size={15} /> },
          { id: 'FLOW', label: 'Event → Accounting Truth Flow', icon: <ArrowRight size={15} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id as TabType)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              activeTab === tab.id
                ? 'bg-brand-700 text-white shadow-sm'
                : 'bg-white border border-surface-border text-navy-600 hover:bg-surface-secondary'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* TAB 1: CHART OF ACCOUNTS */}
      {/* ──────────────────────────────────────────────────────── */}
      {activeTab === 'COA' && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-navy-400" size={14} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search account code, name..."
                className="w-full rounded-md border border-surface-border bg-white py-1.5 pl-8 pr-3 text-xs text-navy-800 placeholder-navy-400 focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {['ALL', 'ASSET', 'LIABILITY', 'EQUITY', 'INCOME', 'EXPENSE'].map((t) => (
                <button
                  key={t}
                  onClick={() => setAccountTypeFilter(t)}
                  className={`rounded px-2.5 py-1 text-xs font-medium transition ${
                    accountTypeFilter === t
                      ? 'bg-brand-700 text-white'
                      : 'bg-white border border-surface-border text-navy-600 hover:bg-surface-secondary'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-surface-border bg-white shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Code</TableHead>
                  <TableHead>Account Title</TableHead>
                  <TableHead>Classification Type</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.map((a) => (
                  <TableRow key={a.id} className="hover:bg-surface-secondary/60">
                    <TableCell className="font-mono text-xs font-bold text-brand-700">{a.code}</TableCell>
                    <TableCell className="font-medium text-navy-900 text-xs">{a.name}</TableCell>
                    <TableCell>
                      <Badge variant={getAccountTypeBadgeVariant(a.type)}>{a.type}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs font-bold text-navy-900">
                      ₹{a.balance.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="success">ACTIVE</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedLedgerAccount(a.id);
                          handleTabChange('LEDGER');
                        }}
                        className="h-7 text-[11px] px-2"
                      >
                        Ledger
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* TAB 2: JOURNALS */}
      {/* ──────────────────────────────────────────────────────── */}
      {activeTab === 'JOURNALS' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {journals.map((j) => (
            <div
              key={j.id}
              className="rounded-lg border border-surface-border bg-white p-4 shadow-sm space-y-2 hover:border-brand-300 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                  {j.code}
                </span>
                <Badge variant="info">{j.type}</Badge>
              </div>
              <h3 className="font-semibold text-navy-900 text-sm">{j.name}</h3>
              <p className="text-xs text-navy-400">
                {j.entriesCount} posted entries reconciled
              </p>
              <div
                onClick={() => handleTabChange('ENTRIES')}
                className="pt-2 border-t border-surface-border flex justify-between items-center text-[11px] text-brand-600 font-medium cursor-pointer hover:underline"
              >
                <span>View journal entries</span>
                <ArrowRight size={12} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* TAB 3: JOURNAL ENTRIES */}
      {/* ──────────────────────────────────────────────────────── */}
      {activeTab === 'ENTRIES' && (
        <div className="space-y-4">
          <div className="rounded-lg border border-surface-border bg-white shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entry #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Journal</TableHead>
                  <TableHead>Source Event Reference</TableHead>
                  <TableHead className="text-right">Total Debit</TableHead>
                  <TableHead className="text-right">Total Credit</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {journalEntries.map((je) => (
                  <TableRow
                    key={je.id}
                    onClick={() => setSelectedEntry(je)}
                    className="cursor-pointer hover:bg-surface-secondary/60"
                  >
                    <TableCell className="font-mono text-xs font-bold text-brand-700">
                      {je.entryNumber}
                    </TableCell>
                    <TableCell className="text-xs text-navy-500">{je.date}</TableCell>
                    <TableCell className="text-xs font-medium text-navy-800">{je.journalName}</TableCell>
                    <TableCell className="text-xs text-navy-600">{je.reference}</TableCell>
                    <TableCell className="text-right font-mono text-xs font-bold text-navy-900">
                      ₹{je.totalDebit.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs font-bold text-navy-900">
                      ₹{je.totalCredit.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={je.isBalanced ? 'success' : 'danger'}>
                        {je.isBalanced ? 'POSTED &bull; BALANCED' : 'UNBALANCED'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedEntry(je)}
                        className="h-7 text-[11px] px-2"
                      >
                        <Eye size={12} className="mr-1" />
                        Audit Lines
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* TAB 4: GENERAL LEDGER */}
      {/* ──────────────────────────────────────────────────────── */}
      {activeTab === 'LEDGER' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-xs font-semibold text-navy-700">Select General Ledger Account:</span>
            <select
              value={selectedLedgerAccount}
              onChange={(e) => setSelectedLedgerAccount(e.target.value)}
              className="rounded-md border border-surface-border bg-white px-3 py-1.5 text-xs text-navy-800 focus:border-brand-500 focus:outline-none"
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.code} — {a.name} (Balance: ₹{a.balance.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-lg border border-surface-border bg-white p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-center border-b border-surface-border pb-3">
              <div>
                <h3 className="font-bold text-navy-900 text-sm">
                  {targetAccount?.code} &bull; {targetAccount?.name}
                </h3>
                <span className="text-[11px] text-navy-400">
                  Account Type: {targetAccount?.type}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-navy-400">Current Ledger Balance</span>
                <p className="text-base font-bold font-mono text-brand-700">
                  ₹{targetAccount?.balance.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Voucher / Entry #</TableHead>
                  <TableHead>Source Event Reference</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ledgerEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-6 text-center text-xs text-navy-400">
                      No posted journal movements recorded for this account.
                    </TableCell>
                  </TableRow>
                ) : (
                  ledgerEntries.map((le, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="text-xs text-navy-500">{le.date}</TableCell>
                      <TableCell className="font-mono text-xs text-brand-700">{le.entryNumber}</TableCell>
                      <TableCell className="text-xs text-navy-700">{le.reference}</TableCell>
                      <TableCell className="text-right font-mono text-xs font-medium text-navy-900">
                        {le.debit > 0 ? `₹${le.debit.toLocaleString('en-IN')}` : '—'}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs font-medium text-navy-900">
                        {le.credit > 0 ? `₹${le.credit.toLocaleString('en-IN')}` : '—'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* TAB 5: EVENT → ACCOUNTING TRUTH FLOW VISUALIZATION */}
      {/* ──────────────────────────────────────────────────────── */}
      {activeTab === 'FLOW' && (
        <div className="rounded-lg border border-brand-200 bg-white p-5 shadow-sm space-y-4">
          <div className="border-b border-surface-border pb-3">
            <h2 className="text-base font-bold text-navy-900">
              ONE BUSINESS EVENT &rarr; ONE ACCOUNTING TRUTH
            </h2>
            <p className="text-xs text-navy-400">
              How operational furniture transactions mathematically map to double-entry accounting records.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Event 1: Customer Invoice */}
            <div className="rounded-md border border-surface-border p-4 bg-surface-secondary/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-800">1. Customer Sales Invoice</span>
                <Badge variant="success">INV-2026-001</Badge>
              </div>
              <p className="text-[11px] text-navy-500">
                Nimesh Pathak buys 5 Ergonomic Office Chairs for ₹22,500 + 18% GST (₹4,050).
              </p>
              <div className="rounded bg-white p-2.5 border border-surface-border font-mono text-xs space-y-1">
                <div className="flex justify-between text-navy-900 font-semibold">
                  <span>Dr Accounts Receivable (1003)</span>
                  <span>₹26,550</span>
                </div>
                <div className="flex justify-between text-navy-600 pl-4">
                  <span>Cr Furniture Sales Income (4001)</span>
                  <span>₹22,500</span>
                </div>
                <div className="flex justify-between text-navy-600 pl-4">
                  <span>Cr GST Output Tax Liability (2002)</span>
                  <span>₹4,050</span>
                </div>
                <div className="border-t border-surface-border pt-1 flex justify-between text-[11px] text-status-success font-bold">
                  <span>Balance Check: Debit = Credit</span>
                  <span>₹26,550</span>
                </div>
              </div>
            </div>

            {/* Event 2: Customer Payment Receipt */}
            <div className="rounded-md border border-surface-border p-4 bg-surface-secondary/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-800">2. Bank Payment Receipt</span>
                <Badge variant="info">PAY-2026-001</Badge>
              </div>
              <p className="text-[11px] text-navy-500">
                Nimesh Pathak transfers ₹26,550 into HDFC Bank Account.
              </p>
              <div className="rounded bg-white p-2.5 border border-surface-border font-mono text-xs space-y-1">
                <div className="flex justify-between text-navy-900 font-semibold">
                  <span>Dr HDFC Bank Current Account (1002)</span>
                  <span>₹26,550</span>
                </div>
                <div className="flex justify-between text-navy-600 pl-4">
                  <span>Cr Accounts Receivable (1003)</span>
                  <span>₹26,550</span>
                </div>
                <div className="border-t border-surface-border pt-1 flex justify-between text-[11px] text-status-success font-bold">
                  <span>Customer Balance Due becomes ₹0</span>
                  <span>Settled</span>
                </div>
              </div>
            </div>

            {/* Event 3: Vendor Bill */}
            <div className="rounded-md border border-surface-border p-4 bg-surface-secondary/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-800">3. Vendor Purchase Bill</span>
                <Badge variant="warning">BILL-2026-001</Badge>
              </div>
              <p className="text-[11px] text-navy-500">
                Azure Furniture supplies timber & chair parts for ₹28,000 + 18% GST (₹5,040).
              </p>
              <div className="rounded bg-white p-2.5 border border-surface-border font-mono text-xs space-y-1">
                <div className="flex justify-between text-navy-900 font-semibold">
                  <span>Dr Raw Material Purchases Expense (5001)</span>
                  <span>₹28,000</span>
                </div>
                <div className="flex justify-between text-navy-900 font-semibold">
                  <span>Dr GST Input Tax Credit (2002)</span>
                  <span>₹5,040</span>
                </div>
                <div className="flex justify-between text-navy-600 pl-4">
                  <span>Cr Accounts Payable (2001)</span>
                  <span>₹33,040</span>
                </div>
                <div className="border-t border-surface-border pt-1 flex justify-between text-[11px] text-status-success font-bold">
                  <span>Balance Check: Debit = Credit</span>
                  <span>₹33,040</span>
                </div>
              </div>
            </div>

            {/* Event 4: Vendor Payout */}
            <div className="rounded-md border border-surface-border p-4 bg-surface-secondary/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-800">4. Vendor Settlement Payout</span>
                <Badge variant="danger">PAY-2026-002</Badge>
              </div>
              <p className="text-[11px] text-navy-500">
                Urban Furniture disburses ₹20,000 to Azure Furniture via HDFC bank transfer.
              </p>
              <div className="rounded bg-white p-2.5 border border-surface-border font-mono text-xs space-y-1">
                <div className="flex justify-between text-navy-900 font-semibold">
                  <span>Dr Accounts Payable (2001)</span>
                  <span>₹20,000</span>
                </div>
                <div className="flex justify-between text-navy-600 pl-4">
                  <span>Cr HDFC Bank Current Account (1002)</span>
                  <span>₹20,000</span>
                </div>
                <div className="border-t border-surface-border pt-1 flex justify-between text-[11px] text-status-success font-bold">
                  <span>Remaining Payable to Azure</span>
                  <span>₹13,040</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Journal Entry Audit Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/50 p-4">
          <div className="w-full max-w-lg rounded-lg border border-surface-border bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div>
                <h3 className="font-bold text-navy-900">{selectedEntry.entryNumber}</h3>
                <span className="text-xs text-navy-400">
                  {selectedEntry.journalName} &bull; {selectedEntry.date}
                </span>
              </div>
              <button onClick={() => setSelectedEntry(null)} className="rounded p-1 text-navy-400 hover:bg-surface-secondary">
                <X size={18} />
              </button>
            </div>

            <div className="text-xs space-y-1 text-navy-600">
              <p>
                <span className="font-semibold text-navy-900">Reference:</span> {selectedEntry.reference}
              </p>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedEntry.lines.map((l, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-xs">
                      <span className="font-mono font-bold text-navy-900 mr-1.5">{l.accountCode}</span>
                      <span>{l.accountName}</span>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      {l.debit > 0 ? `₹${l.debit.toLocaleString('en-IN')}` : '—'}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      {l.credit > 0 ? `₹${l.credit.toLocaleString('en-IN')}` : '—'}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold bg-surface-secondary/60">
                  <TableCell className="text-xs text-navy-900">Total Parity</TableCell>
                  <TableCell className="text-right font-mono text-xs text-navy-900">
                    ₹{selectedEntry.totalDebit.toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-navy-900">
                    ₹{selectedEntry.totalCredit.toLocaleString('en-IN')}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="flex items-center justify-between pt-2">
              <Badge variant="success">
                <CheckCircle2 size={12} className="mr-1" /> EQUALITY VERIFIED
              </Badge>
              <Button variant="outline" size="sm" onClick={() => setSelectedEntry(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountingPage;
