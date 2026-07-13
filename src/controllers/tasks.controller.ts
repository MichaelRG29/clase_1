import { Request, Response } from 'express';
import { tasksService } from '../services/tasks.service';
import { CreateTaskDto, UpdateTaskDto } from '../types/task.types';
import { NotFoundError } from '../helpers/errors';
import { sendSuccess, sendCreated, sendNoContent, sendError } from '../helpers/api-response';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const tasksController = {
  async getByProject(req: Request, res: Response): Promise<void> {
    const projectId = req.params.projectId as string;
    if (!projectId || !UUID_REGEX.test(projectId)) {
      sendError(res, 400, 'ID de proyecto inválido');
      return;
    }
    const tasks = await tasksService.findByProject(
      projectId,
      req.query.status as string | undefined
    );
    sendSuccess(res, 200, 'Tareas del proyecto obtenidas', { data: tasks, count: tasks.length });
  },

  async getById(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    if (!id || !UUID_REGEX.test(id)) {
      sendError(res, 400, 'ID de tarea inválido');
      return;
    }
    const task = await tasksService.findById(id);
    if (!task) throw new NotFoundError('Tarea');
    sendSuccess(res, 200, 'Tarea encontrada', { data: task });
  },

  async create(req: Request, res: Response): Promise<void> {
    const task = await tasksService.create(req.body as CreateTaskDto, req.user!.userId);
    sendCreated(res, 'Tarea creada exitosamente', { data: task });
  },

  async update(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    if (!id || !UUID_REGEX.test(id)) {
      sendError(res, 400, 'ID de tarea inválido');
      return;
    }
    const task = await tasksService.update(
      id, req.body as UpdateTaskDto, req.user!.userId
    );
    sendSuccess(res, 200, 'Tarea actualizada correctamente', { data: task });
  },

  async remove(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    if (!id || !UUID_REGEX.test(id)) {
      sendError(res, 400, 'ID de tarea inválido');
      return;
    }
    await tasksService.remove(id, req.user!.userId);
    sendNoContent(res);
  },
};
