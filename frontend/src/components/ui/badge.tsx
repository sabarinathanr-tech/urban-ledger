import type React from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-surface-tertiary text-navy-600',
  secondary: 'bg-slate-100 text-slate-700',
  success: 'bg-status-success-bg text-status-success',
  warning: 'bg-status-warning-bg text-status-warning',
  danger: 'bg-status-danger-bg text-status-danger',
  info: 'bg-status-info-bg text-status-info',
  outline: 'border border-surface-border text-navy-500',
};

export function Badge({ variant = 'default', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
