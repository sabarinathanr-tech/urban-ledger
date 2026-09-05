import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Loader2, ArrowLeft } from 'lucide-react';
import { createUserSchema, type CreateUserFormValues } from '../schemas/create-user.schema';
import { createUser } from '../api';
import type { ApiStatusState, UserRole } from '../types';
import { AuthCard } from '../components/AuthCard';
import { AuthHeader } from '../components/AuthHeader';
import { InputField } from '../components/InputField';
import { PasswordField } from '../components/PasswordField';
import { RoleInfoCard } from '../components/RoleInfoCard';
import { AuthBanner } from '../components/AuthBanner';
import { AuthFooter } from '../components/AuthFooter';
import { cn } from '@/lib/utils';

export const CreateUserPage: React.FC = () => {
  const navigate = useNavigate();
  const [apiStatus, setApiStatus] = useState<ApiStatusState>({
    type: 'idle',
    message: '',
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      fullName: '',
      email: '',
      mobileNumber: '',
      role: 'ACCOUNTANT',
      contactType: undefined,
      tempPassword: '',
      confirmTempPassword: '',
      isActive: true,
    },
  });

  const selectedRole = watch('role');
  const selectedContactType = watch('contactType');
  const isActiveAccount = watch('isActive');

  const onSubmit = async (data: CreateUserFormValues) => {
    setApiStatus({ type: 'idle', message: '' });

    try {
      const response = await createUser({
        fullName: data.fullName,
        email: data.email,
        mobileNumber: data.mobileNumber,
        role: data.role,
        contactType: data.contactType,
        tempPassword: data.tempPassword,
        confirmTempPassword: data.confirmTempPassword,
        isActive: data.isActive,
      });

      setApiStatus({
        type: 'success',
        message: 'Internal User Form Validated Successfully',
        details: `${response.message} Provisioned user: ${data.fullName} (${data.email}) as ${data.role}${data.contactType ? ` [${data.contactType}]` : ''}. Status: ${data.isActive ? 'Active' : 'Inactive'}.`,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'User creation failed.';
      setApiStatus({
        type: 'error',
        message: 'Unable to provision user',
        details: errorMessage,
      });
    }
  };

  const handleCancel = () => {
    reset();
    navigate('/login');
  };

  return (
    <AuthCard maxWidth="lg">
      {/* Navigation Breadcrumb */}
      <div className="mb-3 text-left">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-700 dark:text-slate-400 dark:hover:text-brand-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign in</span>
        </Link>
      </div>

      <AuthHeader
        title="Create user"
        subtitle="Create an Urban Ledger user and assign access"
        badge="Internal User Management"
      />

      {/* API Notice / Banner */}
      <AuthBanner
        status={apiStatus}
        onDismiss={() => setApiStatus({ type: 'idle', message: '' })}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* ========================================================================= */}
        {/* SECTION 1: USER DETAILS                                                  */}
        {/* ========================================================================= */}
        <div className="space-y-2.5">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-1 text-left">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              User Details
            </h3>
          </div>

          <InputField
            {...register('fullName')}
            label="Full name"
            placeholder="e.g. Marcus Sterling"
            leftIcon={<User className="w-3.5 h-3.5" />}
            error={errors.fullName?.message}
            disabled={isSubmitting}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InputField
              {...register('email')}
              label="Email address"
              type="email"
              placeholder="user@urbanledger.com"
              leftIcon={<Mail className="w-3.5 h-3.5" />}
              error={errors.email?.message}
              disabled={isSubmitting}
              required
            />

            <InputField
              {...register('mobileNumber')}
              label="Mobile number"
              type="tel"
              placeholder="+1 (555) 019-2834"
              leftIcon={<Phone className="w-3.5 h-3.5" />}
              error={errors.mobileNumber?.message}
              disabled={isSubmitting}
              required
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: ACCESS                                                        */}
        {/* ========================================================================= */}
        <div className="space-y-2.5 pt-1">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-1 text-left">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Access
            </h3>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              User Role <span className="text-red-500">*</span>
            </label>

            {/* Restrained Role Selector & Matrix */}
            <RoleInfoCard
              selectedRole={selectedRole}
              interactive={!isSubmitting}
              onSelectRole={(role: UserRole) => {
                setValue('role', role, { shouldValidate: true });
                if (role !== 'CONTACT') {
                  setValue('contactType', undefined);
                }
              }}
            />

            {errors.role && (
              <p className="text-[11px] text-red-600 dark:text-red-400 font-normal mt-0.5">
                {errors.role.message}
              </p>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 3: CONTACT DETAILS (Conditional for Contact role)                */}
        {/* ========================================================================= */}
        {selectedRole === 'CONTACT' && (
          <div className="space-y-2.5 pt-1">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-1 text-left">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Contact Details
              </h3>
            </div>

            <div className="p-3 rounded-md bg-slate-50 dark:bg-[#1A1E24] border border-slate-200 dark:border-slate-800 space-y-2.5 text-left">
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                Contact users can view their own invoices/bills and make payments.
              </p>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Contact Type <span className="text-red-500">*</span>
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {(['CUSTOMER', 'VENDOR', 'BOTH'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setValue('contactType', type, { shouldValidate: true })}
                      className={cn(
                        'py-1.5 px-3 rounded-md text-xs font-medium border text-center transition-all',
                        selectedContactType === type
                          ? 'bg-brand-700 text-white border-brand-700 shadow-erp-subtle'
                          : 'bg-white dark:bg-[#12151A] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-slate-400'
                      )}
                    >
                      {type === 'BOTH' ? 'Both (Cust/Vend)' : type.charAt(0) + type.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>

                {errors.contactType && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 font-normal">
                    {errors.contactType.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 4: ACCOUNT STATUS                                                */}
        {/* ========================================================================= */}
        <div className="space-y-2.5 pt-1">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-1 text-left">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Account Status
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <PasswordField
              {...register('tempPassword')}
              label="Temporary password"
              placeholder="Min. 8 characters"
              error={errors.tempPassword?.message}
              disabled={isSubmitting}
              required
            />

            <PasswordField
              {...register('confirmTempPassword')}
              label="Confirm temp password"
              placeholder="Re-enter password"
              error={errors.confirmTempPassword?.message}
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Active Account Toggle */}
          <div className="p-2.5 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#16191F] flex items-center justify-between">
            <div className="text-left">
              <span className="text-xs font-medium text-slate-800 dark:text-slate-200 block">
                Active status
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {isActiveAccount
                  ? 'User can sign in immediately with temporary credentials.'
                  : 'Account deactivated.'}
              </span>
            </div>

            <Controller
              name="isActive"
              control={control}
              render={({ field: { value, onChange } }) => (
                <button
                  type="button"
                  role="switch"
                  aria-checked={value}
                  disabled={isSubmitting}
                  onClick={() => onChange(!value)}
                  className={cn(
                    'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out focus:outline-none focus:ring-1 focus:ring-brand-700',
                    value ? 'bg-brand-700' : 'bg-slate-300 dark:bg-slate-700'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-150 ease-in-out',
                      value ? 'translate-x-4' : 'translate-x-0'
                    )}
                  />
                </button>
              )}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="w-full sm:w-auto h-9 px-4 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs sm:text-sm transition-colors text-center focus:outline-none focus:ring-1 focus:ring-slate-300"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto h-9 px-5 flex items-center justify-center gap-2 rounded-md bg-brand-700 hover:bg-brand-800 active:bg-brand-850 text-white font-medium text-xs sm:text-sm transition-colors shadow-erp-subtle focus:outline-none focus:ring-1 focus:ring-brand-700 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Creating user...</span>
              </>
            ) : (
              <span>Create user</span>
            )}
          </button>
        </div>
      </form>

      <AuthFooter />
    </AuthCard>
  );
};
