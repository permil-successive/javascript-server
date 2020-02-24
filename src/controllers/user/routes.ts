import { Router } from 'express';
import Controller from './controller';
import validationConfig from './validations';
import { validationHandler, authorizationHandler, PermissionType } from '../../libs';

const userRoutes: Router  = Router();
const { list, create, update, delete: deleteFunction, fetchMe, login } = Controller;
const { get: getConfig, create: createConfig, update: updateConfig, delete: deleteConfig, login: loginConfig } = validationConfig;
const moduleName = 'users';

userRoutes.route('/')
.get(authorizationHandler(moduleName, PermissionType.read), validationHandler(getConfig), list)
.post(authorizationHandler(moduleName, PermissionType.write), validationHandler(createConfig), create)
.put(authorizationHandler(moduleName, PermissionType.write), validationHandler(updateConfig), update);

userRoutes.delete('/:id', authorizationHandler(moduleName, PermissionType.delete), validationHandler(deleteConfig), deleteFunction);
userRoutes.get('/me', authorizationHandler(moduleName, PermissionType.read), validationHandler(getConfig), fetchMe);
userRoutes.get('/login', validationHandler(loginConfig), login);

export default userRoutes;
