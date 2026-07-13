import { Request, Response } from 'express';
import { projectsService } from '../services/projects.service';
import { NotFoundError, ValidationError } from '../helpers/errors';
import { createProjectSchema, updateProjectSchema } from '../validators/projects.validator';
import { sendSuccess, sendCreated, sendNoContent, sendError } from '../helpers/api-response';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validateIdParam(req: Request, res: Response): string | null {
  const id = req.params.id as string;
  if (!id || !UUID_REGEX.test(id)) {
    sendError(res, 400, 'ID de proyecto inválido');
    return null;
  }
  return id;
}

export const projectsController = {
  async getAll(_req: Request, res: Response): Promise<void> {
    const projects = await projectsService.findAll();
    sendSuccess(res, 200, 'Proyectos obtenidos correctamente', { data: projects, count: projects.length });
  },

  async getById(req: Request, res: Response): Promise<void> {
    const id = validateIdParam(req, res);
    if (!id) return;
    const project = await projectsService.findById(id);
    if (!project) throw new NotFoundError('Proyecto');
    sendSuccess(res, 200, 'Proyecto encontrado', { data: project });
  },

  async create(req: Request, res: Response): Promise<void> {
    const parsed = createProjectSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.issues[0].message);
    }
    const project = await projectsService.create(parsed.data);
    sendCreated(res, 'Proyecto creado exitosamente', { data: project });
  },

  async update(req: Request, res: Response): Promise<void> {
    const id = validateIdParam(req, res);
    if (!id) return;
    if (!req.body) throw new ValidationError('Cuerpo de solicitud requerido');
    const parsed = updateProjectSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.issues[0].message);
    }
    if (Object.keys(parsed.data).length === 0) {
      throw new ValidationError('No se enviaron campos para actualizar');
    }
    const project = await projectsService.update(id, parsed.data);
    if (!project) throw new NotFoundError('Proyecto');
    sendSuccess(res, 200, 'Proyecto actualizado correctamente', { data: project });
  },

  async remove(req: Request, res: Response): Promise<void> {
    const id = validateIdParam(req, res);
    if (!id) return;
    const deleted = await projectsService.remove(id);
    if (!deleted) throw new NotFoundError('Proyecto');
    sendNoContent(res);
  },
};
