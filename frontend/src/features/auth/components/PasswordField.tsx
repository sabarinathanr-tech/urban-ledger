import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PasswordFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  rightLabelAction?: React.ReactNode;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  (
    {
      label,
      error,
      helperText,
      rightLabelAction,
      className,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || `password-field-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className="space-y-1 text-left">
        <div className="flex items-center justify-between">
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
          </label>
          {rightLabelAction && <div>{rightLabelAction}</div>}
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Lock className="w-3.5 h-3.5" />
          </div>

          <input
            {...props}
            ref={ref}
            id={inputId}
            type={showPassword ? 'text' : 'password'}
            disabled={disabled}
            className={cn(
              'w-full h-9 pl-9 pr-9 rounded-md text-xs sm:text-sm bg-white dark:bg-[#12151A] border transition-colors',
              'text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500',
              'focus:outline-none focus:ring-1 focus:ring-brand-700 focus:border-brand-700 dark:focus:ring-brand-500 dark:focus:border-brand-500',
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500'
                : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600',
              disabled && 'bg-slate-50 text-slate-500 cursor-not-allowed dark:bg-slate-800/40',
              className
            )}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className={cn(
              'absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors',
              'focus:outline-none focus:text-brand-700 dark:focus:text-brand-400',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Eye className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>

        {error ? (
          <p
            id={`${inputId}-error`}
            className="text-[11px] text-red-600 dark:text-red-400 font-normal mt-0.5"
          >
            {error}
          </p>
        ) : helperText ? (
          <p
            id={`${inputId}-helper`}
            className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5"
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

PasswordField.displayName = 'PasswordField';
