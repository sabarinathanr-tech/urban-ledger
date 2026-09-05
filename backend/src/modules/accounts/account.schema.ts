import { z } from 'zod';

export const createAccountSchema = z.object({
  code: z.string(),
  name: z.string(),
  type: z.string(),
});
