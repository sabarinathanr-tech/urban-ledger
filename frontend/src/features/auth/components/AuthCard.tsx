import React from 'react';
import { cn } from '@/lib/utils';

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'md' | 'lg' | 'xl';
}

export const AuthCard: React.FC<AuthCardProps> = ({
  children,
  className,
  maxWidth = 'md',
}) => {
  const widthClasses = {
    md: 'max-w-[420px]',
    lg: 'max-w-[560px]',
    xl: 'max-w-[640px]',
  };

  return (
    <div
      className={cn(
        'w-full h-full mx-auto bg-white dark:bg-[#181B20]',
        'border border-slate-200 dark:border-slate-800',
        'rounded-lg shadow-erp-subtle',
        'p-6 sm:p-8 flex flex-col justify-between transition-colors',
        widthClasses[maxWidth],
        className
      )}
    >
      {children}
    </div>
  );
};
