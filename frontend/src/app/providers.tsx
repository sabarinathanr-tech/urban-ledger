import type { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Application-wide providers wrapper.
 * Provides central authentication context to the route tree.
 */
export function Providers({ children }: ProvidersProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
