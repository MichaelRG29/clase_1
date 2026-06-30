import { Router, Request, Response } from 'express';
import pool from '../config/database';

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Verifica el estado del servidor y la conexión a la base de datos
 *     responses:
 *       200:
 *         description: Servidor funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                 database:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: connected
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                 environment:
 *                   type: string
 *       500:
 *         description: Error de conexión con la base de datos
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT NOW() as timestamp');

     res.json({
        status: 'ok',
        message: 'TaskFlow API funcionando correctamente',
        database: {
        status: 'connected',
        timestamp: result.rows[0].timestamp,
         },
        environment: process.env.NODE_ENV || 'development',
    });
 } catch (error) {
     res.status(500).json({
    status: 'error',
    message: 'Error al conectar con la base de datos',
    database: {
        status: 'disconnected',
        },
    });
 }
});

export default router;