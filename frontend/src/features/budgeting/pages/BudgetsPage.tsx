import { useState, useEffect, useMemo } from 'react';
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
  ArrowLeft,
  Check,
  RotateCcw,
  Ban,
  PieChart as PieChartIcon,
  List,
  LayoutGrid,
  ExternalLink,
  Calendar,
  Trash2,
  Info,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
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
import type { BudgetHealthItem, BudgetLine, BudgetStage, AnalyticAccountItem } from '@/data/erpData';

const STAGES: { key: BudgetStage; label: string }[] = [
  { key: 'DRAFT', label: 'Draft' },
  { key: 'CONFIRM', label: 'Confirm' },
  { key: 'REVISED', label: 'Revised' },
  { key: 'CANCELED', label: 'Canceled' },
];

export function BudgetsPage() {
  const location = useLocation();
  const {
    budgets,
    addBudget,
    updateBudget,
    confirmBudget,
    reviseBudget,
    cancelBudget,
    resetBudgetToDraft,
    deleteBudget,
    analyticAccounts,
    addAnalyticAccount,
    bills,
    invoices,
    refreshERPData,
  } = useERP();

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

  // View modes
  const [budgetViewMode, setBudgetViewMode] = useState<'list' | 'kanban' | 'chart' | 'form'>('list');
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);
  const [selectedChartBudgetId, setSelectedChartBudgetId] = useState<string>('all');

  // Analytics view mode
  const [analyticViewMode, setAnalyticViewMode] = useState<'list' | 'form'>('list');
  const [selectedAnalyticId, setSelectedAnalyticId] = useState<string | null>(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [notice, setNotice] = useState<string | null>(null);

  // Drilldown modal state
  const [drilldownLine, setDrilldownLine] = useState<{
    line: BudgetLine;
    budgetName: string;
    startDate: string;
    endDate: string;
  } | null>(null);

  // Budget Form local edit state
  const [formBudgetName, setFormBudgetName] = useState('January 2026');
  const [formStartDate, setFormStartDate] = useState('2026-01-01');
  const [formEndDate, setFormEndDate] = useState('2026-01-31');
  const [formResponsible, setFormResponsible] = useState('Mohith (Production Lead)');
  const [formLines, setFormLines] = useState<BudgetLine[]>([
    {
      id: 'line-jan-1',
      analyticAccountId: 'ana-0',
      analyticAccountName: 'Furniture Procurement',
      type: 'EXPENSE',
      committedAmount: 200000,
      achievedAmount: 10000,
      achievedPercent: 5,
      amountToAchieve: 190000,
    },
  ]);

  // Active budget in Form View with guaranteed non-null fallback
  const currentBudget = useMemo(() => {
    let budget = selectedBudgetId ? budgets.find((b) => b.id === selectedBudgetId) : null;
    if (!budget && budgetViewMode === 'form' && budgets.length > 0) {
      budget = budgets[0];
    }
    if (!budget && budgetViewMode === 'form') {
      budget = {
        id: selectedBudgetId || 'bdg-jan-2026',
        name: formBudgetName || 'January 2026',
        period: `${formStartDate} to ${formEndDate}`,
        startDate: formStartDate,
        endDate: formEndDate,
        responsible: formResponsible,
        stage: 'DRAFT',
        analyticAccount: formLines[0]?.analyticAccountName || 'Furniture Procurement',
        plannedAmount: formLines.reduce((s, l) => s + (l.committedAmount || 0), 0) || 200000,
        actualAmount: formLines.reduce((s, l) => s + (l.achievedAmount || 0), 0) || 10000,
        remainingAmount: 190000,
        utilization: 5,
        status: 'HEALTHY',
        lines: formLines,
      };
    }
    return budget;
  }, [
    budgets,
    selectedBudgetId,
    budgetViewMode,
    formBudgetName,
    formStartDate,
    formEndDate,
    formResponsible,
    formLines,
  ]);

  // Sync form state when a specific budget is selected or changes
  useEffect(() => {
    if (currentBudget) {
      setFormBudgetName(currentBudget.name);
      setFormStartDate(currentBudget.startDate || '2026-01-01');
      setFormEndDate(currentBudget.endDate || '2026-01-31');
      setFormResponsible(currentBudget.responsible || 'Mohith (Production Lead)');

      if (currentBudget.lines && currentBudget.lines.length > 0) {
        setFormLines(currentBudget.lines);
      } else {
        const comm = currentBudget.plannedAmount || 200000;
        const ach = currentBudget.actualAmount || 0;
        const matchedAcc = analyticAccounts.find((a) => a.name === currentBudget.analyticAccount);
        setFormLines([
          {
            id: `line-${currentBudget.id}-1`,
            analyticAccountId: matchedAcc?.id || 'ana-0',
            analyticAccountName: currentBudget.analyticAccount || 'Furniture Procurement',
            type: (matchedAcc?.type === 'INCOME' ? 'INCOME' : 'EXPENSE') as 'INCOME' | 'EXPENSE',
            committedAmount: comm,
            achievedAmount: ach,
            achievedPercent: comm > 0 ? Math.round((ach / comm) * 10000) / 100 : 0,
            amountToAchieve: Math.max(0, comm - ach),
          },
        ]);
      }
    }
  }, [currentBudget?.id]);

  // Pager & Navigation indices
  const currentBudgetIndex = useMemo(() => {
    if (!currentBudget) return 0;
    const idx = budgets.findIndex((b) => b.id === currentBudget.id);
    return idx >= 0 ? idx : 0;
  }, [budgets, currentBudget]);

  const canPrevBudget = currentBudgetIndex > 0;
  const canNextBudget = currentBudgetIndex < budgets.length - 1;

  const handlePrevBudget = () => {
    if (canPrevBudget) {
      const prev = budgets[currentBudgetIndex - 1];
      if (prev) openBudgetForm(prev);
    }
  };

  const handleNextBudget = () => {
    if (canNextBudget) {
      const next = budgets[currentBudgetIndex + 1];
      if (next) openBudgetForm(next);
    }
  };

  // Analytic Form local edit state
  const [analyticName, setAnalyticName] = useState('Furniture Procurement');
  const [analyticType, setAnalyticType] = useState<'INCOME' | 'EXPENSES'>('EXPENSES');
  const [analyticDesc, setAnalyticDesc] = useState('Raw timber, teak logs and veneers');

  // Active analytic account in Analytic Form View with guaranteed non-null fallback
  const currentAnalytic = useMemo(() => {
    let acc = selectedAnalyticId ? analyticAccounts.find((a) => a.id === selectedAnalyticId) : null;
    if (!acc && analyticViewMode === 'form') {
      acc = analyticAccounts[0] || null;
    }
    if (!acc && analyticViewMode === 'form') {
      acc = {
        id: selectedAnalyticId || 'ana-0',
        name: analyticName || 'Furniture Procurement',
        type: analyticType || 'EXPENSES',
        description: analyticDesc || 'Raw material procurement for furniture manufacture',
      };
    }
    return acc;
  }, [
    analyticAccounts,
    selectedAnalyticId,
    analyticViewMode,
    analyticName,
    analyticType,
    analyticDesc,
  ]);

  useEffect(() => {
    if (currentAnalytic) {
      setAnalyticName(currentAnalytic.name);
      setAnalyticType(currentAnalytic.type);
      setAnalyticDesc(currentAnalytic.description || '');
    }
  }, [selectedAnalyticId]);

  // Filtered budgets
  const filteredBudgets = useMemo(() => {
    return budgets.filter((b) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        b.name.toLowerCase().includes(q) ||
        (b.analyticAccount && b.analyticAccount.toLowerCase().includes(q)) ||
        (b.responsible && b.responsible.toLowerCase().includes(q));
      const matchesStatus =
        statusFilter === 'ALL' ||
        (b.stage && b.stage === statusFilter) ||
        b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [budgets, searchTerm, statusFilter]);

  // Dynamic live form totals & utilization
  const totalCommitted = useMemo(() => {
    return formLines.reduce((s, l) => s + (Number(l.committedAmount) || 0), 0);
  }, [formLines]);

  const totalAchieved = useMemo(() => {
    return formLines.reduce((s, l) => s + (Number(l.achievedAmount) || 0), 0);
  }, [formLines]);

  const formUtilization = useMemo(() => {
    return totalCommitted > 0 ? Math.round((totalAchieved / totalCommitted) * 10000) / 100 : 0;
  }, [totalCommitted, totalAchieved]);

  // KPIs
  const totalPlanned = budgets.reduce((acc, b) => acc + (b.plannedAmount || 0), 0);
  const totalActual = budgets.reduce((acc, b) => acc + (b.actualAmount || 0), 0);
  const totalRemaining = Math.max(0, totalPlanned - totalActual);
  const warningOrExceededCount = budgets.filter(
    (b) => b.status === 'WARNING' || b.status === 'EXCEEDED'
  ).length;

  // Open budget form
  const openBudgetForm = (budget: BudgetHealthItem) => {
    setSelectedBudgetId(budget.id);
    setFormBudgetName(budget.name);
    setFormStartDate(budget.startDate || '2026-01-01');
    setFormEndDate(budget.endDate || '2026-01-31');
    setFormResponsible(budget.responsible || 'Mohith (Production Lead)');
    if (budget.lines && budget.lines.length > 0) {
      setFormLines(budget.lines);
    }
    setBudgetViewMode('form');
  };

  // Start new budget
  const handleNewBudgetClick = () => {
    const defaultAcc =
      analyticAccounts.find((a) => a.name.toLowerCase().includes('furniture')) ||
      analyticAccounts[0] || {
        id: 'ana-0',
        name: 'Furniture Procurement',
        type: 'EXPENSES' as const,
      };

    const draftCount = budgets.filter((b) => b.name.toLowerCase().includes('draft')).length;
    const defaultName = draftCount > 0 ? `Budget Draft ${draftCount + 1}` : 'Budget Draft 1';
    const newStartDate = '2026-02-01';
    const newEndDate = '2026-02-28';
    const initialLines: BudgetLine[] = [
      {
        id: `line-${Date.now()}-1`,
        analyticAccountId: defaultAcc.id,
        analyticAccountName: defaultAcc.name,
        type: defaultAcc.type === 'INCOME' ? 'INCOME' : 'EXPENSE',
        committedAmount: 200000,
        achievedAmount: 0,
        achievedPercent: 0,
        amountToAchieve: 200000,
      },
    ];

    setFormBudgetName(defaultName);
    setFormStartDate(newStartDate);
    setFormEndDate(newEndDate);
    setFormResponsible('Mohith (Production Lead)');
    setFormLines(initialLines);

    const newDraft = addBudget({
      name: defaultName,
      startDate: newStartDate,
      endDate: newEndDate,
      period: `${newStartDate} to ${newEndDate}`,
      responsible: 'Mohith (Production Lead)',
      stage: 'DRAFT',
      lines: initialLines,
      plannedAmount: 200000,
    });

    setSelectedBudgetId(newDraft.id);
    setBudgetViewMode('form');
    setNotice(`New Budget "${defaultName}" created in DRAFT. Review lines and click Confirm to activate.`);
    setTimeout(() => setNotice(null), 6000);
  };

  // Line editing in form
  const handleLineChange = (index: number, field: keyof BudgetLine, value: any) => {
    setFormLines((prev) => {
      const updated = [...prev];
      const target = { ...updated[index], [field]: value };

      if (field === 'analyticAccountId') {
        const found = analyticAccounts.find((a) => a.id === value);
        if (found) {
          target.analyticAccountName = found.name;
          target.type = found.type === 'INCOME' ? 'INCOME' : 'EXPENSE';
        }
      }

      if (field === 'committedAmount' || field === 'achievedAmount') {
        const comm = Number(field === 'committedAmount' ? value : target.committedAmount) || 0;
        const ach = Number(field === 'achievedAmount' ? value : target.achievedAmount) || 0;
        target.committedAmount = comm;
        target.achievedAmount = ach;
        target.achievedPercent = comm > 0 ? Math.round((ach / comm) * 10000) / 100 : 0;
        target.amountToAchieve = Math.max(0, comm - ach);
      }

      updated[index] = target;
      return updated;
    });
  };

  const handleAddLine = () => {
    const defaultAcc =
      analyticAccounts[0] || { id: 'ana-0', name: 'Furniture Procurement', type: 'EXPENSES' };
    setFormLines((prev) => [
      ...prev,
      {
        id: `line-${Date.now()}-${prev.length + 1}`,
        analyticAccountId: defaultAcc.id,
        analyticAccountName: defaultAcc.name,
        type: defaultAcc.type === 'INCOME' ? 'INCOME' : 'EXPENSE',
        committedAmount: 50000,
        achievedAmount: 0,
        achievedPercent: 0,
        amountToAchieve: 50000,
      },
    ]);
  };

  const handleRemoveLine = (index: number) => {
    if (formLines.length <= 1) return;
    setFormLines((prev) => prev.filter((_, i) => i !== index));
  };

  // Save budget changes
  const handleSaveBudgetForm = () => {
    if (!currentBudget) return;
    updateBudget(currentBudget.id, {
      name: formBudgetName.trim() || currentBudget.name,
      startDate: formStartDate,
      endDate: formEndDate,
      period: `${formStartDate} to ${formEndDate}`,
      responsible: formResponsible,
      lines: formLines,
      analyticAccount: formLines[0]?.analyticAccountName || currentBudget.analyticAccount,
    });
    setNotice(`Budget "${formBudgetName}" saved.`);
    setTimeout(() => setNotice(null), 3000);
  };

  // Confirm budget
  const handleConfirmBudget = () => {
    if (!currentBudget) return;
    handleSaveBudgetForm();
    confirmBudget(currentBudget.id);
    setNotice(`Budget "${formBudgetName}" moved to CONFIRM stage.`);
    setTimeout(() => setNotice(null), 5000);
  };

  // Revise budget
  const handleReviseBudget = () => {
    if (!currentBudget) return;
    const res = reviseBudget(currentBudget.id, 300000);
    if (res) {
      setSelectedBudgetId(res.newBudget.id);
      setFormBudgetName(res.newBudget.name);
      setFormLines(res.newBudget.lines || []);
      setNotice(
        `Budget "${currentBudget.name}" marked REVISED. Created new revision "${res.newBudget.name}".`
      );
      setTimeout(() => setNotice(null), 6000);
    }
  };

  // Cancel budget
  const handleCancelBudget = () => {
    if (!currentBudget) return;
    cancelBudget(currentBudget.id);
    setNotice(`Budget "${formBudgetName}" marked CANCELED.`);
    setTimeout(() => setNotice(null), 5000);
  };

  // Reset to Draft
  const handleResetToDraft = () => {
    if (!currentBudget) return;
    resetBudgetToDraft(currentBudget.id);
    setNotice(`Budget "${formBudgetName}" reset to DRAFT stage.`);
    setTimeout(() => setNotice(null), 4000);
  };

  // Delete budget
  const handleDeleteBudget = () => {
    if (!currentBudget) return;
    if (window.confirm(`Are you sure you want to delete budget "${currentBudget.name}"?`)) {
      const idToDelete = currentBudget.id;
      deleteBudget(idToDelete);
      setNotice(`Budget "${currentBudget.name}" deleted.`);
      const remaining = budgets.filter((b) => b.id !== idToDelete);
      if (remaining.length > 0) {
        openBudgetForm(remaining[0]);
      } else {
        setBudgetViewMode('list');
      }
      setTimeout(() => setNotice(null), 4000);
    }
  };

  // Analytic form handlers
  const openAnalyticForm = (acc: AnalyticAccountItem) => {
    setSelectedAnalyticId(acc.id);
    setAnalyticName(acc.name);
    setAnalyticType(acc.type);
    setAnalyticDesc(acc.description || '');
    setAnalyticViewMode('form');
  };

  const handleNewAnalyticClick = () => {
    const newAcc = addAnalyticAccount({
      name: 'Furniture Procurement',
      type: 'EXPENSES',
      description: 'Raw timber, teak logs and veneers',
    });
    setSelectedAnalyticId(newAcc.id);
    setAnalyticName(newAcc.name);
    setAnalyticType(newAcc.type);
    setAnalyticDesc(newAcc.description || '');
    setAnalyticViewMode('form');
    setNotice(`Created new Analytic Account. Edit details and click Confirm.`);
    setTimeout(() => setNotice(null), 5000);
  };

  const handleConfirmAnalytic = () => {
    if (!analyticName.trim() || !currentAnalytic) return;
    currentAnalytic.name = analyticName.trim();
    currentAnalytic.type = analyticType;
    currentAnalytic.description = analyticDesc.trim();
    setNotice(`Analytic Account "${analyticName}" confirmed.`);
    setTimeout(() => setNotice(null), 4000);
  };

  // Stage Badge helper
  const getStageBadge = (stage?: BudgetStage, utilization = 0) => {
    switch (stage) {
      case 'DRAFT':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            Draft
          </span>
        );
      case 'CONFIRM':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            Confirm ({utilization}%)
          </span>
        );
      case 'REVISED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            Revised
          </span>
        );
      case 'CANCELED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            Canceled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            Confirm
          </span>
        );
    }
  };

  // Pie Chart Data computation
  const pieChartTargetBudget = useMemo(() => {
    if (selectedChartBudgetId === 'all') return null;
    return budgets.find((b) => b.id === selectedChartBudgetId) || null;
  }, [budgets, selectedChartBudgetId]);

  const pieData = useMemo(() => {
    if (pieChartTargetBudget) {
      const ach = pieChartTargetBudget.actualAmount || 0;
      const rem = Math.max(0, (pieChartTargetBudget.plannedAmount || 0) - ach);
      return [
        { name: 'Achieved Amount', value: ach, color: '#7c3aed' }, // Purple
        { name: 'Amount to Achieve', value: rem, color: '#10b981' }, // Emerald
      ];
    } else {
      const ach = totalActual;
      const rem = totalRemaining;
      return [
        { name: 'Total Achieved', value: ach, color: '#7c3aed' },
        { name: 'Total Amount to Achieve', value: rem, color: '#10b981' },
      ];
    }
  }, [pieChartTargetBudget, totalActual, totalRemaining]);

  // All budgets using the currently viewed analytic account (Sub-table)
  const analyticLinkedBudgets = useMemo(() => {
    if (!currentAnalytic) return [];
    return budgets.filter((b) => {
      if (b.lines && b.lines.length > 0) {
        return b.lines.some(
          (l) =>
            l.analyticAccountId === currentAnalytic.id ||
            l.analyticAccountName.toLowerCase() === currentAnalytic.name.toLowerCase()
        );
      }
      return b.analyticAccount.toLowerCase().includes(currentAnalytic.name.toLowerCase());
    });
  }, [budgets, currentAnalytic]);

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-surface-secondary">
      {/* Control Panel / Breadcrumb-Free Navigation */}
      {budgetViewMode !== 'form' && analyticViewMode !== 'form' ? (
        <OdooControlPanel
          title="Budgets & Analytic Accounts"
          subtitle="Financial cost center tracking, stage lifecycle, planned vs achieved drilldown"
          itemCount={activeTab === 'budgets' ? filteredBudgets.length : analyticAccounts.length}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search budgets, analytic markers or responsible leads..."
          onNewClick={() => {
            if (activeTab === 'budgets') {
              handleNewBudgetClick();
            } else {
              handleNewAnalyticClick();
            }
          }}
          newButtonLabel={activeTab === 'budgets' ? 'New Budget' : 'New Analytic Account'}
          filterOptions={
            activeTab === 'budgets'
              ? [
                  { label: 'All Stages', value: 'ALL' },
                  { label: 'Draft', value: 'DRAFT' },
                  { label: 'Confirm', value: 'CONFIRM' },
                  { label: 'Revised', value: 'REVISED' },
                  { label: 'Canceled', value: 'CANCELED' },
                ]
              : undefined
          }
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
          extraActions={
            <div className="flex items-center gap-2">
              {/* View switcher when in budgets overview */}
              {activeTab === 'budgets' && (
                <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs mr-2">
                  <button
                    type="button"
                    title="List View"
                    onClick={() => setBudgetViewMode('list')}
                    className={`p-1.5 rounded transition-colors cursor-pointer ${
                      budgetViewMode === 'list'
                        ? 'bg-white text-brand-700 shadow-2xs font-semibold'
                        : 'text-text-muted hover:text-navy-800'
                    }`}
                  >
                    <List size={15} />
                  </button>
                  <button
                    type="button"
                    title="Kanban View"
                    onClick={() => setBudgetViewMode('kanban')}
                    className={`p-1.5 rounded transition-colors cursor-pointer ${
                      budgetViewMode === 'kanban'
                        ? 'bg-white text-brand-700 shadow-2xs font-semibold'
                        : 'text-text-muted hover:text-navy-800'
                    }`}
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    type="button"
                    title="Pie Chart View"
                    onClick={() => setBudgetViewMode('chart')}
                    className={`p-1.5 rounded transition-colors cursor-pointer ${
                      budgetViewMode === 'chart'
                        ? 'bg-white text-brand-700 shadow-2xs font-semibold'
                        : 'text-text-muted hover:text-navy-800'
                    }`}
                  >
                    <PieChartIcon size={15} />
                  </button>
                </div>
              )}

              {/* Module tabs */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('budgets');
                    setBudgetViewMode('list');
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === 'budgets'
                      ? 'bg-white text-navy-900 shadow-2xs'
                      : 'text-text-muted hover:text-navy-800'
                  }`}
                >
                  Budgets
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('analytics');
                    setAnalyticViewMode('list');
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === 'analytics'
                      ? 'bg-white text-navy-900 shadow-2xs'
                      : 'text-text-muted hover:text-navy-800'
                  }`}
                >
                  Analytic Accounts ({analyticAccounts.length})
                </button>
              </div>
            </div>
          }
          onRefresh={refreshERPData}
        />
      ) : (
        /* Symmetrical Clean Form Header with Full Navigation Controls & Record Pager */
        <div className="bg-white border-b border-surface-border px-4 sm:px-6 py-3 shadow-2xs">
          <div className="max-w-7xl w-full mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setBudgetViewMode('list');
                setAnalyticViewMode('list');
              }}
              className="p-1.5 rounded-md hover:bg-slate-100 text-text-muted hover:text-navy-900 cursor-pointer transition-colors"
              title="Back to List"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-text-muted">
                  {budgetViewMode === 'form' ? 'Budgets' : 'Analytic Accounts'} /
                </span>
                <h1 className="text-base sm:text-lg font-bold text-navy-900">
                  {budgetViewMode === 'form'
                    ? formBudgetName || currentBudget?.name || 'Budget Form'
                    : analyticName || currentAnalytic?.name || 'Analytic Account Form'}
                </h1>
                {budgetViewMode === 'form' && currentBudget && (
                  getStageBadge(currentBudget.stage || 'CONFIRM', formUtilization)
                )}
              </div>
              <p className="text-xs text-text-muted">
                {budgetViewMode === 'form'
                  ? `Period: ${formStartDate} to ${formEndDate} • Lead: ${formResponsible}`
                  : `Analytic Marker • ${analyticType}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Quick Budget Switcher Dropdown (Jump to any budget instantly) */}
            {budgetViewMode === 'form' && budgets.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-text-muted hidden md:inline">Jump to:</span>
                <select
                  value={currentBudget?.id || ''}
                  onChange={(e) => {
                    const b = budgets.find((item) => item.id === e.target.value);
                    if (b) openBudgetForm(b);
                  }}
                  className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-navy-900 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 shadow-2xs cursor-pointer max-w-[220px] truncate"
                >
                  {budgets.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.stage || 'CONFIRM'})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Record Pager (1 of N) */}
            {budgetViewMode === 'form' && budgets.length > 0 && (
              <div className="flex items-center bg-slate-100 rounded-md border border-slate-200 p-0.5 text-xs">
                <button
                  type="button"
                  disabled={!canPrevBudget}
                  onClick={handlePrevBudget}
                  title="Previous Budget"
                  className="px-2 py-1 rounded hover:bg-white text-navy-900 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors font-bold"
                >
                  &lt;
                </button>
                <span className="px-2 font-mono font-semibold text-text-muted select-none">
                  {currentBudgetIndex + 1} / {budgets.length}
                </span>
                <button
                  type="button"
                  disabled={!canNextBudget}
                  onClick={handleNextBudget}
                  title="Next Budget"
                  className="px-2 py-1 rounded hover:bg-white text-navy-900 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors font-bold"
                >
                  &gt;
                </button>
              </div>
            )}

            {/* View switcher icons */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs">
              <button
                type="button"
                title="List View"
                onClick={() => setBudgetViewMode('list')}
                className="p-1.5 rounded transition-colors cursor-pointer text-text-muted hover:text-navy-900"
              >
                <List size={15} />
              </button>
              <button
                type="button"
                title="Kanban View"
                onClick={() => setBudgetViewMode('kanban')}
                className="p-1.5 rounded transition-colors cursor-pointer text-text-muted hover:text-navy-900"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                type="button"
                title="Pie Chart View"
                onClick={() => setBudgetViewMode('chart')}
                className="p-1.5 rounded transition-colors cursor-pointer text-text-muted hover:text-navy-900"
              >
                <PieChartIcon size={15} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setBudgetViewMode('list');
                setAnalyticViewMode('list');
              }}
              className="px-3 py-1.5 rounded text-xs font-semibold text-text-muted hover:text-navy-900 border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              &larr; Back to Overview
            </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 px-4 sm:px-6 pt-4 pb-8 space-y-5 w-full max-w-7xl mx-auto">
        {/* Notice alert */}
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
        {/* TAB 1: BUDGETS SECTION                                       */}
        {/* ============================================================ */}
        {activeTab === 'budgets' && (
          <>
            {/* VIEW MODE 1: BUDGET FORM VIEW (Mockup Left & Middle) */}
            {budgetViewMode === 'form' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* Top Action & Status Pipeline Bar */}
                <div className="rounded-lg border border-surface-border bg-white p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                  {/* Left Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      size="sm"
                      onClick={handleNewBudgetClick}
                      className="bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white text-xs cursor-pointer font-semibold shadow-xs"
                    >
                      <Plus size={14} className="mr-1" />
                      New
                    </Button>

                    {/* CONFIRM BUTTON (Active in DRAFT) */}
                    {currentBudget?.stage === 'DRAFT' && (
                      <Button
                        size="sm"
                        onClick={handleConfirmBudget}
                        className="bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white text-xs cursor-pointer font-semibold shadow-xs"
                      >
                        <Check size={14} className="mr-1" />
                        Confirm
                      </Button>
                    )}

                    {/* REVISE BUTTON (Active in CONFIRM) */}
                    {currentBudget?.stage === 'CONFIRM' && (
                      <Button
                        size="sm"
                        onClick={handleReviseBudget}
                        className="bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white text-xs cursor-pointer font-semibold shadow-xs"
                      >
                        <RotateCcw size={14} className="mr-1" />
                        Revise
                      </Button>
                    )}

                    {/* RESET TO DRAFT (Active in CANCELED or REVISED) */}
                    {(currentBudget?.stage === 'CANCELED' || currentBudget?.stage === 'REVISED') && (
                      <Button
                        size="sm"
                        onClick={handleResetToDraft}
                        className="bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white text-xs cursor-pointer font-semibold shadow-xs"
                      >
                        <RotateCcw size={14} className="mr-1" />
                        Reset to Draft
                      </Button>
                    )}

                    {/* CANCEL BUTTON (Active when not Canceled) */}
                    {currentBudget?.stage !== 'CANCELED' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelBudget}
                        className="text-xs cursor-pointer text-rose-700 hover:bg-rose-50 border-rose-300 font-semibold"
                      >
                        <Ban size={14} className="mr-1" />
                        Cancel
                      </Button>
                    )}

                    {/* DELETE BUTTON (To safely clean up unwanted drafts/canceled records) */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDeleteBudget}
                      title="Delete this budget"
                      className="text-xs cursor-pointer text-slate-600 hover:text-rose-700 hover:bg-rose-50 border-slate-200 hover:border-rose-200 font-medium"
                    >
                      <Trash2 size={13} className="mr-1" />
                      Delete
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setBudgetViewMode('list')}
                      className="text-xs cursor-pointer border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <ArrowLeft size={14} className="mr-1" />
                      Back
                    </Button>
                  </div>

                  {/* Right: Interactive Stage Pipeline Widget (Draft -> Confirm -> Revised -> Canceled) */}
                  <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs font-semibold shrink-0">
                    {STAGES.map((s, idx) => {
                      const isActive = (currentBudget?.stage || 'DRAFT') === s.key;
                      return (
                        <div key={s.key} className="flex items-center">
                          <button
                            type="button"
                            onClick={() => {
                              if (s.key === 'DRAFT') handleResetToDraft();
                              else if (s.key === 'CONFIRM') handleConfirmBudget();
                              else if (s.key === 'REVISED') handleReviseBudget();
                              else if (s.key === 'CANCELED') handleCancelBudget();
                            }}
                            title={`Switch stage to ${s.label}`}
                            className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                              isActive
                                ? s.key === 'CONFIRM'
                                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                                  : s.key === 'REVISED'
                                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                                  : s.key === 'CANCELED'
                                  ? 'bg-rose-600 text-white font-bold shadow-xs'
                                  : 'bg-slate-700 text-white font-bold shadow-xs'
                                : 'text-text-muted hover:text-navy-900 hover:bg-slate-200/60'
                            }`}
                          >
                            {s.label}
                          </button>
                          {idx < STAGES.length - 1 && (
                            <span className="mx-1 text-slate-300 select-none text-[11px]">&rarr;</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Form Card */}
                <div className="rounded-lg border border-surface-border bg-white p-6 shadow-2xs space-y-6">
                  {/* Revision Links Banner (if revised or revision of) */}
                  {currentBudget && (currentBudget.revisionOfId || currentBudget.revisedWithId) && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Info size={16} className="text-amber-700 shrink-0" />
                        <div>
                          {currentBudget.revisionOfId && (
                            <span className="text-navy-900 font-medium mr-3">
                              Revision of:{' '}
                              <button
                                type="button"
                                onClick={() => {
                                  const target = budgets.find((b) => b.id === currentBudget.revisionOfId);
                                  if (target) openBudgetForm(target);
                                }}
                                className="font-bold text-brand-700 underline hover:text-brand-900 cursor-pointer ml-1 inline-flex items-center gap-1"
                              >
                                {currentBudget.revisionOfName || 'Original Budget'}
                                <ExternalLink size={12} />
                              </button>
                            </span>
                          )}
                          {currentBudget.revisedWithId && (
                            <span className="text-navy-900 font-medium">
                              Revised With:{' '}
                              <button
                                type="button"
                                onClick={() => {
                                  const target = budgets.find((b) => b.id === currentBudget.revisedWithId);
                                  if (target) openBudgetForm(target);
                                }}
                                className="font-bold text-brand-700 underline hover:text-brand-900 cursor-pointer ml-1 inline-flex items-center gap-1"
                              >
                                {currentBudget.revisedWithName || 'Revised Budget'}
                                <ExternalLink size={12} />
                              </button>
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge variant="warning" className="text-[10px]">
                        Lifecycle Linked
                      </Badge>
                    </div>
                  )}

                  {/* Header Fields Grid (Symmetrical responsive 2-column grid matching diagram) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-navy-800 mb-1">
                          Budget Name *
                        </label>
                        <input
                          type="text"
                          value={formBudgetName}
                          onChange={(e) => setFormBudgetName(e.target.value)}
                          onBlur={handleSaveBudgetForm}
                          placeholder="e.g. January 2026"
                          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-navy-900 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 shadow-2xs"
                        />
                      </div>

                      {/* Primary Relevant Analytic Account (from PS spec) */}
                      <div>
                        <label className="block text-xs font-semibold text-navy-800 mb-1">
                          Relevant Analytic Account *
                        </label>
                        <select
                          value={formLines[0]?.analyticAccountId || 'ana-0'}
                          onChange={(e) => {
                            const selectedAcc = analyticAccounts.find((a) => a.id === e.target.value);
                            if (selectedAcc) {
                              handleLineChange(0, 'analyticAccountId', selectedAcc.id);
                              handleSaveBudgetForm();
                            }
                          }}
                          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-navy-900 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 shadow-2xs cursor-pointer"
                        >
                          {analyticAccounts.map((acc) => (
                            <option key={acc.id} value={acc.id}>
                              {acc.name} ({acc.type === 'INCOME' ? 'Income' : 'Expense'})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Revision indicator row */}
                      {currentBudget?.revisionOfName && (
                        <div>
                          <label className="block text-xs font-semibold text-navy-800 mb-1">
                            Revision Of
                          </label>
                          <div className="flex items-center gap-2 p-2 rounded-md bg-slate-50 border border-slate-200 text-xs">
                            <span className="font-medium text-navy-900">{currentBudget.revisionOfName}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const target = budgets.find((b) => b.id === currentBudget.revisionOfId);
                                if (target) openBudgetForm(target);
                              }}
                              className="text-brand-700 hover:text-brand-900 font-semibold cursor-pointer underline text-[11px]"
                            >
                              View Original
                            </button>
                          </div>
                        </div>
                      )}

                      {currentBudget?.revisedWithName && (
                        <div>
                          <label className="block text-xs font-semibold text-navy-800 mb-1">
                            Revised With
                          </label>
                          <div className="flex items-center gap-2 p-2 rounded-md bg-slate-50 border border-slate-200 text-xs">
                            <span className="font-medium text-navy-900">{currentBudget.revisedWithName}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const target = budgets.find((b) => b.id === currentBudget.revisedWithId);
                                if (target) openBudgetForm(target);
                              }}
                              className="text-brand-700 hover:text-brand-900 font-semibold cursor-pointer underline text-[11px]"
                            >
                              View Revision
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      {/* Budget Period: Start Date & End Date */}
                      <div>
                        <label className="block text-xs font-semibold text-navy-800 mb-1">
                          Budget Period *
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-[10px] text-text-muted block mb-0.5 font-medium">Start Date</span>
                            <input
                              type="date"
                              value={formStartDate}
                              onChange={(e) => {
                                setFormStartDate(e.target.value);
                                handleSaveBudgetForm();
                              }}
                              className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-navy-900 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 shadow-2xs font-mono"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-text-muted block mb-0.5 font-medium">End Date</span>
                            <input
                              type="date"
                              value={formEndDate}
                              onChange={(e) => {
                                setFormEndDate(e.target.value);
                                handleSaveBudgetForm();
                              }}
                              className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-navy-900 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 shadow-2xs font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Responsible Person */}
                      <div>
                        <label className="block text-xs font-semibold text-navy-800 mb-1">
                          Responsible Lead *
                        </label>
                        <select
                          value={formResponsible}
                          onChange={(e) => {
                            setFormResponsible(e.target.value);
                            handleSaveBudgetForm();
                          }}
                          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-navy-900 font-medium focus:border-brand-600 focus:ring-1 focus:ring-brand-600 shadow-2xs cursor-pointer"
                        >
                          <option value="Mohith (Production Lead)">Mohith (Production Lead)</option>
                          <option value="Rohith (Inventory Head)">Rohith (Inventory Head)</option>
                          <option value="Rugenthra (Sales Manager)">Rugenthra (Sales Manager)</option>
                          <option value="Admin (Business Owner)">Admin (Business Owner)</option>
                          <option value="Accountant (Invoicing User)">Accountant (Invoicing User)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Lines Section */}
                  <div className="space-y-3 pt-4 border-t border-surface-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-navy-900">Budget Allocation Lines</h4>
                        <p className="text-[11px] text-text-muted">
                          Analytic cost markers, planned limits, actual achieved spend, and unspent margin
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleAddLine}
                        className="bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white text-xs cursor-pointer font-medium"
                      >
                        <Plus size={13} className="mr-1" />
                        Add a line
                      </Button>
                    </div>

                    <div className="rounded-lg border border-surface-border bg-white overflow-hidden shadow-2xs">
                      <div className="overflow-x-auto w-full">
                        <Table className="w-full">
                          <TableHeader>
                            <TableRow className="bg-slate-50 border-b border-slate-200">
                              <TableHead className="min-w-[180px] text-xs font-bold text-slate-700">Analytic Account</TableHead>
                              <TableHead className="w-[100px] text-xs font-bold text-slate-700">Type</TableHead>
                              <TableHead className="text-right w-[150px] text-xs font-bold text-slate-700">Committed Amount</TableHead>
                              <TableHead className="text-right w-[140px] text-xs font-bold text-slate-700">Achieved Amount</TableHead>
                              <TableHead className="text-right w-[110px] text-xs font-bold text-slate-700">Achieved %</TableHead>
                              <TableHead className="text-right w-[150px] text-xs font-bold text-slate-700">Amount to Achieve</TableHead>
                              <TableHead className="w-[45px]"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {formLines.map((line, idx) => (
                              <TableRow key={line.id || idx} className="hover:bg-slate-50/80">
                                {/* Analytic Account Dropdown */}
                                <TableCell>
                                  <select
                                    value={line.analyticAccountId}
                                    onChange={(e) => handleLineChange(idx, 'analyticAccountId', e.target.value)}
                                    className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-navy-900 font-medium focus:outline-none focus:border-brand-600 shadow-2xs cursor-pointer"
                                  >
                                    {analyticAccounts.map((acc) => (
                                      <option key={acc.id} value={acc.id}>
                                        {acc.name}
                                      </option>
                                    ))}
                                  </select>
                                </TableCell>

                                {/* Type Badge */}
                                <TableCell>
                                  <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                                      line.type === 'INCOME'
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                        : 'bg-purple-100 text-brand-800 border border-purple-200'
                                    }`}
                                  >
                                    {line.type === 'INCOME' ? 'Income' : 'Expense'}
                                  </span>
                                </TableCell>

                                {/* Committed Amount Input (Clean pristine white background with crisp dark text) */}
                                <TableCell className="text-right">
                                  <div className="relative flex items-center justify-end">
                                    <span className="text-slate-500 mr-1 text-xs font-semibold">₹</span>
                                    <input
                                      type="number"
                                      min={0}
                                      value={line.committedAmount}
                                      onChange={(e) =>
                                        handleLineChange(idx, 'committedAmount', Number(e.target.value))
                                      }
                                      onBlur={handleSaveBudgetForm}
                                      className="w-32 text-right font-mono font-bold text-xs rounded-md border border-slate-300 bg-white text-navy-900 px-2.5 py-1.5 focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 shadow-2xs"
                                    />
                                  </div>
                                </TableCell>

                                {/* Achieved Amount (Clickable Drilldown Link) */}
                                <TableCell className="text-right">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setDrilldownLine({
                                        line,
                                        budgetName: formBudgetName,
                                        startDate: formStartDate,
                                        endDate: formEndDate,
                                      })
                                    }
                                    title="Click to drilldown into contributing bills/invoices"
                                    className="font-mono font-bold text-xs text-brand-700 hover:text-brand-900 hover:underline inline-flex items-center gap-1 cursor-pointer bg-brand-50 px-2.5 py-1 rounded border border-brand-200 whitespace-nowrap"
                                  >
                                    ₹{line.achievedAmount.toLocaleString('en-IN')}
                                    <ExternalLink size={11} className="opacity-70" />
                                  </button>
                                </TableCell>

                                {/* Achieved % */}
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden hidden sm:block">
                                      <div
                                        className={`h-full ${
                                          line.achievedPercent > 100
                                            ? 'bg-rose-600'
                                            : line.achievedPercent > 80
                                            ? 'bg-amber-500'
                                            : 'bg-emerald-600'
                                        }`}
                                        style={{ width: `${Math.min(100, line.achievedPercent)}%` }}
                                      />
                                    </div>
                                    <span className="font-mono text-xs font-semibold text-navy-900 whitespace-nowrap">
                                      {line.achievedPercent.toFixed(1)}%
                                    </span>
                                  </div>
                                </TableCell>

                                {/* Amount to Achieve */}
                                <TableCell className="text-right font-mono font-bold text-xs text-emerald-700 whitespace-nowrap">
                                  ₹{line.amountToAchieve.toLocaleString('en-IN')}
                                </TableCell>

                                {/* Delete Line */}
                                <TableCell className="text-center">
                                  <button
                                    type="button"
                                    disabled={formLines.length <= 1}
                                    onClick={() => handleRemoveLine(idx)}
                                    className="text-text-muted hover:text-rose-600 disabled:opacity-30 cursor-pointer p-1 rounded"
                                    title="Remove line"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </TableCell>
                              </TableRow>
                            ))}

                            {/* Summary / Total Row */}
                            <TableRow className="bg-slate-50 font-bold border-t-2 border-slate-200">
                              <TableCell colSpan={2} className="text-xs text-navy-900 uppercase tracking-wide">
                                Total Analytical Allocation
                              </TableCell>
                              <TableCell className="text-right font-mono font-bold text-xs text-navy-900 whitespace-nowrap">
                                ₹{totalCommitted.toLocaleString('en-IN')}
                              </TableCell>
                              <TableCell className="text-right font-mono font-bold text-xs text-brand-700 whitespace-nowrap">
                                ₹{totalAchieved.toLocaleString('en-IN')}
                              </TableCell>
                              <TableCell className="text-right font-mono font-bold text-xs text-navy-900 whitespace-nowrap">
                                {formUtilization.toFixed(1)}%
                              </TableCell>
                              <TableCell className="text-right font-mono font-bold text-xs text-emerald-700 whitespace-nowrap">
                                ₹{Math.max(0, totalCommitted - totalAchieved).toLocaleString('en-IN')}
                              </TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>

                  {/* Save confirmation button row */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                    <Button
                      size="sm"
                      onClick={handleSaveBudgetForm}
                      className="bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white text-xs cursor-pointer"
                    >
                      Save Budget Changes
                    </Button>
                  </div>
                </div>

                {/* Field Explanation Card (Matching Diagram Bottom Box) */}
                <div className="rounded-lg border border-surface-border bg-white p-5 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2">
                    <Info size={16} className="text-brand-700" />
                    <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wide">
                      Field & Formula Explanations
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="font-bold text-navy-900 block mb-1">Committed Amount</span>
                      <p className="text-text-muted text-[11px] leading-relaxed">
                        The allocated budget ceiling for this analytic marker during the defined date range.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="font-bold text-navy-900 block mb-1">Achieved Amount</span>
                      <p className="text-text-muted text-[11px] leading-relaxed">
                        Total expenditure (for Expenses) or revenue (for Income) actualized from confirmed bills and invoices during the period.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="font-bold text-navy-900 block mb-1">Achieved %</span>
                      <p className="text-text-muted text-[11px] leading-relaxed">
                        Formula: <code className="bg-white px-1 rounded border border-slate-300 font-mono text-[10px]">(Achieved Amount / Committed Amount) &times; 100</code>
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="font-bold text-navy-900 block mb-1">Amount to Achieve</span>
                      <p className="text-text-muted text-[11px] leading-relaxed">
                        Formula: <code className="bg-white px-1 rounded border border-slate-300 font-mono text-[10px]">Committed Amount - Achieved Amount</code> (remaining margin).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW MODE 2: BUDGET REPORT LIST VIEW (Mockup Top Right) */}
            {budgetViewMode === 'list' && (
              <div className="space-y-4">
                {/* KPI Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="rounded-lg border border-surface-border bg-white p-4 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-text-muted uppercase">Total Committed Budget</span>
                      <Target size={16} className="text-navy-600" />
                    </div>
                    <p className="mt-2 text-xl font-bold font-mono text-navy-900">
                      ₹{totalPlanned.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[11px] text-text-muted mt-1 block">
                      Allocated across {budgets.length} analytical budgets
                    </span>
                  </div>

                  <div className="rounded-lg border border-surface-border bg-white p-4 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-text-muted uppercase">Total Achieved Spend</span>
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
                      <span className="text-xs font-semibold text-text-muted uppercase">Amount to Achieve (Margin)</span>
                      <CheckCircle2 size={16} className="text-emerald-700" />
                    </div>
                    <p className="mt-2 text-xl font-bold font-mono text-emerald-700">
                      ₹{totalRemaining.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[11px] text-text-muted mt-1 block">
                      Uncommitted remaining balance
                    </span>
                  </div>

                  <div className="rounded-lg border border-surface-border bg-white p-4 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-text-muted uppercase">Stage Distribution</span>
                      <AlertTriangle size={16} className="text-navy-700" />
                    </div>
                    <p className="mt-2 text-xl font-bold font-mono text-navy-900">
                      {budgets.filter((b) => (b.stage || 'CONFIRM') === 'CONFIRM').length} Active
                    </p>
                    <span className="text-[11px] text-text-muted mt-1 block">
                      {warningOrExceededCount} near ceiling or exceeded
                    </span>
                  </div>
                </div>

                {/* List View Table */}
                <div className="rounded-lg border border-surface-border bg-white shadow-2xs overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead>Budget</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Committed</TableHead>
                        <TableHead className="text-right">Achieved</TableHead>
                        <TableHead className="text-right">Utilization</TableHead>
                        <TableHead className="text-center w-[90px]">Pie Chart</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBudgets.map((b) => (
                        <TableRow
                          key={b.id}
                          className="hover:bg-slate-50/90 cursor-pointer group"
                          onClick={() => openBudgetForm(b)}
                        >
                          <TableCell className="font-semibold text-xs text-navy-900">
                            <div>
                              <span className="group-hover:text-brand-700 transition-colors font-bold">
                                {b.name}
                              </span>
                              {b.revisionOfName && (
                                <span className="block text-[10px] text-amber-700 font-medium">
                                  Rev of {b.revisionOfName}
                                </span>
                              )}
                              {b.revisedWithName && (
                                <span className="block text-[10px] text-slate-500 font-medium">
                                  Revised with {b.revisedWithName}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-text-muted font-mono">
                            {b.startDate || '2026-01-01'}
                          </TableCell>
                          <TableCell className="text-xs text-text-muted font-mono">
                            {b.endDate || '2026-01-31'}
                          </TableCell>
                          <TableCell>{getStageBadge(b.stage, b.utilization)}</TableCell>
                          <TableCell className="text-right font-mono font-bold text-xs text-navy-900">
                            ₹{b.plannedAmount.toLocaleString('en-IN')}
                          </TableCell>
                          <TableCell className="text-right font-mono font-bold text-xs text-brand-700">
                            ₹{b.actualAmount.toLocaleString('en-IN')}
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs">
                            <span
                              className={`font-bold ${
                                b.utilization > 100
                                  ? 'text-rose-600'
                                  : b.utilization > 80
                                  ? 'text-amber-600'
                                  : 'text-emerald-700'
                              }`}
                            >
                              {b.utilization}%
                            </span>
                          </TableCell>
                          <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              title="View Pie Chart breakdown"
                              onClick={() => {
                                setSelectedChartBudgetId(b.id);
                                setBudgetViewMode('chart');
                              }}
                              className="p-1.5 text-brand-700 hover:text-brand-900 hover:bg-brand-50 rounded transition-colors cursor-pointer"
                            >
                              <PieChartIcon size={16} />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* VIEW MODE 3: KANBAN VIEW (Mockup Middle Right) */}
            {budgetViewMode === 'kanban' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-150">
                {filteredBudgets.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => openBudgetForm(b)}
                    className="rounded-lg border border-surface-border bg-white p-5 shadow-2xs hover:shadow-md hover:border-brand-300 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-sm text-navy-900 hover:text-brand-700 transition-colors">
                            {b.name}
                          </h3>
                          <p className="text-[11px] text-brand-700 font-medium mt-0.5">
                            {b.analyticAccount || 'Furniture Procurement'}
                          </p>
                        </div>
                        {getStageBadge(b.stage, b.utilization)}
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                        <Calendar size={13} className="text-slate-400" />
                        <span>
                          {b.startDate || '2026-01-01'} &rarr; {b.endDate || '2026-01-31'}
                        </span>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-text-muted">Achieved Progress</span>
                          <span className="font-mono font-bold text-navy-900">{b.utilization}%</span>
                        </div>
                        <Progress
                          value={b.utilization}
                          indicatorClassName={
                            b.utilization > 100
                              ? 'bg-red-600'
                              : b.utilization > 80
                              ? 'bg-amber-500'
                              : 'bg-brand-600'
                          }
                          className="h-2"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 text-xs border-t border-slate-100">
                        <div>
                          <span className="text-[10px] text-text-muted uppercase font-semibold">Committed</span>
                          <p className="font-mono font-bold text-navy-900 mt-0.5">
                            ₹{b.plannedAmount.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div>
                          <span className="text-[10px] text-text-muted uppercase font-semibold">Achieved</span>
                          <p className="font-mono font-bold text-brand-700 mt-0.5">
                            ₹{b.actualAmount.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-text-muted">
                      <span className="flex items-center gap-1">
                        <UserCheck size={12} /> {b.responsible}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedChartBudgetId(b.id);
                          setBudgetViewMode('chart');
                        }}
                        className="text-brand-700 hover:text-brand-900 inline-flex items-center gap-0.5 font-medium cursor-pointer"
                      >
                        <PieChartIcon size={12} /> Chart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* VIEW MODE 4: PIE CHART VIEW (Mockup Bottom Right) */}
            {budgetViewMode === 'chart' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* Selector Bar */}
                <div className="rounded-lg border border-surface-border bg-white p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold text-navy-900">Select Budget Analysis:</label>
                    <select
                      value={selectedChartBudgetId}
                      onChange={(e) => setSelectedChartBudgetId(e.target.value)}
                      className="rounded-md border border-surface-border bg-white px-3 py-1.5 text-xs text-navy-900 focus:border-navy-600 focus:outline-none cursor-pointer"
                    >
                      <option value="all">All Budgets Combined</option>
                      {budgets.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} ({b.stage || 'CONFIRM'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    {pieChartTargetBudget && (
                      <Button
                        size="sm"
                        onClick={() => openBudgetForm(pieChartTargetBudget)}
                        className="bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white text-xs cursor-pointer"
                      >
                        Open {pieChartTargetBudget.name} Form
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setBudgetViewMode('list')}
                      className="text-xs cursor-pointer"
                    >
                      <ArrowLeft size={14} className="mr-1" />
                      Back to List
                    </Button>
                  </div>
                </div>

                {/* Pie Chart Card */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Chart Visual */}
                  <div className="lg:col-span-2 rounded-lg border border-surface-border bg-white p-6 shadow-2xs flex flex-col items-center justify-center">
                    <h3 className="text-base font-bold text-navy-900 mb-2">
                      {pieChartTargetBudget ? pieChartTargetBudget.name : 'All Active Budgets'} — Achieved vs Amount to Achieve
                    </h3>
                    <p className="text-xs text-text-muted mb-6">
                      Visual comparison between utilized spend and remaining spending ceiling
                    </p>

                    <div className="w-full h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={105}
                            paddingAngle={4}
                            dataKey="value"
                            label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''}: ${((percent || 0) * 100).toFixed(1)}%`}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Amount']}
                          />
                          <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Summary Metric Breakdown */}
                  <div className="rounded-lg border border-surface-border bg-white p-6 shadow-2xs flex flex-col justify-between space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-navy-900 mb-4">Budget Breakdown</h4>
                      <div className="space-y-4 text-xs">
                        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-text-muted font-semibold block text-[11px]">TOTAL COMMITTED</span>
                          <span className="text-lg font-mono font-bold text-navy-900 block mt-1">
                            ₹
                            {(pieChartTargetBudget
                              ? pieChartTargetBudget.plannedAmount
                              : totalPlanned
                            ).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-lg bg-purple-50 border border-purple-200">
                          <span className="text-brand-800 font-semibold block text-[11px]">ACHIEVED AMOUNT</span>
                          <span className="text-lg font-mono font-bold text-brand-700 block mt-1">
                            ₹
                            {(pieChartTargetBudget
                              ? pieChartTargetBudget.actualAmount
                              : totalActual
                            ).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200">
                          <span className="text-emerald-800 font-semibold block text-[11px]">AMOUNT TO ACHIEVE (BALANCE)</span>
                          <span className="text-lg font-mono font-bold text-emerald-700 block mt-1">
                            ₹
                            {(pieChartTargetBudget
                              ? Math.max(0, pieChartTargetBudget.plannedAmount - pieChartTargetBudget.actualAmount)
                              : totalRemaining
                            ).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {pieChartTargetBudget && (
                      <div className="pt-3 border-t border-slate-100 text-xs text-text-muted space-y-1">
                        <div>
                          <span className="font-semibold text-navy-900">Period: </span>
                          <span>{pieChartTargetBudget.startDate} to {pieChartTargetBudget.endDate}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-navy-900">Responsible: </span>
                          <span>{pieChartTargetBudget.responsible}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-navy-900">Status: </span>
                          <span>{pieChartTargetBudget.stage || 'CONFIRM'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ============================================================ */}
        {/* TAB 2: ANALYTIC ACCOUNTS SECTION                             */}
        {/* ============================================================ */}
        {activeTab === 'analytics' && (
          <div className="space-y-4">
            {/* ANALYTIC FORM VIEW (Mockup Top Left) */}
            {analyticViewMode === 'form' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* Top Action Bar */}
                <div className="rounded-lg border border-surface-border bg-white p-3 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={handleNewAnalyticClick}
                      className="bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white text-xs cursor-pointer font-medium"
                    >
                      <Plus size={14} className="mr-1" />
                      New
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleConfirmAnalytic}
                      className="bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white text-xs cursor-pointer font-medium"
                    >
                      <Check size={14} className="mr-1" />
                      Confirm
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setAnalyticViewMode('list')}
                    className="text-xs cursor-pointer"
                  >
                    <ArrowLeft size={14} className="mr-1" />
                    Back
                  </Button>
                </div>

                {/* Form Fields Card */}
                <div className="rounded-lg border border-surface-border bg-white p-6 shadow-2xs space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-navy-800 mb-1">
                        Analytic Account Name *
                      </label>
                      <input
                        type="text"
                        value={analyticName}
                        onChange={(e) => setAnalyticName(e.target.value)}
                        placeholder="e.g. Furniture Procurement"
                        className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs font-semibold text-navy-900 focus:border-navy-600 focus:outline-none shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-navy-800 mb-1">
                        Type *
                      </label>
                      <div className="flex items-center gap-4 mt-2">
                        <label className="flex items-center gap-2 text-xs text-navy-900 cursor-pointer">
                          <input
                            type="radio"
                            name="analyticType"
                            value="EXPENSES"
                            checked={analyticType === 'EXPENSES'}
                            onChange={() => setAnalyticType('EXPENSES')}
                            className="text-brand-700 focus:ring-brand-700"
                          />
                          <span>Expense</span>
                        </label>
                        <label className="flex items-center gap-2 text-xs text-navy-900 cursor-pointer">
                          <input
                            type="radio"
                            name="analyticType"
                            value="INCOME"
                            checked={analyticType === 'INCOME'}
                            onChange={() => setAnalyticType('INCOME')}
                            className="text-brand-700 focus:ring-brand-700"
                          />
                          <span>Income</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-navy-800 mb-1">
                      Description / Purpose
                    </label>
                    <textarea
                      rows={2}
                      value={analyticDesc}
                      onChange={(e) => setAnalyticDesc(e.target.value)}
                      placeholder="Brief notes on operations, projects or costs tracked under this account..."
                      className="w-full rounded-md border border-surface-border bg-white px-3 py-2 text-xs text-navy-900 focus:border-navy-600 focus:outline-none"
                    />
                  </div>

                  {/* Sub-table: All the Budget list where the Analytic Account is used */}
                  <div className="space-y-3 pt-4 border-t border-surface-border">
                    <div>
                      <h4 className="text-sm font-bold text-navy-900">
                        All the Budget list where the Analytic Account is used
                      </h4>
                      <p className="text-[11px] text-text-muted">
                        Budgets actively allocating financial ceiling or monitoring revenue for this analytic marker
                      </p>
                    </div>

                    <div className="rounded-lg border border-surface-border overflow-hidden shadow-2xs">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50">
                            <TableHead>Budget</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>End Date</TableHead>
                            <TableHead className="text-right">Committed</TableHead>
                            <TableHead className="text-right">Achieved</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {analyticLinkedBudgets.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-6 text-xs text-text-muted">
                                No active budgets currently allocate to this analytic account.
                              </TableCell>
                            </TableRow>
                          ) : (
                            analyticLinkedBudgets.map((b) => (
                              <TableRow
                                key={b.id}
                                className="hover:bg-slate-50/80 cursor-pointer"
                                onClick={() => {
                                  setActiveTab('budgets');
                                  openBudgetForm(b);
                                }}
                              >
                                <TableCell className="font-semibold text-xs text-brand-700 hover:underline">
                                  {b.name}
                                </TableCell>
                                <TableCell className="text-xs font-mono text-text-muted">
                                  {b.startDate || '2026-01-01'}
                                </TableCell>
                                <TableCell className="text-xs font-mono text-text-muted">
                                  {b.endDate || '2026-01-31'}
                                </TableCell>
                                <TableCell className="text-right font-mono font-bold text-xs text-navy-900">
                                  ₹{b.plannedAmount.toLocaleString('en-IN')}
                                </TableCell>
                                <TableCell className="text-right font-mono font-bold text-xs text-emerald-700">
                                  ₹{b.actualAmount.toLocaleString('en-IN')}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ANALYTIC MASTER LIST VIEW */}
            {analyticViewMode === 'list' && (
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border border-surface-border shadow-2xs flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-navy-900">Analytic Accounts Master</h3>
                    <p className="text-xs text-text-muted mt-0.5">
                      Financial markers used to monitor expenses and income by department, project, or cost center.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleNewAnalyticClick}
                    className="bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white text-xs cursor-pointer font-medium"
                  >
                    <Plus size={14} className="mr-1" />
                    New Analytic Account
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
                        const matchedBudgets = budgets.filter((b) => {
                          if (b.lines && b.lines.length > 0) {
                            return b.lines.some(
                              (l) =>
                                l.analyticAccountId === acc.id ||
                                l.analyticAccountName.toLowerCase() === acc.name.toLowerCase()
                            );
                          }
                          return b.analyticAccount.toLowerCase().includes(acc.name.toLowerCase());
                        });
                        return (
                          <TableRow
                            key={acc.id}
                            className="hover:bg-slate-50 cursor-pointer group"
                            onClick={() => openAnalyticForm(acc)}
                          >
                            <TableCell className="font-semibold text-xs text-navy-900">
                              <div className="flex items-center gap-2">
                                <Layers size={14} className="text-brand-700" />
                                <span className="group-hover:text-brand-700 transition-colors font-bold">
                                  {acc.name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={acc.type === 'INCOME' ? 'success' : 'default'}
                                className="text-[10px]"
                              >
                                {acc.type === 'INCOME' ? 'Income' : 'Expense'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-text-muted">
                              {acc.description || 'Cost center marker for Urban Furniture operations'}
                            </TableCell>
                            <TableCell className="text-right font-mono text-xs font-semibold text-navy-900">
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
        )}
      </div>

      {/* ============================================================ */}
      {/* ACHIEVED AMOUNT DRILLDOWN MODAL                               */}
      {/* ============================================================ */}
      {drilldownLine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-2xl rounded-xl border border-surface-border bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div>
                <h3 className="text-base font-bold text-navy-900">
                  Achieved Transactions Drilldown
                </h3>
                <p className="text-xs text-text-muted">
                  {drilldownLine.line.analyticAccountName} &bull; {drilldownLine.startDate} to {drilldownLine.endDate}
                </p>
              </div>
              <button
                onClick={() => setDrilldownLine(null)}
                className="text-text-muted hover:text-navy-900 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-brand-50 rounded-lg border border-brand-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-brand-800 font-semibold block">Total Achieved to Date</span>
                  <span className="text-base font-mono font-bold text-brand-900">
                    ₹{drilldownLine.line.achievedAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-brand-800 font-semibold block">Transaction Category</span>
                  <Badge variant={drilldownLine.line.type === 'INCOME' ? 'success' : 'default'} className="text-[10px]">
                    {drilldownLine.line.type === 'INCOME' ? 'Customer Invoices' : 'Vendor Bills'}
                  </Badge>
                </div>
              </div>

              <div className="rounded-lg border border-surface-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 text-xs">
                      <TableHead>Document #</TableHead>
                      <TableHead>Partner</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {drilldownLine.line.type === 'EXPENSE' ? (
                      bills.length > 0 ? (
                        bills.slice(0, 5).map((b) => (
                          <TableRow key={b.id} className="text-xs">
                            <TableCell className="font-mono font-bold text-navy-900">
                              {b.billNumber}
                            </TableCell>
                            <TableCell>{b.vendorName}</TableCell>
                            <TableCell className="font-mono text-text-muted">{b.billDate}</TableCell>
                            <TableCell>
                              <Badge
                                variant={b.status === 'PAID' ? 'success' : 'warning'}
                                className="text-[10px]"
                              >
                                {b.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-mono font-bold text-navy-900">
                              ₹{b.grandTotal.toLocaleString('en-IN')}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow className="text-xs">
                          <TableCell className="font-mono font-bold text-navy-900">
                            BILL/2026/001
                          </TableCell>
                          <TableCell>Modern Wood Suppliers</TableCell>
                          <TableCell className="font-mono text-text-muted">2026-01-15</TableCell>
                          <TableCell>
                            <Badge variant="success" className="text-[10px]">
                              PAID
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono font-bold text-navy-900">
                            ₹10,000
                          </TableCell>
                        </TableRow>
                      )
                    ) : invoices.length > 0 ? (
                      invoices.slice(0, 5).map((inv) => (
                        <TableRow key={inv.id} className="text-xs">
                          <TableCell className="font-mono font-bold text-navy-900">
                            {inv.invoiceNumber}
                          </TableCell>
                          <TableCell>{inv.customerName}</TableCell>
                          <TableCell className="font-mono text-text-muted">{inv.issueDate}</TableCell>
                          <TableCell>
                            <Badge
                              variant={inv.status === 'PAID' ? 'success' : 'warning'}
                              className="text-[10px]"
                            >
                              {inv.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono font-bold text-navy-900">
                            ₹{inv.grandTotal.toLocaleString('en-IN')}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow className="text-xs">
                        <TableCell className="font-mono font-bold text-navy-900">
                          INV/2026/001
                        </TableCell>
                        <TableCell>Nimesh Pathak</TableCell>
                        <TableCell className="font-mono text-text-muted">2026-01-18</TableCell>
                        <TableCell>
                          <Badge variant="success" className="text-[10px]">
                            PAID
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold text-navy-900">
                          ₹10,000
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDrilldownLine(null)}
                className="cursor-pointer text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BudgetsPage;
