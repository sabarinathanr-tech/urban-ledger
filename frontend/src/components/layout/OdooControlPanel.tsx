import React from 'react';
import {
  List,
  LayoutGrid,
  Plus,
  Search,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ViewMode = 'list' | 'kanban';

interface FilterOption {
  label: string;
  value: string;
}

interface OdooControlPanelProps {
  title: string;
  subtitle?: string;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  onNewClick?: () => void;
  newButtonLabel?: string;
  filterOptions?: FilterOption[];
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  extraActions?: React.ReactNode;
  itemCount?: number;
  onRefresh?: () => void;
  hideBreadcrumb?: boolean;
  breadcrumbSection?: string;
  breadcrumbPage?: string;
}

export function OdooControlPanel({
  title,
  subtitle,
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  viewMode = 'list',
  onViewModeChange,
  onNewClick,
  newButtonLabel = 'New',
  filterOptions,
  activeFilter,
  onFilterChange,
  extraActions,
  itemCount,
  onRefresh,
  hideBreadcrumb: _hideBreadcrumb = false,
  breadcrumbSection: _breadcrumbSection,
  breadcrumbPage: _breadcrumbPage,
}: OdooControlPanelProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-4">
      {/* Top Header Row: Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-navy-950 tracking-tight">{title}</h1>
            {itemCount !== undefined && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {itemCount}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-text-muted mt-1">{subtitle}</p>}
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          {onNewClick && (
            <Button
              onClick={onNewClick}
              size="sm"
              className="bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white font-medium text-xs px-3.5 py-1.5 h-8 gap-1.5 rounded-md shadow-xs transition-all cursor-pointer"
            >
              <Plus size={15} />
              <span>{newButtonLabel}</span>
            </Button>
          )}

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              title="Refresh"
              className="p-1.5 text-text-muted hover:text-navy-900 hover:bg-white rounded-md border border-surface-border bg-white shadow-2xs transition-colors cursor-pointer"
            >
              <RefreshCw size={14} />
            </button>
          )}

          {extraActions}
        </div>
      </div>

      {/* Controls Card: Search & Filters (exact match to Users under Configuration) */}
      {(onSearchChange || (filterOptions && filterOptions.length > 0) || onViewModeChange) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3 rounded-lg border border-surface-border shadow-2xs">
          {/* Search Input */}
          {onSearchChange && (
            <div className="relative flex-1 max-w-sm">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              />
              <input
                type="text"
                value={searchTerm || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-surface-border rounded-md text-navy-900 placeholder:text-text-muted focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-700 transition-all"
              />
            </div>
          )}

          {/* Filter Pills & View Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            {filterOptions && filterOptions.length > 0 && onFilterChange && (
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs">
                {filterOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onFilterChange(opt.value)}
                    className={cn(
                      'px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer',
                      activeFilter === opt.value
                        ? 'bg-white text-navy-900 shadow-2xs font-semibold'
                        : 'text-text-muted hover:text-navy-900'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* Odoo View Mode Switcher: List vs Kanban */}
            {onViewModeChange && (
              <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200">
                <button
                  type="button"
                  onClick={() => onViewModeChange('list')}
                  title="List View"
                  className={cn(
                    'p-1.5 rounded transition-all cursor-pointer',
                    viewMode === 'list'
                      ? 'bg-white text-navy-900 shadow-2xs font-semibold'
                      : 'text-text-muted hover:text-navy-900'
                  )}
                >
                  <List size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => onViewModeChange('kanban')}
                  title="Kanban View"
                  className={cn(
                    'p-1.5 rounded transition-all cursor-pointer',
                    viewMode === 'kanban'
                      ? 'bg-white text-navy-900 shadow-2xs font-semibold'
                      : 'text-text-muted hover:text-navy-900'
                  )}
                >
                  <LayoutGrid size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { OdooControlPanel as ERPControlPanel };
