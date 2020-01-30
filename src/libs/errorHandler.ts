import IErrorHandlerResponse from './IErrorHandlerResponse';
import INotFoundError from './routes/INotFoundError';
import { Request, Response, NextFunction } from 'express';

const ErrorHandler = (err: INotFoundError, req: Request, res: Response, next: NextFunction) => {

  // constructing error object
  const error: IErrorHandlerResponse = {
    error: `${err.code} - ${err.message}`,
    message: err.message,
    status: err.code,
    timestamp: new Date().toUTCString()
  };

  console.log(error);
  res.send(error); // sending error to client
  next();
};

export default ErrorHandler;
