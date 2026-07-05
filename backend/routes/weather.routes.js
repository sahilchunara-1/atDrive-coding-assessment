import express from 'express';
import weatherController from '../controllers/weather.controller.js';
import { validateWeather } from '../validators/weather.validator.js';

const weatherRouter = express.Router();

weatherRouter.get('/', validateWeather, weatherController.getWeather);

export default weatherRouter;