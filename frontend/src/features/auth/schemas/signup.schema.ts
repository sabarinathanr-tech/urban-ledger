import { z } from 'zod';

export const signupSchema = z
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
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d).*$/,
        'Password must contain at least one letter and one number'
      ),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
    termsAccepted: z
      .boolean()
      .refine((val) => val === true, {
        message: 'You must agree to the Terms of Service and Privacy Policy',
      }),
    role: z.literal('CONTACT').optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
