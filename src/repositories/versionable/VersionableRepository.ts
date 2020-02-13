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

  private generateBy(currentUser: string) {
    if (!currentUser)
      throw new Error('current user is not provided');
    return {
      createdBy: currentUser,
      updatedBy: currentUser,
    };
  }

  private generateDeletedBy(currentUser: string) {
    if (!currentUser)
      throw new Error('current user is not provided');
    return {
      deletedBy: currentUser,
      deletedAt: new Date(),
    };
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
      ...this.generateBy(currentUser),
      ...data
    };

    const createdData = await this.model.create(userData);
    if (!createdData)
      throw {
        message: 'operation not performed',
        code: this._ERROR_CODE
      };
    createdData.set('password', undefined);
    return createdData;
  }

  async findOne(query, password: boolean = false): Promise<D> {
    let abcd = {};
    if (query.id || query._id) {
      abcd = { originalId: query.id || query._id };
      delete query.id;
      delete query._id;
    }

    const myquery = {...abcd, ...query, ...this._deleteQuery};
    console.log(myquery);
    const projection = password ? '' : '-password';
    return await this.model.findOne(myquery, projection);
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
      updatedAt: new Date().toISOString(),
      ...this.generateBy(currentUser),
      ...data
    };
    console.info('dataToUpdate = ', dataToUpdate);
    const updatedData = await this.model.create(dataToUpdate);
    if (!updatedData) {
      throw {
        message: 'operation not performed',
        code: this._ERROR_CODE
      };
    }

    const updatedPreviousData = await this.model.findByIdAndUpdate({ _id: originalData._id }, this.generateDeletedBy(currentUser));
    if (!updatedPreviousData)
      throw {
        message: 'operation not performed',
        code: this._ERROR_CODE
      };
    updatedData.set('password', undefined);
    return updatedData;
  }

  async delete(id: string, currentUser: string): Promise<D> {
    const query = { originalId: id, ...this._deleteQuery };
    const data = await this.model.findOneAndUpdate(query, this.generateDeletedBy(currentUser));
    if (!data)
      throw {
        message: 'operation not performed',
        code: this._ERROR_CODE
      };
    data.set('password', undefined);
    return data;
  }

  async list(skip: number, limit: number): Promise<D[]> {
    const query = { ...this._deleteQuery };
    return await this.model.find(query, '-password').skip(skip).limit(limit);
  }
}
