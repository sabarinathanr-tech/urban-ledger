import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, Loader2 } from 'lucide-react';
import { loginSchema, type LoginFormValues } from '../schemas/login.schema';
import { loginUser } from '../api';
import type { ApiStatusState } from '../types';
import { AuthCard } from '../components/AuthCard';
import { AuthHeader } from '../components/AuthHeader';
import { InputField } from '../components/InputField';
import { PasswordField } from '../components/PasswordField';
import { AuthDivider } from '../components/AuthDivider';
import { AuthBanner } from '../components/AuthBanner';
import { AuthFooter } from '../components/AuthFooter';

export const LoginPage: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<ApiStatusState>({
    type: 'idle',
    message: '',
  });

  const {
    register,
    handleSubmit,
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
      const response = await loginUser({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      // API integration boundary notice
      setApiStatus({
        type: 'notice',
        message: 'Frontend Validation Succeeded',
        details: `${response.message} Credentials verified for: ${data.email}. Remember me: ${data.rememberMe ? 'Yes' : 'No'}.`,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication service error.';
      setApiStatus({
        type: 'error',
        message: 'Authentication failed',
        details: errorMessage,
      });
    }
  };

  return (
    <AuthCard maxWidth="md">
      <AuthHeader
        title="Welcome back"
        subtitle="Sign in to continue to Urban Ledger"
      />

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
          placeholder="you@example.com"
          leftIcon={<Mail className="w-3.5 h-3.5" />}
          error={errors.email?.message}
          disabled={isSubmitting}
          required
        />

        {/* Password */}
        <PasswordField
          {...register('password')}
          label="Password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          disabled={isSubmitting}
          required
          rightLabelAction={
            <button
              type="button"
              onClick={() =>
                setApiStatus({
                  type: 'notice',
                  message: 'Password Reset',
                  details: 'Password recovery will connect with the enterprise mail service.',
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
              disabled={isSubmitting}
              className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 text-brand-700 focus:ring-1 focus:ring-brand-700/20 cursor-pointer"
            />
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Remember me
            </span>
          </label>
        </div>

        {/* Primary Action Button: Restrained Plum */}
        <div className="pt-1.5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-9 sm:h-10 flex items-center justify-center gap-2 rounded-md bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white font-medium text-xs sm:text-sm transition-colors shadow-erp-subtle focus:outline-none focus:ring-1 focus:ring-brand-700 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
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
            <span className="underline font-medium">Provision user</span>
          </Link>
        </div>
      </div>

      <AuthFooter />
    </AuthCard>
  );
};
