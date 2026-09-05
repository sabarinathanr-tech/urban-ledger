import { useState } from 'react';
import { X, AlertTriangle, Info, AlertOctagon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import type { FinancialAlertData } from '../types';

interface FinancialAlertProps {
  alert: FinancialAlertData;
  onDismiss: (id: string) => void;
}

const severityStyles: Record<FinancialAlertData['severity'], string> = {
  info: 'bg-status-info-bg border-status-info/20 text-status-info',
  warning: 'bg-status-warning-bg border-status-warning/20 text-status-warning',
  danger: 'bg-status-danger-bg border-status-danger/20 text-status-danger',
};

const SeverityIcon = ({ severity }: { severity: FinancialAlertData['severity'] }) => {
  switch (severity) {
    case 'info':
      return <Info size={16} />;
    case 'warning':
      return <AlertTriangle size={16} />;
    case 'danger':
      return <AlertOctagon size={16} />;
  }
};

function FinancialAlert({ alert, onDismiss }: FinancialAlertProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-md border px-4 py-2.5',
        severityStyles[alert.severity]
      )}
      role="alert"
    >
      <SeverityIcon severity={alert.severity} />
      <p className="flex-1 text-body">{alert.message}</p>
      {alert.actionLabel && alert.actionHref && (
        <Link
          to={alert.actionHref}
          className="shrink-0 text-caption font-semibold underline underline-offset-2 hover:no-underline"
        >
          {alert.actionLabel}
        </Link>
      )}
      <button
        type="button"
        onClick={() => onDismiss(alert.id)}
        className="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100"
        aria-label="Dismiss alert"
      >
        <X size={14} />
      </button>
    </div>
  );
}

interface FinancialAlertsProps {
  alerts: FinancialAlertData[];
}

export function FinancialAlerts({ alerts: initialAlerts }: FinancialAlertsProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const visibleAlerts = initialAlerts.filter((a) => !dismissedIds.has(a.id));

  if (visibleAlerts.length === 0) return null;

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => new Set(prev).add(id));
  };

  return (
    <section aria-label="Financial alerts" className="space-y-2">
      {visibleAlerts.map((alert) => (
        <FinancialAlert key={alert.id} alert={alert} onDismiss={handleDismiss} />
      ))}
    </section>
  );
}
