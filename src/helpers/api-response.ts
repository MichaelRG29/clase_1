import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  status: number;
  message: string;
  data?: T;
  error?: string | null;
  timestamp: string;
}

export function sendSuccess<T>(res: Response, status: number, message: string, data?: T): void {
  const body: ApiResponse<T> = {
    status,
    message,
    ...(data !== undefined && { data }),
    error: null,
    timestamp: new Date().toISOString(),
  };
  res.status(status).json(body);
}

export function sendCreated<T>(res: Response, message: string, data?: T): void {
  sendSuccess(res, 201, message, data);
}

export function sendNoContent(res: Response): void {
  res.status(204).send();
}

export function sendError(res: Response, status: number, message: string, error?: string): void {
  const body: ApiResponse = {
    status,
    message,
    error: error ?? message,
    timestamp: new Date().toISOString(),
  };
  res.status(status).json(body);
}
