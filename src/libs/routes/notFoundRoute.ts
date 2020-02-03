import INotFoundError from './INotFoundError';
import { Request, Response, NextFunction } from 'express';

const notFoundRoute = (req: Request, res: Response, next: NextFunction) => {
  const errObj: INotFoundError = {
    message: 'Route not found',
    code: '404',
  };
  next(errObj); // handover control back to event-loop
};

export default notFoundRoute;
