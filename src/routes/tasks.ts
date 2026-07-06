import { Router } from 'express';
import { tasksController } from '../controllers/tasks.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schemas';

const router = Router();

/**
 * @openapi
 * /api/tasks/project/{projectId}:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Obtiene todas las tareas de un proyecto
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del proyecto
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [TODO, IN_PROGRESS, DONE, CANCELLED]
 *         description: Filtrar por estado
 *     responses:
 *       200:
 *         description: Lista de tareas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 count:
 *                   type: integer
 *       401:
 *         description: No autenticado
 * /api/tasks:
 *   post:
 *     tags:
 *       - Tasks
 *     summary: Crea una nueva tarea (solo el owner del proyecto)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskDto'
 *     responses:
 *       201:
 *         description: Tarea creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Solo el dueño del proyecto puede crear tareas
 *       404:
 *         description: Proyecto no encontrado
 * /api/tasks/{id}:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Obtiene una tarea por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la tarea
 *     responses:
 *       200:
 *         description: Tarea encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Tarea no encontrada
 *   put:
 *     tags:
 *       - Tasks
 *     summary: Actualiza una tarea (owner o asignado)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la tarea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskDto'
 *     responses:
 *       200:
 *         description: Tarea actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tienes permiso para modificar esta tarea
 *       404:
 *         description: Tarea no encontrada
 *   delete:
 *     tags:
 *       - Tasks
 *     summary: Elimina una tarea (solo el owner del proyecto)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la tarea
 *     responses:
 *       204:
 *         description: Tarea eliminada exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Solo el dueño puede eliminar tareas
 *       404:
 *         description: Tarea no encontrada
 */
router.get('/project/:projectId', authenticate, tasksController.getByProject);
router.get('/:id', authenticate, tasksController.getById);
router.post('/', authenticate, validate(createTaskSchema), tasksController.create);
router.put('/:id', authenticate, validate(updateTaskSchema), tasksController.update);
router.delete('/:id', authenticate, tasksController.remove);

export default router;
