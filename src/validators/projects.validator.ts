import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(1, 'name es requerido'),
  description: z.string().optional(),
  ownerId: z.string().uuid('ownerId debe ser un UUID válido'),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});
