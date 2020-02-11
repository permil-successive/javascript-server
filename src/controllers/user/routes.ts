import { Router } from 'express';
import Controller from './controller';
import validationConfig from './validations';
import { validationHandler, authorizationHandler, PermissionType } from '../../libs';

const userRoutes: Router  = Router();
const { list, create, update, delete: deleteFunction, fetchMe } = Controller;
const { get: getConfig, create: createConfig, update: updateConfig, delete: deleteConfig } = validationConfig;
const moduleName = 'user';

userRoutes.route('/')
.get(authorizationHandler(moduleName, PermissionType.read), validationHandler(getConfig), list)
.post(authorizationHandler(moduleName, PermissionType.write), validationHandler(createConfig), create)
.put(authorizationHandler(moduleName, PermissionType.write), validationHandler(updateConfig), update)
.delete(authorizationHandler(moduleName, PermissionType.delete), validationHandler(deleteConfig), deleteFunction);

userRoutes.delete('/:id', authorizationHandler(moduleName, PermissionType.delete), validationHandler(deleteConfig), deleteFunction);
userRoutes.get('/me', authorizationHandler(moduleName, PermissionType.read), validationHandler(getConfig), fetchMe);

export default userRoutes;
