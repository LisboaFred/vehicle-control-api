import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import rateLimit from 'express-rate-limit';

// Internal imports
import { config } from './config';
import { swaggerDocument } from './docs/swagger';
import { automobileRoutes } from './routes/automobile.routes';
import { driverRoutes } from './routes/driver.routes';
import { usageRoutes } from './routes/usage.routes';
import { errorHandler } from './middlewares/error-handler';
import { requestId } from './middlewares/request-id';

const app = express();

// --------------- Security & Parsing Middlewares ---------------
app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

// --------------- Request ID Tracking ---------------
app.use(requestId);

// --------------- Rate Limiting ---------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// --------------- Static Frontend ---------------
app.use(express.static(path.join(__dirname, '../public')));

// --------------- Health Check ---------------
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --------------- Swagger Documentation ---------------
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --------------- Routes ---------------
app.use('/api/automobiles', automobileRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/usages', usageRoutes);

// --------------- Global Error Handler (must be last) ---------------
app.use(errorHandler);

export { app };
