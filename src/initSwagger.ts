import * as swaggerJSDoc from 'swagger-jsdoc';
import *  as express from 'express';
import * as swaggerUi from 'swagger-ui-express';

import * as mypackage from '../package.json';

const initSwaggerSpec = () => {

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
  return swaggerSpec;
};

export const initSwagger = (app) => {
  const JSON_PATH = '/api-docs.json';
  const swaggerOptions = {
    swaggerOptions: {
      url: JSON_PATH
    }
  };

  app.use(JSON_PATH, (req: express.Request, res: express.Response): void => {
    res.send(initSwaggerSpec());
  });
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup( undefined, swaggerOptions));
};
