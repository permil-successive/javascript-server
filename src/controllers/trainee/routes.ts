import { Router } from 'express';
import Controller from './controller';
import { validationHandler } from '../../libs';
import validationConfig from './validations';
import authorizationHandler from '../../libs/routes/authMiddleware';

const traineeRoutes: Router  = Router();
const { list, create, update, delete: deleteFunction } = Controller;

traineeRoutes.route('/')
.get(authorizationHandler('trainee', 'read'), validationHandler(validationConfig.get), list)
.post(authorizationHandler('trainee', 'write'), validationHandler(validationConfig.create), create)
.put(authorizationHandler('trainee', 'write'), validationHandler(validationConfig.update), update)
.delete(authorizationHandler('trainee', 'delete'), validationHandler(validationConfig.delete), deleteFunction);

traineeRoutes.delete('/:id', authorizationHandler('trainee', 'delete'), validationHandler(validationConfig.delete), deleteFunction);

export default traineeRoutes;
