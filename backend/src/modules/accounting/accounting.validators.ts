import { z } from 'zod';

export const journalEntryLineSchema = z.object({
  accountId: z.string().min(1, 'Account ID is required'),
  debit: z.number().min(0).default(0),
  credit: z.number().min(0).default(0),
  description: z.string().optional(),
  analyticAccountId: z.string().optional(),
});

export const journalEntrySchema = z.object({
  journalId: z.string().min(1, 'Journal ID is required'),
  date: z.string().or(z.date()),
  reference: z.string().min(1, 'Reference is required'),
  lines: z.array(journalEntryLineSchema).min(2, 'Journal entry must have at least 2 lines'),
});
