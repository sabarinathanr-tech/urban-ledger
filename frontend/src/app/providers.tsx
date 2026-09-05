import type { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ERPProvider } from '@/context/ERPContext';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Application-wide providers wrapper.
 * Provides central authentication and reactive ERP state to the route tree.
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <ERPProvider>{children}</ERPProvider>
    </AuthProvider>
  );
}

