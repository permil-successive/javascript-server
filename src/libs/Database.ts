import * as mongoose from 'mongoose';

export default class Database {

  constructor(private mongoUri) {}

  open(): Promise<any> {

    return new Promise<any>(async (resolve, reject) => {

      await mongoose.connect(this.mongoUri, { useNewUrlParser: true }, (err) => {

        if (err)
          return reject(err);

        console.info(`Database is connect@${this.mongoUri}`);
        resolve();
      });
    });
  }

  close(): Promise<any> {
    return mongoose.disconnect();
  }
}
