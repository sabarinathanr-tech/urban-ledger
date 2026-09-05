import { z } from 'zod';

export const signupSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters long').max(100),
    email: z.string().trim().email('Invalid email address').toLowerCase(),
    mobile: z
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
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
