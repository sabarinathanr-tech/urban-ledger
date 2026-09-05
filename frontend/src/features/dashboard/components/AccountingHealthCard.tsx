import { Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/app/config';
import type { AccountingHealthCheck, HealthCheckStatus } from '../types';
import { getHealthStatusColor } from '../utils';

interface AccountingHealthCardProps {
  checks: AccountingHealthCheck[];
}

function StatusIcon({ status }: { status: HealthCheckStatus }) {
  switch (status) {
    case 'healthy':
      return <CheckCircle2 size={16} className="text-status-success shrink-0" />;
    case 'warning':
      return <AlertCircle size={16} className="text-status-warning shrink-0" />;
    case 'error':
      return <XCircle size={16} className="text-status-danger shrink-0" />;
  }
}

export function AccountingHealthCard({ checks }: AccountingHealthCardProps) {
  const healthyCount = checks.filter((c) => c.status === 'healthy').length;
  const warningCount = checks.filter((c) => c.status === 'warning').length;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Accounting Health</CardTitle>
          <span className="text-caption text-navy-400">
            {healthyCount}/{checks.length} checks passed
            {warningCount > 0 && (
              <span className="ml-1 text-status-warning">
                ({warningCount} warning{warningCount > 1 ? 's' : ''})
              </span>
            )}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <ul className="space-y-2.5" role="list" aria-label="Accounting health checks">
          {checks.map((check) => (
            <li key={check.id} className="flex items-start gap-2.5">
              <StatusIcon status={check.status} />
              <div className="min-w-0">
                <p className={`text-body font-medium ${getHealthStatusColor(check.status)}`}>
                  {check.label}
                </p>
                <p className="text-caption text-navy-300">{check.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Link to={ROUTES.ACCOUNTING}>
          <Button variant="ghost" size="sm">
            View Accounting
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
