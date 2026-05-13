import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { initSchema } from './db.js';
import coursesRouter from './routes/courses.js';
import { errorHandler, notFound } from './errors.js';

const app = express();
const PORT = Number(process.env.PORT || 3000);

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim().replace(/\/+$/, ''))
  .filter(Boolean);

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(helmet());
app.use(
  cors({
    origin(origin, cb) {
      // Allow non-browser tools (curl, healthchecks) with no Origin header
      if (!origin) return cb(null, true);
      const normalized = origin.replace(/\/+$/, '');
      if (allowedOrigins.length === 0 || allowedOrigins.includes(normalized)) {
        return cb(null, true);
      }
      cb(new Error(`Origin ${origin} not allowed by CORS`));
    },
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86_400,
  }),
);

app.use(express.json({ limit: '50kb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'projgestao-back' });
});

app.use('/courses', coursesRouter);

app.use(notFound);
app.use(errorHandler);

async function start() {
  await initSchema();
  app.listen(PORT, () => {
    console.log(`[backend] listening on :${PORT}`);
  });
}

start().catch((err) => {
  console.error('[backend] failed to start', err);
  process.exit(1);
});
