import { Request, Response, NextFunction } from 'express';

import INotFoundError from './IError';

/**
 * constructing error of not found route
 */
const notFoundRoute = (req: Request, res: Response, next: NextFunction) => {
  const errObj: INotFoundError = {
    message: 'Route not found',
    code: '404',
  };
  next(errObj); // handover control back to error handler (event-loop)
};

export default notFoundRoute;
