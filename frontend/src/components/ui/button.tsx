import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand-700 text-white hover:bg-brand-800 active:bg-brand-850 shadow-xs',
  secondary: 'bg-surface-tertiary text-navy-700 hover:bg-surface-border active:bg-navy-200',
  outline: 'border border-surface-border bg-white text-navy-700 hover:bg-surface-secondary active:bg-surface-tertiary',
  ghost: 'text-navy-600 hover:bg-surface-tertiary active:bg-surface-border',
  danger: 'bg-status-danger text-white hover:bg-red-700 active:bg-red-800',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-caption',
  md: 'h-9 px-4 text-body',
  lg: 'h-10 px-5 text-body',
  icon: 'h-9 w-9',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
