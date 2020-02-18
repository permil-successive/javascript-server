import IUserModel from './IUserModel';
import userModel from './UserModel';
import { VersionableRepository } from '../versionable';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { configuration } from '../../config';

export default class UserRepository extends VersionableRepository<IUserModel, mongoose.Model<IUserModel>> {

  constructor() {
    super(userModel);
  }

  async create(data, currentUser: string): Promise<IUserModel> {

    const { SALT_ROUNDS } = configuration;
    const plainPassword = data.password;

    data.password = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    const createdData: IUserModel = await super.create(data, currentUser);
    createdData.set('password', undefined);
    return createdData;
  }

  async findOne(query, password: boolean = false): Promise<IUserModel> {
    const projection: string = password ? '' : '-password';
    return await super.internalFindOne(query, projection);
  }

  async update(id, data, currentUser: string): Promise<IUserModel> {
    const updatedData: IUserModel = await super.update(id, data, currentUser);
    updatedData.set('password', undefined);
    return updatedData;
  }

  async delete(id: string, currentUser: string): Promise<IUserModel> {
    const deletedData = await super.delete(id, currentUser);
    deletedData.set('password', undefined);
    return deletedData;
  }

  async list(skip: number, limit: number): Promise<IUserModel[]> {
    return await super.list(skip, limit, '-password');
  }

}
