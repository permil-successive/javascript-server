import IUserModel from './IUserModel';
import userModel from './UserModel';
import { VersionableRepository } from '../versionable';
import * as mongoose from 'mongoose';

export default class UserRepository extends VersionableRepository<IUserModel, mongoose.Model<IUserModel>> {
  // private _ERROR_CODE = 400;

  constructor() {
    super(userModel);
  }

  async create(data, currentUser: string): Promise<IUserModel> {
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
