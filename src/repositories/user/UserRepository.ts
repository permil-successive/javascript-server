import IUserModel from './IUserModel';
import * as mongoose from 'mongoose';
import userModel from './UserModel';

export default class UserRepository {

  private _userModel: mongoose.Model<IUserModel>;
  private _ERROR_CODE = 400;

  constructor() {
    this._userModel = userModel;
  }

  private generateId(): string {
    return mongoose.Types.ObjectId().toHexString();
  }

  counts() {
    return this._userModel.countDocuments({});
  }

  async create(data) {
    const userData = {
      _id: this.generateId(),
      ...data
    };
    console.log(userData);
    const createdData = await this._userModel.create(userData);
    if (!createdData)
      throw {
        message: 'operation not performed',
        code: this._ERROR_CODE
      };
    return createdData;
  }

  findOne(query) {
    return this._userModel.findOne(query);
  }

  async update(id, data) {
    const updatedData = await this._userModel.findOneAndUpdate({_id: id}, data.dataToUpdate);
    if (!updatedData)
      throw {
        message: 'operation not performed',
        code: this._ERROR_CODE
      };
    return updatedData;
  }

  async delete(id) {
    const userData = {_id: id};
    const data = await this._userModel.findOneAndDelete(userData);
    if (!data)
      throw {
        message: 'operation not performed',
        code: this._ERROR_CODE
      };
    return data;
  }

  list(skip: number, limit: number) {
    return this._userModel.find().skip(skip).limit(limit);
  }

}
