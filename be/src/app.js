import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { authRouter } from './modules/auth/auth.routes.js';
import { catalogRouter } from './modules/catalog/catalog.routes.js';
import { configRouter } from './modules/config/config.routes.js';
import { ordersPublicRouter } from './modules/orders/orders.public.routes.js';
import { adminProductsRouter } from './modules/products/products.routes.js';
import { adminOrdersRouter } from './modules/orders/orders.admin.routes.js';
import { dashboardRouter } from './modules/orders/dashboard.routes.js';
import { errorHandler } from './middleware/error.js';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Public routes
app.use('/api/public/config', configRouter);
app.use('/api/public/catalog', catalogRouter);
app.use('/api/public/orders', ordersPublicRouter);

// Admin routes
app.use('/api/admin/auth', authRouter);
app.use('/api/admin/products', adminProductsRouter);
app.use('/api/admin/orders', adminOrdersRouter);
app.use('/api/admin/dashboard', dashboardRouter);

app.use(errorHandler);

export default app;
