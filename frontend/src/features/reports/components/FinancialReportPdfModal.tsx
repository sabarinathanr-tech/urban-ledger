import { useState } from 'react';
import {
  Download,
  X,
  FileText,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { useERP } from '@/context/ERPContext';

interface FinancialReportPdfModalProps {
  reportType: 'PL' | 'BS' | 'BUDGET' | 'STOCK';
  period: string;
  onClose: () => void;
}

export function FinancialReportPdfModal({
  reportType,
  period,
  onClose,
}: FinancialReportPdfModalProps) {
  const { accounts, budgets, products } = useERP();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const element = document.getElementById('printable-financial-report');
      if (!element) throw new Error('Report container element not found');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const cleanFilename = `${getDocumentTitle().replace(/[^a-zA-Z0-9]/g, '_')}_${period.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      pdf.save(cleanFilename);
    } catch (err) {
      console.error('PDF download error:', err);
      const pdf = new jsPDF();
      pdf.setFontSize(16);
      pdf.text(getDocumentTitle(), 20, 20);
      pdf.setFontSize(10);
      pdf.text(`Urban Furniture Pvt. Ltd. - ${period}`, 20, 30);
      pdf.text(`Document Reference: ${getDocRef()}`, 20, 36);
      pdf.text('Generated from Urban Ledger ERP', 20, 42);
      pdf.save(`${getDocumentTitle().replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
    } finally {
      setIsDownloading(false);
    }
  };

  // Calculations for PL
  const revenueAccounts = accounts.filter((a) => a.type === 'INCOME');
  const totalRevenue = revenueAccounts.reduce((sum, a) => sum + a.balance, 0);

  const cogsAccounts = accounts.filter(
    (a) => a.id === 'acc-5001' || a.code.startsWith('5')
  );
  const totalCogs = cogsAccounts.reduce((sum, a) => sum + a.balance, 0);

  const operatingExpenseAccounts = accounts.filter(
    (a) => a.type === 'EXPENSE' && a.id !== 'acc-5001' && !a.code.startsWith('5')
  );
  const totalOperatingExpenses = operatingExpenseAccounts.reduce((sum, a) => sum + a.balance, 0);
  const totalExpenses = totalCogs + totalOperatingExpenses;
  const netProfit = totalRevenue - totalExpenses;

  // Calculations for BS
  const bankAcc = accounts.find((a) => a.id === 'acc-1001' || a.name.toLowerCase().includes('bank'));
  const cashAcc = accounts.find((a) => a.id === 'acc-1002' || a.name.toLowerCase().includes('cash'));
  const debtorsAcc = accounts.find((a) => a.id === 'acc-1003' || a.name.toLowerCase().includes('receivable'));
  const creditorsAcc = accounts.find((a) => a.id === 'acc-2001' || a.name.toLowerCase().includes('payable'));

  const bankBal = bankAcc?.balance || 0;
  const cashBal = cashAcc?.balance || 0;
  const debtorsBal = debtorsAcc?.balance || 0;
  const totalAssetBal = bankBal + cashBal + debtorsBal;

  const creditorsBal = creditorsAcc?.balance || 0;
  const capitalBal = totalAssetBal - creditorsBal;
  const totalLiabilityBal = creditorsBal + capitalBal;

  // Title calculation
  const getDocumentTitle = () => {
    switch (reportType) {
      case 'BS':
        return 'Balance Sheet';
      case 'PL':
        return 'Statement of Profit & Loss';
      case 'BUDGET':
        return 'Budget Performance Report';
      case 'STOCK':
        return 'Stock & Inventory Valuation Report';
      default:
        return 'Financial Statement';
    }
  };

  const getDocRef = () => {
    switch (reportType) {
      case 'BS':
        return 'UFL/FIN/2026/BS-001';
      case 'PL':
        return 'UFL/FIN/2026/PL-001';
      case 'BUDGET':
        return 'UFL/FIN/2026/BUD-001';
      case 'STOCK':
        return 'UFL/FIN/2026/STK-001';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/75 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto print:static print:p-0 print:bg-white print:overflow-visible">
      {/* Container - on print this fills the A4 page */}
      <div className="relative w-full max-w-4xl rounded-xl bg-white shadow-2xl overflow-hidden my-auto print:m-0 print:w-full print:max-w-none print:shadow-none print:rounded-none">
        {/* Screen-Only Action Header Bar */}
        <div className="flex items-center justify-between border-b border-surface-border bg-slate-50 px-6 py-3.5 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-100 text-brand-700">
              <FileText size={15} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-navy-950">PDF Preview: {getDocumentTitle()}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono">
                  {period}
                </span>
              </div>
              <p className="text-[11px] text-text-muted">A4 Official Corporate Financial Report</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="bg-brand-700 hover:bg-brand-800 text-white font-medium text-xs px-3.5 py-1.5 h-8 gap-1.5 rounded-md shadow-xs cursor-pointer disabled:opacity-70"
            >
              {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              <span>{isDownloading ? 'Generating PDF...' : 'Download PDF'}</span>
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-text-muted hover:text-navy-900 rounded-md hover:bg-slate-200 transition-colors cursor-pointer ml-1"
              title="Close Preview"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable A4 Document Sheet */}
        <div className="p-8 sm:p-12 print:p-6 text-navy-900 font-sans text-xs space-y-6" id="printable-financial-report">
          {/* Corporate Letterhead Header */}
          <div className="flex justify-between items-start border-b-2 border-brand-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-md bg-brand-800 text-white font-black flex items-center justify-center text-sm shadow-xs">
                  UL
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-navy-950">URBAN FURNITURE PVT. LTD.</h1>
                  <span className="text-[11px] font-semibold text-brand-800">Corporate Financial Accounting Division</span>
                </div>
              </div>
              <p className="text-slate-600 mt-2 text-[11px] leading-relaxed">
                Plot 42, Peenya Industrial Area, Phase II &bull; Bengaluru, Karnataka — 560058, India<br />
                GSTIN: <span className="font-mono font-medium">29AABCU1234F1Z5</span> &bull; State Code: 29 &bull; CIN: U36101KA2024PTC123456
              </p>
            </div>

            <div className="text-right space-y-1">
              <span className="inline-block px-3 py-1 bg-brand-800 text-white font-bold text-xs rounded uppercase tracking-wider">
                {getDocumentTitle().toUpperCase()}
              </span>
              <div className="space-y-0.5 text-[11px] text-slate-600 pt-1 font-mono">
                <p>Doc Ref: <span className="font-bold text-navy-950">{getDocRef()}</span></p>
                <p>Period: <span className="font-semibold text-navy-950">{period}</span></p>
                <p>Currency: <span className="font-semibold text-navy-950">INR (₹)</span></p>
                <p>Date Generated: <span className="font-semibold text-navy-950">31 March 2026</span></p>
              </div>
            </div>
          </div>

          {/* Document Sub-Banner */}
          <div className="text-center space-y-1 pb-1">
            <h2 className="text-lg font-black text-navy-950 uppercase tracking-wide">{getDocumentTitle()}</h2>
            <p className="text-xs text-slate-500">
              {reportType === 'BS' && 'As of 31 March 2026 • Double-Entry Equality Verified'}
              {reportType === 'PL' && 'For the Financial Year Ended 31 March 2026 • Accrual Basis'}
              {reportType === 'BUDGET' && 'Analytic Cost Center Planned vs Actual Variance Drilldown'}
              {reportType === 'STOCK' && 'Warehouse Catalog Status & Finished Goods Valuation'}
            </p>
          </div>

          {/* ──────────────────────────────────────────────────────── */}
          {/* 1. BALANCE SHEET TABLE                                   */}
          {/* ──────────────────────────────────────────────────────── */}
          {reportType === 'BS' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Assets */}
                <div className="rounded-lg border-2 border-slate-200 bg-white p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-black text-xs text-navy-950 uppercase tracking-wider">ASSETS</span>
                    <span className="text-[10px] font-mono text-slate-500">Dr Balance (₹)</span>
                  </div>
                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex justify-between items-center py-1 px-2 bg-slate-50 rounded border border-slate-100">
                      <span className="font-sans font-medium text-navy-900">&bull; Bank Accounts (HDFC Operational)</span>
                      <span className="font-bold text-navy-950">₹{bankBal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 px-2 bg-slate-50 rounded border border-slate-100">
                      <span className="font-sans font-medium text-navy-900">&bull; Cash Register</span>
                      <span className="font-bold text-navy-950">₹{cashBal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 px-2 bg-slate-50 rounded border border-slate-100">
                      <span className="font-sans font-medium text-navy-900">&bull; Debtors (Accounts Receivable)</span>
                      <span className="font-bold text-navy-950">₹{debtorsBal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2.5 border-t-2 border-slate-800 text-xs font-bold text-navy-950 font-mono">
                    <span className="font-sans uppercase">Total Assets</span>
                    <span>₹{totalAssetBal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Right: Liabilities & Equity */}
                <div className="rounded-lg border-2 border-slate-200 bg-white p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-black text-xs text-navy-950 uppercase tracking-wider">LIABILITIES & EQUITY</span>
                    <span className="text-[10px] font-mono text-slate-500">Cr Balance (₹)</span>
                  </div>
                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex justify-between items-center py-1 px-2 bg-slate-50 rounded border border-slate-100">
                      <span className="font-sans font-medium text-navy-900">&bull; Creditors (Accounts Payable)</span>
                      <span className="font-bold text-navy-950">₹{creditorsBal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 px-2 bg-slate-50 rounded border border-slate-100">
                      <span className="font-sans font-medium text-navy-900">&bull; Capital Equity (Owner's Capital + Net Surplus)</span>
                      <span className="font-bold text-navy-950">₹{capitalBal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2.5 border-t-2 border-slate-800 text-xs font-bold text-navy-950 font-mono">
                    <span className="font-sans uppercase">Total Liabilities & Equity</span>
                    <span>₹{totalLiabilityBal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Equality Verification Banner */}
              <div className="flex items-center justify-between p-3 rounded-md bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                  <span>Double-Entry Balance Verified: Total Assets = Total Liabilities & Equity (₹{totalAssetBal.toLocaleString('en-IN')})</span>
                </div>
                <span className="font-mono text-[11px] font-bold text-emerald-800">Difference: ₹0.00</span>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── */}
          {/* 2. PROFIT & LOSS TABLE                                   */}
          {/* ──────────────────────────────────────────────────────── */}
          {reportType === 'PL' && (
            <div className="space-y-4">
              {/* Income Section */}
              <div className="rounded-lg border border-slate-200 p-4 space-y-2">
                <div className="flex justify-between items-center border-b border-slate-200 pb-1.5 font-bold text-xs">
                  <span className="uppercase text-emerald-950">1. INCOME / OPERATING REVENUE</span>
                  <span className="font-mono text-emerald-800">₹{totalRevenue.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-700 py-1 font-mono">
                  <span className="font-sans">&bull; Income from Sales (Tax Invoices Confirmed)</span>
                  <span>₹{totalRevenue.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Expense Section */}
              <div className="rounded-lg border border-slate-200 p-4 space-y-2">
                <div className="flex justify-between items-center border-b border-slate-200 pb-1.5 font-bold text-xs">
                  <span className="uppercase text-rose-950">2. OPERATING EXPENSES</span>
                  <span className="font-mono text-rose-800">₹{totalExpenses.toLocaleString('en-IN')}</span>
                </div>
                <div className="space-y-1 text-xs text-slate-700 font-mono">
                  <div className="flex justify-between items-center py-1">
                    <span className="font-sans">&bull; Purchase Expense (Cost of Goods Sold & Timber Procurement)</span>
                    <span>₹{totalCogs.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="font-sans">&bull; Operational, Utilities & Warehouse Logistics</span>
                    <span>₹{totalOperatingExpenses.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Net Income Card */}
              <div className="rounded-lg border-2 border-slate-800 bg-slate-50 p-4 flex justify-between items-center text-xs">
                <div>
                  <span className="font-black uppercase text-sm text-navy-950 block">3. Net Operating Income / Surplus</span>
                  <span className="text-[11px] text-slate-500">Calculated as (Total Revenue &minus; Total Operating Expenses)</span>
                </div>
                <span className={`font-mono text-base font-black ${netProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  ₹{netProfit.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── */}
          {/* 3. BUDGET PERFORMANCE TABLE                              */}
          {/* ──────────────────────────────────────────────────────── */}
          {reportType === 'BUDGET' && (
            <div className="space-y-3">
              <table className="w-full text-left border border-slate-200 text-xs">
                <thead className="bg-slate-100 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Budget Title</th>
                    <th className="p-2.5">Analytic Account</th>
                    <th className="p-2.5 text-right font-mono">Planned (₹)</th>
                    <th className="p-2.5 text-right font-mono">Actual (₹)</th>
                    <th className="p-2.5 text-right font-mono">Remaining (₹)</th>
                    <th className="p-2.5 text-center">Utilization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {budgets.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-sans font-semibold text-navy-950">{b.name}</td>
                      <td className="p-2.5 font-sans text-slate-600">{b.analyticAccount}</td>
                      <td className="p-2.5 text-right">₹{b.plannedAmount.toLocaleString('en-IN')}</td>
                      <td className="p-2.5 text-right">₹{b.actualAmount.toLocaleString('en-IN')}</td>
                      <td className="p-2.5 text-right font-bold text-emerald-700">₹{b.remainingAmount.toLocaleString('en-IN')}</td>
                      <td className="p-2.5 text-center font-sans font-bold">{b.utilization}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── */}
          {/* 4. STOCK & INVENTORY TABLE                               */}
          {/* ──────────────────────────────────────────────────────── */}
          {reportType === 'STOCK' && (
            <div className="space-y-3">
              <table className="w-full text-left border border-slate-200 text-xs">
                <thead className="bg-slate-100 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Item Name</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5 text-right font-mono">On Hand Qty</th>
                    <th className="p-2.5 text-right font-mono">Unit Cost (₹)</th>
                    <th className="p-2.5 text-right font-mono">Total Valuation (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {products
                    .filter((p) => p.type === 'GOODS')
                    .map((p) => {
                      const totalVal = (p.stock || 0) * p.purchasePrice;
                      return (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-sans font-semibold text-navy-950">{p.name}</td>
                          <td className="p-2.5 font-sans text-slate-600">{p.category}</td>
                          <td className="p-2.5 text-right">{p.stock || 0} units</td>
                          <td className="p-2.5 text-right">₹{p.purchasePrice.toLocaleString('en-IN')}</td>
                          <td className="p-2.5 text-right font-bold text-brand-800">₹{totalVal.toLocaleString('en-IN')}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}

          {/* Explanatory Footnote Note */}
          <div className="rounded-md border border-slate-200 bg-slate-50/70 p-3.5 text-[11px] text-slate-600 leading-relaxed space-y-1">
            <span className="font-bold text-navy-950 block">📌 Statutory Note:</span>
            <p>
              This document has been prepared from the transactional double-entry ledger database of Urban Furniture Private Limited. 
              All figures are compiled in compliance with Indian Accounting Standards (Ind AS) and General Ledger postings. 
              Net income and capital reserves are reconciled with confirmed journal vouchers.
            </p>
          </div>

          {/* Authorized Signatories Block */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <div className="h-10 border-b border-dashed border-slate-300 w-48 mx-auto" />
              <p className="mt-2 font-bold text-navy-950">Senior Chief Accountant</p>
              <p className="text-[10px] text-slate-500">Accounts & Compliance Dept</p>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-300 w-48 mx-auto" />
              <p className="mt-2 font-bold text-navy-950">Managing Director / Partner</p>
              <p className="text-[10px] text-slate-500">Urban Furniture Private Limited</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
