import * as mongoose from 'mongoose';
import IVersionableDocument from './IVersionableDocument';
import { IList } from '../entities';

export default class VersionableRepository<D extends IVersionableDocument, M extends mongoose.Model<D>> {
  protected MODEL: M;
  private readonly ERROR_CODE: number = 422;
  private readonly DELETE_QUERY = { deletedAt: { '$exists': false } };

  constructor(model: M) {
    this.MODEL = model;
  }

  private generateId(): string {
    return mongoose.Types.ObjectId().toHexString();
  }

  private getUpdatedInfo(currentUser: string, doneAt: Date = new Date()) {
    if (!currentUser)
      throw new Error('current user is not provided');
    return {
      updatedBy: currentUser,
      updatedAt: doneAt.toISOString(),
    };
  }

  private getCreatedInfo(currentUser: string, doneAt: Date = new Date()) {
    if (!currentUser)
      throw new Error('current user is not provided');
    return {
      createdBy: currentUser,
      createdAt: doneAt.toISOString(),
    };
  }

  private getDeletedInfo(currentUser: string) {
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

    console.info('====== inside counts VersionableRepo =======');

    const query = this.DELETE_QUERY;
    return await this.MODEL.countDocuments(query);
  }

  protected async create(data, currentUser: string): Promise<D> {

    console.info('====== inside create VersionableRepo =======');

    const newId = this.generateId();
    const startedAt = new Date();
    const userData = {
      _id: newId,
      originalId: newId,
      ...this.getCreatedInfo(currentUser, startedAt),
      ...this.getUpdatedInfo(currentUser, startedAt),
      ...data
    };

    const createdData = await this.MODEL.create(userData);
    this.isOperationSuccess(createdData);
    return createdData;
  }

  protected async internalFindOne(query, projection: string): Promise<D> {

    console.info('====== inside findOne VersionableRepo =======');

    let orgIdObj = {};
    if (query.id || query._id)
      orgIdObj = { originalId: query.id || query._id };

    const myQuery = {...orgIdObj, ...query, ...this.DELETE_QUERY};
    delete myQuery.id;
    delete myQuery._id;

    console.log(myQuery);
    return await this.MODEL.findOne(myQuery, projection);
  }

  protected async update(id, data, currentUser: string, notPermittedUsers: string[]): Promise<D> {

    console.info('====== inside update VersionableRepo =======');

    const query = { originalId: id, ...this.DELETE_QUERY };
    const originalData: any = await this.MODEL.findOne(query);
    if (!originalData) {
      throw new Error('record for this ID doesn\'t exist');
    }

    if (notPermittedUsers.indexOf(originalData.role) >= 0 ) {
      throw { message: 'not permitted to edit this record', code: '401'};
    }

    const dataToUpdate = {
      ...originalData.toJSON(),
      _id: this.generateId(),
      ...this.getUpdatedInfo(currentUser),
      createdBy: this.getCreatedInfo(currentUser).createdBy,
      ...data
    };
    console.info('dataToUpdate = ', dataToUpdate);

    const updatedData = await this.MODEL.create(dataToUpdate);
    this.isOperationSuccess(updatedData);

    const updatedPreviousData = await this.MODEL.findByIdAndUpdate({ _id: originalData._id }, this.getDeletedInfo(currentUser));
    this.isOperationSuccess(updatedPreviousData);
    return updatedData;
  }

  protected async delete(id: string, currentUser: string): Promise<D> {

    console.info('====== inside delete VersionableRepo =======');

    const query = { originalId: id, ...this.DELETE_QUERY };
    const data = await this.MODEL.findOneAndUpdate(query, this.getDeletedInfo(currentUser));
    this.isOperationSuccess(data);
    return data;
  }

  protected async list(options: IList): Promise<D[]> {

    console.info('====== inside list VersionableRepo =======');
    // skip: number, limit: number, projection: string = '', sort: string = ''
    const { skip = 0, limit = 10, projection = '', sort = '', search, exclude = {} } = options;

    const query = { ...search, ...exclude, ...this.DELETE_QUERY };
    return await this.MODEL.find(query, projection).skip(skip).limit(limit).sort(sort + ' -updatedAt');
  }
}
