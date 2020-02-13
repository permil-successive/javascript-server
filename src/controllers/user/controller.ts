import * as bcrypt from 'bcrypt';
import * as jsonwebtoken from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ResponseHelper, IRequest } from '../../libs';
import { UserRepository } from '../../repositories';
import { configuration } from '../../config';

class Controller {

  static instance: Controller;
  private userRepository: UserRepository;

  private constructor() {
    this.userRepository = new UserRepository();
   }

  static getInstance(): Controller {
    if (this.instance)
      return this.instance;

    this.instance = new Controller();
    return this.instance;
  }

  create = async (req: IRequest, res: Response, next: NextFunction) => {

    try {
      const data = await this.userRepository.create(req.body, req.user.originalId);

      const response = ResponseHelper.constructResponse(data, 'data inserted');
      ResponseHelper.sendResponse(response, res);
    } catch (err) {
      next(err);
    }
  }

  fetchMe = async (req: IRequest, res: Response, next: NextFunction) => {

    try {
      console.log(req.user);
      const response = ResponseHelper.constructResponse(req.user, 'data fetched');
      ResponseHelper.sendResponse(response, res);
    } catch (err) {
      next(err);
    }
  }

  list = async (req: Request, res: Response, next: NextFunction) => {

    try {
      const data = await this.userRepository.list(req.query.skip, req.query.limit);

      const response = ResponseHelper.constructResponse(data, 'data fetched');
      ResponseHelper.sendResponse(response, res);
    } catch (err) {
      next(err);
    }
  }

  update = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.userRepository.update(req.body.id, req.body.dataToUpdate, req.user.originalId);

      const response = ResponseHelper.constructResponse(data, 'data updated');
      ResponseHelper.sendResponse(response, res);
    } catch (err) {
      next(err);
    }
  }

  delete = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.userRepository.delete(req.params.id, req.user.originalId);

      const response = ResponseHelper.constructResponse(data, 'data deleted');
      ResponseHelper.sendResponse(response, res);
    } catch (err) {
      next(err);
    }
  }

  login = async (req: IRequest, res: Response, next: NextFunction) => {

    try {
      const { email, password } = req.body;
      const { secretKey } = configuration;

      const user = await this.userRepository.findOne({ email }, true);

      console.log('email =', email);

      if (!user) {
        console.info('user doesnot exists');
        throw new Error('Incorrect username/password');
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        console.info('password mismatch');
        throw new Error('Incorrect username/password');
      }

      const TimeOut = Math.floor(Date.now() / 1000) + ( 15 * 60 );
      const { originalId: id, role, name } = user;
      const payload = { iss: 'Successive Technologies', exp: TimeOut, email, id, role, name };

      const token = jsonwebtoken.sign(payload, secretKey);
      const response = ResponseHelper.constructResponse(token);

      ResponseHelper.sendResponse(response, res);
    } catch (err) {
      return next(err);
    }

  }

}


export default Controller.getInstance();
