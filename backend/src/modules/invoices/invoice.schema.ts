import { z } from 'zod';

export const invoiceLineSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.coerce.number().min(0).optional(),
  description: z.string().optional(),
});

export const createInvoiceSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  salesOrderId: z.string().optional(),
  issueDate: z.string().optional(),
  dueDate: z.string().optional(),
  lines: z.array(invoiceLineSchema).min(1, 'At least 1 invoice line is required'),
});

export const listInvoicesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(2000).default(50),
  search: z.string().optional(),
  status: z.enum(['DRAFT', 'POSTED', 'PAID', 'OVERDUE', 'CANCELLED']).optional(),
  customerId: z.string().optional(),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type ListInvoicesQuery = z.infer<typeof listInvoicesQuerySchema>;
