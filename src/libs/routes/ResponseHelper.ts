import IResponse from './IResponse';
import { Response } from 'express';

class ResponseHelper {
  /**
   *
   * @param data any data in response
   * @param message message of response
   * @param res response object of express
   */
  static sendResponse(data: any, res: Response, message: string = 'successful') {
    const responseMessage: IResponse = {
      'message': message,
      status: 'OK',
      timestamp: new Date().toISOString(),
      'data': data
    };

    res.status(200).send(responseMessage);
  }
}

export default ResponseHelper.sendResponse;
