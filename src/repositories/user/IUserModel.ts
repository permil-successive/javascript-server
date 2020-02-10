import * as mongoose from 'mongoose';

export default interface IUserModel extends mongoose.Document {

  _id: string;
  name: string;
  role: string;
  address: string;
  email: string;
  mobileNumber: number;
  dob: Date;
  hobbies: [string];
}
