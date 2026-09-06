import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Loader2, CheckCircle2, Copy, Check, ArrowRight } from 'lucide-react';
import { signupSchema, type SignupFormValues } from '../schemas/signup.schema';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/app/config';
import type { ApiStatusState } from '../types';
import { AuthCard } from '../components/AuthCard';
import { AuthHeader } from '../components/AuthHeader';
import { InputField } from '../components/InputField';
import { PasswordField } from '../components/PasswordField';
import { PasswordStrengthIndicator } from '../components/PasswordStrengthIndicator';
import { AuthBanner } from '../components/AuthBanner';
import { AuthFooter } from '../components/AuthFooter';

interface CreatedAccountInfo {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  role: string;
  password?: string;
}

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [apiStatus, setApiStatus] = useState<ApiStatusState>({
    type: 'idle',
    message: '',
  });
  const [createdAccount, setCreatedAccount] = useState<CreatedAccountInfo | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

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
      const createdUser = await signup({
        fullName: data.fullName,
        email: data.email,
        mobileNumber: data.mobileNumber,
        password: data.password,
        confirmPassword: data.confirmPassword,
        termsAccepted: data.termsAccepted,
        role: data.role,
      });

      setCreatedAccount({
        id: createdUser.id,
        name: createdUser.fullName,
        email: createdUser.email,
        mobile: data.mobileNumber,
        role: 'Customer Portal',
        password: data.password,
      });

      setApiStatus({
        type: 'success',
        message: 'Account Created Successfully!',
        details: `Customer account registered in database with ID: ${createdUser.id}`,
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
        title="Create Customer Account"
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

      {/* Account Created Successfully Modal */}
      {createdAccount && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl border border-surface-border max-w-md w-full overflow-hidden text-left">
            <div className="p-6 bg-gradient-to-b from-emerald-50/80 to-white border-b border-emerald-100 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-700" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Account Created Successfully!</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Your customer account has been registered and verified in the database.
                </p>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Customer ID:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-slate-800">{createdAccount.id}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(createdAccount.id);
                        setCopiedField('id');
                        setTimeout(() => setCopiedField(null), 2000);
                      }}
                      className="text-slate-500 hover:text-slate-700 p-0.5 cursor-pointer"
                      title="Copy Customer ID"
                    >
                      {copiedField === 'id' ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Full Name:</span>
                  <span className="font-semibold text-slate-800">{createdAccount.name}</span>
                </div>

                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Login Email:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-brand-700">{createdAccount.email}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(createdAccount.email);
                        setCopiedField('email');
                        setTimeout(() => setCopiedField(null), 2000);
                      }}
                      className="text-slate-500 hover:text-slate-700 p-0.5 cursor-pointer"
                      title="Copy Email"
                    >
                      {copiedField === 'email' ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Portal Access:</span>
                  <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                    Customer Portal (Invoices & Payments)
                  </span>
                </div>

                {createdAccount.password && (
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-slate-500 font-medium">Password:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-slate-800">{createdAccount.password}</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(createdAccount.password || '');
                          setCopiedField('password');
                          setTimeout(() => setCopiedField(null), 2000);
                        }}
                        className="text-slate-500 hover:text-slate-700 p-0.5 cursor-pointer"
                        title="Copy Password"
                      >
                        {copiedField === 'password' ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="px-5 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => {
                  const creds = `Urban Ledger Customer Account:\nName: ${createdAccount.name}\nEmail: ${createdAccount.email}\nPassword: ${createdAccount.password || ''}\nCustomer ID: ${createdAccount.id}`;
                  navigator.clipboard.writeText(creds);
                  setCopiedField('all');
                  setTimeout(() => setCopiedField(null), 2000);
                }}
                className="w-full sm:w-auto px-3 py-1.5 rounded-md border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                {copiedField === 'all' ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                <span>{copiedField === 'all' ? 'Copied!' : 'Copy Credentials'}</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    navigate('/login', {
                      state: { registeredEmail: createdAccount.email },
                    });
                  }}
                  className="w-full sm:w-auto px-3 py-1.5 rounded-md border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium cursor-pointer transition-colors text-center"
                >
                  Sign In with Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate(ROUTES.DASHBOARD, { replace: true });
                  }}
                  className="w-full sm:w-auto px-4 py-1.5 rounded-md bg-brand-700 hover:bg-brand-800 text-white text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                >
                  <span>Enter Customer Portal</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AuthFooter />
    </AuthCard>
  );
};
