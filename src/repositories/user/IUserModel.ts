import { IVersionableDocument } from '../versionable';

export default interface IUserModel extends IVersionableDocument {

  _id: string;
  name: string;
  role: string;
  address: string;
  email: string;
  mobileNumber: number;
  dob: Date;
  hobbies: [string];
  password: string;
}
