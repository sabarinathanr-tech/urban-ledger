import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightElement,
      className,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className="space-y-1 text-left">
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </label>

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              {leftIcon}
            </div>
          )}

          <input
            {...props}
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              'w-full h-9 rounded-md text-xs sm:text-sm bg-white dark:bg-[#12151A] border transition-colors',
              'text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500',
              'focus:outline-none focus:ring-1 focus:ring-brand-700 focus:border-brand-700 dark:focus:ring-brand-500 dark:focus:border-brand-500',
              leftIcon ? 'pl-9' : 'pl-3',
              rightElement ? 'pr-9' : 'pr-3',
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

          {rightElement && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {rightElement}
            </div>
          )}
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

InputField.displayName = 'InputField';
