import IError from './IError';
import IErrorHandlerResponse from './IErrorHandlerResponse';
import { Request, Response, NextFunction } from 'express';

/**
 * construct the standard JSON error object
 */
const formatError = (err: IError): IErrorHandlerResponse => {

  console.debug('===========inside format error==================');
  console.debug('err = ', err);

  return {
    error: `${err.code} - ${err.message}`,
    message: err.message,
    status: 'Error',
    timestamp: new Date().toISOString()
  };
};

/**
 * constructing an error object for response
 */
const constructErrors = (err: IError): IErrorHandlerResponse[] => {

  console.debug('===========inside format error==================');
  console.debug('err = ', err);

  const errors: IErrorHandlerResponse[] = [];
  if (Array.isArray(err)) {
    err.forEach((element) => {
      errors.push(formatError(element));
    });
  } else {
    errors.push(formatError(err));
  }

  return errors;
};


const ErrorHandler = (err: IError, req: Request, res: Response, next: NextFunction) => {

  console.debug('===================inside error handler===============================');
  console.debug('err = ', err);

  let errors: IErrorHandlerResponse[];

  errors = constructErrors(err);

  console.info('errors = ', errors);

  res.status(err.code || err[0].code || 500).send(errors); // sending error to client
};

export default ErrorHandler;
