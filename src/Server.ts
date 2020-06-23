import *  as express from 'express';
import * as bodyParser from 'body-parser';
import { createHttpTerminator } from 'http-terminator';

import { IConfig } from './config';
import { errorHandler, notFoundRoute } from './libs';
import mainRouter from './router';
import { Database } from './libs';
import { initSwagger } from './initSwagger';

export default class Server {

  app: express.Application;
  database: Database;
  httpTerminator;

  constructor(private config: IConfig) {
    this.app = express();
  }

  bootstrap(): Server {
    this.initBodyParser();
    this.setupRoutes();
    this.app.use(notFoundRoute); // firing route not found error
    this.app.use(errorHandler); // attaching error handler
    return this;
  }

  initBodyParser(): void {
    // parse application/x-www-form-urlencoded
    this.app.use(bodyParser.urlencoded({ extended: false }));

    // parse application/json
    this.app.use(bodyParser.json());
  }

  setupRoutes(): void {
    this.app.get('/health-check', (req: express.Request, res: express.Response): void => {
      res.send('I am OK');
    });

    this.app.use('/api', mainRouter);
    initSwagger(this.app);
  }

  async run(): Promise<Server> {
    try {
      this.database = new Database(this.config.mongoUri);
      await this.database.open();
      const server = this.app.listen(this.config.port, (err) => {
        if (err) {
          throw err;
        }
        console.log(`Server is running on ${this.config.port}`);
        this.httpTerminator = createHttpTerminator({
          server
        });
      });
    } catch (err) {
      console.error(err);
    }

    return this;
  }

  async close() {
    console.log('Server closing');
    await this.httpTerminator.terminate();
    await this.database.close();
    console.log('Server closed');
  }
}
