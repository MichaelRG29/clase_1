import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '../helpers/errors';
import { sendError } from '../helpers/api-response';

function handlePrismaError(error: unknown): AppError | null {
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

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(`[ERROR] ${err.name}: ${err.message}`);

  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.message, err.details);
    return;
  }

  const prismaErr = handlePrismaError(err);
  if (prismaErr) {
    sendError(res, prismaErr.statusCode, prismaErr.message);
    return;
  }

  const anyErr = err as any;
  if (anyErr?.status) {
    sendError(res, anyErr.status, anyErr.message);
    return;
  }

  sendError(res, 500, 'Error interno del servidor');
};
