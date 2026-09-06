import { z } from 'zod';
import { TRANSACTION_TYPES } from '../../config/constants.js';

export const dashboardSummaryQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  period: z.enum(['month', 'quarter', 'year', 'monthly', 'quarterly', 'yearly']).optional(),
});

export const revenueExpenseQuerySchema = z.object({
  period: z.enum(['month', 'quarter', 'year', 'monthly', 'quarterly', 'yearly']).optional().default('monthly'),
  limit: z.coerce.number().optional().default(6),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const recentTransactionsQuerySchema = z.object({
  limit: z.coerce.number().optional().default(10),
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

export type DashboardSummaryQuery = z.infer<typeof dashboardSummaryQuerySchema>;
export type RevenueExpenseQuery = z.infer<typeof revenueExpenseQuerySchema>;
export type RecentTransactionsQuery = z.infer<typeof recentTransactionsQuerySchema>;
