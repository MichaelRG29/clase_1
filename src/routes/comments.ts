import { Router } from 'express';
import { commentsController } from '../controllers/comments.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @openapi
 * /api/comments/task/{taskId}:
 *   get:
 *     tags:
 *       - Comments
 *     summary: Obtiene todos los comentarios de una tarea
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la tarea
 *     responses:
 *       200:
 *         description: Lista de comentarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *                 count:
 *                   type: integer
 *       401:
 *         description: No autenticado
 * /api/comments:
 *   post:
 *     tags:
 *       - Comments
 *     summary: Crea un comentario en una tarea
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommentDto'
 *     responses:
 *       201:
 *         description: Comentario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Tarea no encontrada
 *   delete:
 *     tags:
 *       - Comments
 *     summary: Elimina un comentario (solo el autor)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del comentario
 *     responses:
 *       204:
 *         description: Comentario eliminado exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tienes permiso para eliminar este comentario
 *       404:
 *         description: Comentario no encontrado
 */
router.get('/task/:taskId', authenticate, commentsController.getByTask);
router.post('/', authenticate, commentsController.create);
router.delete('/:id', authenticate, commentsController.remove);

export default router;
