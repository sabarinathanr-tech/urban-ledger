import type { TransactionStatus, BudgetStatus, HealthCheckStatus } from './types';

/** Format amount in Indian Rupees with lakh/crore grouping */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format amount compactly (e.g., ₹8.4L, ₹1.2Cr) */
export function formatCurrencyCompact(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  return formatCurrency(amount);
}

/** Format a date string to locale display */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString));
}

/** Format a date range for display */
export function formatDateRange(start: string, end: string): string {
  const startDate = new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(start));
  const endDate = new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(end));
  return `${startDate} – ${endDate}`;
}

/** Get Tailwind color classes for transaction status */
export function getTransactionStatusVariant(
  status: TransactionStatus
): 'success' | 'warning' | 'danger' | 'info' | 'default' {
  switch (status) {
    case 'Paid':
    case 'Completed':
      return 'success';
    case 'Posted':
      return 'info';
    case 'Draft':
      return 'default';
    case 'Overdue':
      return 'danger';
    case 'Cancelled':
      return 'default';
    default:
      return 'default';
  }
}

/** Get color class for budget status */
export function getBudgetStatusColor(status: BudgetStatus): string {
  switch (status) {
    case 'on-track':
      return 'bg-status-success';
    case 'warning':
      return 'bg-status-warning';
    case 'over-budget':
      return 'bg-status-danger';
    default:
      return 'bg-brand-500';
  }
}

/** Get text color class for budget status */
export function getBudgetStatusTextColor(status: BudgetStatus): string {
  switch (status) {
    case 'on-track':
      return 'text-status-success';
    case 'warning':
      return 'text-status-warning';
    case 'over-budget':
      return 'text-status-danger';
    default:
      return 'text-brand-500';
  }
}

/** Get label for budget status */
export function getBudgetStatusLabel(status: BudgetStatus): string {
  switch (status) {
    case 'on-track':
      return 'On Track';
    case 'warning':
      return 'Warning';
    case 'over-budget':
      return 'Over Budget';
    default:
      return status;
  }
}

/** Get color class for health check status */
export function getHealthStatusColor(status: HealthCheckStatus): string {
  switch (status) {
    case 'healthy':
      return 'text-status-success';
    case 'warning':
      return 'text-status-warning';
    case 'error':
      return 'text-status-danger';
    default:
      return 'text-navy-400';
  }
}

/** Format relative time (e.g., "2 minutes ago") */
export function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
