import React from 'react';
import { cn } from '@/lib/utils';

interface AuthLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  showTagline?: boolean;
  inverted?: boolean;
}

export const AuthLogo: React.FC<AuthLogoProps> = ({
  className,
  size = 'md',
  showText = true,
  showTagline = false,
  inverted = false,
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  };

  return (
    <div className={cn('inline-flex items-center gap-3', className)}>
      {/* Official Urban Ledger Logo Asset */}
      <div
        className={cn(
          'relative flex items-center justify-center rounded-lg overflow-hidden flex-shrink-0 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-erp-subtle p-0.5',
          sizeClasses[size],
          inverted && 'border-white/15 bg-slate-900/60'
        )}
      >
        {inverted ? (
          <img
            src="/logo-dark.png"
            alt="Urban Ledger"
            className="w-full h-full object-contain rounded-md"
          />
        ) : (
          <>
            <img
              src="/logo-light.png"
              alt="Urban Ledger"
              className="w-full h-full object-contain rounded-md dark:hidden"
            />
            <img
              src="/logo-dark.png"
              alt="Urban Ledger"
              className="w-full h-full object-contain rounded-md hidden dark:block"
            />
          </>
        )}
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span
            className={cn(
              'font-bold tracking-tight leading-none',
              textSizes[size],
              inverted
                ? 'text-white'
                : 'text-slate-900 dark:text-slate-100'
            )}
          >
            Urban <span className={inverted ? 'text-wood-300' : 'text-brand-700 dark:text-brand-400'}>Ledger</span>
          </span>
          {showTagline && (
            <span
              className={cn(
                'text-[11px] font-medium tracking-wide mt-1',
                inverted
                  ? 'text-slate-300'
                  : 'text-slate-500 dark:text-slate-400'
              )}
            >
              Furniture business. Clearer finances.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
