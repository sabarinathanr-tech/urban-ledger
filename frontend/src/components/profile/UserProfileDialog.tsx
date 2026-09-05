import {
  User,
  ShieldCheck,
  Briefcase,
  Mail,
  KeyRound,
  CheckCircle2,
  X,
  Building2,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';

import { useState, useEffect } from 'react';

interface UserProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'profile' | 'permissions';
}

export function UserProfileDialog({ isOpen, onClose, initialTab = 'profile' }: UserProfileDialogProps) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'permissions'>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  if (!isOpen || !user) return null;

  const getRoleIcon = () => {
    switch (user.role) {
      case 'ADMIN':
        return <ShieldCheck className="w-5 h-5 text-red-600" />;
      case 'ACCOUNTANT':
        return <Briefcase className="w-5 h-5 text-blue-600" />;
      case 'CONTACT':
        return <User className="w-5 h-5 text-amber-600" />;
      default:
        return <User className="w-5 h-5 text-navy-600" />;
    }
  };

  const getRoleBadgeVariant = (): 'default' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'outline' => {
    switch (user.role) {
      case 'ADMIN':
        return 'danger';
      case 'ACCOUNTANT':
        return 'info';
      case 'CONTACT':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getPermissions = () => {
    switch (user.role) {
      case 'ADMIN':
        return [
          'Full Administrative & System Configuration Access',
          'Create, Modify & Archive Master Data (Contacts, Products, CoA, Journals)',
          'Provision Internal Employees & Assign System Roles (/create-user)',
          'Post Balanced Journal Entries & Full General Ledger Audit',
          'Generate & View Financial Reports (Balance Sheet, P&L, Budgets)',
          'Manage Analytic Accounts & Cost Center Budgets',
        ];
      case 'ACCOUNTANT':
        return [
          'Master Data Management (Contacts, Products, CoA, Journals)',
          'Record & Confirm Sales Orders & Customer Invoices',
          'Record & Confirm Purchase Orders & Vendor Bills',
          'Register Inbound Receipts & Outbound Payments',
          'Access General Ledger & Double-Entry Equality Monitor',
          'Generate P&L, Balance Sheet, and Budget Health Reports',
        ];
      case 'CONTACT':
        return [
          'Customer / Vendor Dedicated Self-Service Portal',
          'View & Search Personal Customer Invoices',
          'View & Search Personal Vendor Bills',
          'Make Online Invoice Payments & Register Settlement Receipts',
          'Restricted from Internal Accounting, GL, Reports, and System Setup',
        ];
      default:
        return [];
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-surface-border overflow-hidden">
        {/* Modal Header */}
        <div className="relative px-6 pt-6 pb-5 bg-gradient-to-r from-navy-900 to-navy-800 text-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-2xl font-bold text-white shadow-inner">
                {(user.fullName || user.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-xs">
                {getRoleIcon()}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{user.fullName || user.name || 'User'}</h2>
                <Badge variant={getRoleBadgeVariant()} className="text-xs font-semibold">
                  {user.role}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-300">
                <Mail size={14} />
                <span>{user.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-surface-border bg-slate-50 px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'border-brand-700 text-brand-700'
                : 'border-transparent text-text-muted hover:text-navy-900'
            }`}
          >
            My Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('permissions')}
            className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'permissions'
                ? 'border-brand-700 text-brand-700'
                : 'border-transparent text-text-muted hover:text-navy-900'
            }`}
          >
            Permissions & Scope
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto text-sm text-navy-800">
          {activeTab === 'profile' && (
            <>
              {/* Identity & Login ID Box */}
              <div className="bg-surface-secondary/70 rounded-lg p-4 border border-surface-border space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-text-muted uppercase tracking-wider">
                  <span>Account Credentials</span>
                  <span className="text-emerald-700 flex items-center gap-1 font-medium">
                    <CheckCircle2 size={13} /> Active Session
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-xs text-text-muted">Login ID / Email</span>
                    <p className="font-semibold text-navy-900 truncate">{user.email}</p>
                  </div>
                  <div>
                    <span className="text-xs text-text-muted">Assigned Role</span>
                    <p className="font-semibold text-navy-900">{user.role}</p>
                  </div>
                  <div>
                    <span className="text-xs text-text-muted">Organization</span>
                    <p className="font-semibold text-navy-900 flex items-center gap-1">
                      <Building2 size={13} className="text-text-muted" /> Urban Furniture Ltd.
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-text-muted">Authentication Mode</span>
                    <p className="font-semibold text-navy-900 flex items-center gap-1">
                      <KeyRound size={13} className="text-text-muted" /> Verified Session
                    </p>
                  </div>
                </div>

                {/* Linked Contact (for Portal users or users associated with a contact) */}
                {(user.role === 'CONTACT' || user.contact) && (
                  <div className="pt-2 border-t border-surface-border/60">
                    <span className="text-xs text-text-muted">Linked Contact Profile</span>
                    <p className="font-semibold text-navy-900">
                      {user.contact?.name || user.fullName || user.name}
                      {user.contact?.type && (
                        <span className="ml-2 text-xs font-normal text-text-muted">
                          ({user.contact.type})
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'permissions' && (
            <>
              {/* Role Description & Permissions */}
              <div>
                <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-navy-900 uppercase tracking-wider">
                  <Shield size={14} className="text-navy-600" />
                  <span>Role Permissions & Scope ({user.role})</span>
                </div>
                <div className="space-y-1.5 bg-slate-50 rounded-lg p-3.5 border border-slate-200/80">
                  {getPermissions().map((perm) => (
                    <div key={perm} className="flex items-start gap-2 text-xs text-navy-700 leading-relaxed">
                      <CheckCircle2 size={13} className="text-emerald-700 shrink-0 mt-0.5" />
                      <span>{perm}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Security Notice */}
          <div className="text-xs text-text-muted bg-amber-50/70 border border-amber-200/60 rounded-lg p-3">
            <span className="font-semibold text-amber-900">Security & Accounting Audit:</span> All operations logged under{' '}
            <span className="font-mono text-amber-950 font-medium">{user.email}</span> are verified and cryptographically recorded in financial audit trails.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-surface-border flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onClose();
              logout();
            }}
            className="text-xs text-red-600 hover:bg-red-50 hover:text-red-700 font-medium cursor-pointer"
          >
            Sign Out
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
