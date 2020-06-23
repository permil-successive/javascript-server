import *  as express from 'express';
import * as bodyParser from 'body-parser';

import { IConfig } from './config';
import { errorHandler, notFoundRoute } from './libs';
import mainRouter from './router';
import { Database } from './libs';
import { initSwagger } from './initSwagger';

export default class Server {

  app: express.Application;

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
      const database: Database = new Database(this.config.mongoUri);
      await database.open();
      this.app.listen(this.config.port, (err) => {
        if (err) {
          throw err;
        }
        console.log(`Server is running on ${this.config.port}`);
      });
    } catch (err) {
      console.error(err);
    }

    return this;
  }
}
