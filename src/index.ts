import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import healthRouter from './routes/health';
import usersRoute from './routes/users';
import projectsRouter from './routes/projects';
import authRouter from './routes/auth';
import commentsRouter from './routes/comments';
import { swaggerSpec } from './config/swagger';
import { errorMiddleware } from './middleware/error.middleware';
import { sendSuccess, sendError } from './helpers/api-response';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || '3000';

app.use(cors({
    origin: [
        'http://localhost:5173', //puerto por defecto
        'http://localhost:5174', //si el 5173 esta ocupado
        'http://localhost:4173', // vista preview
    ],
 credentials: true,
 methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
 allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/health', healthRouter);
app.use('/api/users', usersRoute);
app.use('/api/projects', projectsRouter);
app.use('/auth', authRouter);
app.use('/api/comments', commentsRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (_req: Request, res: Response) => {
  sendSuccess(res, 200, 'TaskFlow API funcionando correctamente', {
    project: 'TaskFlow API - Clase 1',
    version: '1.0.0',
    docs: '/api-docs',
  });
});

app.use(errorMiddleware);

app.use((_req: Request, res: Response) => {
  sendError(res, 404, 'Ruta no encontrada');
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor TaskFlow corriendo en http://localhost:${PORT}`);
  console.log(`🔍 Health: http://localhost:${PORT}/health`);
  console.log(`📖 Docs (Swagger): http://localhost:${PORT}/api-docs`);
});

export default app;
