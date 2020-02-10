import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import IError from '../IError';
import config from '../../config/configuration';
import { hasPermission } from './utils/index';

const ERROR_CODE = '401';

export default (currentModule: string, permissionType: string) => (req: Request, res: Response, next: NextFunction) => {
  console.info('==============inside auth middleware===================');

  try {

    const token = req.headers.authorization;
    console.debug(token);
    const decodedUser = jwt.verify(token, config.secretKey);

    const error: IError = {
      code: ERROR_CODE,
      message: 'Unathorised Access'
    };

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

    const error: IError = {
      code: ERROR_CODE,
      message: exception.name
    };

    next(error);
  }
};
