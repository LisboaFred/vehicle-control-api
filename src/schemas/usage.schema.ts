import { z } from 'zod';

export const createUsageSchema = z.object({
  driverId: z.string().uuid('Invalid driverId'),
  automobileId: z.string().uuid('Invalid automobileId'),
  reason: z.string().min(1, 'Reason is required'),
});
