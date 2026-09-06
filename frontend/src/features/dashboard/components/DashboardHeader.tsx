import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { RefreshCw, Calendar, Pencil, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/app/config';
import type { DashboardPeriod } from '../types';
import { formatDateRange, formatRelativeTime } from '../utils';

interface DashboardHeaderProps {
  period: DashboardPeriod;
  lastUpdated: string;
  onRefresh: () => void;
  isRefreshing?: boolean;
  onPeriodSelect?: (startDate: string, endDate: string, label: string) => void;
}

const PERIOD_PRESETS = [
  {
    label: 'This Month (Sep 2026)',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
  },
  {
    label: 'Current Financial Year',
    startDate: '2026-04-01',
    endDate: '2027-03-31',
  },
  {
    label: 'Last Month (Aug 2026)',
    startDate: '2026-08-01',
    endDate: '2026-08-31',
  },
  {
    label: 'All Time',
    startDate: '2020-01-01',
    endDate: '2030-12-31',
  },
];

export function DashboardHeader({
  period,
  lastUpdated,
  onRefresh,
  isRefreshing = false,
  onPeriodSelect,
}: DashboardHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [customStart, setCustomStart] = useState(period.startDate);
  const [customEnd, setCustomEnd] = useState(period.endDate);

  const handleSelectPreset = (preset: typeof PERIOD_PRESETS[0]) => {
    if (onPeriodSelect) {
      onPeriodSelect(preset.startDate, preset.endDate, preset.label);
    }
    setIsDropdownOpen(false);
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (onPeriodSelect && customStart && customEnd) {
      onPeriodSelect(customStart, customEnd, `${customStart} - ${customEnd}`);
    }
    setIsDropdownOpen(false);
  };

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
          {/* Interactive Period Filter */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 rounded-md border border-surface-border bg-white px-3 py-1.5 text-caption text-navy-600 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
              title="Filter dashboard by accounting date range"
            >
              <Calendar size={14} className="text-navy-400" />
              <span className="font-medium text-navy-800">{formatDateRange(period.startDate, period.endDate)}</span>
              <ChevronDown size={13} className="text-navy-400 ml-0.5" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-72 rounded-lg bg-white p-3 shadow-lg border border-surface-border z-50 text-xs animate-in fade-in zoom-in-95">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-navy-400 mb-2">
                  Select Reporting Period
                </p>
                <div className="space-y-1">
                  {PERIOD_PRESETS.map((p) => {
                    const isSelected = period.startDate === p.startDate && period.endDate === p.endDate;
                    return (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => handleSelectPreset(p)}
                        className={cn(
                          'w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors',
                          isSelected
                            ? 'bg-brand-50 text-brand-700 font-semibold'
                            : 'text-navy-700 hover:bg-slate-100'
                        )}
                      >
                        <span>{p.label}</span>
                        {isSelected && <Check size={14} className="text-brand-600" />}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-[11px] font-medium text-navy-600 mb-1.5">Custom Date Range</p>
                  <form onSubmit={handleApplyCustom} className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-navy-400 mb-0.5">From</label>
                        <input
                          type="date"
                          value={customStart}
                          onChange={(e) => setCustomStart(e.target.value)}
                          className="w-full rounded border border-slate-200 px-1.5 py-1 text-[11px] text-navy-800 focus:outline-brand-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-navy-400 mb-0.5">To</label>
                        <input
                          type="date"
                          value={customEnd}
                          onChange={(e) => setCustomEnd(e.target.value)}
                          className="w-full rounded border border-slate-200 px-1.5 py-1 text-[11px] text-navy-800 focus:outline-brand-600"
                        />
                      </div>
                    </div>
                    <Button type="submit" variant="primary" size="sm" className="w-full py-1 text-xs">
                      Apply Filter
                    </Button>
                  </form>
                </div>
              </div>
            )}
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
