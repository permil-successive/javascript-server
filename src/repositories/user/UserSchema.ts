import * as mongoose from 'mongoose';
import { VersionableSchema } from '../versionable';

export default class UserSchema extends VersionableSchema {
  constructor(options: any) {
    const userSchema = {
      _id: String,
      name: String,
      role: String,
      address: String,
      email: String,
      password: String,
      // {
      //   type: String,
      //   unique: true,
      // },
      mobileNumber: Number,
      dob: Date,
      hobbies: [String]
    };

    super(userSchema, options);
  }
}
