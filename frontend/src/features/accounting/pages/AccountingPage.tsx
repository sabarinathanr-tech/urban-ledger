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
  Plus,
  Trash2,
  AlertTriangle,
  Info,
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
import type { AccountItem, JournalEntry, JournalItem } from '@/data/erpData';

type TabType = 'COA' | 'JOURNALS' | 'ENTRIES' | 'LEDGER' | 'FLOW';

interface NewEntryLineDraft {
  id: string;
  accountId: string;
  partnerId: string;
  debit: number | string;
  credit: number | string;
}

export function AccountingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    accounts,
    journals,
    journalEntries,
    contacts,
    addAccount,
    addJournal,
    createManualJournalEntry,
    postJournalEntry,
    resetJournalEntryToDraft,
    refreshERPData,
  } = useERP();

  const [activeTab, setActiveTab] = useState<TabType>('COA');
  const [accountTypeFilter, setAccountTypeFilter] = useState<string>('ALL');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [selectedLedgerAccount, setSelectedLedgerAccount] = useState<string>('acc-1002');
  const [searchTerm, setSearchTerm] = useState('');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [confirmNotice, setConfirmNotice] = useState(false);
  const [showArchivedOnly, setShowArchivedOnly] = useState(false);

  // Sub-view modes matching mockup ("When clicking on new" vs List View)
  const [coaViewMode, setCoaViewMode] = useState<'list' | 'new'>('list');
  const [journalViewMode, setJournalViewMode] = useState<'list' | 'new'>('list');
  const [entryViewMode, setEntryViewMode] = useState<'list' | 'new'>('list');

  // Modals state
  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountCode, setNewAccountCode] = useState('');
  const [newAccountType, setNewAccountType] = useState<AccountItem['type']>('ASSET');
  const [newAccountBalance, setNewAccountBalance] = useState<number | string>('');

  const [isNewJournalModalOpen, setIsNewJournalModalOpen] = useState(false);
  const [newJournalName, setNewJournalName] = useState('');
  const [newJournalType, setNewJournalType] = useState<JournalItem['type']>('SALES');
  const [newJournalDefaultAccountId, setNewJournalDefaultAccountId] = useState('');

  const [isNewEntryModalOpen, setIsNewEntryModalOpen] = useState(false);
  const [newEntryDate, setNewEntryDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newEntryJournalId, setNewEntryJournalId] = useState('');
  const [newEntryReference, setNewEntryReference] = useState('');
  const [newEntryLines, setNewEntryLines] = useState<NewEntryLineDraft[]>([
    { id: '1', accountId: '', partnerId: '', debit: '', credit: '' },
    { id: '2', accountId: '', partnerId: '', debit: '', credit: '' },
  ]);

  // Format date helper matching mockup (Sep 1, Sep 2)
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    if (dateStr.startsWith('Sep') || dateStr.startsWith('Oct') || dateStr.startsWith('Jan')) return dateStr;
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const monthIndex = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[monthIndex]} ${day}`;
      }
    } catch {
      // fallback
    }
    return dateStr;
  };

  const formatAmount = (val: number) => `Rs. ${val.toLocaleString('en-IN')}`;

  // Helper to load exact sample from diagram: Asset A/c + Rahul (Debit 10,000) & Bank A/c (Credit 10,000)
  const fillMockupSample = () => {
    const assetAcc = accounts.find((a) => a.type === 'ASSET' && a.id !== 'acc-1002') || accounts[0];
    const bankAcc = accounts.find((a) => a.type === 'BANK' || a.name.includes('Bank')) || accounts[1];
    const rahulContact = contacts.find((c) => c.name.includes('Rahul')) || contacts[0];

    setNewEntryLines([
      {
        id: '1',
        accountId: assetAcc?.id || '',
        partnerId: rahulContact?.id || '',
        debit: 10000,
        credit: '',
      },
      {
        id: '2',
        accountId: bankAcc?.id || '',
        partnerId: '',
        debit: '',
        credit: 10000,
      },
    ]);
  };

  // Set default dropdown values
  useEffect(() => {
    if (journals.length > 0 && !newEntryJournalId) {
      setNewEntryJournalId(journals[0].id);
    }
    if (accounts.length > 0 && !newJournalDefaultAccountId) {
      setNewJournalDefaultAccountId(accounts[0].id);
    }
  }, [journals, accounts, newEntryJournalId, newJournalDefaultAccountId]);

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
    } else if (path.includes('/one-truth') || path.includes('/flow')) {
      setActiveTab('FLOW');
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
      case 'FLOW':
        navigate(ROUTES.ACCOUNTING_ONE_TRUTH);
        break;
      default:
        navigate(ROUTES.ACCOUNTING);
        break;
    }
  };

  // Total debits & credits validation
  const totalDebits = journalEntries.reduce((acc, je) => acc + je.totalDebit, 0);
  const totalCredits = journalEntries.reduce((acc, je) => acc + je.totalCredit, 0);
  const isSystemBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

  const filteredAccounts = accounts.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.code.includes(searchTerm);
    const matchesType =
      accountTypeFilter === 'ALL' ||
      a.type === accountTypeFilter ||
      (accountTypeFilter === 'ASSET' && (a.type === 'BANK' || a.type === 'CASH')) ||
      (accountTypeFilter === 'EXPENSE' && a.type === 'OTHER_EXPENSE') ||
      (accountTypeFilter === 'EQUITY' && a.type === 'CAPITAL');
    return matchesSearch && matchesType;
  });

  const getAccountTypeBadgeVariant = (type: AccountItem['type']) => {
    switch (type) {
      case 'ASSET':
      case 'BANK':
      case 'CASH':
        return 'info';
      case 'LIABILITY':
        return 'danger';
      case 'EQUITY':
      case 'CAPITAL':
        return 'warning';
      case 'INCOME':
        return 'success';
      case 'EXPENSE':
      case 'OTHER_EXPENSE':
        return 'default';
      default:
        return 'default';
    }
  };

  const formatAccountTypeDisplay = (type: AccountItem['type'] | string) => {
    switch (type) {
      case 'ASSET':
      case 'BANK':
      case 'CASH':
        return 'Assets';
      case 'LIABILITY':
        return 'Liabilities';
      case 'EXPENSE':
      case 'OTHER_EXPENSE':
        return 'Expense';
      case 'INCOME':
        return 'Income';
      case 'CAPITAL':
      case 'EQUITY':
        return 'Capital';
      default:
        return type;
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

  // Line items calculations for new entry
  const sumEntryDebit = newEntryLines.reduce(
    (acc, l) => acc + (typeof l.debit === 'number' ? l.debit : parseFloat(String(l.debit)) || 0),
    0
  );
  const sumEntryCredit = newEntryLines.reduce(
    (acc, l) => acc + (typeof l.credit === 'number' ? l.credit : parseFloat(String(l.credit)) || 0),
    0
  );
  const entryDiscrepancy = Math.abs(sumEntryDebit - sumEntryCredit);
  const isEntryBalanced = entryDiscrepancy < 0.01 && sumEntryDebit > 0;
  const isPostDisabled = !isEntryBalanced;

  const handleSaveAccount = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newAccountName.trim()) return;

    addAccount({
      name: newAccountName.trim(),
      code: newAccountCode.trim() || undefined,
      type: newAccountType,
      initialBalance: parseFloat(String(newAccountBalance)) || 0,
    });

    setNewAccountName('');
    setNewAccountCode('');
    setNewAccountType('ASSET');
    setNewAccountBalance('');
    setCoaViewMode('list');
    setIsNewAccountModalOpen(false);
  };

  const handleSaveJournal = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newJournalName.trim() || !newJournalDefaultAccountId) return;

    addJournal({
      name: newJournalName.trim(),
      type: newJournalType,
      defaultAccountId: newJournalDefaultAccountId,
    });

    setNewJournalName('');
    setNewJournalType('SALES');
    setJournalViewMode('list');
    setIsNewJournalModalOpen(false);
  };

  const handleAddEntryLine = () => {
    setNewEntryLines((prev) => [
      ...prev,
      {
        id: String(Date.now() + Math.random()),
        accountId: '',
        partnerId: '',
        debit: '',
        credit: '',
      },
    ]);
  };

  const handleRemoveEntryLine = (id: string) => {
    if (newEntryLines.length <= 2) return;
    setNewEntryLines((prev) => prev.filter((l) => l.id !== id));
  };

  const handleLineChange = (
    id: string,
    field: keyof NewEntryLineDraft,
    value: string | number
  ) => {
    setNewEntryLines((prev) =>
      prev.map((line) => {
        if (line.id !== id) return line;
        const updated = { ...line, [field]: value };
        if (field === 'debit' && value !== '' && Number(value) > 0) {
          updated.credit = '';
        } else if (field === 'credit' && value !== '' && Number(value) > 0) {
          updated.debit = '';
        }
        return updated;
      })
    );
  };

  const handlePostEntry = () => {
    if (isPostDisabled) return;

    const formattedLines = newEntryLines
      .filter((l) => l.accountId && (Number(l.debit) > 0 || Number(l.credit) > 0))
      .map((l) => ({
        accountId: l.accountId,
        partnerId: l.partnerId || undefined,
        debit: Number(l.debit) || 0,
        credit: Number(l.credit) || 0,
      }));

    if (formattedLines.length < 2) return;

    const created = createManualJournalEntry({
      date: newEntryDate,
      journalId: newEntryJournalId || (journals[0] ? journals[0].id : ''),
      reference: newEntryReference.trim() || 'Manual Journal Entry',
      status: 'POSTED',
      lines: formattedLines,
    });

    setEntryViewMode('list');
    setIsNewEntryModalOpen(false);
    setNewEntryReference('');
    setAlertMessage(`Journal Entry ${created.entryNumber} successfully posted to General Ledger.`);
    setNewEntryLines([
      { id: '1', accountId: '', partnerId: '', debit: '', credit: '' },
      { id: '2', accountId: '', partnerId: '', debit: '', credit: '' },
    ]);
  };

  const handleSaveDraftEntry = () => {
    if (isPostDisabled) return;

    const formattedLines = newEntryLines
      .filter((l) => l.accountId && (Number(l.debit) > 0 || Number(l.credit) > 0))
      .map((l) => ({
        accountId: l.accountId,
        partnerId: l.partnerId || undefined,
        debit: Number(l.debit) || 0,
        credit: Number(l.credit) || 0,
      }));

    if (formattedLines.length < 2) return;

    const created = createManualJournalEntry({
      date: newEntryDate,
      journalId: newEntryJournalId || (journals[0] ? journals[0].id : ''),
      reference: newEntryReference.trim() || 'Manual Journal Entry (Draft)',
      status: 'DRAFT',
      lines: formattedLines,
    });

    setEntryViewMode('list');
    setIsNewEntryModalOpen(false);
    setNewEntryReference('');
    setAlertMessage(`Draft Journal Entry ${created.entryNumber} saved. You can review and post it at any time.`);
    setNewEntryLines([
      { id: '1', accountId: '', partnerId: '', debit: '', credit: '' },
      { id: '2', accountId: '', partnerId: '', debit: '', credit: '' },
    ]);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-surface-secondary">
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 w-full max-w-7xl mx-auto">
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

      {/* Alert Notifications */}
      {alertMessage && (
        <div className="flex items-center justify-between rounded-md border border-brand-200 bg-brand-50/80 px-4 py-2.5 text-xs text-brand-900 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-brand-700 shrink-0" />
            <span className="font-medium">{alertMessage}</span>
          </div>
          <button
            onClick={() => setAlertMessage(null)}
            className="text-brand-700 hover:text-brand-900 p-1 rounded cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {confirmNotice && (
        <div className="flex items-center justify-between rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs text-status-success shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0" />
            <span className="font-medium">Chart of Accounts verified and reconciled with General Ledger double-entry balance.</span>
          </div>
          <button
            onClick={() => setConfirmNotice(false)}
            className="text-emerald-700 hover:text-emerald-900 p-1 rounded cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

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
        coaViewMode === 'new' ? (
          <div className="rounded-lg border border-surface-border bg-white p-6 shadow-sm space-y-5">
            {/* Mockup Top Bar: Save Account (Purple) | Cancel, Back */}
            <div className="flex items-center justify-between border-b border-surface-border pb-4">
              <Button
                onClick={handleSaveAccount}
                className="bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white text-xs font-medium px-5 shadow-2xs cursor-pointer"
              >
                Save Account
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCoaViewMode('list')}
                  className="text-xs cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCoaViewMode('list')}
                  className="text-xs cursor-pointer"
                >
                  Back
                </Button>
              </div>
            </div>

            {/* When clicking on new: Card matching mockup */}
            <div className="max-w-xl space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-navy-800">
                  Account Name <span className="text-status-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Name (e.g. Bank A/c, Building A/c, Creditors A/c...)"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  className="w-full rounded border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-navy-800">
                    Account Code <span className="text-[10px] text-navy-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1005"
                    value={newAccountCode}
                    onChange={(e) => setNewAccountCode(e.target.value)}
                    className="w-full rounded border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-navy-800">
                    Initial Balance (Rs.)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={newAccountBalance}
                    onChange={(e) => setNewAccountBalance(e.target.value)}
                    className="w-full rounded border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Grouped Account Type Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-navy-800">
                  Type <span className="text-status-danger">*</span>
                </label>
                <select
                  value={newAccountType}
                  onChange={(e) => setNewAccountType(e.target.value as AccountItem['type'])}
                  className="w-full rounded border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-500 focus:outline-none"
                >
                  <optgroup label="Balancesheet">
                    <option value="ASSET">Asset</option>
                    <option value="LIABILITY">Liability</option>
                    <option value="BANK">Bank</option>
                    <option value="CAPITAL">Capital</option>
                    <option value="CASH">Cash</option>
                  </optgroup>
                  <optgroup label="Profit and Loss">
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expenses</option>
                    <option value="OTHER_EXPENSE">Other Expenses</option>
                  </optgroup>
                </select>

                {/* Exact mockup note */}
                <p className="text-[11px] text-navy-500 mt-2 leading-relaxed bg-brand-50/50 p-2.5 rounded border border-brand-100">
                  Each account is assigned an account Type, which would further be used for how the account to be treated and where it appears in reports.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Mockup Top Bar: New, Confirm, Archived | Home, Back */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setCoaViewMode('new')}
                  className="bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white text-xs flex items-center gap-1.5 shadow-sm font-medium"
                >
                  <Plus size={14} />
                  <span>New</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setConfirmNotice(true);
                    setTimeout(() => setConfirmNotice(false), 5000);
                  }}
                  className="text-xs text-navy-600 cursor-pointer"
                >
                  Confirm
                </Button>
                <Button
                  variant={showArchivedOnly ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setShowArchivedOnly((prev) => !prev);
                    setAccountTypeFilter((prev) => (prev === 'ALL' ? 'ASSET' : 'ALL'));
                    if (!showArchivedOnly) {
                      setAlertMessage('Archive View toggled: All accounts are currently active in General Ledger.');
                    } else {
                      setAlertMessage(null);
                    }
                  }}
                  className={`text-xs cursor-pointer ${showArchivedOnly ? 'bg-brand-700 text-white' : 'text-navy-600'}`}
                >
                  Archived
                </Button>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-navy-400" size={14} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search account name, code..."
                    className="w-full rounded-md border border-surface-border bg-white py-1.5 pl-8 pr-3 text-xs text-navy-800 placeholder-navy-400 focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(ROUTES.DASHBOARD)}
                  className="text-xs cursor-pointer"
                >
                  Home
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(-1)}
                  className="text-xs cursor-pointer"
                >
                  Back
                </Button>
              </div>
            </div>

            {/* Table matching diagram */}
            <div className="rounded-lg border border-surface-border bg-white shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="w-24">Code</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.map((a) => (
                    <TableRow key={a.id} className="hover:bg-surface-secondary/60">
                      <TableCell className="font-semibold text-navy-900 text-xs">{a.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-xs text-navy-800">
                            {formatAccountTypeDisplay(a.type)}
                          </span>
                          <Badge variant={getAccountTypeBadgeVariant(a.type)} className="text-[10px] py-0 px-1.5">
                            {a.type}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs font-bold text-brand-700">{a.code}</TableCell>
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
        )
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* TAB 2: JOURNALS */}
      {/* ──────────────────────────────────────────────────────── */}
      {activeTab === 'JOURNALS' && (
        journalViewMode === 'new' ? (
          <div className="rounded-lg border border-surface-border bg-white p-6 shadow-sm space-y-5">
            {/* Top Bar matching diagram: Save Journal (Purple) | Cancel, Back */}
            <div className="flex items-center justify-between border-b border-surface-border pb-4">
              <Button
                onClick={handleSaveJournal}
                className="bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white text-xs font-medium px-5 shadow-2xs cursor-pointer"
              >
                Save Journal
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setJournalViewMode('list')}
                  className="text-xs cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setJournalViewMode('list')}
                  className="text-xs cursor-pointer"
                >
                  Back
                </Button>
              </div>
            </div>

            {/* When clicking on New: Card matching mockup */}
            <div className="max-w-xl space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-navy-800">
                  Journal Name <span className="text-status-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Name (e.g. Sales, Purchase, Bank, Cash...)"
                  value={newJournalName}
                  onChange={(e) => setNewJournalName(e.target.value)}
                  className="w-full rounded border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-navy-800">
                  Journal Type <span className="text-status-danger">*</span>
                </label>
                <select
                  value={newJournalType}
                  onChange={(e) => setNewJournalType(e.target.value as JournalItem['type'])}
                  className="w-full rounded border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-500 focus:outline-none"
                >
                  <option value="SALES">Sales</option>
                  <option value="PURCHASE">Purchase</option>
                  <option value="BANK">Bank</option>
                  <option value="CASH">Cash</option>
                </select>
                <p className="text-[11px] text-navy-400">Select from: Sales, Purchase, Bank, Cash</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-navy-800">
                  Default Account <span className="text-status-danger">*</span>
                </label>
                <select
                  required
                  value={newJournalDefaultAccountId}
                  onChange={(e) => setNewJournalDefaultAccountId(e.target.value)}
                  className="w-full rounded border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-500 focus:outline-none"
                >
                  <option value="">-- Select Default Account --</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.type})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-navy-400">From Chart of Accounts Many to one</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {/* Mockup Button: New (Purple) */}
              <Button
                onClick={() => setJournalViewMode('new')}
                className="bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white text-xs flex items-center gap-1.5 shadow-sm font-medium"
              >
                <Plus size={14} />
                <span>New</span>
              </Button>

              {/* Mockup Button: Back */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="text-xs"
              >
                Back
              </Button>
            </div>

            {/* Table View matching mockup: Journal Name, Type, Default Account */}
            <div className="rounded-lg border border-surface-border bg-white shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Journal Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Default Account</TableHead>
                    <TableHead className="text-center">Entries Count</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {journals.map((j) => {
                    const defAcc = accounts.find((a) => a.id === j.defaultAccountId);
                    const defaultAccountDisplay = j.defaultAccountName || (defAcc ? `${defAcc.name}` : '—');
                    return (
                      <TableRow key={j.id} className="hover:bg-surface-secondary/60">
                        <TableCell className="font-semibold text-xs text-navy-900">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-bold text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded">
                              {j.code}
                            </span>
                            <span>{j.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="info">{j.type}</Badge>
                        </TableCell>
                        <TableCell className="text-xs text-navy-700 font-medium">
                          {defaultAccountDisplay}
                        </TableCell>
                        <TableCell className="text-center font-mono text-xs text-navy-700">
                          {j.entriesCount}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTabChange('ENTRIES')}
                            className="h-7 text-[11px] px-2 text-brand-700"
                          >
                            View Entries
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* TAB 3: JOURNAL ENTRIES */}
      {/* ──────────────────────────────────────────────────────── */}
      {activeTab === 'ENTRIES' && (
        entryViewMode === 'new' ? (
          <div className="rounded-lg border border-surface-border bg-white p-6 shadow-sm space-y-5">
            {/* Top action bar: Post (Purple), Save as Draft | Cancel, Back */}
            <div className="flex items-center justify-between border-b border-surface-border pb-4">
              <div className="flex items-center gap-2">
                <Button
                  disabled={isPostDisabled}
                  onClick={handlePostEntry}
                  className={`text-xs text-white font-medium px-6 py-2 rounded shadow-2xs transition cursor-pointer ${
                    isPostDisabled
                      ? 'bg-brand-300/80 text-white/70 cursor-not-allowed hover:bg-brand-300/80'
                      : 'bg-brand-700 hover:bg-brand-800 active:bg-brand-850'
                  }`}
                >
                  Post
                </Button>
                <Button
                  disabled={isPostDisabled}
                  variant="outline"
                  size="sm"
                  onClick={handleSaveDraftEntry}
                  className="text-xs text-navy-700 font-medium cursor-pointer"
                >
                  Save as Draft
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEntryViewMode('list')}
                  className="text-xs cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEntryViewMode('list')}
                  className="text-xs cursor-pointer"
                >
                  Back
                </Button>
              </div>
            </div>

            {/* Document Header Fields Grid: 3-column cohesive responsive layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/80 p-4 rounded-lg border border-surface-border">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-navy-800">
                  Accounting Date <span className="text-status-danger">*</span>
                </label>
                <input
                  type="date"
                  value={newEntryDate}
                  onChange={(e) => setNewEntryDate(e.target.value)}
                  className="w-full rounded border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-500 focus:outline-none shadow-2xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-navy-800">
                  Journal <span className="text-status-danger">*</span>
                </label>
                <select
                  value={newEntryJournalId}
                  onChange={(e) => setNewEntryJournalId(e.target.value)}
                  className="w-full rounded border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-500 focus:outline-none shadow-2xs"
                >
                  {journals.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.name} ({j.type})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-navy-400">Selection (From journals Many to one)</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-navy-800">Reference</label>
                <input
                  type="text"
                  placeholder="e.g. Bill/2026/0001, Inv/2026/001..."
                  value={newEntryReference}
                  onChange={(e) => setNewEntryReference(e.target.value)}
                  className="w-full rounded border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-500 focus:outline-none shadow-2xs"
                />
              </div>
            </div>

            {/* Quick helper to load diagram sample */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-navy-700">Line Items</span>
              <button
                type="button"
                onClick={fillMockupSample}
                className="text-[11px] text-brand-700 hover:text-brand-800 font-medium underline"
              >
                + Load Diagram Sample (Asset A/c + Bank A/c Rs. 10,000)
              </button>
            </div>

            {/* Dynamic Lines Table: Account, Partner, Debit, Credit */}
            <div className="rounded border border-surface-border bg-white overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-surface-secondary/60">
                  <TableRow>
                    <TableHead className="w-[36%]">Account</TableHead>
                    <TableHead className="w-[28%]">Partner</TableHead>
                    <TableHead className="w-[16%] text-right">Debit</TableHead>
                    <TableHead className="w-[16%] text-right">Credit</TableHead>
                    <TableHead className="w-[4%]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {newEntryLines.map((line) => (
                    <TableRow key={line.id} className="hover:bg-slate-50/50">
                      <TableCell className="p-2">
                        <select
                          value={line.accountId}
                          onChange={(e) => handleLineChange(line.id, 'accountId', e.target.value)}
                          className="w-full rounded border border-surface-border bg-white px-2 py-1.5 text-xs text-navy-900 focus:border-brand-500 focus:outline-none"
                        >
                          <option value="">-- Select Account --</option>
                          {accounts.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.name} ({a.type})
                            </option>
                          ))}
                        </select>
                      </TableCell>

                      <TableCell className="p-2">
                        <select
                          value={line.partnerId}
                          onChange={(e) => handleLineChange(line.id, 'partnerId', e.target.value)}
                          className="w-full rounded border border-surface-border bg-white px-2 py-1.5 text-xs text-navy-900 focus:border-brand-500 focus:outline-none"
                        >
                          <option value="">-- None --</option>
                          {contacts.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </TableCell>

                      <TableCell className="p-2 text-right">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={line.debit}
                          onChange={(e) => handleLineChange(line.id, 'debit', e.target.value)}
                          className="w-full text-right rounded border border-surface-border bg-white px-2 py-1.5 text-xs font-mono text-navy-900 focus:border-brand-500 focus:outline-none"
                        />
                      </TableCell>

                      <TableCell className="p-2 text-right">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={line.credit}
                          onChange={(e) => handleLineChange(line.id, 'credit', e.target.value)}
                          className="w-full text-right rounded border border-surface-border bg-white px-2 py-1.5 text-xs font-mono text-navy-900 focus:border-brand-500 focus:outline-none"
                        />
                      </TableCell>

                      <TableCell className="p-2 text-center">
                        {newEntryLines.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveEntryLine(line.id)}
                            className="text-navy-400 hover:text-status-danger transition p-1"
                            title="Remove Line"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}

                  <TableRow className="bg-surface-secondary/70 font-bold border-t border-surface-border">
                    <TableCell colSpan={2} className="py-2.5 px-3 text-xs text-navy-900">Total</TableCell>
                    <TableCell className="py-2.5 px-2 text-right font-mono text-xs text-navy-900">
                      Rs. {sumEntryDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="py-2.5 px-2 text-right font-mono text-xs text-navy-900">
                      Rs. {sumEntryCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddEntryLine}
                className="text-xs text-brand-700 hover:bg-brand-50 flex items-center gap-1 border-dashed"
              >
                <Plus size={13} />
                <span>Add a Line</span>
              </Button>
            </div>

            {/* Blocking warning if the debit and credit amount don't match */}
            {!isEntryBalanced ? (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-status-danger font-medium flex items-center gap-2">
                <AlertTriangle size={16} className="shrink-0" />
                <span>
                  Blocking warning: The debit and credit amount don&apos;t match. (Debit: Rs. {sumEntryDebit.toLocaleString('en-IN')} vs Credit: Rs. {sumEntryCredit.toLocaleString('en-IN')}). The &apos;Post&apos; button is disabled until both sides match.
                </span>
              </div>
            ) : (
              <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs text-status-success font-medium flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>
                  Balanced Double-Entry: Total Debits (Rs. {sumEntryDebit.toLocaleString('en-IN')}) equal Total Credits (Rs. {sumEntryCredit.toLocaleString('en-IN')}). Ready to post.
                </span>
              </div>
            )}

            {/* Field Explanation Card */}
            <div className="rounded-lg border border-surface-border bg-surface-secondary/40 p-4 space-y-2 text-xs">
              <h4 className="font-bold text-navy-900 text-sm">Field Explanation</h4>
              <div className="space-y-1.5 text-navy-700">
                <p><span className="font-semibold text-brand-700">Account</span> — Selection From Chart of Accounts (Many to one)</p>
                <p><span className="font-semibold text-brand-700">Partner</span> — Selection from contact master</p>
                <p className="text-[11px] text-navy-500 pt-2 border-t border-surface-border">
                  The Transaction would be connected through Chart of Accounts
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {/* Mockup Button: New (Purple) */}
              <Button
                onClick={() => setEntryViewMode('new')}
                className="bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white text-xs flex items-center gap-1.5 shadow-sm font-medium"
              >
                <Plus size={14} />
                <span>New</span>
              </Button>

              {/* Mockup Button: Back */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="text-xs"
              >
                Back
              </Button>
            </div>

            {/* List Table matching diagram: Date, Number, Partner, Journal, Total, Status, Actions */}
            <div className="rounded-lg border border-surface-border bg-white shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Number</TableHead>
                    <TableHead>Partner</TableHead>
                    <TableHead>Journal</TableHead>
                    <TableHead className="text-right">Total</TableHead>
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
                      <TableCell className="text-xs text-navy-600 font-medium">
                        {formatDisplayDate(je.date)}
                      </TableCell>
                      <TableCell className="font-mono text-xs font-bold text-brand-700">
                        {je.entryNumber}
                      </TableCell>
                      <TableCell className="text-xs font-medium text-navy-800">
                        {je.partnerName || '—'}
                      </TableCell>
                      <TableCell className="text-xs text-navy-700">
                        {je.journalName}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs font-bold text-navy-900">
                        {formatAmount(je.totalDebit)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={je.status === 'POSTED' || je.isBalanced ? 'success' : 'warning'}>
                          {je.status === 'POSTED' || je.isBalanced ? 'Posted' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {je.status === 'DRAFT' && (
                            <Button
                              size="sm"
                              onClick={() => {
                                postJournalEntry(je.id);
                                setAlertMessage(`Journal Entry ${je.entryNumber} successfully posted to General Ledger.`);
                              }}
                              className="h-7 text-[11px] px-2.5 bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white font-medium shadow-xs cursor-pointer"
                            >
                              Post
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedEntry(je)}
                            className="h-7 text-[11px] px-2 cursor-pointer"
                          >
                            <Eye size={12} className="mr-1" />
                            Audit Lines
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )
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

      {/* ──────────────────────────────────────────────────────── */}
      {/* MODAL: + NEW ACCOUNT (EXACT MOCKUP IMPLEMENTATION) */}
      {/* ──────────────────────────────────────────────────────── */}
      {isNewAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/50 p-4">
          <div className="w-full max-w-md rounded-lg border border-surface-border bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="font-bold text-navy-900 text-sm">New Chart of Account</h3>
              <button
                onClick={() => setIsNewAccountModalOpen(false)}
                className="rounded p-1 text-navy-400 hover:bg-surface-secondary"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAccount} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">
                  Account Name <span className="text-status-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Building A/c, Other Expense A/c, Capital A/c..."
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">
                    Account Code <span className="text-[10px] text-navy-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1005"
                    value={newAccountCode}
                    onChange={(e) => setNewAccountCode(e.target.value)}
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">
                    Initial Balance (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={newAccountBalance}
                    onChange={(e) => setNewAccountBalance(e.target.value)}
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Grouped Account Type Dropdown as in Mockup */}
              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">
                  Type <span className="text-status-danger">*</span>
                </label>
                <select
                  value={newAccountType}
                  onChange={(e) => setNewAccountType(e.target.value as AccountItem['type'])}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-500 focus:outline-none"
                >
                  <optgroup label="BalanceSheet">
                    <option value="ASSET">Asset</option>
                    <option value="LIABILITY">Liability</option>
                    <option value="BANK">Bank</option>
                    <option value="CAPITAL">Capital</option>
                    <option value="CASH">Cash</option>
                  </optgroup>
                  <optgroup label="Profit and Loss">
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expenses</option>
                    <option value="OTHER_EXPENSE">Other Expenses</option>
                  </optgroup>
                </select>
                {/* Mockup note */}
                <p className="text-[11px] text-navy-400 mt-1.5 leading-relaxed">
                  Each account is assigned an Account Type, which would further be used for how the account to be treated and where it appears in reports.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsNewAccountModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white text-xs shadow-sm font-medium"
                >
                  Save Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* MODAL: + NEW JOURNAL (EXACT MOCKUP IMPLEMENTATION) */}
      {/* ──────────────────────────────────────────────────────── */}
      {isNewJournalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/50 p-4">
          <div className="w-full max-w-md rounded-lg border border-surface-border bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="font-bold text-navy-900 text-sm">New Journal</h3>
              <button
                onClick={() => setIsNewJournalModalOpen(false)}
                className="rounded p-1 text-navy-400 hover:bg-surface-secondary"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveJournal} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">
                  Journal Name <span className="text-status-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sales, Purchases, Bank, Cash..."
                  value={newJournalName}
                  onChange={(e) => setNewJournalName(e.target.value)}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">
                  Journal Type <span className="text-status-danger">*</span>
                </label>
                <select
                  value={newJournalType}
                  onChange={(e) => setNewJournalType(e.target.value as JournalItem['type'])}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-500 focus:outline-none"
                >
                  <option value="SALES">Sales</option>
                  <option value="PURCHASE">Purchases</option>
                  <option value="BANK">Bank</option>
                  <option value="CASH">Cash</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">
                  Default Account (Many to one) <span className="text-status-danger">*</span>
                </label>
                <select
                  required
                  value={newJournalDefaultAccountId}
                  onChange={(e) => setNewJournalDefaultAccountId(e.target.value)}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-brand-500 focus:outline-none"
                >
                  <option value="">-- Select Default Account --</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.code} — {a.name} ({a.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsNewJournalModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white text-xs shadow-sm font-medium"
                >
                  Save Journal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* MODAL / SCREEN: + NEW JOURNAL ENTRY (EXACT MOCKUP POST SCREEN) */}
      {/* ──────────────────────────────────────────────────────── */}
      {isNewEntryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/60 p-4 overflow-y-auto">
          <div className="w-full max-w-4xl rounded-lg border border-surface-border bg-white p-6 shadow-2xl space-y-4 my-8">
            {/* Header Action Bar: Post & Cancel */}
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-bold text-navy-900">New Journal Entry</h3>
                <Badge variant={isEntryBalanced ? 'success' : 'warning'}>
                  {isEntryBalanced ? 'BALANCED' : 'DRAFT'}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsNewEntryModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>

                {/* Post Button: Purple, blocked if unbalanced */}
                <Button
                  size="sm"
                  disabled={isPostDisabled}
                  onClick={handlePostEntry}
                  className={`text-xs text-white font-medium px-4 shadow-sm transition ${
                    isPostDisabled
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed hover:bg-slate-300'
                      : 'bg-brand-700 hover:bg-brand-800 active:bg-brand-850'
                  }`}
                >
                  Post
                </Button>
              </div>
            </div>

            {/* Header Metadata Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-surface-secondary/40 p-3.5 rounded-lg border border-surface-border">
              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">
                  Accounting Date <span className="text-status-danger">*</span>
                </label>
                <input
                  type="date"
                  value={newEntryDate}
                  onChange={(e) => setNewEntryDate(e.target.value)}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-1.5 text-xs text-navy-900 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">
                  Journal <span className="text-status-danger">*</span>
                </label>
                <select
                  value={newEntryJournalId}
                  onChange={(e) => setNewEntryJournalId(e.target.value)}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-1.5 text-xs text-navy-900 focus:border-brand-500 focus:outline-none"
                >
                  {journals.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.name} ({j.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">
                  Reference
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bill/2026/0001, Inv/2026/001, JE-2026-001..."
                  value={newEntryReference}
                  onChange={(e) => setNewEntryReference(e.target.value)}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-1.5 text-xs text-navy-900 focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Dynamic Line Items Table */}
            <div className="rounded-md border border-surface-border bg-white overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[36%]">Account (Selection from Chart of Accounts)</TableHead>
                    <TableHead className="w-[28%]">Partner (Selection from Contact Master)</TableHead>
                    <TableHead className="w-[16%] text-right">Debit (₹)</TableHead>
                    <TableHead className="w-[16%] text-right">Credit (₹)</TableHead>
                    <TableHead className="w-[4%] text-center"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {newEntryLines.map((line) => (
                    <TableRow key={line.id} className="hover:bg-slate-50/50">
                      {/* Account Selector (Many to one) */}
                      <TableCell className="p-2">
                        <select
                          value={line.accountId}
                          onChange={(e) => handleLineChange(line.id, 'accountId', e.target.value)}
                          className="w-full rounded border border-surface-border bg-white px-2 py-1.5 text-xs text-navy-900 focus:border-brand-500 focus:outline-none"
                        >
                          <option value="">-- Select Account --</option>
                          {accounts.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.code} — {a.name} ({a.type})
                            </option>
                          ))}
                        </select>
                      </TableCell>

                      {/* Partner Selector (Contact Master) */}
                      <TableCell className="p-2">
                        <select
                          value={line.partnerId}
                          onChange={(e) => handleLineChange(line.id, 'partnerId', e.target.value)}
                          className="w-full rounded border border-surface-border bg-white px-2 py-1.5 text-xs text-navy-900 focus:border-brand-500 focus:outline-none"
                        >
                          <option value="">-- None / Internal --</option>
                          {contacts.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name} ({c.type})
                            </option>
                          ))}
                        </select>
                      </TableCell>

                      {/* Debit Input */}
                      <TableCell className="p-2 text-right">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={line.debit}
                          onChange={(e) => handleLineChange(line.id, 'debit', e.target.value)}
                          className="w-full text-right rounded border border-surface-border bg-white px-2 py-1.5 text-xs font-mono text-navy-900 focus:border-brand-500 focus:outline-none"
                        />
                      </TableCell>

                      {/* Credit Input */}
                      <TableCell className="p-2 text-right">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={line.credit}
                          onChange={(e) => handleLineChange(line.id, 'credit', e.target.value)}
                          className="w-full text-right rounded border border-surface-border bg-white px-2 py-1.5 text-xs font-mono text-navy-900 focus:border-brand-500 focus:outline-none"
                        />
                      </TableCell>

                      {/* Remove line */}
                      <TableCell className="p-2 text-center">
                        {newEntryLines.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveEntryLine(line.id)}
                            className="text-navy-400 hover:text-status-danger transition p-1"
                            title="Remove Line"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Totals Summary Row */}
                  <TableRow className="bg-surface-secondary/70 font-bold border-t border-surface-border">
                    <TableCell colSpan={2} className="py-2.5 px-3 text-xs text-navy-900">
                      Total Equality Balance
                    </TableCell>
                    <TableCell className="py-2.5 px-2 text-right font-mono text-xs text-navy-900">
                      ₹{sumEntryDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="py-2.5 px-2 text-right font-mono text-xs text-navy-900">
                      ₹{sumEntryCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Add a Line Button */}
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddEntryLine}
                className="text-xs text-brand-700 hover:bg-brand-50 flex items-center gap-1 border-dashed"
              >
                <Plus size={13} />
                <span>Add a Line</span>
              </Button>

              {entryDiscrepancy > 0 && (
                <span className="text-xs font-mono text-status-danger font-semibold">
                  Discrepancy: ₹{entryDiscrepancy.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              )}
            </div>

            {/* ⚠️ BLOCKING WARNING BANNER (EXACT REQUIREMENT FROM DIAGRAM) */}
            {!isEntryBalanced ? (
              <div className="flex items-start gap-2.5 rounded-md border border-red-200 bg-red-50/90 p-3 text-xs text-status-danger">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold">Blocking warning: </span>
                  {sumEntryDebit === 0 && sumEntryCredit === 0 ? (
                    <span>Enter debit and credit amounts for at least two account lines.</span>
                  ) : (
                    <span>
                      The debit (₹{sumEntryDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}) and credit (₹{sumEntryCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}) amounts do not match. The &apos;Post&apos; button is disabled until both sides are perfectly equal.
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-status-success font-medium">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>
                  Balanced Double-Entry: Total Debits (₹{sumEntryDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}) equal Total Credits (₹{sumEntryCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}). Ready to post.
                </span>
              </div>
            )}

            {/* Diagram Help / Explanatory Note Card */}
            <div className="rounded-md border border-brand-100 bg-brand-50/50 p-3 text-xs text-navy-600 space-y-1">
              <div className="font-bold text-brand-900 flex items-center gap-1.5">
                <Info size={14} />
                <span>Accounting Architecture Rules:</span>
              </div>
              <ul className="list-disc list-inside text-[11px] text-navy-700 space-y-0.5 pl-1">
                <li>
                  <strong className="text-navy-900">Account:</strong> Selection from Chart of Accounts (Many to one).
                </li>
                <li>
                  <strong className="text-navy-900">Partner:</strong> Selection from Contact Master (Customers / Vendors).
                </li>
                <li>
                  The transaction is connected through Chart of Accounts and automatically reflects in the General Ledger.
                </li>
              </ul>
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
              {selectedEntry.partnerName && (
                <p>
                  <span className="font-semibold text-navy-900">Partner:</span> {selectedEntry.partnerName}
                </p>
              )}
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

            <div className="flex items-center justify-between pt-3 border-t border-surface-border">
              {selectedEntry.status === 'DRAFT' ? (
                <div className="flex items-center gap-2">
                  <Badge variant="warning">Draft Entry</Badge>
                  <Button
                    size="sm"
                    onClick={() => {
                      postJournalEntry(selectedEntry.id);
                      setSelectedEntry((prev) => (prev ? { ...prev, status: 'POSTED' } : null));
                      setAlertMessage(`Journal Entry ${selectedEntry.entryNumber} successfully posted to General Ledger.`);
                    }}
                    className="bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white text-xs font-medium px-4 py-1.5 shadow-sm cursor-pointer"
                  >
                    Post Entry
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Badge variant="success">
                    <CheckCircle2 size={12} className="mr-1" /> EQUALITY VERIFIED (POSTED)
                  </Badge>
                  <button
                    onClick={() => {
                      resetJournalEntryToDraft(selectedEntry.id);
                      setSelectedEntry((prev) => (prev ? { ...prev, status: 'DRAFT' } : null));
                      setAlertMessage(`Journal Entry ${selectedEntry.entryNumber} reset to Draft.`);
                    }}
                    className="text-[11px] text-navy-400 hover:text-navy-700 underline cursor-pointer ml-1"
                  >
                    Reset to Draft
                  </button>
                </div>
              )}
              <Button variant="outline" size="sm" onClick={() => setSelectedEntry(null)} className="cursor-pointer">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default AccountingPage;
