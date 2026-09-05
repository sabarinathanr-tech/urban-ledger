import { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Printer,
  Scale,
  TrendingUp,
  PieChart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { INITIAL_BUDGETS } from '@/data/erpData';

export function ReportsPage() {
  const [reportType, setReportType] = useState<'PL' | 'BS' | 'BUDGET'>('PL');
  const [period, setPeriod] = useState('FY 2025-26');

  // Profit & Loss data (mathematically derived from transactions)
  const plData = {
    revenue: [
      { code: '4001', name: 'Furniture Sales Income', amount: 58500 },
      { code: '4002', name: 'Custom Finishing Services Revenue', amount: 4500 },
    ],
    totalRevenue: 63000,
    cogs: [
      { code: '5001', name: 'Raw Material & Stock Purchases', amount: 28000 },
    ],
    totalCogs: 28000,
    grossProfit: 35000,
    operatingExpenses: [
      { code: '5002', name: 'Workshop Rent & Power Expense', amount: 12500 },
      { code: '5003', name: 'Freight, Logistics & Handling', amount: 4500 },
    ],
    totalExpenses: 17000,
    netProfit: 18000,
  };

  // Balance Sheet data
  const bsData = {
    assets: [
      { code: '1001', name: 'Cash on Hand', amount: 15400 },
      { code: '1002', name: 'HDFC Current Bank Account', amount: 285500 },
      { code: '1003', name: 'Accounts Receivable (Debtors)', amount: 42480 },
      { code: '1004', name: 'Finished Furniture Inventory', amount: 145000 },
    ],
    totalAssets: 488380,
    liabilities: [
      { code: '2001', name: 'Accounts Payable (Creditors)', amount: 13040 },
      { code: '2002', name: 'GST Output Tax Liability', amount: 10530 },
    ],
    totalLiabilities: 23570,
    equity: [
      { code: '3001', name: 'Owner Capital Equity', amount: 400000 },
      { code: '3002', name: 'Retained Earnings', amount: 46810 },
      { code: 'CURR', name: 'Current Period Net Profit', amount: 18000 },
    ],
    totalEquity: 464810,
    totalLiabilitiesAndEquity: 488380,
  };

  const isBalanced = bsData.totalAssets === bsData.totalLiabilitiesAndEquity;

  return (
    <div className="mx-auto max-w-dashboard space-y-5 p-4 lg:p-6">
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
          onClick={() => setReportType('PL')}
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
          onClick={() => setReportType('BS')}
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
          onClick={() => setReportType('BUDGET')}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
            reportType === 'BUDGET'
              ? 'bg-brand-700 text-white shadow-sm'
              : 'bg-white border border-surface-border text-navy-600 hover:bg-surface-secondary'
          }`}
        >
          <PieChart size={14} />
          <span>Budget Performance</span>
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
              <p className="text-xl font-bold font-mono text-status-success">
                ₹{plData.netProfit.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Income Section */}
            <div>
              <h3 className="font-bold uppercase tracking-wider text-navy-500 mb-2 border-b border-surface-secondary pb-1">
                Operating Revenue
              </h3>
              {plData.revenue.map((r) => (
                <div key={r.code} className="flex justify-between py-1.5 text-navy-700 hover:bg-surface-secondary/40 px-2 rounded">
                  <span>
                    <span className="font-mono text-navy-400 mr-2">{r.code}</span>
                    {r.name}
                  </span>
                  <span className="font-mono font-medium">₹{r.amount.toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 border-t border-surface-border font-semibold text-navy-900 px-2">
                <span>Total Revenue (A)</span>
                <span className="font-mono font-bold">₹{plData.totalRevenue.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* COGS Section */}
            <div>
              <h3 className="font-bold uppercase tracking-wider text-navy-500 mb-2 border-b border-surface-secondary pb-1">
                Cost of Goods Sold (Raw Materials & Stock)
              </h3>
              {plData.cogs.map((c) => (
                <div key={c.code} className="flex justify-between py-1.5 text-navy-700 hover:bg-surface-secondary/40 px-2 rounded">
                  <span>
                    <span className="font-mono text-navy-400 mr-2">{c.code}</span>
                    {c.name}
                  </span>
                  <span className="font-mono font-medium">₹{c.amount.toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 border-t border-surface-border font-semibold text-navy-900 px-2">
                <span>Total Cost of Sales (B)</span>
                <span className="font-mono font-bold">₹{plData.totalCogs.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Gross Profit Subtotal */}
            <div className="flex justify-between py-2.5 px-3 rounded-md bg-surface-secondary font-bold text-navy-900">
              <span>Gross Profit (A - B)</span>
              <span className="font-mono text-brand-700">₹{plData.grossProfit.toLocaleString('en-IN')}</span>
            </div>

            {/* Operating Expenses */}
            <div>
              <h3 className="font-bold uppercase tracking-wider text-navy-500 mb-2 border-b border-surface-secondary pb-1">
                Operating Expenses
              </h3>
              {plData.operatingExpenses.map((exp) => (
                <div key={exp.code} className="flex justify-between py-1.5 text-navy-700 hover:bg-surface-secondary/40 px-2 rounded">
                  <span>
                    <span className="font-mono text-navy-400 mr-2">{exp.code}</span>
                    {exp.name}
                  </span>
                  <span className="font-mono font-medium">₹{exp.amount.toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 border-t border-surface-border font-semibold text-navy-900 px-2">
                <span>Total Operating Expenses (C)</span>
                <span className="font-mono font-bold">₹{plData.totalExpenses.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Final Net Profit */}
            <div className="flex justify-between py-3 px-3 rounded-md bg-brand-50 border border-brand-200 font-bold text-navy-900 text-sm">
              <span className="text-brand-900">Net Profit for Period (Gross Profit - C)</span>
              <span className="font-mono text-status-success font-bold">
                ₹{plData.netProfit.toLocaleString('en-IN')}
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
                {bsData.assets.map((a) => (
                  <div key={a.code} className="flex justify-between py-1 text-navy-700">
                    <span>
                      <span className="font-mono text-navy-400 mr-2">{a.code}</span>
                      {a.name}
                    </span>
                    <span className="font-mono font-medium">₹{a.amount.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="border-t-2 border-navy-900 pt-3 flex justify-between font-bold text-navy-900 text-sm">
                <span>Total Assets</span>
                <span className="font-mono text-brand-700">₹{bsData.totalAssets.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Right: Liabilities & Equity */}
            <div className="space-y-4 rounded-md border border-surface-border p-4 bg-surface-secondary/30">
              {/* Liabilities */}
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-navy-900 border-b border-surface-border pb-2">
                  Liabilities (Current Creditors & Taxes)
                </h3>
                {bsData.liabilities.map((l) => (
                  <div key={l.code} className="flex justify-between py-1 text-navy-700">
                    <span>
                      <span className="font-mono text-navy-400 mr-2">{l.code}</span>
                      {l.name}
                    </span>
                    <span className="font-mono font-medium">₹{l.amount.toLocaleString('en-IN')}</span>
                  </div>
                ))}
                <div className="border-t border-surface-border pt-1.5 flex justify-between font-semibold text-navy-900">
                  <span>Total Liabilities</span>
                  <span className="font-mono">₹{bsData.totalLiabilities.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Equity */}
              <div className="space-y-2 pt-2 border-t border-surface-border">
                <h3 className="font-bold text-sm text-navy-900 border-b border-surface-border pb-2">
                  Owner Capital & Reserves
                </h3>
                {bsData.equity.map((eq) => (
                  <div key={eq.code} className="flex justify-between py-1 text-navy-700">
                    <span>
                      <span className="font-mono text-navy-400 mr-2">{eq.code}</span>
                      {eq.name}
                    </span>
                    <span className="font-mono font-medium">₹{eq.amount.toLocaleString('en-IN')}</span>
                  </div>
                ))}
                <div className="border-t border-surface-border pt-1.5 flex justify-between font-semibold text-navy-900">
                  <span>Total Capital & Reserves</span>
                  <span className="font-mono">₹{bsData.totalEquity.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Total Liabilities + Equity */}
              <div className="border-t-2 border-navy-900 pt-3 flex justify-between font-bold text-navy-900 text-sm">
                <span>Total Liabilities & Equity</span>
                <span className="font-mono text-brand-700">₹{bsData.totalLiabilitiesAndEquity.toLocaleString('en-IN')}</span>
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
            {INITIAL_BUDGETS.map((b) => (
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
    </div>
  );
}
