import React from 'react';
import { cn } from '@/lib/utils';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  className?: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  subtitle,
  badge,
  className,
}) => {
  return (
    <div className={cn('space-y-1 mb-5 text-left', className)}>
      {badge && (
        <div className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 mb-1">
          {badge}
        </div>
      )}
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        {title}
      </h1>
      {subtitle && (
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
