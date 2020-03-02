import *  as express from 'express';
import * as bodyParser from 'body-parser';
import * as swaggerJSDoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';
import { IConfig } from './config';
import { errorHandler, notFoundRoute } from './libs';
import mainRouter from './router';
import { Database } from './libs';
import * as mypackage from '../package.json';

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

  initSwaggerSpec() {

    console.info('====== inside initSwaggerSpec =======');

    const { name: title, version, description  } = mypackage;

    const swaggerDefinition = {
      info: {
        // API informations (required)
        title, // Title (required)
        version, // Version (required)
        description, // Description (optional)
      },
      servers: {
        url: 'http://localhost:9000/api',
        description: 'Internal Develop Server'
      },
      securityDefinitions: {
        Bearer: {
          in: 'headers',
          name: 'Authorization',
          type: 'apiKey'
        }
      },
      swagger: '2.0',
      // host, // Host (optional)
      basePath: '/api',
    };

    const swaggerOptions = {
      swaggerDefinition, // swagger definition
      apis: ['dist/src/controllers/**/**.js'],
    };

    const swaggerSpec = swaggerJSDoc(swaggerOptions);
    console.log('swaggerSpec = ', swaggerSpec);
    return swaggerSpec;
  }

  iniSwagger() {

    const JSON_PATH = '/api-docs.json';

    this.app.use(JSON_PATH, (req: express.Request, res: express.Response): void => {

      res.send(this.initSwaggerSpec());
    });

    const swaggerOptions = {
      swaggerOptions: {
        url: JSON_PATH
      }
    };

    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup( undefined, swaggerOptions));
  }

  setupRoutes(): void {

    this.app.get('/health-check', (req: express.Request, res: express.Response): void => {

      res.send('I am OK');
    });

    this.app.use('/api', mainRouter);

    this.iniSwagger();
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
