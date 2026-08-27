import { z } from 'zod';

export const createDriverSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export const updateDriverSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
});
