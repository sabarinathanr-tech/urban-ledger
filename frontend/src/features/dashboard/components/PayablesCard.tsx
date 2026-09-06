import { Link } from 'react-router-dom';
import { AlertTriangle, Receipt } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/app/config';
import type { PayablesSummary } from '../types';
import { formatCurrency } from '../utils';

interface PayablesCardProps {
  data: PayablesSummary;
}

export function PayablesCard({ data }: PayablesCardProps) {
  const hasOverdue = data.overdueAmount > 0;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Payables</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-3.5">
        {/* Total outstanding */}
        <div>
          <p className="text-caption text-navy-400">Outstanding Payables</p>
          <p className="text-heading font-bold text-navy-900 tabular-nums">
            {formatCurrency(data.totalOutstanding)}
          </p>
        </div>

        {/* Overdue */}
        <div
          className={cn(
            'flex items-center gap-2 rounded-md px-3 py-2',
            hasOverdue ? 'bg-status-warning-bg' : 'bg-status-success-bg'
          )}
        >
          {hasOverdue && <AlertTriangle size={14} className="text-status-warning shrink-0" />}
          <div>
            <p
              className={cn(
                'text-body font-medium tabular-nums',
                hasOverdue ? 'text-status-warning' : 'text-status-success'
              )}
            >
              {hasOverdue ? formatCurrency(data.overdueAmount) : 'No'} Overdue
            </p>
            <p className="text-caption text-navy-400">
              Vendor disbursement schedule
            </p>
          </div>
        </div>

        {/* Schedule Breakdown Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs text-navy-600">
            <span className="flex items-center gap-1.5 font-medium">
              <Receipt size={13} className="text-navy-400" />
              <span>{data.openBills} Open Bills</span>
            </span>
            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
              Scheduled
            </span>
          </div>
          <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="bg-blue-500"
              style={{
                width: `${data.totalOutstanding > 0 ? Math.max(10, Math.min(90, Math.round(((data.totalOutstanding - data.overdueAmount) / data.totalOutstanding) * 100))) : 100}%`,
              }}
              title="Within Terms"
            />
            {hasOverdue && (
              <div
                className="bg-amber-500"
                style={{
                  width: `${data.totalOutstanding > 0 ? Math.max(10, Math.min(90, Math.round((data.overdueAmount / data.totalOutstanding) * 100))) : 0}%`,
                }}
                title="Overdue"
              />
            )}
          </div>
          <div className="flex justify-between text-[10px] text-navy-400">
            <span>Terms: {formatCurrency(Math.max(0, data.totalOutstanding - data.overdueAmount))}</span>
            <span>Due Soon: {formatCurrency(data.overdueAmount)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Link to={ROUTES.BILLS}>
          <Button variant="ghost" size="sm">
            View Bills
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
