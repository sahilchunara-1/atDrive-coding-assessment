import Router from 'express';
import productController from '../controllers/product.controller.js';
import { validateAddProduct, validateObjectId, validateUpdateProduct } from '../validators/product.validator.js';

const productRouter = Router();

productRouter.get('/getAllProducts', productController.getAllProducts);
productRouter.post('/addProduct', validateAddProduct, productController.addProduct);
productRouter.get('/getProductById/:productId', validateObjectId('productId'), productController.getProductById);
productRouter.put('/updateProduct/:productId', validateObjectId('productId'), validateUpdateProduct, productController.updateProduct);
productRouter.delete('/deleteProduct/:productId', validateObjectId('productId'), productController.deleteProduct);

export default productRouter;