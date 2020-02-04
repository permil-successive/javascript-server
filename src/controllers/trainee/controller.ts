import { Request, Response } from 'express';
import IResponse from '../../IResponse';

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

    const responseMessage: IResponse = {
      message: 'Record inserted successfully.',
      status: 'OK',
      timestamp: new Date().toISOString(),
      data: traineeData
    };

    res.status(200).send(responseMessage);
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

    const responseMessage: IResponse = {
      message: 'Record fetched successfully.',
      status: 'OK',
      timestamp: new Date().toISOString(),
      data: traineeData
    };

    res.status(200).send(responseMessage);
  }

  update(req: Request, res: Response): void {
    const traineeData = {
      id : 1,
      name : 'Vinay',
      location : 'Noida'
    };

    const responseMessage: IResponse = {
      message: 'Record updated successfully.',
      status: 'OK',
      timestamp: new Date().toISOString(),
      data: traineeData
    };

    res.status(200).send(responseMessage);
  }

  delete(req: Request, res: Response): void {
    const traineeData = {
      id : 1,
      name : 'Vinay',
      location : 'Noida'
    };

    const responseMessage: IResponse = {
      message: 'Record deleted successfully.',
      status: 'OK',
      timestamp: new Date().toISOString(),
      data: traineeData
    };

    res.status(200).send(responseMessage);
  }
}

export default Controller.getInstance();