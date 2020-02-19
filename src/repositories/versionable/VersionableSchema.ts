import * as mongoose from 'mongoose';

export default class VersionableSchema extends mongoose.Schema {
  constructor(schema: any , options: any) {
    const versionableSchema = {
      originalId: String,
      createdAt: {
        type: Date,
        default: Date.now()
      },
      createdBy: String,
      updatedAt: {
        type: Date,
        default: Date.now()
      },
      updatedBy: String,
      deletedAt: Date,
      deletedBy: String,
    };

    super({...schema, ...versionableSchema}, options);
  }
}
