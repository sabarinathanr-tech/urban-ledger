import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AuthLogo } from '@/features/auth/components/AuthLogo';
import { FileText, Calculator, ShieldCheck } from 'lucide-react';

interface AuthLayoutProps {
  children?: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50/80 dark:bg-[#0B0E14] font-sans text-slate-900 dark:text-slate-100 antialiased selection:bg-brand-100 selection:text-brand-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-stretch justify-center gap-8 lg:gap-10 xl:gap-14 my-auto">
        {/* ========================================================================= */}
        {/* LEFT / BRAND CARD (Identical card styling & height as login/signup)       */}
        {/* ========================================================================= */}
        <div className="w-full max-w-[420px] lg:w-[420px] shrink-0 bg-white dark:bg-[#181B20] border border-slate-200 dark:border-slate-800 rounded-lg shadow-erp-subtle p-6 sm:p-8 flex flex-col justify-between transition-colors">
          {/* Top Header & Identity */}
          <div>
            <Link
              to="/login"
              className="inline-block focus:outline-none focus:ring-2 focus:ring-brand-700/20 rounded-md"
            >
              <AuthLogo size="md" showTagline />
            </Link>

            {/* Tagline & Supporting Copy */}
            <div className="mt-6 lg:mt-7 space-y-2.5">
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

            {/* Subtle Accounting & Furniture Motif (Feature cards inside white card) */}
            <div className="hidden lg:block mt-6 space-y-2.5">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50/90 dark:bg-[#14171D] border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                <div className="p-1.5 rounded bg-white dark:bg-slate-800 text-brand-700 dark:text-brand-400 shrink-0 border border-slate-200/60 dark:border-slate-700 shadow-2xs">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Double-Entry Ledger</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Invoices, bills & journals linked to chart of accounts.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50/90 dark:bg-[#14171D] border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                <div className="p-1.5 rounded bg-white dark:bg-slate-800 text-brand-700 dark:text-brand-400 shrink-0 border border-slate-200/60 dark:border-slate-700 shadow-2xs">
                  <Calculator className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Furniture Costing & BOM</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Real-time analytical budgets and margin tracking.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50/90 dark:bg-[#14171D] border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                <div className="p-1.5 rounded bg-white dark:bg-slate-800 text-brand-700 dark:text-brand-400 shrink-0 border border-slate-200/60 dark:border-slate-700 shadow-2xs">
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
          <div className="mt-auto pt-4 border-t border-slate-200/70 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
            <span>Urban Ledger &bull; Financial ERP</span>
            <span className="font-mono text-[10px]">v1.0</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT / AUTHENTICATION WORKSPACE (Clean, centered, ERP style)            */}
        {/* ========================================================================= */}
        <div className="w-full max-w-[420px] lg:w-[420px] flex flex-col">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};
