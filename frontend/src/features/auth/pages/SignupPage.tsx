import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Loader2 } from 'lucide-react';
import { signupSchema, type SignupFormValues } from '../schemas/signup.schema';
import { signupUser } from '../api';
import type { ApiStatusState } from '../types';
import { AuthCard } from '../components/AuthCard';
import { AuthHeader } from '../components/AuthHeader';
import { InputField } from '../components/InputField';
import { PasswordField } from '../components/PasswordField';
import { PasswordStrengthIndicator } from '../components/PasswordStrengthIndicator';
import { AuthBanner } from '../components/AuthBanner';
import { AuthFooter } from '../components/AuthFooter';

export const SignupPage: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<ApiStatusState>({
    type: 'idle',
    message: '',
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      mobileNumber: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
      role: 'CONTACT',
    },
  });

  const passwordValue = watch('password');

  const onSubmit = async (data: SignupFormValues) => {
    setApiStatus({ type: 'idle', message: '' });

    try {
      const response = await signupUser({
        fullName: data.fullName,
        email: data.email,
        mobileNumber: data.mobileNumber,
        password: data.password,
        confirmPassword: data.confirmPassword,
        termsAccepted: data.termsAccepted,
        role: data.role,
      });

      setApiStatus({
        type: 'notice',
        message: 'Registration Validated Successfully',
        details: `${response.message} Account setup for: ${data.fullName} (${data.email}, ${data.mobileNumber}). Default role: Contact.`,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Registration error.';
      setApiStatus({
        type: 'error',
        message: 'Registration encountered an issue',
        details: errorMessage,
      });
    }
  };

  return (
    <AuthCard maxWidth="md">
      <AuthHeader
        title="Create your account"
        subtitle="Set up your Urban Ledger account"
      />

      {/* Integration Notice */}
      <AuthBanner
        status={apiStatus}
        onDismiss={() => setApiStatus({ type: 'idle', message: '' })}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
        {/* Full Name */}
        <InputField
          {...register('fullName')}
          label="Full name"
          placeholder="e.g. Eleanor Vance"
          autoComplete="name"
          leftIcon={<User className="w-3.5 h-3.5" />}
          error={errors.fullName?.message}
          disabled={isSubmitting}
          required
        />

        {/* Email Address */}
        <InputField
          {...register('email')}
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          leftIcon={<Mail className="w-3.5 h-3.5" />}
          error={errors.email?.message}
          disabled={isSubmitting}
          required
        />

        {/* Mobile Number */}
        <InputField
          {...register('mobileNumber')}
          label="Mobile number"
          type="tel"
          placeholder="+1 (555) 000-1234"
          autoComplete="tel"
          leftIcon={<Phone className="w-3.5 h-3.5" />}
          error={errors.mobileNumber?.message}
          disabled={isSubmitting}
          required
        />

        {/* Password */}
        <div className="space-y-1.5">
          <PasswordField
            {...register('password')}
            label="Password"
            autoComplete="new-password"
            placeholder="Min. 8 characters"
            error={errors.password?.message}
            disabled={isSubmitting}
            required
          />

          {/* Password Strength Indicator */}
          <PasswordStrengthIndicator password={passwordValue} />
        </div>

        {/* Confirm Password */}
        <PasswordField
          {...register('confirmPassword')}
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          disabled={isSubmitting}
          required
        />

        {/* Hidden Role Contract */}
        <input type="hidden" {...register('role')} value="CONTACT" />

        {/* Terms Checkbox */}
        <div className="pt-0.5">
          <label className="flex items-start gap-2 cursor-pointer select-none text-left">
            <input
              {...register('termsAccepted')}
              type="checkbox"
              disabled={isSubmitting}
              className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 text-brand-700 focus:ring-1 focus:ring-brand-700/20 cursor-pointer"
            />
            <span className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
              I agree to the{' '}
              <span className="text-brand-700 dark:text-brand-400 font-medium underline hover:text-brand-800">
                Terms of Service
              </span>{' '}
              and{' '}
              <span className="text-brand-700 dark:text-brand-400 font-medium underline hover:text-brand-800">
                Privacy Policy
              </span>
              .
            </span>
          </label>
          {errors.termsAccepted && (
            <p className="text-[11px] text-red-600 dark:text-red-400 font-normal mt-0.5 text-left">
              {errors.termsAccepted.message}
            </p>
          )}
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
                <span>Creating account...</span>
              </>
            ) : (
              <span>Create account</span>
            )}
          </button>
        </div>
      </form>

      {/* Secondary Navigation */}
      <div className="mt-5 pt-3 border-t border-slate-200/70 dark:border-slate-800 text-center">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-brand-700 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300 transition-colors underline"
          >
            Sign in
          </Link>
        </p>
      </div>

      <AuthFooter />
    </AuthCard>
  );
};
