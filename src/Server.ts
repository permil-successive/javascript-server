import *  as express from 'express';
import * as bodyParser from 'body-parser';
import * as swaggerJSDoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';
import { IConfig } from './config';
import { errorHandler, notFoundRoute } from './libs';
import mainRouter from './router';
import { Database } from './libs';

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

  initSwagger() {

    const swaggerDefinition = {
      info: {
        // API informations (required)
        title: 'Hello World', // Title (required)
        version: '1.0.0', // Version (required)
        description: 'A sample API', // Description (optional)
      },
      // host, // Host (optional)
      basePath: '/',
    };

    const swaggerOptions = {
      swaggerDefinition, // swagger definition
      apis: ['dist/controllers/**/**.js'],
    };

    const swaggerSpec = swaggerJSDoc(swaggerOptions);
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    console.log(swaggerSpec);
    return swaggerSpec;
  }

  setupRoutes(): void {

    this.app.get('/health-check', (req: express.Request, res: express.Response): void => {

      res.send('I am OK');
    });

    this.app.use('/api', mainRouter);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(this.initSwagger()));
  }

  run(): Server {
    const database: Database = new Database(this.config.mongoUri);
    database.open().then(() => {
      this.app.listen(this.config.port, (err) => {
        if (err) {
          throw err;
        }
        console.log(`Server is running on ${this.config.port}`);
      });
    }).catch((err) => {
      console.error(err);
    });
    return this;
  }
}
