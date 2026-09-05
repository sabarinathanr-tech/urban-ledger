import React from 'react';
import { ShieldCheck, FileSpreadsheet, UserCircle2, Check } from 'lucide-react';
import type { UserRole } from '../types';
import { cn } from '@/lib/utils';

interface RoleInfoCardProps {
  selectedRole?: UserRole;
  className?: string;
  onSelectRole?: (role: UserRole) => void;
  interactive?: boolean;
}

interface RoleDefinition {
  key: UserRole;
  title: string;
  badge: string;
  summary: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    key: 'ADMIN',
    title: 'Admin / Business Owner',
    badge: 'Full Access',
    summary: 'Manage master data, record transactions and view reports.',
    icon: ShieldCheck,
  },
  {
    key: 'ACCOUNTANT',
    title: 'Invoicing User / Accountant',
    badge: 'Operations',
    summary: 'Create master data, record transactions and view reports.',
    icon: FileSpreadsheet,
  },
  {
    key: 'CONTACT',
    title: 'Contact',
    badge: 'Portal Access',
    summary: 'View own invoices/bills and make payments.',
    icon: UserCircle2,
  },
];

export const RoleInfoCard: React.FC<RoleInfoCardProps> = ({
  selectedRole,
  className,
  onSelectRole,
  interactive = false,
}) => {
  return (
    <div className={cn('space-y-2 text-left', className)}>
      <div className="grid gap-2">
        {ROLE_DEFINITIONS.map((roleDef) => {
          const Icon = roleDef.icon;
          const isSelected = selectedRole === roleDef.key;

          return (
            <div
              key={roleDef.key}
              onClick={() => interactive && onSelectRole?.(roleDef.key)}
              role={interactive ? 'button' : undefined}
              tabIndex={interactive ? 0 : undefined}
              aria-pressed={isSelected}
              onKeyDown={(e) => {
                if (interactive && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onSelectRole?.(roleDef.key);
                }
              }}
              className={cn(
                'p-2.5 rounded-md border transition-all text-left flex items-start gap-2.5',
                isSelected
                  ? 'bg-brand-50/50 border-brand-700 dark:bg-brand-950/20 dark:border-brand-500 shadow-erp-subtle'
                  : 'bg-white border-slate-200 dark:bg-[#181B20] dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
                interactive && 'cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-700'
              )}
            >
              <div
                className={cn(
                  'p-1.5 rounded flex-shrink-0 mt-0.5',
                  isSelected
                    ? 'bg-brand-700 text-white dark:bg-brand-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1.5">
                  <h4
                    className={cn(
                      'text-xs font-semibold truncate',
                      isSelected
                        ? 'text-slate-900 dark:text-slate-100'
                        : 'text-slate-800 dark:text-slate-200'
                    )}
                  >
                    {roleDef.title}
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'text-[10px] font-medium px-1.5 py-0.2 rounded border',
                        isSelected
                          ? 'bg-brand-100 text-brand-900 border-brand-200 dark:bg-brand-900/50 dark:text-brand-200 dark:border-brand-800'
                          : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                      )}
                    >
                      {roleDef.badge}
                    </span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-brand-700 dark:text-brand-400" />
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {roleDef.summary}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
