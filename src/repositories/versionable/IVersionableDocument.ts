import * as mongoose from 'mongoose';

export default interface IVersionableDocument extends mongoose.Document {

  originalId: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: string;
  deletedBy: string;
}
