import type { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Application-wide providers wrapper.
 * Add context providers here (auth, theme, query client, etc.)
 */
export function Providers({ children }: ProvidersProps) {
  return <>{children}</>;
}
