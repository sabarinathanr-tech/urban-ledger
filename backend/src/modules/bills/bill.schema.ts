import { z } from 'zod';

export const billLineSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.coerce.number().min(0).optional(),
  description: z.string().optional(),
});

export const createBillSchema = z.object({
  vendorId: z.string().min(1, 'Vendor is required'),
  purchaseOrderId: z.string().optional(),
  billDate: z.string().optional(),
  dueDate: z.string().optional(),
  lines: z.array(billLineSchema).min(1, 'At least 1 bill line is required'),
});

export const listBillsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  search: z.string().optional(),
  status: z.enum(['DRAFT', 'POSTED', 'PAID', 'OVERDUE', 'CANCELLED']).optional(),
  vendorId: z.string().optional(),
});

export type CreateBillInput = z.infer<typeof createBillSchema>;
export type ListBillsQuery = z.infer<typeof listBillsQuerySchema>;
