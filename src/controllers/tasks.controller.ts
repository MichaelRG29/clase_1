import { Request, Response } from 'express';
import { tasksService } from '../services/tasks.service';
import { CreateTaskDto, UpdateTaskDto } from '../types/task.types';
import { NotFoundError } from '../helpers/errors';
import { sendSuccess, sendCreated, sendNoContent } from '../helpers/api-response';

export const tasksController = {
  async getByProject(req: Request, res: Response): Promise<void> {
    const tasks = await tasksService.findByProject(
      req.params.projectId as string,
      req.query.status as string | undefined
    );
    sendSuccess(res, 200, 'Tareas del proyecto obtenidas', { data: tasks, count: tasks.length });
  },

  async getById(req: Request, res: Response): Promise<void> {
    const task = await tasksService.findById(req.params.id as string);
    if (!task) throw new NotFoundError('Tarea');
    sendSuccess(res, 200, 'Tarea encontrada', { data: task });
  },

  async create(req: Request, res: Response): Promise<void> {
    const task = await tasksService.create(req.body as CreateTaskDto, req.user!.userId);
    sendCreated(res, 'Tarea creada exitosamente', { data: task });
  },

  async update(req: Request, res: Response): Promise<void> {
    const task = await tasksService.update(
      req.params.id as string, req.body as UpdateTaskDto, req.user!.userId
    );
    sendSuccess(res, 200, 'Tarea actualizada correctamente', { data: task });
  },

  async remove(req: Request, res: Response): Promise<void> {
    await tasksService.remove(req.params.id as string, req.user!.userId);
    sendNoContent(res);
  },
};
