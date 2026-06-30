import { Response } from 'express';
import { Prisma } from '@prisma/client';

export function handlePrismaError(res: Response, error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2025':
        res.status(404).json({ error: 'Recurso no encontrado' });
        return true;
      case 'P2023':
        res.status(400).json({ error: 'ID inválido' });
        return true;
      case 'P2002':
        res.status(409).json({ error: 'El email ya está registrado' });
        return true;
    }
  }
  return false;
}
