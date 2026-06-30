import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from './errors';

export function handlePrismaError(error: unknown): AppError | null {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2025':
        return new AppError(404, 'Recurso no encontrado');
      case 'P2023':
        return new AppError(400, 'ID inválido');
      case 'P2002':
        return new AppError(409, 'El email ya está registrado');
      default:
        if (error.code.startsWith('P1')) {
          return new AppError(503, 'Servicio de base de datos no disponible');
        }
        return new AppError(500, 'Error inesperado en la base de datos');
    }
  }
  return null;
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(`[ERROR] ${err.name}: ${err.message}`);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      ...(err.details && { details: err.details }),
    });
    return;
  }

  const prismaErr = handlePrismaError(err);
  if (prismaErr) {
    res.status(prismaErr.statusCode).json({ error: prismaErr.message });
    return;
  }

  res.status(500).json({ error: 'Error interno del servidor' });
}
