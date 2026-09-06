import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/app/config';
import type { BudgetHealthItem } from '../types';
import {
  formatCurrency,
  getBudgetStatusColor,
  getBudgetStatusLabel,
  getBudgetStatusTextColor,
} from '../utils';

interface BudgetHealthCardProps {
  budgets: BudgetHealthItem[];
}

function getStatusBadgeVariant(status: BudgetHealthItem['status']): 'success' | 'warning' | 'danger' {
  switch (status) {
    case 'on-track':
      return 'success';
    case 'warning':
      return 'warning';
    case 'over-budget':
      return 'danger';
  }
}

export function BudgetHealthCard({ budgets }: BudgetHealthCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Budget Health</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-3.5">
        {budgets.slice(0, 3).map((budget) => (
          <div key={budget.id} className="space-y-1.5 pb-2 border-b border-slate-100 last:border-0 last:pb-0">
            <div className="flex items-center justify-between">
              <span className="text-caption font-semibold text-navy-800 line-clamp-1">{budget.name}</span>
              <Badge variant={getStatusBadgeVariant(budget.status)} className="text-[10px] py-0 px-1.5">
                {getBudgetStatusLabel(budget.status)}
              </Badge>
            </div>

            <Progress
              value={Math.min(100, budget.utilization)}
              indicatorClassName={getBudgetStatusColor(budget.status)}
              className="h-1.5"
            />

            <div className="flex items-center justify-between text-[11px] text-navy-400">
              <span>
                {formatCurrency(budget.actual)}{' '}
                <span className="text-navy-300">of {formatCurrency(budget.planned)}</span>
              </span>
              <span className={cn('font-mono font-medium', getBudgetStatusTextColor(budget.status))}>
                {budget.utilization}%
              </span>
            </div>
          </div>
        ))}
        {budgets.length > 3 && (
          <div className="text-center pt-0.5">
            <span className="text-[11px] text-text-muted">+{budgets.length - 3} more departmental budgets</span>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Link to={ROUTES.REPORT_BUDGET}>
          <Button variant="ghost" size="sm">
            View Budget Report
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
