import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  type: z.enum(['GOODS', 'SERVICE', 'COMBO']).default('GOODS'),
  salesPrice: z.coerce.number().min(0, 'Sales price must be positive'),
  purchasePrice: z.coerce.number().min(0, 'Purchase price must be positive'),
  category: z.string().min(1, 'Category is required'),
});

export const updateProductSchema = createProductSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const listProductsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(2000).default(50),
  search: z.string().optional(),
  category: z.string().optional(),
  type: z.enum(['GOODS', 'SERVICE', 'COMBO']).optional(),
  isActive: z.enum(['true', 'false']).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;
