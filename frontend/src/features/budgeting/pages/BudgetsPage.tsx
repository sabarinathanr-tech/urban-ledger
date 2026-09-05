import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Plus,
  CheckCircle2,
  AlertTriangle,
  X,
  Target,
  UserCheck,
  TrendingDown,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useERP } from '@/context/ERPContext';
import { OdooControlPanel } from '@/components/layout/OdooControlPanel';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

export function BudgetsPage() {
  const location = useLocation();
  const { budgets, addBudget, analyticAccounts, addAnalyticAccount, refreshERPData } = useERP();

  const isAnalyticRoute = location.pathname.includes('analytic');
  const [activeTab, setActiveTab] = useState<'budgets' | 'analytics'>(
    isAnalyticRoute ? 'analytics' : 'budgets'
  );

  useEffect(() => {
    if (location.pathname.includes('analytic')) {
      setActiveTab('analytics');
    } else {
      setActiveTab('budgets');
    }
  }, [location.pathname]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnalyticModalOpen, setIsAnalyticModalOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // New Budget Form State
  const [name, setName] = useState('');
  const [period, setPeriod] = useState('FY 2025-26 Q4');
  const [responsible, setResponsible] = useState('Mohith (Production Lead)');
  const [selectedAnalytic, setSelectedAnalytic] = useState(
    analyticAccounts[0]?.name || 'Wood Procurement (Expenses)'
  );
  const [plannedAmount, setPlannedAmount] = useState<number>(50000);

  // New Analytic Account Form State
  const [newAnalyticName, setNewAnalyticName] = useState('');
  const [newAnalyticType, setNewAnalyticType] = useState<'INCOME' | 'EXPENSES'>('EXPENSES');
  const [newAnalyticDesc, setNewAnalyticDesc] = useState('');

  const filteredBudgets = budgets.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.analyticAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.responsible.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPlanned = budgets.reduce((acc, b) => acc + b.plannedAmount, 0);
  const totalActual = budgets.reduce((acc, b) => acc + b.actualAmount, 0);
  const totalRemaining = budgets.reduce((acc, b) => acc + b.remainingAmount, 0);
  const warningOrExceededCount = budgets.filter(
    (b) => b.status === 'WARNING' || b.status === 'EXCEEDED'
  ).length;

  const handleCreateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || plannedAmount <= 0) return;

    addBudget({
      name: name.trim(),
      period,
      responsible,
      analyticAccount: selectedAnalytic,
      plannedAmount,
    });

    setIsModalOpen(false);
    setName('');
    setNotice(`Budget "${name}" created successfully under analytic account "${selectedAnalytic}".`);
    setTimeout(() => setNotice(null), 6000);
  };

  const handleCreateAnalytic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnalyticName.trim()) return;

    const acc = addAnalyticAccount({
      name: newAnalyticName.trim(),
      type: newAnalyticType,
      description: newAnalyticDesc.trim() || undefined,
    });

    setIsAnalyticModalOpen(false);
    setNewAnalyticName('');
    setNewAnalyticDesc('');
    setSelectedAnalytic(acc.name);
    setNotice(`Analytic Account "${acc.name}" added to master cost centers.`);
    setTimeout(() => setNotice(null), 5000);
  };

  const getStatusBadge = (status: string, utilization: number) => {
    switch (status) {
      case 'HEALTHY':
        return <Badge variant="success">HEALTHY ({utilization}%)</Badge>;
      case 'WARNING':
        return <Badge variant="warning">NEAR LIMIT ({utilization}%)</Badge>;
      case 'EXCEEDED':
        return <Badge variant="danger">EXCEEDED ({utilization}%)</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-surface-secondary">
      {/* Odoo Control Panel */}
      <OdooControlPanel
        title="Budgets & Analytic Accounts"
        subtitle="Cost center tracking, planned vs actual spend, and analytic accounting (PS Page 4)"
        itemCount={activeTab === 'budgets' ? filteredBudgets.length : analyticAccounts.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search budgets or analytic accounts..."
        onNewClick={() => {
          if (activeTab === 'budgets') {
            setIsModalOpen(true);
          } else {
            setIsAnalyticModalOpen(true);
          }
        }}
        newButtonLabel={activeTab === 'budgets' ? 'New Budget' : 'New Analytic Account'}
        filterOptions={
          activeTab === 'budgets'
            ? [
                { label: 'All', value: 'ALL' },
                { label: 'Healthy', value: 'HEALTHY' },
                { label: 'Warning', value: 'WARNING' },
                { label: 'Exceeded', value: 'EXCEEDED' },
              ]
            : undefined
        }
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
        extraActions={
          <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('budgets')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'budgets'
                  ? 'bg-white text-navy-900 shadow-2xs'
                  : 'text-text-muted hover:text-navy-800'
              }`}
            >
              Budgets Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-white text-navy-900 shadow-2xs'
                  : 'text-text-muted hover:text-navy-800'
              }`}
            >
              Analytic Accounts ({analyticAccounts.length})
            </button>
          </div>
        }
        onRefresh={refreshERPData}
      />

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 max-w-7xl w-full mx-auto">
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

        {/* ============================================================ */}
        {/* TAB 1: BUDGETS OVERVIEW                                      */}
        {/* ============================================================ */}
        {activeTab === 'budgets' && (
          <>
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-lg border border-surface-border bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-muted uppercase">Total Planned Budget</span>
                  <Target size={16} className="text-navy-600" />
                </div>
                <p className="mt-2 text-xl font-bold font-mono text-navy-900">
                  ₹{totalPlanned.toLocaleString('en-IN')}
                </p>
                <span className="text-[11px] text-text-muted mt-1 block">Allocated across {budgets.length} cost centers</span>
              </div>

              <div className="rounded-lg border border-surface-border bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-muted uppercase">Actual Expenditure</span>
                  <TrendingDown size={16} className="text-amber-600" />
                </div>
                <p className="mt-2 text-xl font-bold font-mono text-amber-600">
                  ₹{totalActual.toLocaleString('en-IN')}
                </p>
                <span className="text-[11px] text-text-muted mt-1 block">
                  {Math.round((totalActual / (totalPlanned || 1)) * 100)}% overall utilization
                </span>
              </div>

              <div className="rounded-lg border border-surface-border bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-muted uppercase">Available Balance</span>
                  <CheckCircle2 size={16} className="text-emerald-700" />
                </div>
                <p className="mt-2 text-xl font-bold font-mono text-emerald-700">
                  ₹{totalRemaining.toLocaleString('en-IN')}
                </p>
                <span className="text-[11px] text-text-muted mt-1 block">Uncommitted spending margin</span>
              </div>

              <div className="rounded-lg border border-surface-border bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-muted uppercase">Over-Limit Alerts</span>
                  <AlertTriangle size={16} className="text-red-600" />
                </div>
                <p className="mt-2 text-xl font-bold font-mono text-red-600">
                  {warningOrExceededCount} Budgets
                </p>
                <span className="text-[11px] text-text-muted mt-1 block">Near or exceeding 80% ceiling</span>
              </div>
            </div>

            {/* Budgets Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBudgets.map((b) => (
                <div
                  key={b.id}
                  className="rounded-lg border border-surface-border bg-white p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-sm text-navy-900 leading-snug">{b.name}</h3>
                        <p className="text-[11px] text-brand-700 font-medium mt-0.5">{b.analyticAccount}</p>
                      </div>
                      {getStatusBadge(b.status, b.utilization)}
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-muted">Utilization</span>
                        <span className="font-mono font-bold text-navy-900">{b.utilization}%</span>
                      </div>
                      <Progress
                        value={b.utilization}
                        indicatorClassName={b.utilization > 100 ? 'bg-red-600' : b.utilization > 80 ? 'bg-amber-500' : 'bg-emerald-600'}
                        className="h-2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 text-xs border-t border-slate-100">
                      <div>
                        <span className="text-[10px] text-text-muted uppercase font-semibold">Planned Budget</span>
                        <p className="font-mono font-bold text-navy-900 mt-0.5">
                          ₹{b.plannedAmount.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-text-muted uppercase font-semibold">Actual Spend</span>
                        <p className="font-mono font-bold text-amber-600 mt-0.5">
                          ₹{b.actualAmount.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-text-muted">
                    <span className="flex items-center gap-1">
                      <UserCheck size={12} /> {b.responsible}
                    </span>
                    <span>{b.period}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ============================================================ */}
        {/* TAB 2: ANALYTIC ACCOUNTS MASTER (PS Page 4)                 */}
        {/* ============================================================ */}
        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg border border-surface-border shadow-2xs flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-navy-900">Analytic Accounts Master (PS Page 4)</h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Financial markers used to monitor expenses and income by department, project, or cost center.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => setIsAnalyticModalOpen(true)}
                className="bg-navy-900 hover:bg-navy-800 text-white text-xs cursor-pointer"
              >
                <Plus size={14} className="mr-1" />
                Add Analytic Account
              </Button>
            </div>

            <div className="rounded-lg border border-surface-border bg-white shadow-2xs overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Analytic Account Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description / Purpose</TableHead>
                    <TableHead className="text-right">Active Budgets</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticAccounts.map((acc) => {
                    const matchedBudgets = budgets.filter((b) =>
                      b.analyticAccount.toLowerCase().includes(acc.name.toLowerCase())
                    );
                    return (
                      <TableRow key={acc.id} className="hover:bg-slate-50">
                        <TableCell className="font-semibold text-xs text-navy-900">
                          <div className="flex items-center gap-2">
                            <Layers size={14} className="text-brand-700" />
                            <span>{acc.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={acc.type === 'INCOME' ? 'success' : 'default'} className="text-[10px]">
                            {acc.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-text-muted">
                          {acc.description || 'Cost center marker for Urban Furniture operations'}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs font-semibold">
                          {matchedBudgets.length} allocated
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* NEW BUDGET MODAL                                             */}
      {/* ============================================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-xl border border-surface-border bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div>
                <h3 className="text-base font-bold text-navy-900">Create Analytical Budget</h3>
                <p className="text-xs text-text-muted">Set spending limit for department or project</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-navy-900 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateBudget} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Budget Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Teak Log Procurement Q1"
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Analytic Account (PS Page 4) *</label>
                <select
                  value={selectedAnalytic}
                  onChange={(e) => setSelectedAnalytic(e.target.value)}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none cursor-pointer"
                >
                  {analyticAccounts.map((acc) => (
                    <option key={acc.id} value={acc.name}>
                      {acc.name} ({acc.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Planned Ceiling (₹) *</label>
                  <input
                    type="number"
                    min={1000}
                    required
                    value={plannedAmount}
                    onChange={(e) => setPlannedAmount(Number(e.target.value))}
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs font-mono text-navy-900 focus:border-navy-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-800 mb-1">Budget Period</label>
                  <input
                    type="text"
                    required
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    placeholder="FY 2025-26 Q4"
                    className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Responsible Person</label>
                <input
                  type="text"
                  required
                  value={responsible}
                  onChange={(e) => setResponsible(e.target.value)}
                  placeholder="e.g. Mohith (Production Lead)"
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-navy-900 hover:bg-navy-800 text-white cursor-pointer">
                  Save Budget
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* NEW ANALYTIC ACCOUNT MODAL                                   */}
      {/* ============================================================ */}
      {isAnalyticModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-xl border border-surface-border bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div>
                <h3 className="text-base font-bold text-navy-900">New Analytic Account</h3>
                <p className="text-xs text-text-muted">Define financial tracking marker (PS Page 4)</p>
              </div>
              <button onClick={() => setIsAnalyticModalOpen(false)} className="text-text-muted hover:text-navy-900 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAnalytic} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Analytic Account Name *</label>
                <input
                  type="text"
                  required
                  value={newAnalyticName}
                  onChange={(e) => setNewAnalyticName(e.target.value)}
                  placeholder="e.g. Showroom Expansion, Assembly Line"
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Account Classification *</label>
                <select
                  value={newAnalyticType}
                  onChange={(e) => setNewAnalyticType(e.target.value as 'INCOME' | 'EXPENSES')}
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none cursor-pointer"
                >
                  <option value="EXPENSES">Expenses Marker</option>
                  <option value="INCOME">Income Marker</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">Description / Project Notes</label>
                <textarea
                  rows={2}
                  value={newAnalyticDesc}
                  onChange={(e) => setNewAnalyticDesc(e.target.value)}
                  placeholder="Briefly describe what expenses/income are tagged here"
                  className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAnalyticModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-navy-900 hover:bg-navy-800 text-white cursor-pointer">
                  Save Analytic Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BudgetsPage;
