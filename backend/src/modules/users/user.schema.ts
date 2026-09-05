import { z } from 'zod';
import { ROLES, CONTACT_TYPES } from '../../config/constants.js';

export const createUserSchema = z.object({
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
  role: z.enum([ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.CONTACT]),
  contactType: z
    .enum([CONTACT_TYPES.CUSTOMER, CONTACT_TYPES.VENDOR, CONTACT_TYPES.BOTH])
    .optional(),
});

export const listUsersQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  role: z.enum([ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.CONTACT]).optional(),
  search: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
