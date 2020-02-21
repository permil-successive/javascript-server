import * as bcrypt from 'bcrypt';
import * as jsonwebtoken from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ResponseHelper, parseStringQuery } from '../../libs';
import { UserRepository } from '../../repositories';
import { configuration } from '../../config';
import { ISearch } from '../../repositories/entities';

class Controller {

  static instance: Controller;
  private userRepository: UserRepository;
  private _TOKEN_TIMEOUT = Math.floor(Date.now() / 1000) + ( 15 * 60 ); // 15 min

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

    console.info('====== inside create user controller =======');

    try {
      const { user: currentUser } = res.locals;
      const { email } = req.body;
      const isExist = await this.userRepository.findOne({email});
      if (isExist)
        throw { message: 'Record already exists', code: 422 };

      const data = await this.userRepository.create(req.body, currentUser.originalId);

      const response = ResponseHelper.constructResponse(data, 'data inserted');
      ResponseHelper.sendResponse(response, res);
    } catch (err) {
      next(err);
    }
  }

  fetchMe = async (req: Request, res: Response, next: NextFunction) => {

    console.info('====== inside fetch user controller =======');

    try {
      const { user } = res.locals;
      const response = ResponseHelper.constructResponse(user, 'data fetched');
      ResponseHelper.sendResponse(response, res);
    } catch (err) {
      next(err);
    }
  }

  list = async (req: Request, res: Response, next: NextFunction) => {

    console.info('====== inside list user controller =======');

    try {
      const { skip, limit, sort, search: searchQuery = '' } = req.query;
      const search: ISearch = parseStringQuery(searchQuery, (value) => {
        const regExpToSearch = new RegExp(value, 'i');
        console.info('regExpToSearch = ', regExpToSearch);
        return regExpToSearch;
      });
      const count = await this.userRepository.counts();
      const records = await this.userRepository.list({skip, limit, sort, search });

      const response = ResponseHelper.constructResponse({ count, records }, 'data fetched');
      ResponseHelper.sendResponse(response, res);
    } catch (err) {
      next(err);
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {

    console.info('====== inside update user controller =======');

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

    console.info('====== inside delete user controller =======');

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

  login = async (req: Request, res: Response, next: NextFunction) => {

    console.info('====== inside login user controller =======');

    try {
      const { email, password } = req.body;
      const { secretKey } = configuration;

      const user = await this.userRepository.findOne({ email }, true);

      console.log('email =', email);

      if (!user) {
        console.info('user doesnot exists');
        throw { message: 'Incorrect username/password', code: '401' };
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        console.info('password mismatch');
        throw { message: 'Incorrect username/password', code: '401' };
      }

      const { originalId: id, role, name } = user;
      const payload = { iss: 'Successive Technologies', exp: this._TOKEN_TIMEOUT, email, id, role, name };

      const token = jsonwebtoken.sign(payload, secretKey);
      const response = ResponseHelper.constructResponse(token);

      ResponseHelper.sendResponse(response, res);
    } catch (err) {
      return next(err);
    }

  }

}


export default Controller.getInstance();
