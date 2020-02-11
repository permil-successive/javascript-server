import { Request, Response, NextFunction } from 'express';
import { ResponseHelper, IRequest } from '../../libs';
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

  create = async (req: Request, res: Response, next: NextFunction) => {

    try {
      const data = await this.userRepository.create(req.body);

      const response = ResponseHelper.constructResponse(data, 'data inserted');
      ResponseHelper.sendResponse(response, res);
    } catch (err) {
      next(err);
    }
  }

  fetchMe = async (req: IRequest, res: Response, next: NextFunction) => {

    try {
      const response = ResponseHelper.constructResponse(req.user, 'data fetched');
      ResponseHelper.sendResponse(response, res);
    } catch (err) {
      next(err);
    }
  }

  list = async (req: Request, res: Response, next: NextFunction) => {

    try {
      const data = await this.userRepository.list(parseInt(req.query.skip, 10), parseInt(req.query.limit, 10));

      const response = ResponseHelper.constructResponse(data, 'data fetched');
      ResponseHelper.sendResponse(response, res);
    } catch (err) {
      next(err);
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.userRepository.update(req.body.id, req.body);

      const response = ResponseHelper.constructResponse(data, 'data updated');
      ResponseHelper.sendResponse(response, res);
    } catch (err) {
      next(err);
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.userRepository.delete(req.params.id);

      const response = ResponseHelper.constructResponse(data, 'data deleted');
      ResponseHelper.sendResponse(response, res);
    } catch (err) {
      next(err);
    }
  }
}

export default Controller.getInstance();
