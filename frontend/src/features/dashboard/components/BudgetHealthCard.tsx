import { Link } from 'react-router-dom';
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

      <CardContent className="flex-1 space-y-4">
        {budgets.map((budget) => (
          <div key={budget.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-body font-medium text-navy-700">{budget.name}</span>
              <Badge variant={getStatusBadgeVariant(budget.status)}>
                {getBudgetStatusLabel(budget.status)}
              </Badge>
            </div>

            <Progress
              value={budget.utilization}
              indicatorClassName={getBudgetStatusColor(budget.status)}
            />

            <div className="flex items-center justify-between text-caption text-navy-400">
              <span>
                {formatCurrency(budget.actual)}{' '}
                <span className="text-navy-300">of {formatCurrency(budget.planned)}</span>
              </span>
              <span className={getBudgetStatusTextColor(budget.status)}>
                {budget.utilization}%
              </span>
            </div>
          </div>
        ))}
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
