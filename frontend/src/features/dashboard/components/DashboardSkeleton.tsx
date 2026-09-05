import { Skeleton } from '@/components/ui/skeleton';

/**
 * Full-page skeleton loader that mirrors the dashboard layout.
 * Shown while dashboard data is being fetched.
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-4 lg:p-6" aria-busy="true" aria-label="Loading dashboard">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-96" />
        <div className="flex items-center gap-2 pt-1">
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>

      {/* Alerts skeleton */}
      <Skeleton className="h-10 w-full" />

      {/* Quick actions skeleton */}
      <div className="flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={`qa-${i}`} className="h-8 w-28" />
        ))}
      </div>

      {/* KPI cards skeleton */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={`metric-${i}`} className="rounded-card border border-surface-border bg-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="rounded-card border border-surface-border bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-72 w-full" />
      </div>

      {/* Budget + Receivables + Payables row skeleton */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={`card-${i}`} className="rounded-card border border-surface-border bg-white p-5 space-y-4">
            <Skeleton className="h-5 w-32" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-2 w-full rounded-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Accounting Health + Transactions row skeleton */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-2 rounded-card border border-surface-border bg-white p-5 space-y-3">
          <Skeleton className="h-5 w-40" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`health-${i}`} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
        <div className="lg:col-span-3 rounded-card border border-surface-border bg-white p-5 space-y-3">
          <Skeleton className="h-5 w-40" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={`txn-${i}`} className="h-10 w-full" />
          ))}
        </div>
      </div>

      {/* Reports skeleton */}
      <div>
        <Skeleton className="h-5 w-24 mb-3" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={`report-${i}`} className="rounded-card border border-surface-border bg-white p-4 flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-md" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
