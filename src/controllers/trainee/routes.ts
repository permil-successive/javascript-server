import { Router } from 'express';
import Controller from './controller';
import { validationHandler } from '../../libs';
import validationConfig from './validations';
import { authorizationHandler } from '../../libs/routes';

const traineeRoutes: Router  = Router();
const { list, create, update, delete: deleteFunction } = Controller;
const { get: getConfig, create: createConfig, update: updateConfig, delete: deleteConfig } = validationConfig;

traineeRoutes.route('/')
.get(authorizationHandler('trainee', 'read'), validationHandler(getConfig), list)
.post(authorizationHandler('trainee', 'write'), validationHandler(createConfig), create)
.put(authorizationHandler('trainee', 'write'), validationHandler(updateConfig), update)
.delete(authorizationHandler('trainee', 'delete'), validationHandler(deleteConfig), deleteFunction);

<<<<<<< HEAD
traineeRoutes.delete('/:id', authorizationHandler('trainee', 'delete'), validationHandler(validationConfig.delete), deleteFunction);
=======
traineeRoutes.delete('/:id', validationHandler(deleteConfig), deleteFunction);
>>>>>>> 535d9e621d732678ec3a17ec90d6235829d88800

export default traineeRoutes;
