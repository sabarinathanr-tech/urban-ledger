import {
  Building2,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Globe,
  Lock,
} from 'lucide-react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { APP_CONFIG } from '@/app/config';
import { Badge } from '@/components/ui/badge';

export function SettingsPage() {
  return (
    <div className="flex-1 flex flex-col bg-surface-secondary min-h-0">
      {/* Top Header & Breadcrumb */}
      <div className="bg-white border-b border-surface-border px-4 sm:px-6 py-3">
        <Breadcrumb section="Configuration" currentPage="Settings" />
        <div className="mt-2 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-navy-900">ERP System Settings</h1>
            <p className="text-xs text-text-muted mt-0.5">
              System configuration, fiscal year parameters, accounting policies, and company profile.
            </p>
          </div>
          <Badge variant="success" className="text-xs gap-1 py-1 px-2.5">
            <CheckCircle2 size={13} /> Production Ready
          </Badge>
        </div>
      </div>

      {/* Main Content Settings Cards */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 max-w-5xl">
        {/* Company Profile Card */}
        <div className="bg-white rounded-lg border border-surface-border shadow-2xs overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-50/75 border-b border-surface-border flex items-center gap-2.5">
            <Building2 size={18} className="text-brand-700" />
            <h2 className="text-sm font-bold text-navy-900">Company Legal Identity</h2>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-text-muted font-medium">Company Legal Name</span>
              <p className="text-sm font-semibold text-navy-900 mt-0.5">{APP_CONFIG.companyName}</p>
            </div>
            <div>
              <span className="text-text-muted font-medium">Business Tagline</span>
              <p className="text-sm text-navy-800 mt-0.5">{APP_CONFIG.tagline}</p>
            </div>
            <div>
              <span className="text-text-muted font-medium">GSTIN / Tax ID</span>
              <p className="text-sm font-mono font-medium text-navy-900 mt-0.5">29AAAAA0000A1Z5</p>
            </div>
            <div>
              <span className="text-text-muted font-medium">Operational Jurisdiction</span>
              <p className="text-sm text-navy-900 mt-0.5">Bengaluru, Karnataka, India</p>
            </div>
          </div>
        </div>

        {/* Currency & Localization */}
        <div className="bg-white rounded-lg border border-surface-border shadow-2xs overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-50/75 border-b border-surface-border flex items-center gap-2.5">
            <Globe size={18} className="text-brand-700" />
            <h2 className="text-sm font-bold text-navy-900">Currency & Localization</h2>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-text-muted font-medium">Base Reporting Currency</span>
              <p className="text-sm font-semibold text-navy-900 mt-0.5">
                {APP_CONFIG.currency} (Indian Rupee - ₹)
              </p>
            </div>
            <div>
              <span className="text-text-muted font-medium">Number & Date Locale</span>
              <p className="text-sm text-navy-900 mt-0.5">{APP_CONFIG.locale} (Lakhs/Crores grouping)</p>
            </div>
            <div>
              <span className="text-text-muted font-medium">System Timezone</span>
              <p className="text-sm text-navy-900 mt-0.5">Asia/Kolkata (IST, UTC+5:30)</p>
            </div>
          </div>
        </div>

        {/* Accounting & Fiscal Rules */}
        <div className="bg-white rounded-lg border border-surface-border shadow-2xs overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-50/75 border-b border-surface-border flex items-center gap-2.5">
            <Calendar size={18} className="text-brand-700" />
            <h2 className="text-sm font-bold text-navy-900">Fiscal Period & Accounting Controls</h2>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-text-muted font-medium">Fiscal Year Calendar</span>
              <p className="text-sm font-semibold text-navy-900 mt-0.5">April 1 – March 31</p>
            </div>
            <div>
              <span className="text-text-muted font-medium">Accounting Basis</span>
              <p className="text-sm text-navy-900 mt-0.5">Double-Entry Accrual Accounting</p>
            </div>
            <div>
              <span className="text-text-muted font-medium">Strict Double-Entry Balancing</span>
              <p className="text-sm text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
                <CheckCircle2 size={13} /> Strictly Enforced (Debits = Credits)
              </p>
            </div>
          </div>
        </div>

        {/* Security & Access Policies */}
        <div className="bg-white rounded-lg border border-surface-border shadow-2xs overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-50/75 border-b border-surface-border flex items-center gap-2.5">
            <ShieldCheck size={18} className="text-brand-700" />
            <h2 className="text-sm font-bold text-navy-900">Security & Access Policies</h2>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-text-muted font-medium">Authentication Protocol</span>
              <p className="text-sm font-medium text-navy-900 mt-0.5 flex items-center gap-1">
                <Lock size={13} className="text-navy-600" /> JWT with HttpOnly Headers
              </p>
            </div>
            <div>
              <span className="text-text-muted font-medium">Access Control Mode</span>
              <p className="text-sm text-navy-900 mt-0.5">Role-Based (ADMIN, ACCOUNTANT, CONTACT)</p>
            </div>
            <div>
              <span className="text-text-muted font-medium">Portal Isolation</span>
              <p className="text-sm text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
                <CheckCircle2 size={13} /> Strict Contact Scoping Enabled
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
