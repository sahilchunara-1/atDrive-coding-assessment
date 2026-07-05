import Router from 'express';
import userController from '../controllers/user.controller.js';
import { validateLogin, validateRegister } from '../validators/user.validator.js';

const userRouter = Router();

userRouter.post('/register', validateRegister, userController.register);
userRouter.post('/login', validateLogin,userController.login);

export default userRouter;
