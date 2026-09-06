import { z } from 'zod';

export const signupSchema = z
  .object({
    name: z.string().trim().max(100).optional(),
    fullName: z.string().trim().max(100).optional(),
    email: z.string().trim().email('Invalid email address').toLowerCase(),
    mobile: z
      .string()
      .trim()
      .regex(/^[0-9+\-() ]{7,20}$/, 'Invalid mobile number format')
      .optional()
      .or(z.literal('')),
    mobileNumber: z
      .string()
      .trim()
      .regex(/^[0-9+\-() ]{7,20}$/, 'Invalid mobile number format')
      .optional()
      .or(z.literal('')),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => {
    const n = (data.name || data.fullName || '').trim();
    return n.length >= 2;
  }, {
    message: 'Name must be at least 2 characters long',
    path: ['name'],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .transform((data) => ({
    name: (data.name || data.fullName)!.trim(),
    email: data.email,
    mobile: ((data.mobile || data.mobileNumber || '').trim() || null),
    password: data.password,
    confirmPassword: data.confirmPassword,
  }));

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
