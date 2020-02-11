import { Request, Response } from 'express';
import { ResponseHelper } from '../../libs';

class Controller {

  static instance: Controller;

  private constructor() { }

  static getInstance(): Controller {
    if (this.instance)
      return this.instance;

    this.instance = new Controller();
    return this.instance;
  }

  create(req: Request, res: Response): void {
    const traineeData = {
      id : 1,
      name : 'Vinay',
      location : 'Noida'
    };

    const response = ResponseHelper.constructResponse(traineeData, 'done');
    ResponseHelper.sendResponse(response, res);
  }

  list(req: Request, res: Response): void {
    const traineeData = [
      {
        id : 1,
        name : 'Vinay',
        location : 'Noida'
      }, {
        id : 2,
        name : 'Vinay',
        location : 'Noida'
      }
    ];

    const response = ResponseHelper.constructResponse(traineeData, 'done');
    ResponseHelper.sendResponse(response, res);
  }

  update(req: Request, res: Response): void {
    const traineeData = {
      id : 1,
      name : 'Vinay',
      location : 'Noida'
    };

    const response = ResponseHelper.constructResponse(traineeData, 'done');
    ResponseHelper.sendResponse(response, res);
  }

  delete(req: Request, res: Response): void {
    const traineeData = {
      id : 1,
      name : 'Vinay',
      location : 'Noida'
    };

    const response = ResponseHelper.constructResponse(traineeData, 'done');
    ResponseHelper.sendResponse(response, res);
  }
}

export default Controller.getInstance();
