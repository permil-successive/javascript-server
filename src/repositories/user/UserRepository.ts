import IUserModel from './IUserModel';
import userModel from './UserModel';
import { VersionableRepository } from '../versionable';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { configuration } from '../../config';

export default class UserRepository extends VersionableRepository<IUserModel, mongoose.Model<IUserModel>> {
  // private _ERROR_CODE = 400;

  constructor() {
    super(userModel);
  }

  async create(data, currentUser: string): Promise<IUserModel> {
      const { SALT_ROUNDS } = configuration;
      const plainPassword = data.password;

      data.password = await bcrypt.hash(plainPassword, SALT_ROUNDS);
      return await super.create(data, currentUser);
  }

}
