import React from 'react';
import {
  List,
  LayoutGrid,
  Plus,
  Search,
  Filter,
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
}: OdooControlPanelProps) {
  return (
    <div className="bg-white border-b border-surface-border sticky top-0 z-20 shadow-2xs">
      <div className="px-4 sm:px-6 py-2.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Left Section: Breadcrumb / Title & New Action */}
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-navy-900 leading-tight">{title}</h1>
              {itemCount !== undefined && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {itemCount}
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
          </div>

          {onNewClick && (
            <Button
              onClick={onNewClick}
              size="sm"
              className="bg-navy-900 hover:bg-navy-800 text-white font-medium text-xs px-3 py-1.5 h-8 gap-1.5 rounded-md shadow-xs transition-all cursor-pointer"
            >
              <Plus size={15} />
              <span>{newButtonLabel}</span>
            </Button>
          )}

          {onRefresh && (
            <button
              onClick={onRefresh}
              title="Refresh"
              className="p-1.5 text-text-muted hover:text-navy-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </div>

        {/* Center & Right Section: Search, Filters, Extra Actions, View Switcher */}
        <div className="flex flex-wrap items-center gap-2.5 md:justify-end flex-1">
          {/* Search Input */}
          {onSearchChange && (
            <div className="relative min-w-[200px] max-w-xs flex-1 sm:flex-initial">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              />
              <input
                type="text"
                value={searchTerm || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-surface-border rounded-md text-navy-900 placeholder:text-text-muted focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-600 focus:border-navy-600 transition-all"
              />
            </div>
          )}

          {/* Filter Pills / Dropdown */}
          {filterOptions && filterOptions.length > 0 && onFilterChange && (
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs">
              <Filter size={12} className="text-text-muted ml-1.5 mr-0.5" />
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onFilterChange(opt.value)}
                  className={cn(
                    'px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer',
                    activeFilter === opt.value
                      ? 'bg-white text-navy-900 shadow-2xs'
                      : 'text-text-muted hover:text-navy-800'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Extra contextual actions */}
          {extraActions}

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
                <List size={15} />
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
                <LayoutGrid size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
