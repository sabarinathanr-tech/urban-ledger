import { z } from 'zod';

export const createPaymentSchema = z.object({
  type: z.enum(['CUSTOMER_PAYMENT', 'VENDOR_PAYMENT']),
  contactId: z.string().min(1, 'Contact is required'),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than zero'),
  method: z.enum(['CASH', 'BANK']).default('BANK'),
  paymentDate: z.string().optional(),
  invoiceId: z.string().optional(),
  billId: z.string().optional(),
  referenceDoc: z.string().optional(),
});

export const listPaymentsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(2000).default(50),
  search: z.string().optional(),
  type: z.enum(['CUSTOMER_PAYMENT', 'VENDOR_PAYMENT']).optional(),
  method: z.enum(['CASH', 'BANK']).optional(),
  contactId: z.string().optional(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type ListPaymentsQuery = z.infer<typeof listPaymentsQuerySchema>;
