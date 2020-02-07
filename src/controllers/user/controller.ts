import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../../libs';
import { UserRepository } from '../../repositories';
import { IRequest } from '../../libs';

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

  create = async (req: Request, res: Response, next: NextFunction) => {

    try {
      sendResponse(await this.userRepository.create(req.body), res, 'data inserted');
    } catch (err) {
      next(err);
    }
  }

  fetchMe = async (req: IRequest, res: Response, next: NextFunction) => {

    try {
      sendResponse(req.user, res, 'data fetched');
    } catch (err) {
      next(err);
    }
  }

  list = async (req: Request, res: Response, next: NextFunction) => {

    console.log('UserRepo');
    console.log(this);
    console.log(this.userRepository);

    try {
      sendResponse(await this.userRepository.list(req.body), res, 'data fetched');
    } catch (err) {
      next(err);
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      sendResponse(await this.userRepository.update(req.body.id, req.body), res, 'data updated');
    } catch (err) {
      next(err);
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      sendResponse(await this.userRepository.delete(req.params.id), res, 'data deleted');
    } catch (err) {
      next(err);
    }
  }
}

export default Controller.getInstance();
