import { Router } from 'express';
import Controller from './controller';
import validationConfig from './validations';
import { validationHandler } from '../../libs';
import { authorizationHandler } from '../../libs/routes';

const userRoutes: Router  = Router();
const { list, create, update, delete: deleteFunction } = Controller;
const { get: getConfig, create: createConfig, update: updateConfig, delete: deleteConfig } = validationConfig;
const moduleName = 'trainee';
const enum PermissionType { read = 'read', write = 'write', delete = 'delete' }

userRoutes.route('/')
.get(authorizationHandler(moduleName, PermissionType.read), validationHandler(getConfig), list)
.post(authorizationHandler(moduleName, PermissionType.write), validationHandler(createConfig), create)
.put(authorizationHandler(moduleName, PermissionType.write), validationHandler(updateConfig), update)
.delete(authorizationHandler(moduleName, PermissionType.delete), validationHandler(deleteConfig), deleteFunction);

export default userRoutes;
