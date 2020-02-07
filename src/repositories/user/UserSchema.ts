import * as mongoose from 'mongoose';

export default class UserSchema extends mongoose.Schema {
  constructor(options: any) {
    const userSchema = {
      _id: String,
      name: String,
      role: String,
      address: String,
      email: String,
      mobileNumber: Number,
      dob: Date,
      hobbies: [String]
    };

    super(userSchema, options);
  }
}
