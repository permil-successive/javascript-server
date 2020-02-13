import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import IError from './IError';
import config from '../../config/configuration';
import { hasPermission } from './utils';
import { UserRepository, IUserModel } from '../../repositories';
import IRequest from './IRequest';

const ERROR_CODE = '401';

/**
 * validate the user from the request
 *
 *  @param currentModule name of the module user accessing
 *  @param permissionType type of permission required to complete the request like read, write, delete
 *
 *  @returns express request handler
 */
export default (currentModule: string, permissionType: string) => async (req: IRequest, res: Response, next: NextFunction) => {
  console.info('==============inside auth middleware===================');

  try {

    const { authorization: token } = req.headers;
    console.debug('token = ', token);
    const decodedUser = jwt.verify(token, config.secretKey);

    const error: IError = {
      code: ERROR_CODE,
      message: 'Unathorised Access'
    };

    console.debug('decoded user = ', decodedUser);

    if (!decodedUser.id) {
      console.info('invalid token or user not decoded');
      return next(error);
    }

    // repo
    const userRepository: UserRepository = new UserRepository();
    const user: IUserModel = await userRepository.findOne({
      _id : decodedUser.id,
      email: decodedUser.email
    });

    if (!user) {
      console.info('given user doesn\'t exist');
      return next(error);
    }

    req.user = user; // assigning user to request for further use

    console.log(">>>>>>>>", req.user);

    if (!hasPermission(currentModule, user.role, permissionType)) {
      console.info(`unauthorised access to ${user.role} while ${permissionType} in ${currentModule}`);
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
