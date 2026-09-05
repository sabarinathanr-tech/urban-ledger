import { useNavigate, Link } from 'react-router-dom';
import { Building2, ArrowLeft, LayoutDashboard, FileText, Receipt, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/app/config';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-secondary px-4 py-12">
      <div className="w-full max-w-md text-center">
        {/* Brand mark */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-700 text-white shadow-md">
          <Building2 size={28} />
        </div>

        <span className="font-mono text-sm font-bold text-brand-600">ERROR 404</span>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-navy-900">
          Document or Page Not Found
        </h1>
        <p className="mt-2 text-xs text-navy-500 leading-relaxed">
          The requested ledger entry, transaction document, or module could not be found in Urban Ledger.
          It may have been moved, archived, or you may have entered an incorrect URL reference.
        </p>

        {/* Primary Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5"
          >
            <ArrowLeft size={14} />
            <span>Go Back</span>
          </Button>

          <Link to={ROUTES.DASHBOARD}>
            <Button variant="primary" size="sm" className="flex items-center gap-1.5 bg-brand-700 hover:bg-brand-800">
              <LayoutDashboard size={14} />
              <span>ERP Dashboard</span>
            </Button>
          </Link>
        </div>

        {/* Quick Navigation Links */}
        <div className="mt-8 border-t border-surface-border pt-6">
          <span className="text-[11px] font-medium uppercase tracking-wider text-navy-400">
            Quick ERP Modules
          </span>
          <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs">
            <Link
              to={ROUTES.INVOICES}
              className="flex items-center gap-1 rounded-md border border-surface-border bg-white px-2.5 py-1 text-navy-600 hover:bg-surface-secondary"
            >
              <FileText size={12} className="text-brand-600" />
              <span>Invoices</span>
            </Link>
            <Link
              to={ROUTES.BILLS}
              className="flex items-center gap-1 rounded-md border border-surface-border bg-white px-2.5 py-1 text-navy-600 hover:bg-surface-secondary"
            >
              <Receipt size={12} className="text-brand-600" />
              <span>Bills</span>
            </Link>
            <Link
              to={ROUTES.ACCOUNTING}
              className="flex items-center gap-1 rounded-md border border-surface-border bg-white px-2.5 py-1 text-navy-600 hover:bg-surface-secondary"
            >
              <BookOpen size={12} className="text-brand-600" />
              <span>General Ledger</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
