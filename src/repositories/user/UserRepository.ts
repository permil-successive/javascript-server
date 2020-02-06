import IUserModel from './IUserModel';
import * as mongoose from 'mongoose';
import userModel from './UserModel';

export default class UserRepository {

  private _userModel: mongoose.Model<IUserModel>;

  constructor() {
    this._userModel = userModel;
  }

  counts() {
    return this._userModel.count({});
  }

  create(data) {
    return this._userModel.create(data);
  }

  update(data, id) {
    return this._userModel.findByIdAndUpdate(id, data);
  }

  deleteFunction(id) {
    return this._userModel.findByIdAndDelete(id);
  }

  list(id) {
    return this._userModel.findById(id);
  }

}
