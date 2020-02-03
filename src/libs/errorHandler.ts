import { INotFoundError } from './routes';
import IErrorHandlerResponse from './IErrorHandlerResponse';
import { Request, Response, NextFunction } from 'express';

const ErrorHandler = (err: INotFoundError, req: Request, res: Response, next: NextFunction) => {

  console.debug('in error handler');
  console.debug(err);

  // constructing error object
  if (Array.isArray(err)) {
    const errors: IErrorHandlerResponse[] = [];
    err.forEach((element) => {
      const error: IErrorHandlerResponse = {
        error: `${element.code} - ${element.message}`,
        message: element.message,
        status: element.code,
        timestamp: new Date().toUTCString()
      };

      errors.push(error);
    });

    console.log(errors);
    res.send(errors); // sending error to client
  } else {
    const error: IErrorHandlerResponse = {
      error: `${err.code} - ${err.message}`,
      message: err.message,
      status: err.code,
      timestamp: new Date().toUTCString()
    };

    console.log(error);
    res.send(error); // sending error to client
  }
};

export default ErrorHandler;
