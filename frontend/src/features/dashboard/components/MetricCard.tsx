import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Landmark,
  ArrowDownLeft,
  ArrowUpRight,
  Minus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MetricCardData, TrendDirection } from '../types';
import { formatCurrency } from '../utils';

const ICON_MAP: Record<string, React.ReactNode> = {
  TrendingUp: <TrendingUp size={20} />,
  TrendingDown: <TrendingDown size={20} />,
  DollarSign: <DollarSign size={20} />,
  Landmark: <Landmark size={20} />,
  ArrowDownLeft: <ArrowDownLeft size={20} />,
  ArrowUpRight: <ArrowUpRight size={20} />,
};

function TrendIndicator({ direction, value, label }: { direction: TrendDirection; value: string; label: string }) {
  const isPositive = direction === 'up';
  const Icon = direction === 'up' ? TrendingUp : direction === 'down' ? TrendingDown : Minus;

  return (
    <div className="flex items-center gap-1 text-caption">
      <Icon
        size={12}
        className={cn(
          isPositive ? 'text-status-success' : 'text-status-danger'
        )}
      />
      <span
        className={cn(
          'font-medium',
          isPositive ? 'text-status-success' : 'text-status-danger'
        )}
      >
        {value}
      </span>
      <span className="text-navy-300">{label}</span>
    </div>
  );
}

interface MetricCardProps {
  data: MetricCardData;
}

export function MetricCard({ data }: MetricCardProps) {
  const navigate = useNavigate();
  const icon = ICON_MAP[data.icon] ?? <DollarSign size={20} />;
  const isClickable = Boolean(data.href);

  return (
    <button
      type="button"
      onClick={() => {
        if (data.href) navigate(data.href);
      }}
      className={cn(
        'flex w-full flex-col gap-2 rounded-card border border-surface-border bg-white p-4 text-left shadow-card transition-all',
        isClickable && 'cursor-pointer hover:shadow-card-hover hover:border-brand-200',
        !isClickable && 'cursor-default'
      )}
      aria-label={`${data.label}: ${formatCurrency(data.amount)}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-caption font-medium text-navy-400">{data.label}</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-50 text-brand-500">
          {icon}
        </div>
      </div>

      <div className="text-heading text-navy-900 font-bold tabular-nums">
        {formatCurrency(data.amount)}
      </div>

      {data.trend && (
        <TrendIndicator
          direction={data.trend.direction}
          value={data.trend.value}
          label={data.trend.label}
        />
      )}
    </button>
  );
}
