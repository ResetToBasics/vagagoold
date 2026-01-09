import express from 'express';
import cors from 'cors';
import routes from './routes';
import { env } from './config/env';
import { errorHandler } from './middlewares/errorHandler';

export const app = express();

app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api', routes);

app.use(errorHandler);
