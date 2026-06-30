import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import healthRouter from './routes/health';
import usersRoute from './routes/users';
import projectsRouter from './routes/projects';
import { swaggerSpec } from './config/swagger';
import { errorHandler } from './helpers/error-handler';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || '3000';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/health', healthRouter);
app.use('/api/users', usersRoute);
app.use('/api/projects', projectsRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (_req: Request, res: Response) => {
  res.json({
    project: 'TaskFlow API - Clase 1',
    version: '1.0.0',
    docs: '/api-docs',
  });
});

app.use(errorHandler);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor TaskFlow corriendo en http://localhost:${PORT}`);
  console.log(`🔍 Health: http://localhost:${PORT}/health`);
  console.log(`📖 Docs (Swagger): http://localhost:${PORT}/api-docs`);
});

export default app;
