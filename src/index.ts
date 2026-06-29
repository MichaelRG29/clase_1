import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRouter from './routes/health';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || "3000";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/health', healthRouter);

app.get('/', (req: Request, res: Response) => {
 res.json({
    project: 'TaskFlow API - Clase 1',
    version: '1.0.0',
    docs: '/health',
 });
});

app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Ruta no encontrada'});
});

app.listen(PORT, () => {
 console.log('🚀 Servidor TaskFlow corriendo en  http://localhost:${PORT}');
 console.log(`🔍 Health: http://localhost:${PORT}/health`);
});

export default app;