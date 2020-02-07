import { Router } from 'express';
import Controller from './controller';
import { validationHandler, authorizationHandler, PermissionType } from '../../libs';
import validationConfig from './validations';

const traineeRoutes: Router  = Router();
const moduleName = 'trainee';
const { list, create, update, delete: deleteFunction } = Controller;
const { get: getConfig, create: createConfig, update: updateConfig, delete: deleteConfig } = validationConfig;

traineeRoutes.route('/')
.get(authorizationHandler(moduleName, PermissionType.read), validationHandler(getConfig), list)
.post(authorizationHandler(moduleName, PermissionType.write), validationHandler(createConfig), create)
.put(authorizationHandler(moduleName, PermissionType.write), validationHandler(updateConfig), update)
.delete(authorizationHandler(moduleName, PermissionType.delete), validationHandler(deleteConfig), deleteFunction);

traineeRoutes.delete('/:id', authorizationHandler('trainee', 'delete'), validationHandler(validationConfig.delete), deleteFunction);

export default traineeRoutes;
