import * as bcrypt from 'bcrypt';
import * as jsonwebtoken from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ResponseHelper, parseStringQuery } from '../../libs';
import { UserRepository } from '../../repositories';
import { configuration } from '../../config';

class Controller {

  static instance: Controller;
  private userRepository: UserRepository;
  private TOKEN_TIMEOUT = Math.floor(Date.now() / 1000) + ( 15 * 60 ); // 15 min

  private constructor() {
    this.userRepository = new UserRepository();
   }

  static getInstance(): Controller {
    if (this.instance)
      return this.instance;

    this.instance = new Controller();
    return this.instance;
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
      const payload = { iss: 'Successive Technologies', exp: this.TOKEN_TIMEOUT, email, id, role, name };

      const token = jsonwebtoken.sign(payload, secretKey);
      const response = ResponseHelper.constructResponse(token);

      ResponseHelper.sendResponse(response, res);
    } catch (err) {
      return next(err);
    }

  }

}


export default Controller.getInstance();
