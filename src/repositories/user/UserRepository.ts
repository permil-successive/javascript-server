import IUserModel from './IUserModel';
import userModel from './UserModel';
import { VersionableRepository } from '../versionable';
import * as mongoose from 'mongoose';

export default class UserRepository extends VersionableRepository<IUserModel, mongoose.Model<IUserModel>> {
  // private _ERROR_CODE = 400;

  constructor() {
    super(userModel);
  }

}
