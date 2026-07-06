import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { RegisterDto, LoginDto } from '../types/auth.types';
import { sendSuccess, sendCreated } from '../helpers/api-response';

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    const result = await authService.register(req.body as RegisterDto);
    sendCreated(res, 'Registro exitoso', result);
  },

  async login(req: Request, res: Response): Promise<void> {
    const result = await authService.login(req.body as LoginDto);
    sendSuccess(res, 200, 'Inicio de sesión exitoso', result);
  },

  async me(req: Request, res: Response): Promise<void> {
    sendSuccess(res, 200, 'Sesión verificada', { data: req.user });
  },
};
