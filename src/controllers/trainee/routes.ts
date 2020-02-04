import { Router } from 'express';
import Controller from './controller';
import { validationHandler } from '../../libs';
import validationConfig from './validations';

const traineeRoutes: Router  = Router();
const { list, create, update, delete: deleteFunction } = Controller;
const { get: getConfig, create: createConfig, update: updateConfig, delete: deleteConfig } = validationConfig;

traineeRoutes.route('/')
.get(validationHandler(getConfig), list)
.post(validationHandler(createConfig), create)
.put(validationHandler(updateConfig), update)
.delete(validationHandler(deleteConfig), deleteFunction);

traineeRoutes.delete('/:id', validationHandler(validationConfig.delete), deleteFunction);

export default traineeRoutes;
