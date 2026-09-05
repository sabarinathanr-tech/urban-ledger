import { z } from 'zod';

export const salesOrderLineInputSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.coerce.number().min(0, 'Unit price must be positive').optional(),
});

export const createSalesOrderSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  orderDate: z.string().optional(),
  lines: z.array(salesOrderLineInputSchema).min(1, 'At least 1 product line is required'),
});

export const listSalesOrdersQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  search: z.string().optional(),
  status: z.enum(['DRAFT', 'CONFIRMED', 'INVOICED', 'CANCELLED']).optional(),
  customerId: z.string().optional(),
});

export type CreateSalesOrderInput = z.infer<typeof createSalesOrderSchema>;
export type ListSalesOrdersQuery = z.infer<typeof listSalesOrdersQuerySchema>;
