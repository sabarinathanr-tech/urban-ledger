import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Calendar,
  Printer,
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
import { Breadcrumb } from '@/components/layout/Breadcrumb';

type ReportType = 'PL' | 'BS' | 'BUDGET' | 'STOCK';

export function ReportsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { accounts, budgets, products } = useERP();

  const [reportType, setReportType] = useState<ReportType>('PL');
  const [period, setPeriod] = useState('FY 2025-26');

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

  // ────────────────────────────────────────────────────────
  // DYNAMIC BALANCE SHEET DERIVATION
  // ────────────────────────────────────────────────────────
  const assetAccounts = accounts.filter((a) => a.type === 'ASSET');
  const totalAssets = assetAccounts.reduce((sum, a) => sum + a.balance, 0);

  const liabilityAccounts = accounts.filter((a) => a.type === 'LIABILITY');
  const totalLiabilities = liabilityAccounts.reduce((sum, a) => sum + a.balance, 0);

  const capitalAccount = accounts.find((a) => a.id === 'acc-3001' || a.type === 'EQUITY');
  const retainedEarningsAccount = accounts.find((a) => a.id === 'acc-3002');

  const capitalBalance = capitalAccount ? capitalAccount.balance : 0;
  const retainedEarningsBalance = retainedEarningsAccount ? retainedEarningsAccount.balance : 0;

  // Total Equity = Capital + Retained Earnings + Current Period Net Profit
  // By accounting identity: Assets = Liabilities + Equity + Net Profit
  const totalEquity = capitalBalance + retainedEarningsBalance + netProfit;
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

  const isBalanced = Math.abs(totalAssets - totalLiabilitiesAndEquity) < 1;

  return (
    <div className="mx-auto max-w-dashboard space-y-5 p-4 lg:p-6">
      {/* Breadcrumb */}
      <Breadcrumb section="Reporting" />

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-surface-border pb-4">
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
            onClick={() => window.print()}
            className="flex items-center gap-1 text-xs"
          >
            <Printer size={13} />
            <span className="hidden sm:inline">Print</span>
          </Button>
        </div>
      </div>

      {/* Report Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-border pb-2">
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
      {/* 1. PROFIT & LOSS STATEMENT */}
      {/* ──────────────────────────────────────────────────────── */}
      {reportType === 'PL' && (
        <div className="rounded-lg border border-surface-border bg-white p-6 shadow-sm space-y-6">
          <div className="border-b border-surface-border pb-4 flex justify-between items-start">
            <div>
              <h2 className="text-base font-bold text-navy-900">Statement of Profit and Loss</h2>
              <span className="text-xs text-navy-400">Urban Furniture &bull; For the period ended {period}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-navy-400">Net Profit</span>
              <p className={`text-xl font-bold font-mono ${netProfit >= 0 ? 'text-status-success' : 'text-status-danger'}`}>
                ₹{netProfit.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Income Section */}
            <div>
              <h3 className="font-bold uppercase tracking-wider text-navy-500 mb-2 border-b border-surface-secondary pb-1">
                Operating Revenue
              </h3>
              {revenueAccounts.map((r) => (
                <div key={r.code} className="flex justify-between py-1.5 text-navy-700 hover:bg-surface-secondary/40 px-2 rounded">
                  <span>
                    <span className="font-mono text-navy-400 mr-2">{r.code}</span>
                    {r.name}
                  </span>
                  <span className="font-mono font-medium">₹{r.balance.toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 border-t border-surface-border font-semibold text-navy-900 px-2">
                <span>Total Revenue (A)</span>
                <span className="font-mono font-bold">₹{totalRevenue.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* COGS Section */}
            <div>
              <h3 className="font-bold uppercase tracking-wider text-navy-500 mb-2 border-b border-surface-secondary pb-1">
                Cost of Goods Sold (Raw Materials & Stock)
              </h3>
              {cogsAccounts.map((c) => (
                <div key={c.code} className="flex justify-between py-1.5 text-navy-700 hover:bg-surface-secondary/40 px-2 rounded">
                  <span>
                    <span className="font-mono text-navy-400 mr-2">{c.code}</span>
                    {c.name}
                  </span>
                  <span className="font-mono font-medium">₹{c.balance.toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 border-t border-surface-border font-semibold text-navy-900 px-2">
                <span>Total Cost of Sales (B)</span>
                <span className="font-mono font-bold">₹{totalCogs.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Gross Profit Subtotal */}
            <div className="flex justify-between py-2.5 px-3 rounded-md bg-surface-secondary font-bold text-navy-900">
              <span>Gross Profit (A - B)</span>
              <span className="font-mono text-brand-700">₹{grossProfit.toLocaleString('en-IN')}</span>
            </div>

            {/* Operating Expenses */}
            <div>
              <h3 className="font-bold uppercase tracking-wider text-navy-500 mb-2 border-b border-surface-secondary pb-1">
                Operating Expenses
              </h3>
              {operatingExpenseAccounts.map((exp) => (
                <div key={exp.code} className="flex justify-between py-1.5 text-navy-700 hover:bg-surface-secondary/40 px-2 rounded">
                  <span>
                    <span className="font-mono text-navy-400 mr-2">{exp.code}</span>
                    {exp.name}
                  </span>
                  <span className="font-mono font-medium">₹{exp.balance.toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 border-t border-surface-border font-semibold text-navy-900 px-2">
                <span>Total Operating Expenses (C)</span>
                <span className="font-mono font-bold">₹{totalOperatingExpenses.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Final Net Profit */}
            <div className="flex justify-between py-3 px-3 rounded-md bg-brand-50 border border-brand-200 font-bold text-navy-900 text-sm">
              <span className="text-brand-900">Net Profit for Period (Gross Profit - C)</span>
              <span className={`font-mono font-bold ${netProfit >= 0 ? 'text-status-success' : 'text-status-danger'}`}>
                ₹{netProfit.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 2. BALANCE SHEET */}
      {/* ──────────────────────────────────────────────────────── */}
      {reportType === 'BS' && (
        <div className="rounded-lg border border-surface-border bg-white p-6 shadow-sm space-y-6">
          <div className="border-b border-surface-border pb-4 flex justify-between items-start">
            <div>
              <h2 className="text-base font-bold text-navy-900">Balance Sheet</h2>
              <span className="text-xs text-navy-400">Urban Furniture &bull; As of March 2026</span>
            </div>
            <Badge variant={isBalanced ? 'success' : 'danger'}>
              {isBalanced ? 'BALANCED: ASSETS = LIABILITIES + EQUITY' : 'DISCREPANCY DETECTED'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Left: Assets */}
            <div className="space-y-3 rounded-md border border-surface-border p-4 bg-surface-secondary/30">
              <h3 className="font-bold text-sm text-navy-900 border-b border-surface-border pb-2">
                Assets
              </h3>
              <div className="space-y-1.5">
                {assetAccounts.map((a) => (
                  <div key={a.code} className="flex justify-between py-1 text-navy-700">
                    <span>
                      <span className="font-mono text-navy-400 mr-2">{a.code}</span>
                      {a.name}
                    </span>
                    <span className="font-mono font-medium">₹{a.balance.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="border-t-2 border-navy-900 pt-3 flex justify-between font-bold text-navy-900 text-sm">
                <span>Total Assets</span>
                <span className="font-mono text-brand-700">₹{totalAssets.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Right: Liabilities & Equity */}
            <div className="space-y-4 rounded-md border border-surface-border p-4 bg-surface-secondary/30">
              {/* Liabilities */}
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-navy-900 border-b border-surface-border pb-2">
                  Liabilities (Current Creditors & Taxes)
                </h3>
                {liabilityAccounts.map((l) => (
                  <div key={l.code} className="flex justify-between py-1 text-navy-700">
                    <span>
                      <span className="font-mono text-navy-400 mr-2">{l.code}</span>
                      {l.name}
                    </span>
                    <span className="font-mono font-medium">₹{l.balance.toLocaleString('en-IN')}</span>
                  </div>
                ))}
                <div className="border-t border-surface-border pt-1.5 flex justify-between font-semibold text-navy-900">
                  <span>Total Liabilities</span>
                  <span className="font-mono">₹{totalLiabilities.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Equity */}
              <div className="space-y-2 pt-2 border-t border-surface-border">
                <h3 className="font-bold text-sm text-navy-900 border-b border-surface-border pb-2">
                  Owner Capital & Reserves
                </h3>
                <div className="flex justify-between py-1 text-navy-700">
                  <span>
                    <span className="font-mono text-navy-400 mr-2">3001</span>
                    Owner Capital Equity
                  </span>
                  <span className="font-mono font-medium">₹{capitalBalance.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 text-navy-700">
                  <span>
                    <span className="font-mono text-navy-400 mr-2">3002</span>
                    Retained Earnings
                  </span>
                  <span className="font-mono font-medium">₹{retainedEarningsBalance.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 text-navy-700">
                  <span>
                    <span className="font-mono text-navy-400 mr-2">CURR</span>
                    Current Period Net Profit
                  </span>
                  <span className="font-mono font-medium text-status-success">₹{netProfit.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-surface-border pt-1.5 flex justify-between font-semibold text-navy-900">
                  <span>Total Capital & Reserves</span>
                  <span className="font-mono">₹{totalEquity.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Total Liabilities + Equity */}
              <div className="border-t-2 border-navy-900 pt-3 flex justify-between font-bold text-navy-900 text-sm">
                <span>Total Liabilities & Equity</span>
                <span className="font-mono text-brand-700">₹{totalLiabilitiesAndEquity.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 3. BUDGET PERFORMANCE */}
      {/* ──────────────────────────────────────────────────────── */}
      {reportType === 'BUDGET' && (
        <div className="rounded-lg border border-surface-border bg-white p-6 shadow-sm space-y-5">
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
        <div className="rounded-lg border border-surface-border bg-white p-6 shadow-sm space-y-6">
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
  );
}

export default ReportsPage;
