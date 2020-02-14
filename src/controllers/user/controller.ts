import { Request, Response, NextFunction } from 'express';
import { ResponseHelper } from '../../libs';
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
      const { user: currentUser } = res.locals;
      const data = await this.userRepository.create(req.body, currentUser.originalId);

      const response = ResponseHelper.constructResponse(data, 'data inserted');
      ResponseHelper.sendResponse(response, res);
    } catch (err) {
      next(err);
    }
  }

  fetchMe = async (req: Request, res: Response, next: NextFunction) => {

    try {
      const { user } = res.locals;
      const response = ResponseHelper.constructResponse(user, 'data fetched');
      ResponseHelper.sendResponse(response, res);
    } catch (err) {
      next(err);
    }
  }

  list = async (req: Request, res: Response, next: NextFunction) => {

    try {
      const { skip, limit } = req.query;
      const data = await this.userRepository.list(skip, limit);

      const response = ResponseHelper.constructResponse(data, 'data fetched');
      ResponseHelper.sendResponse(response, res);
    } catch (err) {
      next(err);
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, dataToUpdate } = req.body;
      const { user: currentUser } = res.locals;
      const data = await this.userRepository.update(id, dataToUpdate, currentUser.originalId);

      const response = ResponseHelper.constructResponse(data, 'data updated');
      ResponseHelper.sendResponse(response, res);
    } catch (err) {
      next(err);
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { user: currentUser } = res.locals;
      const data = await this.userRepository.delete(id, currentUser.originalId);

      const response = ResponseHelper.constructResponse(data, 'data deleted');
      ResponseHelper.sendResponse(response, res);
    } catch (err) {
      next(err);
    }
  }
}

export default Controller.getInstance();
