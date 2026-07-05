import Router from 'express';
import orderController from '../controllers/order.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { validateCreateOrder, validateObjectId, validateUpdateOrder } from '../validators/order.validator.js';

const orderRouter = Router();

orderRouter.get('/getAllOrders', authMiddleware.verifyToken, orderController.getAllOrders);
orderRouter.post('/createOrder', authMiddleware.verifyToken, validateCreateOrder, orderController.createOrder);
orderRouter.get('/getOrderById/:orderId', authMiddleware.verifyToken, validateObjectId('orderId'), orderController.getOrderById);
orderRouter.put('/updateOrder/:orderId', authMiddleware.verifyToken, validateObjectId('orderId'), validateUpdateOrder, orderController.updateOrder);
orderRouter.delete('/deleteOrder/:orderId', authMiddleware.verifyToken, validateObjectId('orderId'), orderController.deleteOrder);

export default orderRouter;