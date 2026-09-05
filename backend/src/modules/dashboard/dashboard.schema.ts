import { z } from 'zod';
import { TRANSACTION_TYPES } from '../../config/constants.js';

export const revenueExpenseQuerySchema = z.object({
  period: z.enum(['month', 'quarter', 'year']).optional().default('month'),
  limit: z.string().optional().default('6'),
});

export const recentTransactionsQuerySchema = z.object({
  limit: z.string().optional().default('10'),
  type: z
    .enum([
      TRANSACTION_TYPES.CUSTOMER_INVOICE,
      TRANSACTION_TYPES.VENDOR_BILL,
      TRANSACTION_TYPES.PAYMENT,
      TRANSACTION_TYPES.SALES_ORDER,
      TRANSACTION_TYPES.PURCHASE_ORDER,
    ])
    .optional(),
});

export type RevenueExpenseQuery = z.infer<typeof revenueExpenseQuerySchema>;
export type RecentTransactionsQuery = z.infer<typeof recentTransactionsQuerySchema>;
