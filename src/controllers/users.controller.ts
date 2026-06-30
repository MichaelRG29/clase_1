import { Request, Response } from 'express';
import { usersService } from '../services/users.service';
import { NotFoundError, ValidationError } from '../helpers/errors';
import { createUserSchema, updateUserSchema } from '../validators/users.validator';

export const usersController = {
  async getAll(_req: Request, res: Response): Promise<void> {
    const users = await usersService.findAll();
    res.json({ data: users, count: users.length });
  },

  async getById(req: Request, res: Response): Promise<void> {
    const user = await usersService.findById(req.params.id as string);
    if (!user) throw new NotFoundError('Usuario');
    res.json({ data: user });
  },

  async create(req: Request, res: Response): Promise<void> {
    const parsed = createUserSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.issues[0].message);
    }
    const user = await usersService.create(parsed.data);
    res.status(201).json({ data: user });
  },

  async update(req: Request, res: Response): Promise<void> {
    if (!req.body) throw new ValidationError('Cuerpo de solicitud requerido');
    const parsed = updateUserSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.issues[0].message);
    }
    if (Object.keys(parsed.data).length === 0) {
      throw new ValidationError('No se enviaron campos para actualizar');
    }
    const user = await usersService.update(req.params.id as string, parsed.data);
    if (!user) throw new NotFoundError('Usuario');
    res.json({ data: user });
  },

  async remove(req: Request, res: Response): Promise<void> {
    const deleted = await usersService.remove(req.params.id as string);
    if (!deleted) throw new NotFoundError('Usuario');
    res.status(204).send();
  },
};
