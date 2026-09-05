import { Link } from 'react-router-dom';
import { AlertTriangle, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/app/config';
import type { ReceivablesSummary } from '../types';
import { formatCurrency } from '../utils';

interface ReceivablesCardProps {
  data: ReceivablesSummary;
}

export function ReceivablesCard({ data }: ReceivablesCardProps) {
  const hasOverdue = data.overdueAmount > 0;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Receivables</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Total outstanding */}
        <div>
          <p className="text-caption text-navy-400">Outstanding</p>
          <p className="text-heading font-bold text-navy-900 tabular-nums">
            {formatCurrency(data.totalOutstanding)}
          </p>
        </div>

        {/* Overdue */}
        <div
          className={cn(
            'flex items-center gap-2 rounded-md px-3 py-2',
            hasOverdue ? 'bg-status-danger-bg' : 'bg-status-success-bg'
          )}
        >
          {hasOverdue && <AlertTriangle size={14} className="text-status-danger" />}
          <div>
            <p
              className={cn(
                'text-body font-medium tabular-nums',
                hasOverdue ? 'text-status-danger' : 'text-status-success'
              )}
            >
              {hasOverdue ? formatCurrency(data.overdueAmount) : 'No'} Overdue
            </p>
            {hasOverdue && data.topOverdueCustomer && (
              <p className="text-caption text-navy-400">
                Top: {data.topOverdueCustomer}
              </p>
            )}
          </div>
        </div>

        {/* Invoice count */}
        <div className="flex items-center gap-2 text-body text-navy-500">
          <FileText size={14} className="text-navy-300" />
          <span>{data.openInvoices} Open Invoices</span>
        </div>
      </CardContent>

      <CardFooter>
        <Link to={ROUTES.INVOICES}>
          <Button variant="ghost" size="sm">
            View Invoices
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
