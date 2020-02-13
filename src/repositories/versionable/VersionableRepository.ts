import * as mongoose from 'mongoose';
import IVersionableDocument from './IVersionableDocument';

export default class VersionableRepository<D extends IVersionableDocument, M extends mongoose.Model<D>> {
  model: M;
  _ERROR_CODE = 400;
  private _deleteQuery = { deletedAt: {'$exists': false} };

  constructor(model: M) {
    this.model = model;
  }

  private generateId(): string {
    return mongoose.Types.ObjectId().toHexString();
  }

  private generateUpdatedInfo(currentUser: string) {
    if (!currentUser)
      throw new Error('current user is not provided');
    return {
      updatedBy: currentUser,
      updatedAt: new Date(),
    };
  }

  private generateCreatedInfo(currentUser: string) {
    if (!currentUser)
      throw new Error('current user is not provided');
    return {
      createdBy: currentUser,
      createdAt: new Date(),
    };
  }

  private generateDeletedInfo(currentUser: string) {
    if (!currentUser)
      throw new Error('current user is not provided');
    return {
      deletedBy: currentUser,
      deletedAt: new Date(),
    };
  }

  private isOperationSuccess(res) {
    if (!res)
      throw {
        message: 'operation not performed',
        code: this._ERROR_CODE
      };
    return true;
  }

  async counts(): Promise<number> {
    const query = this._deleteQuery;
    return await this.model.countDocuments(query);
  }

  async create(data, currentUser: string): Promise<D> {
    const newId = this.generateId();
    const userData = {
      _id: newId,
      originalId: newId,
      ...this.generateCreatedInfo(currentUser),
      ...this.generateUpdatedInfo(currentUser),
      ...data
    };

    const createdData = await this.model.create(userData);
    this.isOperationSuccess(createdData);

    createdData.set('password', undefined);
    return createdData;
  }

  async findOne(query, password: boolean = false): Promise<D> {
    let orgIdObj = {};
    if (query.id || query._id)
      orgIdObj = { originalId: query.id || query._id };

    const myQuery = {...orgIdObj, ...query, ...this._deleteQuery};
    delete myQuery.id;
    delete myQuery._id;

    console.log(myQuery);
    const projection = password ? '' : '-password';
    return await this.model.findOne(myQuery, projection);
  }

  async update(id, data, currentUser: string): Promise<D> {
    const query = { originalId: id, ...this._deleteQuery };
    const originalData = await this.model.findOne(query);
    if (!originalData) {
      throw new Error('record for this ID doesn\'t exist');
    }

    const dataToUpdate = {
      ...originalData.toJSON(),
      _id: this.generateId(),
      ...this.generateUpdatedInfo(currentUser),
      createdBy: this.generateCreatedInfo(currentUser).createdBy,
      ...data
    };
    console.info('dataToUpdate = ', dataToUpdate);

    const updatedData = await this.model.create(dataToUpdate);
    this.isOperationSuccess(updatedData);

    const updatedPreviousData = await this.model.findByIdAndUpdate({ _id: originalData._id }, this.generateDeletedInfo(currentUser));
    this.isOperationSuccess(updatedPreviousData);
    updatedData.set('password', undefined);
    return updatedData;
  }

  async delete(id: string, currentUser: string): Promise<D> {
    const query = { originalId: id, ...this._deleteQuery };
    const data = await this.model.findOneAndUpdate(query, this.generateDeletedInfo(currentUser));
    this.isOperationSuccess(data);
    data.set('password', undefined);
    return data;
  }

  async list(skip: number, limit: number): Promise<D[]> {
    const query = { ...this._deleteQuery };
    return await this.model.find(query, '-password').skip(skip).limit(limit);
  }
}
