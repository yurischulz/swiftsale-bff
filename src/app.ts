import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import timeout from 'connect-timeout';
import swaggerUi from 'swagger-ui-express';

import { connectDatabase } from './config/database';
import { swaggerDocs } from './config/swagger';
import { errorHandler } from './middlewares/errorHandler';
import { firebaseAuthMiddleware } from './middlewares/firebaseAuth';

import authRoutes from './routes/auth.routes';
import customerRoutes from './routes/customer.routes';
import productRoutes from './routes/product.routes';
import affiliationRoutes from './routes/affiliations.routes';
import saleRoutes from './routes/sale.routes';
import paymentRoutes from './routes/payment.routes';
import dashboardRoutes from './routes/dashboard.routes';

const env = process.env.NODE_ENV!;
const app = express();

app.use(timeout('10s'));

app.use(cors());
app.use(helmet());
app.use(express.json());
// istanbul ignore next
app.use(morgan(env === 'development' ? 'dev' : 'common'));

// istanbul ignore next
if (process.env.NODE_ENV !== 'test') {
  connectDatabase().catch((err) => {
    console.error('❌ Erro ao conectar com o MongoDB:', err);
    process.exit(1);
  });
}

app.use('/auth', authRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(firebaseAuthMiddleware);

app.use('/customers', customerRoutes);
app.use('/products', productRoutes);
app.use('/affiliations', affiliationRoutes);
app.use('/sales', saleRoutes);
app.use('/payments', paymentRoutes);
app.use('/dashboard', dashboardRoutes);

app.use(errorHandler);

export default app;
