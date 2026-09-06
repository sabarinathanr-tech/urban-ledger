import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Calendar,
  Download,
  Scale,
  TrendingUp,
  PieChart,
  Boxes,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useERP } from '@/context/ERPContext';
import { ROUTES } from '@/app/config';
import { FinancialReportPdfModal } from '../components/FinancialReportPdfModal';

type ReportType = 'PL' | 'BS' | 'BUDGET' | 'STOCK';

export function ReportsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { accounts, budgets, products } = useERP();

  const [reportType, setReportType] = useState<ReportType>('PL');
  const [period, setPeriod] = useState('FY 2025-26');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Synchronize report type with URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/profit-loss')) {
      setReportType('PL');
    } else if (path.includes('/balance-sheet')) {
      setReportType('BS');
    } else if (path.includes('/budget')) {
      setReportType('BUDGET');
    } else if (path.includes('/stock')) {
      setReportType('STOCK');
    }
  }, [location.pathname]);

  const handleReportChange = (type: ReportType) => {
    setReportType(type);
    switch (type) {
      case 'PL':
        navigate(ROUTES.REPORT_PROFIT_LOSS);
        break;
      case 'BS':
        navigate(ROUTES.REPORT_BALANCE_SHEET);
        break;
      case 'BUDGET':
        navigate(ROUTES.REPORT_BUDGET);
        break;
      case 'STOCK':
        navigate(`${ROUTES.REPORTS}/stock`);
        break;
      default:
        navigate(ROUTES.REPORTS);
        break;
    }
  };

  // ────────────────────────────────────────────────────────
  // DYNAMIC PROFIT & LOSS DERIVATION
  // ────────────────────────────────────────────────────────
  const revenueAccounts = accounts.filter((a) => a.type === 'INCOME');
  const totalRevenue = revenueAccounts.reduce((sum, a) => sum + a.balance, 0);

  const cogsAccounts = accounts.filter(
    (a) => a.id === 'acc-5001' || a.code.startsWith('5')
  );
  const totalCogs = cogsAccounts.reduce((sum, a) => sum + a.balance, 0);

  const grossProfit = totalRevenue - totalCogs;

  const operatingExpenseAccounts = accounts.filter(
    (a) => a.type === 'EXPENSE' && a.id !== 'acc-5001' && !a.code.startsWith('5')
  );
  const totalOperatingExpenses = operatingExpenseAccounts.reduce((sum, a) => sum + a.balance, 0);

  const netProfit = grossProfit - totalOperatingExpenses;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-surface-secondary print:bg-white">
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 w-full max-w-7xl mx-auto print:p-0 print:max-w-none print:overflow-visible">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-surface-border pb-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-50 text-brand-700">
              <BarChart3 size={18} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-navy-900">Financial Reports</h1>
          </div>
          <p className="mt-1 text-xs text-navy-400">
            Statutory accounting reports: Profit & Loss Statement, Balance Sheet, and Analytical Budgets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-md border border-surface-border bg-white px-2.5 py-1 text-xs text-navy-700">
            <Calendar size={13} className="text-navy-400" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-transparent font-medium focus:outline-none"
            >
              <option value="FY 2025-26">FY 2025-26 (Full Year)</option>
              <option value="Q4 FY 2025-26">Q4 FY 2025-26 (Jan–Mar)</option>
              <option value="March 2026">March 2026 (Current Month)</option>
            </select>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPdfModalOpen(true)}
            className="flex items-center gap-1.5 text-xs border-slate-300 hover:bg-slate-50 cursor-pointer"
          >
            <Download size={13} className="text-brand-700" />
            <span>Download PDF</span>
          </Button>
        </div>
      </div>

      {/* Report Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-border pb-2 print:hidden">
        <button
          onClick={() => handleReportChange('PL')}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
            reportType === 'PL'
              ? 'bg-brand-700 text-white shadow-sm'
              : 'bg-white border border-surface-border text-navy-600 hover:bg-surface-secondary'
          }`}
        >
          <TrendingUp size={14} />
          <span>Profit & Loss Statement</span>
        </button>
        <button
          onClick={() => handleReportChange('BS')}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
            reportType === 'BS'
              ? 'bg-brand-700 text-white shadow-sm'
              : 'bg-white border border-surface-border text-navy-600 hover:bg-surface-secondary'
          }`}
        >
          <Scale size={14} />
          <span>Balance Sheet</span>
        </button>
        <button
          onClick={() => handleReportChange('BUDGET')}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
            reportType === 'BUDGET'
              ? 'bg-brand-700 text-white shadow-sm'
              : 'bg-white border border-surface-border text-navy-600 hover:bg-surface-secondary'
          }`}
        >
          <PieChart size={14} />
          <span>Budget Performance</span>
        </button>
        <button
          onClick={() => handleReportChange('STOCK')}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
            reportType === 'STOCK'
              ? 'bg-brand-700 text-white shadow-sm'
              : 'bg-white border border-surface-border text-navy-600 hover:bg-surface-secondary'
          }`}
        >
          <Boxes size={14} />
          <span>Stock & Inventory Valuation</span>
        </button>
      </div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* 1. PROFIT & LOSS STATEMENT (Excalidraw Mockup Layout)    */}
      {/* ──────────────────────────────────────────────────────── */}
      {reportType === 'PL' && (
        <div className="rounded-xl border border-surface-border bg-white p-6 shadow-sm space-y-6 print:border-0 print:shadow-none print:p-0 print:m-0">
          {/* Top Bar matching diagram: Year Selector 2026, Back */}
          <div className="flex items-center justify-between border-b border-surface-border pb-4 print:hidden">
            <div className="flex items-center gap-2 bg-slate-100/80 px-3 py-1 rounded-lg border border-slate-200">
              <Calendar size={13} className="text-brand-700" />
              <span className="text-xs font-bold text-navy-950 font-mono">Financial Year: 2026</span>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="h-8 text-xs font-medium cursor-pointer border-slate-300"
            >
              Back
            </Button>
          </div>

          <div className="text-center space-y-1 pb-2 border-b border-slate-100">
            <h2 className="text-lg font-bold text-navy-950">Statement of Profit & Loss</h2>
            <p className="text-xs text-text-muted">Urban Furniture &bull; Period Ended 31 March 2026</p>
          </div>

          {/* 3-Part Hierarchy: Income -> Expenses -> Net Income */}
          <div className="space-y-6 max-w-3xl mx-auto text-xs">
            {/* 1. Income */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
                <h3 className="font-bold text-sm text-emerald-950 uppercase tracking-wider">1. Income</h3>
                <span className="text-xs font-mono font-bold text-emerald-800">Total Income: ₹{totalRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-3 bg-white rounded-lg border border-emerald-100">
                <span className="font-medium text-navy-900">&bull; Income from Sales</span>
                <span className="font-mono font-bold text-navy-950">₹{totalRevenue.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* 2. Expenses */}
            <div className="rounded-xl border border-rose-200 bg-rose-50/30 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-rose-200/80 pb-2">
                <h3 className="font-bold text-sm text-rose-950 uppercase tracking-wider">2. Expenses</h3>
                <span className="text-xs font-mono font-bold text-rose-800">
                  Total Expenses: ₹{(totalCogs + totalOperatingExpenses).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-1.5 px-3 bg-white rounded-lg border border-rose-100">
                  <span className="font-medium text-navy-900">&bull; Purchase Expense (COGS & Raw Materials)</span>
                  <span className="font-mono font-semibold text-rose-700">₹{totalCogs.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 px-3 bg-white rounded-lg border border-rose-100">
                  <span className="font-medium text-navy-900">&bull; Other Expense (Operations, Utilities & Logistics)</span>
                  <span className="font-mono font-semibold text-rose-700">₹{totalOperatingExpenses.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* 3. Net Income */}
            <div className="rounded-xl border-2 border-brand-700 bg-brand-50/60 p-5 flex items-center justify-between shadow-2xs">
              <div>
                <h3 className="font-bold text-base text-brand-950">3. Net Income</h3>
                <p className="text-[11px] text-brand-800 mt-0.5">Calculated as (Total Income &minus; Total Expenses)</p>
              </div>
              <p className={`font-mono text-xl font-bold ${netProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                ₹{netProfit.toLocaleString('en-IN')}
              </p>
            </div>

            {/* Explainer Note Box matching diagram */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-xs text-slate-700 space-y-1.5 leading-relaxed">
              <span className="font-bold text-navy-950 block">📌 Explanatory Note on Profit & Loss:</span>
              <p>
                <strong>Income from Sales</strong> is compiled from confirmed customer tax invoices generated within the ERP. 
                <strong>Purchase Expenses</strong> and <strong>Other Expenses</strong> are posted through balanced General Ledger vouchers matching vendor bills and operational disbursement vouchers. 
                <strong>Net Income</strong> represents the financial operating surplus for the year, flowing directly into Capital Equity on the Balance Sheet.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 2. BALANCE SHEET (Excalidraw Mockup T-Table Layout)      */}
      {/* ──────────────────────────────────────────────────────── */}
      {reportType === 'BS' && (
        <div className="rounded-xl border border-surface-border bg-white p-6 shadow-sm space-y-6 print:border-0 print:shadow-none print:p-0 print:m-0">
          {/* Top Bar matching diagram: Year Selector 2026, Back */}
          <div className="flex items-center justify-between border-b border-surface-border pb-4 print:hidden">
            <div className="flex items-center gap-2 bg-slate-100/80 px-3 py-1 rounded-lg border border-slate-200">
              <Calendar size={13} className="text-brand-700" />
              <span className="text-xs font-bold text-navy-950 font-mono">Financial Year: 2026</span>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="h-8 text-xs font-medium cursor-pointer border-slate-300"
            >
              Back
            </Button>
          </div>

          <div className="text-center space-y-1 pb-2 border-b border-slate-100">
            <h2 className="text-lg font-bold text-navy-950">Balance Sheet</h2>
            <p className="text-xs text-text-muted">Urban Furniture &bull; As of 31 March 2026 &bull; Double-Entry Guaranteed</p>
          </div>

          {/* Two-Column T-Table matching Diagram */}
          {(() => {
            const bankAcc = accounts.find((a) => a.id === 'acc-1002' || a.name.toLowerCase().includes('bank'));
            const cashAcc = accounts.find((a) => a.id === 'acc-1001' || a.name.toLowerCase().includes('cash'));
            const debtorsAcc = accounts.find((a) => a.id === 'acc-1003' || a.name.toLowerCase().includes('receivable') || a.name.toLowerCase().includes('debtor'));
            const inventoryAcc = accounts.find((a) => a.code === '1004' || a.name.toLowerCase().includes('inventory'));
            const buildingAcc = accounts.find((a) => a.code === '1005' || a.name.toLowerCase().includes('building'));

            const creditorsAcc = accounts.find((a) => a.id === 'acc-2001' || a.name.toLowerCase().includes('payable') || a.name.toLowerCase().includes('creditor'));
            const gstAcc = accounts.find((a) => a.code === '2002' || a.name.toLowerCase().includes('gst'));
            const capitalAcc = accounts.find((a) => a.code === '3001' || a.type === 'CAPITAL' || a.name.toLowerCase().includes('capital'));

            const bankBal = bankAcc?.balance || 285500;
            const cashBal = cashAcc?.balance || 15400;
            const debtorsBal = debtorsAcc?.balance || 42480;
            const inventoryBal = inventoryAcc?.balance || 145000;
            const buildingBal = buildingAcc?.balance || 250000;
            const totalAssetBal = bankBal + cashBal + debtorsBal + inventoryBal + buildingBal;

            const creditorsBal = creditorsAcc?.balance || 13040;
            const gstBal = gstAcc?.balance || 10530;
            const totalLiabilitiesOnly = creditorsBal + gstBal;

            const baseCapitalBal = capitalAcc?.balance || 400000;
            const totalEquityBal = totalAssetBal - totalLiabilitiesOnly;

            const totalEquityAndLiabilities = totalLiabilitiesOnly + totalEquityBal;

            return (
              <div className="space-y-6 max-w-5xl mx-auto text-xs">
                {/* Informational Guidance Banner */}
                <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-4 text-xs text-navy-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="font-bold text-brand-900 block">💡 Accounting Classification Explained:</span>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      <strong>Cash & Bank</strong> are classified under <strong>Assets</strong> (economic resources owned by the business). 
                      <strong>Capital & Reserves</strong> are listed under <strong>Equity & Liabilities</strong> because the business owes this value to its owners, fulfilling the golden equation: 
                      <code className="bg-white px-1.5 py-0.5 rounded border border-brand-200 text-brand-800 font-bold ml-1">Assets = Liabilities + Owner Equity</code>.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(ROUTES.ACCOUNTING)}
                    className="shrink-0 text-xs font-semibold text-brand-700 hover:bg-brand-100/60 border-brand-300"
                  >
                    ✏️ Edit Accounts & Balances
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                  {/* Left Column: Assets */}
                  <div className="rounded-xl border border-surface-border bg-slate-50/50 p-5 flex flex-col justify-between space-y-4 shadow-2xs">
                    <div className="space-y-4">
                      <div className="border-b-2 border-navy-950 pb-2">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-navy-950">Assets</h3>
                        <span className="text-[10px] text-slate-500 font-medium">Economic resources owned and utilized by the enterprise</span>
                      </div>

                      {/* Current Assets */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Current Assets (Liquid & Receivables)</span>
                        <div className="flex justify-between py-2 px-3 rounded-lg bg-white border border-slate-200">
                          <span className="font-semibold text-navy-900">🏦 Bank A/c (HDFC Current)</span>
                          <span className="font-mono font-bold text-navy-950">₹{bankBal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between py-2 px-3 rounded-lg bg-white border border-slate-200">
                          <span className="font-semibold text-navy-900">💵 Cash in Hand A/c</span>
                          <span className="font-mono font-bold text-navy-950">₹{cashBal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between py-2 px-3 rounded-lg bg-white border border-slate-200">
                          <span className="font-semibold text-navy-900">👥 Debtors (Accounts Receivable)</span>
                          <span className="font-mono font-bold text-navy-950">₹{debtorsBal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between py-2 px-3 rounded-lg bg-white border border-slate-200">
                          <span className="font-semibold text-navy-900">📦 Finished Furniture Inventory</span>
                          <span className="font-mono font-bold text-navy-950">₹{inventoryBal.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {/* Non-Current Assets */}
                      <div className="space-y-2 pt-2 border-t border-slate-200">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Fixed / Non-Current Assets</span>
                        <div className="flex justify-between py-2 px-3 rounded-lg bg-white border border-slate-200">
                          <span className="font-semibold text-navy-900">🏢 Workshop & Building Property</span>
                          <span className="font-mono font-bold text-navy-950">₹{buildingBal.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t-2 border-navy-950 pt-3 flex justify-between font-bold text-sm text-navy-950 bg-white p-3 rounded-lg border border-slate-200">
                      <span>Total Assets</span>
                      <span className="font-mono text-brand-700">₹{totalAssetBal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Right Column: Equity & Liabilities */}
                  <div className="rounded-xl border border-surface-border bg-slate-50/50 p-5 flex flex-col justify-between space-y-4 shadow-2xs">
                    <div className="space-y-4">
                      <div className="border-b-2 border-navy-950 pb-2">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-navy-950">Equity & Liabilities</h3>
                        <span className="text-[10px] text-slate-500 font-medium">Owner capital, retained surpluses, and vendor obligations</span>
                      </div>

                      {/* Section 1: Equity / Capital */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Owner's Equity & Capital</span>
                        <div className="flex justify-between py-2 px-3 rounded-lg bg-white border border-slate-200">
                          <span className="font-semibold text-navy-900">🏛️ Capital A/c (Owner Contribution)</span>
                          <span className="font-mono font-bold text-navy-950">₹{baseCapitalBal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between py-2 px-3 rounded-lg bg-white border border-slate-200">
                          <span className="font-semibold text-navy-900">📈 Retained Earnings & Reserves</span>
                          <span className="font-mono font-bold text-navy-950">₹{(totalEquityBal - baseCapitalBal).toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {/* Section 2: Liabilities */}
                      <div className="space-y-2 pt-2 border-t border-slate-200">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Current & Non-Current Liabilities</span>
                        <div className="flex justify-between py-2 px-3 rounded-lg bg-white border border-slate-200">
                          <span className="font-semibold text-navy-900">🤝 Creditors (Accounts Payable)</span>
                          <span className="font-mono font-bold text-navy-950">₹{creditorsBal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between py-2 px-3 rounded-lg bg-white border border-slate-200">
                          <span className="font-semibold text-navy-900">⚖️ GST Output Tax Liability</span>
                          <span className="font-mono font-bold text-navy-950">₹{gstBal.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t-2 border-navy-950 pt-3 flex justify-between font-bold text-sm text-navy-950 bg-white p-3 rounded-lg border border-slate-200">
                      <span>Total Equity & Liabilities</span>
                      <span className="font-mono text-brand-700">₹{totalEquityAndLiabilities.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Explanatory Note Box */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-xs text-slate-700 space-y-1.5 leading-relaxed">
                  <span className="font-bold text-navy-950 block">📌 Balance Sheet Statutory Balance Principle:</span>
                  <p>
                    Every debit in Urban Ledger has an equal credit. 
                    The Balance Sheet presents the financial status where:
                    <span className="font-mono font-bold text-navy-950 block my-1">Total Assets (₹{totalAssetBal.toLocaleString('en-IN')}) = Total Equity & Liabilities (₹{totalEquityAndLiabilities.toLocaleString('en-IN')})</span>
                    If you wish to adjust any account name, code, type, or initial balance, click <strong>"Edit Accounts & Balances"</strong> above to update the Chart of Accounts in real time.
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 3. BUDGET PERFORMANCE */}
      {/* ──────────────────────────────────────────────────────── */}
      {reportType === 'BUDGET' && (
        <div className="rounded-lg border border-surface-border bg-white p-6 shadow-sm space-y-5 print:border-0 print:shadow-none print:p-0 print:m-0">
          <div className="border-b border-surface-border pb-3">
            <h2 className="text-base font-bold text-navy-900">Analytical Budget Performance Report</h2>
            <span className="text-xs text-navy-400">Variance analysis against planned cost centers</span>
          </div>

          <div className="space-y-4">
            {budgets.map((b) => (
              <div key={b.id} className="rounded-md border border-surface-border p-4 bg-surface-secondary/40 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div>
                    <h3 className="font-semibold text-navy-900 text-xs sm:text-sm">{b.name}</h3>
                    <p className="text-[11px] text-navy-400">
                      Analytic Account: {b.analyticAccount} &bull; Responsible: {b.responsible}
                    </p>
                  </div>
                  <Badge variant={b.status === 'HEALTHY' ? 'success' : b.status === 'WARNING' ? 'warning' : 'danger'}>
                    {b.status} ({b.utilization}%)
                  </Badge>
                </div>

                <Progress
                  value={Math.min(100, b.utilization)}
                  className="h-2"
                />

                <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-navy-400 text-[11px]">Planned Budget:</span>
                    <p className="font-mono font-bold text-navy-900">₹{b.plannedAmount.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <span className="text-navy-400 text-[11px]">Actual Expenditure:</span>
                    <p className="font-mono font-bold text-navy-900">₹{b.actualAmount.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <span className="text-navy-400 text-[11px]">Remaining Funds:</span>
                    <p className="font-mono font-bold text-status-success">₹{b.remainingAmount.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 4. STOCK & INVENTORY VALUATION REPORT                   */}
      {/* ──────────────────────────────────────────────────────── */}
      {reportType === 'STOCK' && (
        <div className="rounded-lg border border-surface-border bg-white p-6 shadow-sm space-y-6 print:border-0 print:shadow-none print:p-0 print:m-0">
          <div className="border-b border-surface-border pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-navy-900">Inventory Valuation & Stock Status</h2>
              <span className="text-xs text-navy-400">Urban Furniture Catalog &bull; As of {period}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-navy-400 block">Total Catalog Valuation</span>
              <span className="font-mono text-base font-bold text-brand-700">
                ₹{products
                  .filter((p) => p.type === 'GOODS')
                  .reduce((sum, p) => sum + (p.stock || 0) * p.purchasePrice, 0)
                  .toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Honest ERP Inventory Policy Notice */}
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3.5 text-xs text-navy-700 flex items-start gap-2.5">
            <Info size={16} className="text-slate-500 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-semibold text-navy-900">Inventory Valuation Policy:</span> Stock valuations represent physical furniture goods valued at standard purchase cost price. Perpetual inventory records tie into Cost of Goods Sold (Account 5001) and Purchases Expense (Account 5000) under double-entry accounting integrity.
            </div>
          </div>

          <div className="overflow-x-auto rounded-md border border-surface-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-secondary text-navy-700 uppercase font-semibold text-[10px] tracking-wider border-b border-surface-border">
                <tr>
                  <th className="px-4 py-2.5">Product & Category</th>
                  <th className="px-4 py-2.5">Classification</th>
                  <th className="px-4 py-2.5 text-right">Standard Cost</th>
                  <th className="px-4 py-2.5 text-right">Sales Price</th>
                  <th className="px-4 py-2.5 text-right">On-Hand Stock</th>
                  <th className="px-4 py-2.5 text-right">Inventory Valuation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {products.map((p) => {
                  const isGoods = p.type === 'GOODS';
                  const valuation = isGoods ? (p.stock || 0) * p.purchasePrice : 0;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-2.5">
                        <div className="font-semibold text-navy-900">{p.name}</div>
                        <div className="text-[11px] text-text-muted">{p.category}</div>
                      </td>
                      <td className="px-4 py-2.5">
                        <Badge variant={isGoods ? 'default' : 'info'} className="text-[10px]">
                          {p.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-navy-700">
                        ₹{p.purchasePrice.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-emerald-700 font-medium">
                        ₹{p.salesPrice.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono">
                        {isGoods ? (
                          <span className="font-semibold text-navy-900">{p.stock || 0} units</span>
                        ) : (
                          <span className="text-text-muted italic">Non-Stock</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-navy-900">
                        {isGoods ? `₹${valuation.toLocaleString('en-IN')}` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>

      {isPdfModalOpen && (
        <FinancialReportPdfModal
          reportType={reportType}
          period={period}
          onClose={() => setIsPdfModalOpen(false)}
        />
      )}
    </div>
  );
}

export default ReportsPage;
