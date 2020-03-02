import { Request, Response, NextFunction } from 'express';
import { ResponseHelper, parseStringQuery, Roles } from '../../libs';
import { UserRepository } from '../../repositories';
import { ISearch } from '../../repositories/entities';

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

  create = async (req: Request, res: Response, next: NextFunction) => {

    console.info('====== inside create trainee controller =======');

    try {
      const { user: currentUser } = res.locals;
      const { email } = req.body;
      req.body.role = 'trainee';

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

  list = async (req: Request, res: Response, next: NextFunction) => {

    console.info('====== inside list trainee controller =======');

    const { role = '100' } = res.locals.user;

    try {
      const { skip, limit, sort, search: searchQuery = '' } = req.query;
      const exludeUsers = [...Array(Roles[role]).keys()].map((i) => Roles[i]);
      console.log('excludeUsers =', exludeUsers);
      const search: ISearch = parseStringQuery(searchQuery, (value) => {

        const regExpToSearch = new RegExp(value, 'i');
        console.info('regExpToSearch = ', regExpToSearch);
        return regExpToSearch;

      });
      const exclude = { role : { '$nin': exludeUsers }};
      const count = await this.userRepository.counts();
      const records = await this.userRepository.list({skip, limit, sort, search, exclude });

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

      const notPermittedUsers = [...Array(Roles[currentUser.role]).keys()].map((i) => Roles[i]);
      console.log('notPermittedUsers =', notPermittedUsers);

      const data = await this.userRepository.update(id, dataToUpdate, currentUser.originalId, notPermittedUsers);

      const response = ResponseHelper.constructResponse(data, 'data updated');
      ResponseHelper.sendResponse(response, res);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    console.info('====== inside delete trainee controller =======');

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
