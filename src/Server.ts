import *  as express from 'express';
import IConfig from './config/IConfig';
import * as bodyParser from 'body-parser';
import { errorHandler, notFoundRoute } from './libs';

export default class Server {

  app: express.Application;

  constructor(private config: IConfig) {
    this.app = express();
  }

  bootstrap(): Server {
    this.initBodyParser();
    this.setupRoutes();
    this.app.use(notFoundRoute);
    this.app.use(errorHandler);
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

    this.app.get('/body-parser', (req: express.Request, res: express.Response): void => {

      console.log('user send data : ');
      console.log(req.body);
      res.send('Ok');
    });
  }

  run(): Server {
    this.app.listen(this.config.port, (err) => {
      if (err) {
        console.error(err);
        throw err;
      }

      console.log(`Server is running on ${this.config.port}`);
    });
    return this;
  }
}
