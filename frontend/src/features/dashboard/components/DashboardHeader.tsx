import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { RefreshCw, Calendar, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/app/config';
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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white border border-surface-border shadow-xs p-1 flex items-center justify-center shrink-0">
            <img src="/logo-light.png" alt="Urban Ledger Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-display text-navy-900">Financial Control Center</h1>
            <p className="mt-0.5 text-body text-navy-400">
              Real-time overview of Urban Furniture&apos;s financial position.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Period indicator */}
          <div className="flex items-center gap-1.5 rounded-md border border-surface-border bg-white px-3 py-1.5 text-caption text-navy-600">
            <Calendar size={14} className="text-navy-400" />
            <span>{formatDateRange(period.startDate, period.endDate)}</span>
          </div>

          {/* Edit Balances & Chart of Accounts */}
          <Link to={ROUTES.ACCOUNTING}>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer text-xs gap-1.5 text-navy-700 hover:text-brand-700 border-surface-border"
              title="Edit account balances and chart of accounts"
            >
              <Pencil size={13} />
              <span className="hidden sm:inline">Edit Balances</span>
            </Button>
          </Link>

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
      </p>
    </header>
  );
}
