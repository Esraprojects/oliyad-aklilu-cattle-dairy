import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import cattleRoutes from './routes/cattle';
import feedRoutes from './routes/feed';
import feedingRoutes from './routes/feeding';
import milkRoutes from './routes/milk';
import salesRoutes from './routes/sales';
import employeeRoutes from './routes/employees';
import dashboardRoutes from './routes/dashboard';
import reportRoutes from './routes/reports';
import customerRoutes from './routes/customers';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'https://oliyad-aklilu-cattle-dairy.vercel.app',
  /\.vercel\.app$/,
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    const ok = allowedOrigins.some(o =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );
    cb(ok ? null : new Error('Not allowed by CORS'), ok);
  },
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: 'Too many requests, please try again later.',
});
app.use('/api/', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/cattle', cattleRoutes);
app.use('/api/feeds', feedRoutes);
app.use('/api/feeding', feedingRoutes);
app.use('/api/milk', milkRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/customers', customerRoutes);

app.get('/api/health', (_, res) => {
  res.json({ status: 'OK', message: 'Oliyad & Aklilu Cattle Dairy API is running' });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Local dev: listen on port. Vercel: export app as handler.
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
