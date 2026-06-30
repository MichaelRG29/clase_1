import { Request, Response } from 'express';
import { projectsService } from '../services/projects.service';
import { NotFoundError, ValidationError } from '../helpers/errors';
import { createProjectSchema, updateProjectSchema } from '../validators/projects.validator';

export const projectsController = {
  async getAll(_req: Request, res: Response): Promise<void> {
    const projects = await projectsService.findAll();
    res.json({ data: projects, count: projects.length });
  },

  async getById(req: Request, res: Response): Promise<void> {
    const project = await projectsService.findById(req.params.id as string);
    if (!project) throw new NotFoundError('Proyecto');
    res.json({ data: project });
  },

  async create(req: Request, res: Response): Promise<void> {
    const parsed = createProjectSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.issues[0].message);
    }
    const project = await projectsService.create(parsed.data);
    res.status(201).json({ data: project });
  },

  async update(req: Request, res: Response): Promise<void> {
    if (!req.body) throw new ValidationError('Cuerpo de solicitud requerido');
    const parsed = updateProjectSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.issues[0].message);
    }
    if (Object.keys(parsed.data).length === 0) {
      throw new ValidationError('No se enviaron campos para actualizar');
    }
    const project = await projectsService.update(req.params.id as string, parsed.data);
    if (!project) throw new NotFoundError('Proyecto');
    res.json({ data: project });
  },

  async remove(req: Request, res: Response): Promise<void> {
    const deleted = await projectsService.remove(req.params.id as string);
    if (!deleted) throw new NotFoundError('Proyecto');
    res.status(204).send();
  },
};
