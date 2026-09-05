import React from 'react';
import { cn } from '@/lib/utils';

interface PasswordStrengthIndicatorProps {
  password?: string;
  className?: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password = '',
  className,
}) => {
  if (!password) return null;

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const label = strengthLabels[Math.min(score, 3)];

  const getBarColor = (index: number) => {
    if (index >= score) return 'bg-slate-200 dark:bg-slate-800';
    if (score <= 1) return 'bg-red-500';
    if (score === 2) return 'bg-amber-500';
    if (score === 3) return 'bg-brand-600';
    return 'bg-emerald-600'; // Semantic green for strong only
  };

  const getLabelColor = () => {
    if (score <= 1) return 'text-red-600 dark:text-red-400';
    if (score === 2) return 'text-amber-600 dark:text-amber-400';
    if (score === 3) return 'text-brand-700 dark:text-brand-300';
    return 'text-emerald-600 dark:text-emerald-400';
  };

  return (
    <div className={cn('space-y-1 pt-0.5 text-left', className)} aria-live="polite">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-500 dark:text-slate-400">Security strength</span>
        <span className={cn('font-medium', getLabelColor())}>{label}</span>
      </div>

      <div className="grid grid-cols-4 gap-1 h-1 w-full">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={cn('rounded-full transition-colors duration-150', getBarColor(index))}
          />
        ))}
      </div>

      <p className="text-[10px] text-slate-400 dark:text-slate-500">
        8+ characters, letters and numbers.
      </p>
    </div>
  );
};
