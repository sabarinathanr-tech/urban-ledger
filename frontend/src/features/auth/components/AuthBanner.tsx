import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import type { ApiStatusState } from '../types';
import { cn } from '@/lib/utils';

interface AuthBannerProps {
  status: ApiStatusState;
  onDismiss?: () => void;
  className?: string;
}

export const AuthBanner: React.FC<AuthBannerProps> = ({
  status,
  onDismiss,
  className,
}) => {
  if (status.type === 'idle' || !status.message) return null;

  const styleConfig = {
    error: {
      bg: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900',
      text: 'text-red-900 dark:text-red-300',
      iconColor: 'text-red-600 dark:text-red-400',
      Icon: AlertCircle,
    },
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900',
      text: 'text-emerald-900 dark:text-emerald-300',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      Icon: CheckCircle2,
    },
    notice: {
      bg: 'bg-slate-50 dark:bg-[#1A1E24] border-slate-200 dark:border-slate-800',
      text: 'text-slate-800 dark:text-slate-200',
      iconColor: 'text-brand-700 dark:text-brand-400',
      Icon: Info,
    },
    loading: {
      bg: 'bg-slate-50 dark:bg-[#1A1E24] border-slate-200 dark:border-slate-800',
      text: 'text-slate-800 dark:text-slate-200',
      iconColor: 'text-slate-500',
      Icon: Info,
    },
  }[status.type] || {
    bg: 'bg-slate-50 border-slate-200',
    text: 'text-slate-800',
    iconColor: 'text-slate-500',
    Icon: Info,
  };

  const IconComponent = styleConfig.Icon;

  return (
    <div
      role="alert"
      className={cn(
        'p-3 rounded-md border flex items-start gap-2.5 text-left transition-all mb-4 text-xs',
        styleConfig.bg,
        className
      )}
    >
      <IconComponent className={cn('w-4 h-4 flex-shrink-0 mt-0.5', styleConfig.iconColor)} />
      <div className="flex-1 min-w-0 leading-relaxed">
        <p className={cn('font-medium', styleConfig.text)}>{status.message}</p>
        {status.details && (
          <p className="mt-0.5 text-slate-500 dark:text-slate-400 text-[11px] font-mono">
            {status.details}
          </p>
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 -mr-0.5"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
