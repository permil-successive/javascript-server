import * as mongoose from 'mongoose';
import IVersionableDocument from './IVersionableDocument';

export default class VersionableRepository<D extends IVersionableDocument, M extends mongoose.Model<D>> {
  protected MODEL: M;
  private readonly ERROR_CODE: number = 400;
  private readonly DELETE_QUERY = { deletedAt: { '$exists': false } };

  constructor(model: M) {
    this.MODEL = model;
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
        code: this.ERROR_CODE
      };
    return true;
  }

  public async counts(): Promise<number> {
    const query = this.DELETE_QUERY;
    return await this.MODEL.countDocuments(query);
  }

  protected async create(data, currentUser: string): Promise<D> {
    const newId = this.generateId();
    const userData = {
      _id: newId,
      originalId: newId,
      ...this.generateCreatedInfo(currentUser),
      ...this.generateUpdatedInfo(currentUser),
      ...data
    };

    const createdData = await this.MODEL.create(userData);
    this.isOperationSuccess(createdData);
    return createdData;
  }

  protected async internalFindOne(query, projection: string): Promise<D> {
    let orgIdObj = {};
    if (query.id || query._id)
      orgIdObj = { originalId: query.id || query._id };

    const myQuery = {...orgIdObj, ...query, ...this.DELETE_QUERY};
    delete myQuery.id;
    delete myQuery._id;

    console.log(myQuery);
    return await this.MODEL.findOne(myQuery, projection);
  }

  protected async update(id, data, currentUser: string): Promise<D> {
    const query = { originalId: id, ...this.DELETE_QUERY };
    const originalData = await this.MODEL.findOne(query);
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

    const updatedData = await this.MODEL.create(dataToUpdate);
    this.isOperationSuccess(updatedData);

    const updatedPreviousData = await this.MODEL.findByIdAndUpdate({ _id: originalData._id }, this.generateDeletedInfo(currentUser));
    this.isOperationSuccess(updatedPreviousData);
    return updatedData;
  }

  protected async delete(id: string, currentUser: string): Promise<D> {
    const query = { originalId: id, ...this.DELETE_QUERY };
    const data = await this.MODEL.findOneAndUpdate(query, this.generateDeletedInfo(currentUser));
    this.isOperationSuccess(data);
    return data;
  }

  protected async list(skip: number, limit: number, projection: string = ''): Promise<D[]> {
    const query = { ...this.DELETE_QUERY };
    return await this.MODEL.find(query, projection).skip(skip).limit(limit);
  }
}