import React from 'react';
import { cn } from '@/lib/utils';

interface AuthFooterProps {
  className?: string;
}

export const AuthFooter: React.FC<AuthFooterProps> = ({ className }) => {
  return (
    <footer
      className={cn(
        'mt-6 pt-4 border-t border-slate-200/70 dark:border-slate-800 text-center text-[11px] text-slate-500 dark:text-slate-400 space-y-1',
        className
      )}
    >
      <div className="flex items-center justify-center gap-3 font-normal text-slate-500 dark:text-slate-400">
        <span className="hover:text-brand-700 dark:hover:text-brand-300 cursor-pointer transition-colors">
          Privacy
        </span>
        <span className="text-slate-300 dark:text-slate-700">&bull;</span>
        <span className="hover:text-brand-700 dark:hover:text-brand-300 cursor-pointer transition-colors">
          Terms
        </span>
        <span className="text-slate-300 dark:text-slate-700">&bull;</span>
        <span className="hover:text-brand-700 dark:hover:text-brand-300 cursor-pointer transition-colors">
          Security
        </span>
      </div>
      <p className="text-[10px] text-slate-400 dark:text-slate-500">
        Urban Ledger &copy; {new Date().getFullYear()} &bull; Enterprise Accounting ERP
      </p>
    </footer>
  );
};
