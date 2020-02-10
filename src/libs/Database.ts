import * as mongoose from 'mongoose';
import userSeedData from './seedData';

export default class Database {

  constructor(private mongoUri) {}

  open(): Promise<any> {

    return new Promise<any>(async (resolve, reject) => {

      try {
        await mongoose.connect(this.mongoUri, { useNewUrlParser: true });
        console.info(`Database is connect@${this.mongoUri}`);
        resolve(userSeedData());
      } catch (err) {
        reject(err);
      }
    });
  }

  close(): Promise<any> {
    return mongoose.disconnect();
  }
}
