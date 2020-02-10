import * as mongoose from 'mongoose';
import IUserModel from './IUserModel';
import UserSchema from './UserSchema';


const userSchema = new UserSchema({
  collection: 'Users'
});

const UserModel: mongoose.Model<IUserModel> = mongoose.model<IUserModel>('user', userSchema, 'users', false);
export default UserModel;
