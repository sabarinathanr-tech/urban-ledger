import type { MetricCardData } from '../types';
import { MetricCard } from './MetricCard';

interface FinancialSummaryProps {
  metrics: MetricCardData[];
}

export function FinancialSummary({ metrics }: FinancialSummaryProps) {
  return (
    <section aria-label="Financial KPI summary">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {metrics.map((metric) => (
          <MetricCard key={metric.id} data={metric} />
        ))}
      </div>
    </section>
  );
}
