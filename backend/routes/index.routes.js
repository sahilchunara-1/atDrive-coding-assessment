import { Router } from 'express';
import healthRouter from './health.routes.js';
import productRouter from './product.routes.js';
import userRouter from './user.routes.js';
import orderRouter from './order.routes.js';
import weatherRouter from './weather.routes.js';

const indexRoutes = Router();

indexRoutes.use('/health', healthRouter);
indexRoutes.use('/api/products', productRouter);
indexRoutes.use('/api/users', userRouter);
indexRoutes.use('/api/orders', orderRouter);
indexRoutes.use('/api/weather', weatherRouter);


export default indexRoutes;