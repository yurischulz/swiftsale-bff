import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import timeout from 'connect-timeout';

import authRoutes from './routes/auth.routes';
import customerRoutes from './routes/customers.routes';
import productRoutes from './routes/products.routes';
import affiliationRoutes from './routes/affiliations.routes';
import saleRoutes from './routes/sales.routes';
import paymentRoutes from './routes/payments.routes';
import dashboardRoutes from './routes/dashboard.routes';

import { connectDatabase } from './config/database';
import { errorHandler } from './middlewares/errorHandler';
import { firebaseAuthMiddleware } from './middlewares/firebaseAuth';

const env = process.env.NODE_ENV || 'development';
const app = express();

app.use(timeout('10s'));

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan(env === 'development' ? 'dev' : 'common'));

connectDatabase().catch((err) => {
  console.error('❌ Erro ao conectar com o MongoDB:', err);
  process.exit(1);
});

app.use('/auth', authRoutes);

app.use(firebaseAuthMiddleware);

app.use('/customers', customerRoutes);
app.use('/products', productRoutes);
app.use('/affiliations', affiliationRoutes);
app.use('/sales', saleRoutes);
app.use('/payments', paymentRoutes);
app.use('/dashboard', dashboardRoutes);

app.use(errorHandler);

export default app;
