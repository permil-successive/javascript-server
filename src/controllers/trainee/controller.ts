import { Request, Response } from 'express';
import { sendResponse } from '../../libs';

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

    sendResponse(traineeData, res, 'done');
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

    sendResponse(traineeData, res);
  }

  update(req: Request, res: Response): void {
    const traineeData = {
      id : 1,
      name : 'Vinay',
      location : 'Noida'
    };

    sendResponse(traineeData, res);
  }

  delete(req: Request, res: Response): void {
    const traineeData = {
      id : 1,
      name : 'Vinay',
      location : 'Noida'
    };

    sendResponse(traineeData, res);
  }
}

export default Controller.getInstance();
