import { z } from 'zod';

export const createUserSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, 'Full name is required')
      .min(2, 'Full name must be at least 2 characters'),
    email: z
      .string()
      .trim()
      .min(1, 'Email address is required')
      .email('Please enter a valid email address'),
    mobileNumber: z
      .string()
      .trim()
      .min(1, 'Mobile number is required')
      .regex(
        /^[0-9+\-\s()]{7,18}$/,
        'Please enter a valid mobile number (e.g., +1 234 567 8900)'
      ),
    role: z.enum(['ADMIN', 'ACCOUNTANT', 'CONTACT'], {
      message: 'Please select a valid user role',
    }),
    contactType: z.enum(['CUSTOMER', 'VENDOR', 'BOTH']).optional(),
    tempPassword: z
      .string()
      .min(1, 'Temporary password is required')
      .min(8, 'Temporary password must be at least 8 characters'),
    confirmTempPassword: z
      .string()
      .min(1, 'Please confirm the temporary password'),
    isActive: z.boolean(),
  })
  .refine((data) => data.tempPassword === data.confirmTempPassword, {
    message: 'Passwords do not match',
    path: ['confirmTempPassword'],
  })
  .refine(
    (data) => {
      if (data.role === 'CONTACT') {
        return Boolean(data.contactType);
      }
      return true;
    },
    {
      message: 'Please select a contact type (Customer, Vendor, or Both)',
      path: ['contactType'],
    }
  );

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
