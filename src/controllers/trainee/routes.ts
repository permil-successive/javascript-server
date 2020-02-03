import { Router } from 'express';
import Controller from './controller';
import { validationHandler } from '../../libs';
import validationConfig from './validations';

const traineeRoutes: Router  = Router();
const { list, create, update, delete: deleteFunction } = Controller;

traineeRoutes.route('/')
.get(validationHandler(validationConfig.get), list)
.post(validationHandler(validationConfig.create), create)
.put(validationHandler(validationConfig.update), update)
.delete(validationHandler(validationConfig.delete), deleteFunction);

traineeRoutes.delete('/:id', validationHandler(validationConfig.delete), deleteFunction);

export default traineeRoutes;
