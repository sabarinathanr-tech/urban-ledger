import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  indicatorClassName?: string;
}

export function Progress({ value, max = 100, className, indicatorClassName }: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-surface-tertiary', className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className={cn('h-full rounded-full transition-all duration-300', indicatorClassName || 'bg-brand-500')}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
