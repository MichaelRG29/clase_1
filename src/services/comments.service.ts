import prisma from '../config/prisma';
import { CreateCommentDto } from '../types/comment.types';
import { AppError } from '../helpers/errors';
export const commentsService = {
 async findByTask(taskId: string) {
 return prisma.comment.findMany({
 where: { taskId },
 include: { user: { select: { id: true, name: true, email: true } } },
 orderBy: { createdAt: 'asc' },
 });
 },
 async create(data: CreateCommentDto, userId: string) {
 const task = await prisma.task.findUnique({ where: { id: data.taskId } });
  if (!task) throw new AppError(404, 'Tarea no encontrada');

 return prisma.comment.create({
 data: { content: data.content, taskId: data.taskId, userId },
 include: { user: { select: { id: true, name: true } } },
 });
 },
 async remove(id: string, requesterId: string) {
 const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) throw new AppError(404, 'Comentario no encontrado');
  if (comment.userId !== requesterId)
   throw new AppError(403, 'Solo puedes eliminar tus propios comentarios');
 await prisma.comment.delete({ where: { id } });
 },
};