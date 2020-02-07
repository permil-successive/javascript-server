import IUserModel from './IUserModel';
import * as mongoose from 'mongoose';
import userModel from './UserModel';

export default class UserRepository {

  private _userModel: mongoose.Model<IUserModel>;

  constructor() {
    this._userModel = userModel;
  }

  private generateId(): string {
    return mongoose.Types.ObjectId().toHexString();
  }

  counts() {
    return this._userModel.countDocuments({});
  }

  create(data) {
    const userData = {
      _id: this.generateId(),
      ...data
    };
    console.log(userData);
    return this._userModel.create(userData);
  }

  findOne(query) {
    return this._userModel.findOne(query);
  }

  update(id, data) {
    return this._userModel.findOneAndUpdate({_id: id}, data.dataToUpdate);
  }

  delete(id) {
    const userData = {_id: id};
    return this._userModel.findOneAndDelete(userData);
  }

  list() {
    return this._userModel.find();
  }

}
