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
    return createdData;
  }

  async findOne(query): Promise<D> {
    const myquery = {originalId: query.id || query._id, ...query, ...this._deleteQuery};
    return await this.model.findOne(myquery);
  }

  async update(id, data, currentUser: string): Promise<D> {
    const query = { originalId: id, ...this._deleteQuery };
    const originalData = await this.model.findOne(query);
    if (!originalData) {
      throw new Error('record for this ID doesn\'t exist');
    }
    const dataToUpdate = {
      _id: this.generateId(),
      originalId: originalData.originalId,
      updatedAt: new Date().toISOString(),
      ...this.generateBy(currentUser),
      ...data
    };
    const updatedData = await this.model.create(dataToUpdate);
    const updatedPreviousData = await this.model.findByIdAndUpdate({ _id: originalData._id }, this.generateDeletedBy(currentUser));
    if (!updatedData && !updatedPreviousData)
      throw {
        message: 'operation not performed',
        code: this._ERROR_CODE
      };
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
    return data;
  }

  async list(skip: number, limit: number): Promise<D[]> {
    const query = { ...this._deleteQuery };
    return await this.model.find(query).skip(skip).limit(limit);
  }
}
