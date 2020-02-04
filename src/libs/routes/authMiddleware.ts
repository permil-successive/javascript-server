import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import IError from '../IError';
import config from '../../config/configuration';
import { hasPermission } from './utils/index';

export default (currentModule: string, permissionType: string) => (req: Request, res: Response, next: NextFunction) => {
  console.info('==============inside auth middleware===================');

  const error: IError = {
    code: '401',
    message: 'Unathorised Access'
  };

  try {

    const token = req.headers.authorization;
    console.debug(token);
    const decodedUser = jwt.verify(token, config.secretKey);

    console.debug('decoded user = ', decodedUser);

    if (!decodedUser) {
      console.info('invalid token or user not decoded');
      return next(error);
    }

    if (!hasPermission(currentModule, decodedUser.role, permissionType)) {
      console.info(`unauthorised access to ${decodedUser.role} while ${permissionType} in ${currentModule}`);
      return next(error);
    }

    return next();
  } catch (exception) {
    console.error(exception);
    error.message = exception.name;
    next(error);
  }
};
