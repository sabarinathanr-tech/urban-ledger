import { Link } from 'react-router-dom';
import { TrendingUp, Scale, PieChart, ArrowRight } from 'lucide-react';
import type { ReportCardData } from '../types';

const ICON_MAP: Record<string, React.ReactNode> = {
  TrendingUp: <TrendingUp size={20} />,
  Scale: <Scale size={20} />,
  PieChart: <PieChart size={20} />,
};

interface ReportCardProps {
  data: ReportCardData;
}

export function ReportCard({ data }: ReportCardProps) {
  const icon = ICON_MAP[data.icon] ?? <TrendingUp size={20} />;

  return (
    <Link
      to={data.href}
      className="group flex items-start gap-3 rounded-card border border-surface-border bg-white p-4 shadow-card transition-all hover:shadow-card-hover hover:border-brand-200"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-500 group-hover:bg-brand-100">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-body font-semibold text-navy-800 group-hover:text-brand-600">
          {data.title}
        </h4>
        <p className="mt-0.5 text-caption text-navy-400">{data.description}</p>
      </div>
      <ArrowRight
        size={16}
        className="mt-0.5 shrink-0 text-navy-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500"
      />
    </Link>
  );
}

interface ReportsSectionProps {
  reports: ReportCardData[];
}

export function ReportsSection({ reports }: ReportsSectionProps) {
  return (
    <section aria-label="Financial reports">
      <h3 className="mb-3 text-subheading text-navy-800">Reports</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <ReportCard key={report.id} data={report} />
        ))}
      </div>
    </section>
  );
}
