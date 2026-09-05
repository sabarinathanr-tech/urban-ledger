import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Package,
  FileText,
  CreditCard,
  Users,
  Plus,
} from 'lucide-react';
import type { QuickAction } from '../types';

const ICON_MAP: Record<string, React.ReactNode> = {
  ShoppingCart: <ShoppingCart size={16} />,
  Package: <Package size={16} />,
  FileText: <FileText size={16} />,
  CreditCard: <CreditCard size={16} />,
  Users: <Users size={16} />,
};

interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  const navigate = useNavigate();

  return (
    <section aria-label="Quick actions">
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => navigate(action.href)}
            className="inline-flex items-center gap-1.5 rounded-md border border-surface-border bg-white px-3 py-1.5 text-caption font-medium text-navy-600 transition-colors hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2"
          >
            <Plus size={14} className="text-navy-400" />
            {ICON_MAP[action.icon] ?? <Package size={16} />}
            {action.label}
          </button>
        ))}
      </div>
    </section>
  );
}
