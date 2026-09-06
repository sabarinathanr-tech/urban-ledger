import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { RevenueExpenseDataPoint, ChartPeriod } from '../types';
import { formatCurrency } from '../utils';

interface RevenueExpenseChartProps {
  data: RevenueExpenseDataPoint[];
  onPeriodChange?: (period: ChartPeriod) => void;
  activePeriod?: ChartPeriod;
}

const PERIOD_OPTIONS: { value: ChartPeriod; label: string }[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload) return null;

  return (
    <div className="rounded-card border border-surface-border bg-white p-3 shadow-card">
      <p className="mb-1.5 text-caption font-medium text-navy-600">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-caption">
          <div
            className="h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-navy-400">{entry.name}:</span>
          <span className="font-medium text-navy-700">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function RevenueExpenseChart({
  data,
  onPeriodChange,
  activePeriod: controlledPeriod,
}: RevenueExpenseChartProps) {
  const [internalPeriod, setInternalPeriod] = useState<ChartPeriod>('monthly');
  const currentPeriod = controlledPeriod ?? internalPeriod;

  const handleSelectPeriod = (period: ChartPeriod) => {
    setInternalPeriod(period);
    onPeriodChange?.(period);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>Financial performance over the selected period</CardDescription>
          </div>

          {/* Period selector */}
          <div className="flex rounded-md border border-surface-border bg-surface-secondary p-0.5">
            {PERIOD_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelectPeriod(option.value)}
                className={cn(
                  'rounded px-3 py-1 text-caption font-medium transition-colors cursor-pointer',
                  currentPeriod === option.value
                    ? 'bg-white text-navy-700 shadow-sm font-semibold'
                    : 'text-navy-400 hover:text-navy-600'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={4} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: '#7c849a' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#7c849a' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value: number) =>
                  value >= 100000 ? `₹${(value / 100000).toFixed(0)}L` : `₹${(value / 1000).toFixed(0)}K`
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="square"
                iconSize={10}
                wrapperStyle={{ fontSize: '12px', color: '#7c849a' }}
              />
              <Bar dataKey="revenue" name="Revenue" fill="#0D6B58" radius={[3, 3, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#8B6914" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
