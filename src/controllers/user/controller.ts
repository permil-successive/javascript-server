import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../../libs';
import { UserRepository } from '../../repositories';

class Controller {

  static instance: Controller;
  private userRepository;

  private constructor() {
    this.userRepository = new UserRepository();
   }

  static getInstance(): Controller {
    if (this.instance)
      return this.instance;

    this.instance = new Controller();
    return this.instance;
  }

  async create(req: Request, res: Response, next: NextFunction) {

    try {
      sendResponse(await this.userRepository.create(req.body), res, 'data inserted');
    } catch (err) {
      next(err);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {

    try {
      sendResponse(await this.userRepository.list(req.body), res, 'data fetched');
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      sendResponse(await this.userRepository.update(req.body), res, 'data updated');
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      sendResponse(await this.userRepository.list(req.body), res, 'data deleted');
    } catch (err) {
      next(err);
    }
  }
}

export default Controller.getInstance();
