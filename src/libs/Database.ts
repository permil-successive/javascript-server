import * as mongoose from 'mongoose';

export default class Database {

  constructor(private mongoUri) {}

  open(): Promise<any> {

    return new Promise<any>((resolve, reject) => {
      mongoose.connect(this.mongoUri, { useNewUrlParser: true }).then(() => {
        console.info(`Database is connect@${this.mongoUri}`);
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  close(): Promise<any> {
    return mongoose.disconnect();
  }
}
