import { INotFoundError } from './routes';
import IErrorHandlerResponse from './IErrorHandlerResponse';
import { Request, Response, NextFunction } from 'express';

const formatError = (err: INotFoundError): IErrorHandlerResponse => {
  return {
    error: `${err.code} - ${err.message}`,
    message: err.message,
    status: err.code,
    timestamp: new Date().toUTCString()
  };
};

const constructErrors = (err: INotFoundError): IErrorHandlerResponse[] => {
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

const ErrorHandler = (err: INotFoundError, req: Request, res: Response, next: NextFunction) => {

  console.debug('===================inside error handler===============================');
  console.debug('err = ', err);
  let errors: IErrorHandlerResponse[];

  // constructing error object
  errors = constructErrors(err);

  console.info(errors);
  // TODO: fix error code in response
  res.status(401).send(errors); // sending error to client
};

export default ErrorHandler;
