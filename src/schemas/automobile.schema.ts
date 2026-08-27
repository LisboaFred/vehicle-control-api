import { z } from 'zod';

export const createAutomobileSchema = z.object({
  licensePlate: z.string().min(1, 'License plate is required'),
  color: z.string().min(1, 'Color is required'),
  brand: z.string().min(1, 'Brand is required'),
});

export const updateAutomobileSchema = z.object({
  color: z.string().min(1, 'Color is required').optional(),
  brand: z.string().min(1, 'Brand is required').optional(),
});
