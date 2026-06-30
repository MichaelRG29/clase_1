import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, 'name es requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Password debe tener al menos 6 caracteres'),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email('Email inválido').optional(),
});
