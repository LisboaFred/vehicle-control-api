import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middlewares/error-handler';

const app = express();

// --------------- Security & Parsing Middlewares ---------------
app.use(helmet());
app.use(cors());
app.use(express.json());

// --------------- Health Check ---------------
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

import { automobileRoutes } from './routes/automobile.routes';

import { driverRoutes } from './routes/driver.routes';
import { usageRoutes } from './routes/usage.routes';

// --------------- Routes (will be added in later stages) ---------------
app.use('/api/automobiles', automobileRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/usages', usageRoutes);

// --------------- Global Error Handler (must be last) ---------------
app.use(errorHandler);

export { app };
