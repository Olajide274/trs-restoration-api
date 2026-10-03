import { z } from 'zod';

export const createJobSchema = z.object({
  body: z.object({
    customerName: z.string().min(1, 'customerName is required'),
    customerEmail: z.string().email('Invalid email address'),
    propertyAddress: z.string().min(1, 'propertyAddress is required'),
    damageType: z.enum(['WATER', 'FIRE', 'MOLD', 'STORM', 'OTHER'], {
      errorMap: () => ({ message: 'Invalid damageType' }),
    }),
    damageDescription: z.string().min(1, 'damageDescription is required'),
    squareFeet: z.number().positive('squareFeet must be a positive number'),
  }),
});

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(
      [
        'NEW',
        'INSPECTION',
        'ESTIMATING',
        'PROPOSAL_SENT',
        'APPROVED',
        'IN_PROGRESS',
        'COMPLETED',
        'CANCELLED',
      ],
      { errorMap: () => ({ message: 'Invalid status' }) }
    ),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});

export const estimateSchema = z.object({
  body: z.object({
    laborCost: z.number().nonnegative('laborCost cannot be negative'),
    materialCost: z.number().nonnegative('materialCost cannot be negative'),
    equipmentCost: z.number().nonnegative('equipmentCost cannot be negative'),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});