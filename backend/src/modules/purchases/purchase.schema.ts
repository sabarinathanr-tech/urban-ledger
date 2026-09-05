import { z } from 'zod';

export const purchaseOrderLineInputSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.coerce.number().min(0).optional(),
});

export const createPurchaseOrderSchema = z.object({
  vendorId: z.string().min(1, 'Vendor is required'),
  orderDate: z.string().optional(),
  lines: z.array(purchaseOrderLineInputSchema).min(1, 'At least 1 product line is required'),
});

export const listPurchaseOrdersQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  search: z.string().optional(),
  status: z.enum(['DRAFT', 'CONFIRMED', 'BILLED', 'CANCELLED']).optional(),
  vendorId: z.string().optional(),
});

export type CreatePurchaseOrderInput = z.infer<typeof createPurchaseOrderSchema>;
export type ListPurchaseOrdersQuery = z.infer<typeof listPurchaseOrdersQuerySchema>;
