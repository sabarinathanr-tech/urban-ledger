import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Loader2, Sparkles, Shield, UserCheck, Briefcase } from 'lucide-react';
import { loginSchema, type LoginFormValues } from '../schemas/login.schema';
import type { ApiStatusState } from '../types';
import { AuthCard } from '../components/AuthCard';
import { AuthHeader } from '../components/AuthHeader';
import { InputField } from '../components/InputField';
import { PasswordField } from '../components/PasswordField';
import { AuthDivider } from '../components/AuthDivider';
import { AuthBanner } from '../components/AuthBanner';
import { AuthFooter } from '../components/AuthFooter';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/app/config';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginAsDemo } = useAuth();
  const [apiStatus, setApiStatus] = useState<ApiStatusState>({
    type: 'idle',
    message: '',
  });
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  // Return to intended page or dashboard
  const destination = (location.state as { from?: { pathname?: string } })?.from?.pathname || ROUTES.DASHBOARD;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setApiStatus({ type: 'idle', message: '' });

    try {
      await login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      navigate(destination, { replace: true });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid email or password.';
      setApiStatus({
        type: 'error',
        message: 'Authentication failed',
        details: errorMessage,
      });
    }
  };

  const handleQuickDemo = async (role: 'ADMIN' | 'ACCOUNTANT' | 'CUSTOMER' | 'VENDOR', email: string) => {
    setDemoLoading(role);
    setApiStatus({ type: 'idle', message: '' });
    setValue('email', email);
    setValue('password', 'Password@123');

    try {
      await loginAsDemo(role);
      navigate(destination, { replace: true });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Demo sign in failed.';
      setApiStatus({
        type: 'error',
        message: 'Quick demo login failed',
        details: errorMessage,
      });
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <AuthCard maxWidth="md">
      <AuthHeader
        title="Sign in to Urban Ledger"
        subtitle="Furniture business. Clearer finances."
      />

      {/* Quick Demo Evaluation Panel */}
      <div className="mb-4 rounded-md border border-brand-100 bg-brand-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-800 dark:text-brand-300">
          <Sparkles className="h-3.5 w-3.5 text-brand-600" />
          <span>Quick Demo Evaluation:</span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          <button
            type="button"
            disabled={isSubmitting || !!demoLoading}
            onClick={() => handleQuickDemo('ADMIN', 'admin@urbanledger.com')}
            className="flex items-center justify-center gap-1 rounded border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm transition hover:border-brand-300 hover:bg-brand-50/30 hover:text-brand-700 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            title="Full ERP Administrator access"
          >
            <Shield className="h-3 w-3 text-brand-600" />
            <span>Admin</span>
          </button>
          <button
            type="button"
            disabled={isSubmitting || !!demoLoading}
            onClick={() => handleQuickDemo('ACCOUNTANT', 'accountant@urbanledger.com')}
            className="flex items-center justify-center gap-1 rounded border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm transition hover:border-brand-300 hover:bg-brand-50/30 hover:text-brand-700 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            title="Finance, Journals & Ledger access"
          >
            <Briefcase className="h-3 w-3 text-brand-600" />
            <span>Accountant</span>
          </button>
          <button
            type="button"
            disabled={isSubmitting || !!demoLoading}
            onClick={() => handleQuickDemo('CUSTOMER', 'nimesh@gmail.com')}
            className="flex items-center justify-center gap-1 rounded border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm transition hover:border-brand-300 hover:bg-brand-50/30 hover:text-brand-700 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            title="Nimesh Pathak (Customer Portal)"
          >
            <UserCheck className="h-3 w-3 text-brand-600" />
            <span>Customer</span>
          </button>
          <button
            type="button"
            disabled={isSubmitting || !!demoLoading}
            onClick={() => handleQuickDemo('VENDOR', 'azure@furniture.com')}
            className="flex items-center justify-center gap-1 rounded border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm transition hover:border-brand-300 hover:bg-brand-50/30 hover:text-brand-700 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            title="Azure Furniture (Vendor Bills & Payments)"
          >
            <Briefcase className="h-3 w-3 text-brand-600" />
            <span>Vendor</span>
          </button>
        </div>
      </div>

      {/* Integration Notice / Error Banner */}
      <AuthBanner
        status={apiStatus}
        onDismiss={() => setApiStatus({ type: 'idle', message: '' })}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
        {/* Email Address */}
        <InputField
          {...register('email')}
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="admin@urbanledger.com"
          leftIcon={<Mail className="w-3.5 h-3.5" />}
          error={errors.email?.message}
          disabled={isSubmitting || !!demoLoading}
          required
        />

        {/* Password */}
        <PasswordField
          {...register('password')}
          label="Password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          disabled={isSubmitting || !!demoLoading}
          required
          rightLabelAction={
            <button
              type="button"
              onClick={() =>
                setApiStatus({
                  type: 'notice',
                  message: 'Demo Credentials',
                  details: 'For quick evaluation, use any of the 4 demo accounts above or enter admin@urbanledger.com / Admin@12345.',
                })
              }
              className="text-xs text-brand-700 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300 font-medium focus:outline-none focus:underline"
            >
              Forgot password?
            </button>
          }
        />

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              {...register('rememberMe')}
              type="checkbox"
              disabled={isSubmitting || !!demoLoading}
              className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 text-brand-700 focus:ring-1 focus:ring-brand-700/20 cursor-pointer"
            />
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Remember me
            </span>
          </label>
        </div>

        {/* Primary Action Button */}
        <div className="pt-1.5">
          <button
            type="submit"
            disabled={isSubmitting || !!demoLoading}
            className="w-full h-9 sm:h-10 flex items-center justify-center gap-2 rounded-md bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white font-medium text-xs sm:text-sm transition-colors shadow-erp-subtle focus:outline-none focus:ring-1 focus:ring-brand-700 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting || demoLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign in</span>
            )}
          </button>
        </div>
      </form>

      {/* Divider */}
      <AuthDivider label="or" className="my-4" />

      {/* Secondary Option: Create Account */}
      <div className="space-y-3">
        <Link
          to="/signup"
          className="w-full h-9 sm:h-10 flex items-center justify-center rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 font-medium text-xs sm:text-sm transition-colors text-center focus:outline-none focus:ring-1 focus:ring-slate-300"
        >
          Create an account
        </Link>

        {/* Internal Provisioning Link */}
        <div className="text-center pt-1">
          <Link
            to="/create-user"
            className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-brand-700 dark:text-slate-400 dark:hover:text-brand-300 transition-colors"
          >
            <span>Internal administrator?</span>
            <span className="underline font-medium">Provision internal user</span>
          </Link>
        </div>
      </div>

      <AuthFooter />
    </AuthCard>
  );
};
