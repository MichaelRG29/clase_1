import { Request, Response } from 'express';
import { commentsService } from '../services/comments.service';
import { CreateCommentDto } from '../types/comment.types';
import { sendSuccess, sendCreated, sendNoContent } from '../helpers/api-response';

export const commentsController = {
  async getByTask(req: Request, res: Response): Promise<void> {
    const comments = await commentsService.findByTask(req.params.taskId as string);
    sendSuccess(res, 200, 'Comentarios obtenidos', { data: comments, count: comments.length });
  },

  async create(req: Request, res: Response): Promise<void> {
    const comment = await commentsService.create(
      req.body as CreateCommentDto,
      req.user!.userId
    );
    sendCreated(res, 'Comentario creado exitosamente', { data: comment });
  },

  async remove(req: Request, res: Response): Promise<void> {
    await commentsService.remove(req.params.id as string, req.user!.userId);
    sendNoContent(res);
  },
};
