import IUserModel from './IUserModel';
import userModel from './UserModel';
import { VersionableRepository } from '../versionable';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { configuration } from '../../config';
import { IList } from '../entities';

export default class UserRepository extends VersionableRepository<IUserModel, mongoose.Model<IUserModel>> {

  constructor() {
    super(userModel);
  }

  async create(data, currentUser: string): Promise<IUserModel> {

    const { saltRounds } = configuration;
    const plainPassword = data.password;

    data.password = await bcrypt.hash(plainPassword, saltRounds);
    const createdData: IUserModel = await super.create(data, currentUser);
    createdData.set('password', undefined);
    return createdData;
  }

  async findOne(query, projection: string = ''): Promise<IUserModel> {

    console.info('====== inside findOne Repo =======');

    return await super.findOne(query, projection);
  }

  async update(id, data, currentUser: string): Promise<IUserModel> {

    console.info('====== inside update Repo =======');

    const updatedData: IUserModel = await super.update(id, data, currentUser);
    updatedData.set('password', undefined);
    return updatedData;
  }

  async delete(id: string, currentUser: string): Promise<IUserModel> {

    console.info('====== inside delete Repo =======');

    const deletedData = await super.delete(id, currentUser);
    deletedData.set('password', undefined);
    return deletedData;
  }

  async list(query = {}, projection: string = '', options: IList): Promise<IUserModel[]> {

    console.info('====== inside list Repo =======');

    projection = projection + '-password';
    return await super.list(query, projection, options);
  }

}
