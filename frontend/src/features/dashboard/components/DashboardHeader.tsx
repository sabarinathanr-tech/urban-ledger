import { cn } from '@/lib/utils';
import { RefreshCw, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DashboardPeriod } from '../types';
import { formatDateRange, formatRelativeTime } from '../utils';

interface DashboardHeaderProps {
  period: DashboardPeriod;
  lastUpdated: string;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function DashboardHeader({
  period,
  lastUpdated,
  onRefresh,
  isRefreshing = false,
}: DashboardHeaderProps) {
  return (
    <header className="space-y-1">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-display text-navy-900">Financial Control Center</h1>
          <p className="mt-1 text-body text-navy-400">
            Real-time overview of Urban Furniture&apos;s financial position.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Period indicator */}
          <div className="flex items-center gap-1.5 rounded-md border border-surface-border bg-white px-3 py-1.5 text-caption text-navy-600">
            <Calendar size={14} className="text-navy-400" />
            <span>{formatDateRange(period.startDate, period.endDate)}</span>
          </div>

          {/* Refresh */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Refresh dashboard data"
          >
            <RefreshCw
              size={14}
              className={cn(isRefreshing && 'animate-spin')}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Last updated */}
      <p className="text-caption text-navy-300">
        Last updated: {formatRelativeTime(lastUpdated)}
        <span className="ml-1 text-navy-200">(demo data)</span>
      </p>
    </header>
  );
}
