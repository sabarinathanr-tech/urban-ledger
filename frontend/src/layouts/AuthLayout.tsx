import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AuthLogo } from '@/features/auth/components/AuthLogo';
import { FileText, Calculator, ShieldCheck } from 'lucide-react';

interface AuthLayoutProps {
  children?: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F9FAFB] dark:bg-[#0F1216] font-sans text-slate-900 dark:text-slate-100 antialiased selection:bg-brand-100 selection:text-brand-900">
      {/* ========================================================================= */}
      {/* LEFT / BRAND AREA (Neutral, quiet, professional enterprise workspace)   */}
      {/* ========================================================================= */}
      <div className="lg:w-[420px] xl:w-[460px] bg-slate-50/80 dark:bg-[#14171D] border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
        {/* Top Header & Identity */}
        <div>
          <Link
            to="/login"
            className="inline-block focus:outline-none focus:ring-2 focus:ring-brand-700/20 rounded-md"
          >
            <AuthLogo size="md" showTagline />
          </Link>

          {/* Tagline & Supporting Copy */}
          <div className="mt-8 lg:mt-12 space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Furniture business.{' '}
              <span className="text-brand-700 dark:text-brand-400 font-semibold">
                Clearer finances.
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              Accounting-centric ERP connecting sales orders, purchase bills, double-entry journals, and cash flow reports in one unified ledger.
            </p>
          </div>

          {/* Subtle Accounting & Furniture Motif (Minimal Odoo-style feature pills) */}
          <div className="hidden lg:block mt-8 space-y-2.5">
            <div className="flex items-center gap-3 p-2.5 rounded-md bg-white dark:bg-[#181B20] border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 shadow-erp-subtle">
              <div className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 text-brand-700 dark:text-brand-400">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Double-Entry Ledger</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Invoices, bills & journals linked to chart of accounts.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-md bg-white dark:bg-[#181B20] border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 shadow-erp-subtle">
              <div className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 text-brand-700 dark:text-brand-400">
                <Calculator className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Furniture Costing & BOM</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Real-time analytical budgets and margin tracking.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-md bg-white dark:bg-[#181B20] border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 shadow-erp-subtle">
              <div className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 text-brand-700 dark:text-brand-400">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Controlled Role Segregation</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Dedicated Admin, Accountant & Contact portals.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="hidden lg:flex items-center justify-between pt-6 border-t border-slate-200/70 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500">
          <span>Urban Ledger &bull; Financial ERP</span>
          <span className="font-mono text-[10px]">v1.0</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT / AUTHENTICATION WORKSPACE (Clean, centered, ERP style)            */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 md:p-10 lg:p-12 overflow-y-auto">
        <div className="w-full flex justify-center py-4">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};
