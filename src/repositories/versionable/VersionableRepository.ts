import * as mongoose from 'mongoose';

import IVersionableDocument from './IVersionableDocument';
import { IList } from '../entities';
import {
  getCreatedInfo, getDeletedInfo, getUpdatedInfo, isOperationSuccess,
} from './helper';

export default class VersionableRepository<D extends IVersionableDocument, M extends mongoose.Model<D>> {
  protected MODEL: M;
  public readonly DEFAULT_PAGESIZE = 100;
  private readonly DELETE_QUERY = { deletedAt: { '$exists': false } };

  constructor(model: M) {
    this.MODEL = model;
  }

  private generateId(): string {
    return mongoose.Types.ObjectId().toHexString();
  }

  public async counts(query = {}): Promise<number> {

    console.info('====== inside counts VersionableRepo =======');

    const ehancedQuery: mongoose.FilterQuery<any> = {...query, ...this.DELETE_QUERY};
    return await this.MODEL.countDocuments(ehancedQuery);
  }

  protected async create(data, currentUser: string): Promise<D> {

    console.info('====== inside create VersionableRepo =======');

    const newId = this.generateId();
    const startedAt = new Date();
    const userData = {
      _id: newId,
      originalId: newId,
      ...getCreatedInfo(currentUser, startedAt),
      ...getUpdatedInfo(currentUser, startedAt),
      ...data
    };

    const createdData = await this.MODEL.create(userData);
    isOperationSuccess(createdData);
    return createdData;
  }

  protected async findOne(query = {}, projection: string = ''): Promise<D> {

    console.info('====== inside findOne VersionableRepo =======');

    const ehancedQuery: mongoose.FilterQuery<any> = {...query, ...this.DELETE_QUERY};
    return await this.MODEL.findOne(ehancedQuery, projection);
  }

  protected async update(id: string, data, currentUser: string): Promise<D> {

    console.info('====== inside update VersionableRepo =======');

    const query: mongoose.FilterQuery<any> = { originalId: id, ...this.DELETE_QUERY };
    const originalData: any = await this.MODEL.findOne(query);
    if (!originalData) {
      throw new Error('record for this ID doesn\'t exist');
    }

    const dataToUpdate = {
      ...originalData.toJSON(),
      _id: this.generateId(),
      ...getUpdatedInfo(currentUser),
      createdBy: getCreatedInfo(currentUser).createdBy,
      ...data
    };
    console.info('dataToUpdate = ', dataToUpdate);

    const updatedData = await this.MODEL.create(dataToUpdate);
    isOperationSuccess(updatedData);

    const updatedPreviousData = await this.MODEL.findByIdAndUpdate({
      _id: originalData._id },
      getDeletedInfo(currentUser) as any
    );
    isOperationSuccess(updatedPreviousData);
    return updatedData;
  }

  protected async delete(id: string, currentUser: string): Promise<D> {

    console.info('====== inside delete VersionableRepo =======');

    const query: mongoose.FilterQuery<any> = { originalId: id, ...this.DELETE_QUERY };
    const data = await this.MODEL.findOneAndUpdate(query, getDeletedInfo(currentUser) as any);
    isOperationSuccess(data);
    return data;
  }

  protected async list(query = {}, projection = '', options: IList): Promise<D[]> {

    console.info('====== inside list VersionableRepo =======');

    const { skip = 0, sort = '', exclude = {} } = options;
    let { limit = this.DEFAULT_PAGESIZE } = options;

    if (limit > this.DEFAULT_PAGESIZE)
      limit = this.DEFAULT_PAGESIZE;

    const myQuery: mongoose.FilterQuery<any> = { ...query, ...exclude, ...this.DELETE_QUERY };
    return await this.MODEL.find(myQuery, projection)
    .skip(skip)
    .limit(limit)
    .sort(`${sort} -updatedAt`);
  }
}
