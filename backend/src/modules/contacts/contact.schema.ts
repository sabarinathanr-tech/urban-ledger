import { z } from 'zod';

export const createContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  type: z.enum(['CUSTOMER', 'VENDOR', 'BOTH']).default('CUSTOMER'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  mobile: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
  pincode: z.string().optional().or(z.literal('')),
  profileImage: z.string().optional(),
  createPortalUser: z.boolean().optional(),
  password: z.string().optional(),
});

export const updateContactSchema = createContactSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const listContactsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(2000).default(50),
  search: z.string().optional(),
  type: z.enum(['CUSTOMER', 'VENDOR', 'BOTH']).optional(),
  isActive: z.enum(['true', 'false']).optional(),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
export type ListContactsQuery = z.infer<typeof listContactsQuerySchema>;
