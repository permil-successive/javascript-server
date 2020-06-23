import { Response } from 'express';

import IResponse from './IResponse';

class ResponseHelper {

  static constructResponse(data: any, message: string = 'successful') {
    const responseMessage: IResponse = {
      'message': message,
      status: 'OK',
      timestamp: new Date().toISOString(),
      'data': data
    };

    return responseMessage;
  }

  static sendResponse(resData: any, res: Response, resCode: number = 200) {

    res.status(resCode).send(resData);
  }
}

export default ResponseHelper;
